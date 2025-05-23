// src/hooks/chat/useChatSessionList.ts

import { useState, useCallback, useEffect } from 'react';
import apiClient from '@/lib/apiClient';

export interface ChatSession { // 다른 컴포넌트에서 재사용되므로 export 유지
  index: number;
  uuid: string;
  title: string | null;
  createdTime: string; // "YYYY-MM-DD HH:mm:ss"
  updateTime: string | null;
  lastMessage: any | null; // 실제 데이터 구조에 맞게 조정 필요
}

interface GetChatSessionListPayload {
  offset: number;
}

// 🚨🚨🚨 이 부분이 중요합니다: API 응답의 최상위가 배열인 것을 반영 🚨🚨🚨
// 서버 응답이 단일 객체가 아닌 '배열 안에 단일 객체가 담긴' 형태입니다.
interface GetChatSessionListSuccessResponse { // 배열 안의 객체 타입
  statusCode: number;
  message: string;
  data: ChatSession[]; // 'data' 속성도 ChatSession 배열입니다.
  metadata: any | null;
  error: any | null;
}

// apiClient.post가 반환하는 전체 응답 구조 (배열로 감싸진 경우)
type GetChatSessionListApiResponse = GetChatSessionListSuccessResponse[];


const useChatSessionList = () => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchChatSessions = useCallback(
    async (payload: GetChatSessionListPayload): Promise<ChatSession[] | null> => {
      setIsLoading(true);
      setError(null);
      try {
        // apiClient.post의 제네릭 타입을 GetChatSessionListApiResponse로 지정
        const response = await apiClient.post<GetChatSessionListApiResponse>(
          '/ai/chat/session/get-list',
          payload
        );

        // 🚨🚨🚨 이 부분도 중요합니다: response.data[0]으로 최상위 배열에 접근 🚨🚨🚨
        const apiResponseObject = response.data[0]; // 배열의 첫 번째 요소 (실제 응답 객체)

        if (
          apiResponseObject &&
          apiResponseObject.statusCode === 200 &&
          apiResponseObject.data // apiResponseObject.data가 존재하는지 확인
        ) {
          console.log(
            'useChatSessionList: API 응답 데이터 수신:',
            apiResponseObject.data
          );
          setSessions(apiResponseObject.data); // apiResponseObject.data를 sessions 상태에 업데이트
          console.log('useChatSessionList: sessions 상태 업데이트 완료');
          return apiResponseObject.data; // ChatSession 배열 반환
        } else {
          const errorMessage = apiResponseObject?.message || '채팅 세션 목록을 가져오는데 실패했습니다: 유효하지 않은 응답 구조.';
          console.error('useChatSessionList: API 응답이 유효하지 않습니다.', apiResponseObject);
          throw new Error(errorMessage);
        }
      } catch (err) {
        console.error('useChatSessionList: 오류 발생', err);
        setError(
          err instanceof Error
            ? err
            : new Error(
                '채팅 세션 목록 조회 중 알 수 없는 오류가 발생했습니다.'
              )
        );
        return null; // 오류 발생 시 null 반환
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    console.log('useChatSessionList: sessions 상태 변경됨:', sessions);
  }, [sessions]);

  return { fetchChatSessions, sessions, isLoading, error, setSessions };
};

export default useChatSessionList;