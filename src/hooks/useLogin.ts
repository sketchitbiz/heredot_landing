import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore'; // default import로 변경
import { useState } from 'react';

interface LoginResponse {
  // 서버 응답에 따라 정의 (예시)
  user: {
    uid: string;
    email: string | null;
    // 기타 사용자 정보
  };
  accessToken?: string; // 예시: 서버에서 JWT 토큰을 반환하는 경우
}

const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { login, setIsLoggedIn, closeLoginModal } = useAuthStore();

  const googleLogin = async (idToken: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // 서버의 /user/login 엔드포인트로 idToken 전송
      const response = await apiClient.post<LoginResponse>('/user/login', {
        token: idToken, // 백엔드에서 받을 파라미터 이름에 따라 수정 (예: idToken, googleToken 등)
        provider: 'google', // 어떤 소셜 로그인인지 명시 (선택적)
      });

      const userData = response.data.user;
      // const accessToken = response.data.accessToken;

      // Zustand 스토어 업데이트
      login(userData as any); // user 정보 저장  <-- 타입 임시 변경
      setIsLoggedIn(true); // 로그인 상태 true로 변경

      // 예시: 액세스 토큰을 로컬 스토리지에 저장 (apiClient 인터셉터에서 활용 가능)
      // if (accessToken) {
      //   localStorage.setItem('accessToken', accessToken);
      // }

      closeLoginModal(); // 로그인 성공 시 모달 닫기
      return true;
    } catch (err) {
      console.error('Google login error:', err);
      setError(
        err instanceof Error
          ? err
          : new Error('An unknown error occurred during login.')
      );
      setIsLoggedIn(false); // 혹시 모르니 로그인 실패 시 false 처리
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { googleLogin, isLoading, error };
};

export default useLogin;
