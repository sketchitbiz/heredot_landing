import { useState } from "react";
import apiClient from "@/lib/apiClient";

interface ChatMessageContent {
  [key: string]: any; // Assuming content can be any JSON structure
}

interface ChatMessage {
  index: number;
  sessionIndex: number;
  role: "USER" | "AI";
  content: ChatMessageContent;
  createdTime: string;
  updateTime: string | null;
}

interface GetChatMessageListPayload {
  sessionIndex: number;
  offset: number;
}

// 🚨🚨🚨 이 부분이 중요합니다: API 응답의 최상위가 배열인 것을 반영 🚨🚨🚨
// 서버 응답이 단일 객체가 아닌 '배열 안에 단일 객체가 담긴' 형태입니다.
interface GetChatMessageListSuccessResponse { // 배열 안의 객체 타입
  statusCode: number;
  message: string;
  data: ChatMessage[]; // 'data' 속성도 ChatMessage 배열입니다.
  metadata: any | null;
  error: any | null;
}

// apiClient.post가 반환하는 전체 응답 구조 (배열로 감싸진 경우)
type GetChatMessageListApiResponse = GetChatMessageListSuccessResponse[];


const useChatMessageList = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const fetchChatMessages = async (payload: GetChatMessageListPayload): Promise<ChatMessage[] | null> => {
    setIsLoading(true);
    setError(null);
    try {
      // apiClient.post의 제네릭 타입을 GetChatMessageListApiResponse로 지정
      const response = await apiClient.post<GetChatMessageListApiResponse>(
        "/ai/chat/message/get-list",
        payload
      );

      // 🚨🚨🚨 이 부분도 중요합니다: response.data[0]으로 최상위 배열에 접근 🚨🚨🚨
      const apiResponseObject = response.data[0]; // 배열의 첫 번째 요소 (실제 응답 객체)

      if (
        apiResponseObject &&
        apiResponseObject.statusCode === 200 &&
        apiResponseObject.data
      ) {
        setMessages(apiResponseObject.data);
        console.log("useChatMessageList: 채팅 메시지 목록 수신 성공:", apiResponseObject.data);
        return apiResponseObject.data;
      } else {
        const errorMessage = apiResponseObject?.message || "Failed to fetch chat messages: Unexpected response structure or status.";
        console.error("useChatMessageList: API 응답이 유효하지 않습니다.", apiResponseObject);
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error("useChatMessageList: 채팅 메시지 목록 조회 실패:", err);
      setError(err instanceof Error ? err : new Error("채팅 메시지 목록 조회 중 알 수 없는 오류가 발생했습니다."));
      setMessages([]); // Clear messages on error
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { fetchChatMessages, messages, isLoading, error };
};

export default useChatMessageList;