import { useState, useRef, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@nextui-org/skeleton";

import DefaultLayout from "@/layouts/default";
import { chatWithBot, getChatRecords } from "@/apis/chat";
import { ChatMessage } from "@/types";
import MarkdownDisplay from "@/components/markdown-display";

export default function ChatboxPage() {
  const [messagesContent, setMessagesContent] = useState<ChatMessage[]>([]);
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const quickReplies = ["問題一", "問題二", "問題三"]; // 可以設定問題(? 但不確定要不要留這個功能

  const onKeyDownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim()) return;

    setIsGenerating(true);
    setUserInput("");
    setMessagesContent((prev) =>
      prev.concat({ role: "user", message: userInput })
    );

    const { response } = await chatWithBot("user_0", userInput);

    setMessagesContent((prev) =>
      prev.concat({ role: "bot", message: response })
    );
    setIsGenerating(false);
  };

  const loadMoreContent = async () => {
    if (!timestamp) return;

    setIsLoading(true);
    const data = await handleGetChatRecords("user_0", timestamp);

    if (data.content.length === 0) {
      setIsLoading(false);
      setTimestamp(-1);

      return;
    }

    const chatContents = data.content
      .map((content: any) =>
        content.chat_content.map((chat: any) => ({
          role: chat.role,
          message: chat.message,
        }))
      )
      .reverse()
      .flat();

    setTimestamp(data.content[data.content.length - 1].timestamp);
    setMessagesContent((prev) => chatContents.reverse().concat(prev));
    setIsLoading(false);
  };

  const handleGetChatRecords = async (userId: string, timestamp?: number) => {
    const data = await getChatRecords(userId, timestamp);

    return data;
  };

  const handleQuickReply = (message: string) => {
    setMessagesContent([
      ...messagesContent,
      { role: "user", message },
      { role: "bot", message: `回應於：${message}` },
    ]);
  };

  useEffect(() => {
    if (messagesContent.length !== 0) return;

    handleGetChatRecords("user_0").then((data) => {
      const contents = data.content;

      if (contents.length === 0) {
        setMessagesContent([
          {
            role: "bot",
            message: "歡迎使用 FooDiary 聊天機器人！有什麼是我能幫助您的嗎？",
          },
        ]);
      }

      const chatContents = contents
        .map((content: any) =>
          content.chat_content
            .map((chat: any) => ({
              role: chat.role,
              message: chat.message,
            }))
            .reverse()
        )
        .flat();

      setTimestamp(contents[contents.length - 1].timestamp);
      setMessagesContent(chatContents.reverse());
    });
  }, []);

  // 送出新訊息後自動滾動到最下方
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesContent]);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const moreContentBtn = document.getElementById("more-content");

      if (window.scrollY === 0) {
        moreContentBtn?.classList.remove("pointer-events-none");
        moreContentBtn?.classList.remove("!opacity-0");
        moreContentBtn?.classList.add("opacity-100");
      } else {
        moreContentBtn?.classList.add("pointer-events-none");
        moreContentBtn?.classList.remove("opacity-100");
        moreContentBtn?.classList.add("!opacity-0");
      }
    });
  }, []);

  return (
    <DefaultLayout>
      <section className="flex flex-col">
        <Button
          className="fixed top-20 left-1/2 -translate-x-1/2 transition"
          id="more-content"
          isDisabled={timestamp === -1}
          isLoading={isLoading}
          radius="full"
          variant="ghost"
          onClick={loadMoreContent}
        >
          {timestamp === -1 ? "這裡已經是對話的起點" : "載入更多對話"}
        </Button>
        {/* Chat Window */}
        <div className="w-full max-w-lg mx-auto pb-32">
          {messagesContent.map((messageContent, index) => (
            <div
              key={index}
              className={`flex mb-6 gap-2 ${
                messageContent.role === "user" && "flex-row-reverse"
              }`}
            >
              <Avatar
                showFallback
                classNames={{
                  base: `${messageContent.role === "bot" && "bg-white"}`,
                }}
                size="sm"
                src={`${
                  messageContent.role === "bot" && "/assets/FooDiary.png"
                }`}
              />
              <div
                className={`p-3 rounded-lg max-w-xs ${
                  messageContent.role === "bot"
                    ? "bg-gray-300 text-black"
                    : "bg-blue-500 text-white"
                }`}
              >
                <MarkdownDisplay content={messageContent.message} />
              </div>
            </div>
          ))}
          {isGenerating && (
            <div className="flex mb-6 gap-2">
              <Avatar
                classNames={{ base: "bg-white" }}
                size="sm"
                src="/assets/FooDiary.png"
              />
              <div className="w-full max-w-xs bg-gray-300 p-3 rounded-lg grid gap-2">
                <Skeleton className="w-3/5 rounded-lg">
                  <div className="h-3 bg-secondary" />
                </Skeleton>
                <Skeleton className="w-4/5 rounded-lg">
                  <div className="h-3 bg-secondary" />
                </Skeleton>
                <Skeleton className="w-2/5 rounded-lg">
                  <div className="h-3 bg-secondary" />
                </Skeleton>
              </div>
            </div>
          )}

          {/* 滾動到此處 */}
          <div ref={chatWindowRef} />
        </div>

        {/* Quick Replies + Input Box */}
        <div className="fixed w-full max-w-lg mx-auto bottom-0 left-0 right-0 bg-white border-t border-gray-300">
          {/* Quick Replies */}
          <div className="flex gap-2 bg-gray-100 p-2">
            {quickReplies.map((reply, index) => (
              <Button
                key={index}
                className="bg-purple-500 text-white"
                size="sm"
                onClick={() => handleQuickReply(reply)}
              >
                {reply}
              </Button>
            ))}
          </div>

          {/* Input Box */}
          <div className="flex max-w-lg w-full items-center p-4">
            <Input
              className="flex-grow mr-2"
              placeholder="傳訊息給 FooDiary"
              size="lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={onKeyDownHandler}
            />
            <Button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              size="lg"
              onClick={handleSendMessage}
            >
              {isGenerating ? <Spinner color="white" /> : "➤"}
            </Button>
          </div>
        </div>
      </section>
    </DefaultLayout>
  );
}
