import { useState, useRef, useEffect } from "react";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { Avatar } from "@nextui-org/avatar";
import { Spinner } from "@nextui-org/spinner";
import { Skeleton } from "@nextui-org/skeleton";

import DefaultLayout from "@/layouts/default";
import { getChatRecords } from "@/apis/chat";
import { getUserData } from "@/apis/user";
import { ChatMessage } from "@/types";
import MarkdownDisplay from "@/components/markdown-display";
import { useNavigate } from "react-router-dom";

export default function ChatboxPage() {
  const [messagesContent, setMessagesContent] = useState<ChatMessage[]>([]);
  const [timestamp, setTimestamp] = useState<number | undefined>(undefined);
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string | null>(null);
  const chatWindowRef = useRef<HTMLDivElement>(null);

  const quickReplies = ["問題一", "問題二", "問題三"];
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
                message: "歡迎使用 FooDiary 聊天機器人！有什麼是我能幫助您的嗎？",
              },
            ]
            : prev
        );
        setTimestamp(-1);
        return;
      }

      const chatContents: ChatMessage[] = contents
        .map((content: any) =>
          content.chat_content.map((chat: any) => ({
            role: chat.role,
            message: chat.message,
            timestamp: content.timestamp,
          })).reverse()
        )
        .flat()
        .reverse();

      setTimestamp(contents[contents.length - 1].timestamp);
      setMessagesContent((prev) => {
        const newMessages = chatContents.filter(
          (newMsg: ChatMessage) =>
            !prev.some((existingMsg) => existingMsg.timestamp === newMsg.timestamp)
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
                message: "歡迎使用 FooDiary 聊天機器人！有什麼是我能幫助您的嗎？",
              },
            ]
            : prev
        );
        setTimestamp(-1);
        return;
      }

      const chatContents: ChatMessage[] = contents
        .map((content: any) =>
          content.chat_content.map((chat: any) => ({
            role: chat.role,
            message: chat.message,
            timestamp: content.timestamp,
          })).reverse()
        )
        .flat()
        .reverse();
        

      setTimestamp(contents[contents.length - 1].timestamp);
      setMessagesContent((prev) => {
        const newMessages = chatContents.filter(
          (newMsg: ChatMessage) =>
            !prev.some((existingMsg) => existingMsg.timestamp === newMsg.timestamp)
        );
        return [...newMessages,...prev];
      });
    } catch (error) {
      console.error("取得聊天紀錄失敗：", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!userInput.trim() || !email || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
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
  const handleQuickReply = (message: string) => {
    setMessagesContent((prev) => [
      ...prev,
      { role: "user", message },
    ]);
  };


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
        const ws = new WebSocket("ws://localhost:8000"); 
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
              className={`flex mb-6 gap-2 ${messageContent.role === "user" ? "flex-row-reverse" : ""
                }`}
            >
              <Avatar
                showFallback
                classNames={{ base: messageContent.role === "bot" ? "bg-white" : "" }}
                size="sm"
                src={messageContent.role === "bot" ? "/assets/FooDiary.png" : ""}
              />
              <div
                className={`p-3 rounded-lg max-w-xs ${messageContent.role === "bot"
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
              <Avatar classNames={{ base: "bg-white" }} size="sm" src="/assets/FooDiary.png" />
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
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <Button
              className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform"
              isDisabled={isGenerating}
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
