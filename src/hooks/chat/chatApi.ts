// src/lib/api/chatApi.ts
import apiClient from '@/lib/apiClient';

interface ChatMessageContent {
  [key: string]: any; // Content can be any JSON structure
}

interface CreateChatMessagePayload {
  role: 'USER' | 'AI';
  sessionIndex?: number; // Optional: if provided, message is added to this session
  title?: string; // Optional: if provided without sessionIndex, a new session is created
  content: ChatMessageContent;
  uuid?: string;
}

export interface CreatedSessionDetails {
  index: number;
  uuid: string;
  title: string | null; // title이 null일 수 있음을 명시
  createdTime: string;
  updateTime: string | null;
}

export interface CreatedMessageDetails {
  index: number;
  sessionIndex: number;
  role: 'USER' | 'AI';
  content: ChatMessageContent;
  createdTime: string;
  updateTime: string | null;
}

interface CreateChatMessageResponseData {
  chatSession?: CreatedSessionDetails; // Present if a new session was created
  chatMessage: CreatedMessageDetails;
}

interface CreateChatMessageSuccessResponse {
  statusCode: number;
  message: string;
  data: CreateChatMessageResponseData[];
  metadata: any | null;
  error: any | null;
}

export const createChatMessageApi = async (
  payload: CreateChatMessagePayload
): Promise<CreateChatMessageResponseData | null> => {
  try {
    const response = await apiClient.post<CreateChatMessageSuccessResponse[]>(
      '/ai/chat/message/create',
      payload
    );

    const apiResponseArray = response.data;
    if (apiResponseArray && apiResponseArray.length > 0) {
      const apiResponseObject = apiResponseArray[0];

      if (
        apiResponseObject &&
        apiResponseObject.statusCode === 200 &&
        apiResponseObject.data &&
        apiResponseObject.data.length > 0
      ) {
        return apiResponseObject.data[0];
      } else {
        const errorMessage =
          apiResponseObject?.message ||
          'Failed to create chat message: Unexpected response structure or status.';
        console.error(
          'createChatMessageApi: API 응답이 유효하지 않습니다.',
          apiResponseObject
        );
        throw new Error(errorMessage);
      }
    } else {
      throw new Error('createChatMessageApi: Empty or invalid API response.');
    }
  } catch (err) {
    console.error('createChatMessageApi: 채팅 메시지 생성 중 오류 발생:', err);
    throw err;
  }
};
