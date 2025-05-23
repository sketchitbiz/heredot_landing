// src/hooks/inquire/useSendInquireMessage.ts
import { useState, useCallback } from 'react';
import apiClient from '@/lib/apiClient'; // API 클라이언트 임포트

// API 요청 바디 타입 정의
interface SendInquireMessagePayload {
  name: string;
  title: string;
}

// API 응답 타입 정의 (예시 응답에 따라)
interface SendInquireMessageResponse {
  statusCode: number;
  message: string;
  data: any; // 현재는 null이므로 any로 설정
  metadata: any;
  error: any;
}

interface UseSendInquireMessageResult {
  sendInquireMessage: (payload: SendInquireMessagePayload) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const INQUIRE_MESSAGE_ENDPOINT = '/ai/inquire/send-message';

export const useSendInquireMessage = (): UseSendInquireMessageResult => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendInquireMessage = useCallback(async (payload: SendInquireMessagePayload): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      // apiClient를 사용하여 POST 요청 전송
      const response = await apiClient.post<SendInquireMessageResponse[]>(
        INQUIRE_MESSAGE_ENDPOINT,
        payload
      );

      // 응답 데이터가 배열이고 첫 번째 요소가 성공적인지 확인
      if (response.data && Array.isArray(response.data) && response.data.length > 0) {
        const result = response.data[0];
        if (result.statusCode === 200 && result.message === 'success') {
          console.log('견적 요청 메시지 전송 성공:', result);
          return true; // 성공적으로 전송되었음을 알림
        } else {
          const errorMessage = result.message || '알 수 없는 응답 오류가 발생했습니다.';
          console.error('견적 요청 메시지 전송 실패 (서버 응답 오류):', errorMessage, result);
          setError(errorMessage);
          return false;
        }
      } else {
        const errorMessage = '서버에서 올바른 응답 데이터를 받지 못했습니다.';
        console.error('견적 요청 메시지 전송 실패:', errorMessage, response.data);
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      const axiosError = err as any; // AxiosError 타입을 명확히 하기 위해
      const errorMessage = axiosError.response?.data?.message || axiosError.message || '네트워크 오류가 발생했습니다.';
      console.error('견적 요청 메시지 전송 중 오류 발생:', axiosError);
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { sendInquireMessage, isLoading, error };
};