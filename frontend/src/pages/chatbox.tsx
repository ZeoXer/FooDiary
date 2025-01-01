import { useState, useRef, useEffect } from "react";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { Avatar } from "@nextui-org/react";
import { Spinner } from "@nextui-org/react";
import { Skeleton } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import DefaultLayout from "@/layouts/default";
import { getChatRecords } from "@/apis/chat";
import { getUserData } from "@/apis/user";
import { ChatMessage } from "@/types";
import MarkdownDisplay from "@/components/markdown-display";

export default function ChatboxPage() {
  const [messagesContent, setMessagesContent] = useState<ChatMessage[]>([]);
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  // const quickReplies = ["問題一", "問題二", "問題三"];
  const wsRef = useRef<WebSocket | null>(null);

  // Fetch user email
  const fetchUserEmail = async () => {
    try {
      const response = await getUserData();
      const userEmail = response?.userData?.userID?.email;

      if (userEmail) {
        setEmail(userEmail);

        return userEmail;
      }

      throw new Error("無法取得使用者 Email");
    } catch (error) {
      console.error("取得 Email 失敗：", error);

      return null;
    }
  };

  // Fetch chat records
  const fetchChatRecords = async (userEmail: string, timestamp?: number) => {
    try {
      setIsLoading(true);
      const data = await getChatRecords(userEmail, timestamp);
      const contents = data?.content || [];

      if (contents.length === 0) {
        setMessagesContent((prev) =>
          prev.length === 0
            ? [
                {
                  role: "bot",
                  message:
                    "歡迎使用 FooDiary 聊天機器人！有什麼是我能幫助您的嗎？",
                },
              ]
            : prev
        );
        setTimestamp(-1);

        return;
      }

      const chatContents: ChatMessage[] = contents
        .map((content: any) =>
          content.chat_content
            .map((chat: any) => ({
              role: chat.role,
              message: chat.message,
              timestamp: content.timestamp,
            }))
            .reverse()
        )
        .flat()
        .reverse();

      setTimestamp(contents[contents.length - 1].timestamp);
      setMessagesContent((prev) => {
        const newMessages = chatContents.filter(
          (newMsg: ChatMessage) =>
            !prev.some(
              (existingMsg) => existingMsg.timestamp === newMsg.timestamp
            )
        );

        return [...prev, ...newMessages];
      });
    } catch (error) {
      console.error("取得聊天紀錄失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatRecord = async (userEmail: string, timestamp?: number) => {
    try {
      setIsLoading(true);
      const data = await getChatRecords(userEmail, timestamp);
      const contents = data?.content || [];

      if (contents.length === 0) {
        setMessagesContent((prev) =>
          prev.length === 0
            ? [
                {
                  role: "bot",
                  message:
                    "歡迎使用 FooDiary 聊天機器人！有什麼是我能幫助您的嗎？",
                },
              ]
            : prev
        );
        setTimestamp(-1);

        return;
      }

      const chatContents: ChatMessage[] = contents
        .map((content: any) =>
          content.chat_content
            .map((chat: any) => ({
              role: chat.role,
              message: chat.message,
              timestamp: content.timestamp,
            }))
            .reverse()
        )
        .flat()
        .reverse();

      setTimestamp(contents[contents.length - 1].timestamp);
      setMessagesContent((prev) => {
        const newMessages = chatContents.filter(
          (newMsg: ChatMessage) =>
            !prev.some(
              (existingMsg) => existingMsg.timestamp === newMsg.timestamp
            )
        );

        return [...newMessages, ...prev];
      });
    } catch (error) {
      console.error("取得聊天紀錄失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (
      !userInput.trim() ||
      !email ||
      !wsRef.current ||
      wsRef.current.readyState !== WebSocket.OPEN
    ) {
      console.error("Invalid input or WebSocket state");

      return;
    }

    setIsGenerating(true);

    setMessagesContent((prev) => [
      ...prev,
      { role: "user", message: userInput },
    ]);

    setUserInput("");

    try {
      wsRef.current.send(
        JSON.stringify({
          email: email,
          queryText: userInput,
        })
      );
    } catch (error) {
      console.error("Error while sending message:", error);
    }
  };

  // Handle quick reply
  // const handleQuickReply = (message: string) => {
  //   setMessagesContent((prev) => [...prev, { role: "user", message }]);
  // };

  const loadMoreContent = () => {
    if (email && timestamp !== -1 && timestamp !== undefined) {
      fetchChatRecord(email, timestamp);
    }
  };

  const navigate = useNavigate();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userDataResponse = await getUserData();

        if (!userDataResponse || userDataResponse.status === 401) {
          console.log("Unauthorized, redirecting to login.");
          navigate("/login");

          return;
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    checkLoginStatus();
  }, [navigate]);

  useEffect(() => {
    const initializeWebSocket = async () => {
      const userEmail = await fetchUserEmail();

      if (userEmail) {
        fetchChatRecords(userEmail);
        console.log("Fetched user email:", userEmail);
        const ws = new WebSocket("wss://www.foodiary.ching11720.site");

        wsRef.current = ws;

        ws.onopen = () => {
          console.log("WebSocket connection established");
        };

        ws.onmessage = (event) => {
          const data = JSON.parse(event.data);

          if (data.error) {
            console.error("WebSocket error:", data.error);
          } else if (data.response) {
            setMessagesContent((prev) => [
              ...prev,
              { role: "bot", message: data.response },
            ]);
            setIsGenerating(false);
          }
        };

        ws.onerror = (error) => {
          console.error("WebSocket error:", error);
        };

        ws.onclose = () => {
          console.log("WebSocket connection closed");
        };
      }
    };

    initializeWebSocket();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return (
    <DefaultLayout>
      <div className="flex flex-col w-full min-h-screen bg-gray-100">
        {/* Load More Button */}
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
        <div className="flex-grow flex justify-center py-6 px-2 sm:px-4">
          <div className="w-full max-w-full sm:max-w-lg lg:max-w-screen-lg xl:max-w-screen-xl bg-white shadow-lg rounded-lg p-4 sm:p-6 lg:p-8">
            {messagesContent.map((messageContent, index) => (
              <div
                key={index}
                className={`flex mb-6 gap-4 ${
                  messageContent.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                <Avatar
                  showFallback
                  classNames={{
                    base: messageContent.role === "bot" ? "bg-white" : "",
                  }}
                  size="md"
                  src={
                    messageContent.role === "bot" ? "/assets/FooDiary.png" : ""
                  }
                />
                <div
                  className={`p-4 sm:p-6 rounded-lg max-w-full sm:max-w-lg lg:max-w-3xl shadow-md ${
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
              <div className="flex mb-6 gap-4">
                <Avatar
                  classNames={{ base: "bg-white" }}
                  size="md"
                  src="/assets/FooDiary.png"
                />
                <div className="w-full max-w-full sm:max-w-lg bg-gray-300 p-4 rounded-lg grid gap-2">
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
        </div>

        {/* Input Box */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10 border-gray-300 px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex gap-4 items-center max-w-full sm:max-w-lg lg:max-w-screen-lg xl:max-w-screen-xl mx-auto">
            <Input
              className="flex-grow"
              placeholder="傳訊息給 FooDiary"
              size="lg"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              isDisabled={isGenerating}
              size="lg"
              onPress={handleSendMessage}
            >
              {isGenerating ? <Spinner color="white" /> : "➤"}
            </Button>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
