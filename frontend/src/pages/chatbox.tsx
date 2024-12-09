import { useState, useRef, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { Spinner } from "@nextui-org/spinner";

import DefaultLayout from "@/layouts/default";
import { chatWithBot, getChatRecords } from "@/apis/chat";
import { ChatMessage } from "@/types";
import MarkdownDisplay from "@/components/markdown-display";

export default function ChatboxPage() {
  const [messagesContent, setMessagesContent] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
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
    const { content } = await chatWithBot("user_0", userInput);

    const newMessages: ChatMessage[] = [
      ...messagesContent,
      { role: "user", message: userInput },
      { role: "bot", message: content },
    ];

    setMessagesContent(newMessages);
    setUserInput("");
    setIsGenerating(false);
  };

  const handleGetChatRecords = async (userId: string) => {
    const data = await getChatRecords(userId);

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

      setMessagesContent(chatContents.reverse());
    });
  }, []);

  // 送出新訊息後自動滾動到最下方
  useEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messagesContent]);

  return (
    <DefaultLayout>
      <section className="flex flex-col">
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
