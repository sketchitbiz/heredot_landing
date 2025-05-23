// src/hooks/chat/useCreateChatMessage.ts

import { useState } from 'react';
import {
  createChatMessageApi,
  type CreatedSessionDetails,
  type CreatedMessageDetails,
} from '@/hooks/chat/chatApi';
// import useAuthStore from '@/store/authStore'; // <-- 이 줄은 그대로 둡니다.
import authStore from '@/store/authStore'; // 🚨 authStore 임포트 (기존 useAuthStore를 authStore로 변경했다면)

import { mutate as swrMutate } from 'swr';
import { toast } from 'react-toastify';
import { ChatSession } from '@/hooks/chat/useChatSessionList';

const CHAT_SESSIONS_API_KEY = '/api/chat/sessions';

interface ChatMessageContent {
  [key: string]: any;
}

interface CreateChatMessagePayload {
  role: 'USER' | 'AI';
  sessionIndex?: number;
  title?: string;
  content: ChatMessageContent;
}

interface CreateChatMessageResult {
  chatSession?: CreatedSessionDetails;
  chatMessage: CreatedMessageDetails;
}

const useCreateChatMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [createdMessage, setCreatedMessage] =
    useState<CreatedMessageDetails | null>(null);
  const [createdSession, setCreatedSession] =
    useState<CreatedSessionDetails | null>(null);

  // 🚨 authStore에서 currentSessionIndex와 setCurrentSessionIndex를 올바르게 가져옵니다.
  // 이 부분은 컴포넌트나 다른 훅 내에서 Zustand 스토어를 사용할 때의 표준 방식입니다.
  const currentSessionIndex = authStore((state) => state.currentSessionIndex);
  const setCurrentSessionIndex = authStore(
    (state) => state.setCurrentSessionIndex
  );

  const createChatMessage = async (
    payload: CreateChatMessagePayload
  ): Promise<CreateChatMessageResult | null> => {
    setIsLoading(true);
    setError(null);
    setCreatedMessage(null);
    setCreatedSession(null);

    const finalPayload: CreateChatMessagePayload = {
      ...payload,
      ...(currentSessionIndex !== null && {
        sessionIndex: currentSessionIndex,
      }),
    };

    if (currentSessionIndex === null && !finalPayload.title) {
      finalPayload.title = '새로운 채팅';
    }

    try {
      const responseData = await createChatMessageApi(finalPayload);

      if (responseData) {
        setCreatedMessage(responseData.chatMessage);
        if (responseData.chatSession) {
          setCreatedSession(responseData.chatSession);
          // 새로운 세션이 생성되면 currentSessionIndex를 업데이트합니다.
          // 🚨 이제 setCurrentSessionIndex는 함수입니다!
          setCurrentSessionIndex(responseData.chatSession.index);

          swrMutate(
            CHAT_SESSIONS_API_KEY,
            (prevSessions: ChatSession[] | undefined) => {
              const currentPrevSessions = prevSessions || [];
              const newSessionDataForSidebar: ChatSession = {
                index: responseData.chatSession!.index,
                uuid: responseData.chatSession!.uuid,
                title: responseData.chatSession!.title || '새로운 채팅',
                createdTime: responseData.chatSession!.createdTime,
                updateTime: responseData.chatSession!.updateTime || null,
                lastMessage: null,
              };

              if (
                !currentPrevSessions.some(
                  (s) => s.uuid === newSessionDataForSidebar.uuid
                )
              ) {
                return [newSessionDataForSidebar, ...currentPrevSessions];
              }
              return currentPrevSessions;
            },
            false
          );
        } else if (currentSessionIndex === null && !responseData.chatSession) {
          console.error(
            'useCreateChatMessage: 새로운 세션이 예상되었으나, null 세션 인덱스에 대한 메시지만 수신되었습니다.'
          );
          toast.error('채팅 세션 생성에 문제가 발생했습니다.');
          // 🚨 여기서도 setCurrentSessionIndex를 호출합니다.
          setCurrentSessionIndex(null);
        }

        console.log(
          'useCreateChatMessage: 채팅 메시지 생성 성공:',
          responseData
        );
        return responseData;
      } else {
        throw new Error(
          '채팅 메시지 생성에 실패했습니다: API에서 데이터가 반환되지 않았습니다.'
        );
      }
    } catch (err) {
      console.error('useCreateChatMessage: 채팅 메시지 생성 실패:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('채팅 메시지 생성 중 알 수 없는 오류가 발생했습니다.')
      );
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    createChatMessage,
    createdMessage,
    createdSession,
    isLoading,
    error,
  };
};

export default useCreateChatMessage;
