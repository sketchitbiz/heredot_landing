// src/hooks/chat/useCreateChatSession.ts

import { useState } from 'react';
import apiClient from '@/lib/apiClient';

interface CreateChatSessionPayload {
  title: string;
}

export interface CreatedChatSession {
  index: number;
  uuid: string;
  title: string | null;
  createdTime: string;
  updateTime: string | null;
}

// 🚨🚨🚨 이 부분이 중요합니다: API 응답의 최상위가 배열인 것을 반영 🚨🚨🚨
// 서버 응답이 단일 객체가 아닌 '배열 안에 단일 객체가 담긴' 형태입니다.
interface CreateChatSessionSuccessResponse {
  // 배열 안의 객체 타입
  statusCode: number;
  message: string;
  data: CreatedChatSession[]; // 'data' 속성도 배열입니다.
  metadata: any | null;
  error: any | null;
}

// APIClient.post가 반환하는 전체 응답 구조 (배열로 감싸진 경우)
type CreateChatSessionApiResponse = CreateChatSessionSuccessResponse[];

const useCreateChatSession = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [newSession, setNewSession] = useState<CreatedChatSession | null>(null);

  const createChatSession = async (
    payload: CreateChatSessionPayload
  ): Promise<CreatedChatSession | null> => {
    setIsLoading(true);
    setError(null);
    setNewSession(null);
    try {
      // apiClient.post의 제네릭 타입을 CreateChatSessionApiResponse로 지정
      const response = await apiClient.post<CreateChatSessionApiResponse>(
        '/ai/chat/session/create',
        payload
      );

      // 🚨🚨🚨 이 부분도 중요합니다: response.data[0]으로 최상위 배열에 접근 🚨🚨🚨
      const apiResponseObject = response.data[0]; // 배열의 첫 번째 요소 (실제 응답 객체)

      if (
        apiResponseObject && // apiResponseObject가 null이 아닌지 확인
        apiResponseObject.statusCode === 200 &&
        apiResponseObject.data && // apiResponseObject.data가 존재하는지 확인
        apiResponseObject.data.length > 0
      ) {
        const createdSession = apiResponseObject.data[0]; // 실제 세션 데이터 추출
        setNewSession(createdSession);
        console.log(
          'useCreateChatSession: 새 채팅 세션 생성 성공:',
          createdSession
        );
        return createdSession; // CreatedChatSession 객체 자체를 반환
      } else {
        const errorMessage =
          apiResponseObject?.message ||
          'Failed to create chat session: Unexpected response structure or status.';
        console.error(
          'useCreateChatSession: API 응답이 유효하지 않습니다.',
          apiResponseObject
        );
        throw new Error(errorMessage);
      }
    } catch (err) {
      console.error('useCreateChatSession: 새 채팅 세션 생성 실패:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('새 채팅 세션 생성 중 알 수 없는 오류가 발생했습니다.')
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return { createChatSession, newSession, isLoading, error };
};

export default useCreateChatSession;
