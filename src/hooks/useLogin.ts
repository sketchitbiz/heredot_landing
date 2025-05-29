import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore'; // default import로 변경
import { useState } from 'react';
import { toast } from 'react-hot-toast';

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

      const userDataFromServer = response.data.user;
      const accessToken = response.data.accessToken;

      // Zustand 스토어 업데이트 시 accessToken도 함께 전달하거나,
      // 스토어의 User 타입에 accessToken 필드가 있다면 userDataFromServer와 합쳐서 전달
      // 여기서는 userDataFromServer만 전달하고, accessToken은 localStorage에서 apiClient가 사용한다고 가정
      // 필요하다면 authStore의 login 액션과 User 타입을 수정하여 accessToken도 스토어에 저장할 수 있습니다.

      const userForStore = {
        uuid: userDataFromServer.uid,
        email: userDataFromServer.email,
        name: userDataFromServer.name,
        profileUrl: userDataFromServer.profileUrl,
        // accessToken: accessToken, // User 타입에 accessToken이 있다면 이렇게 포함
        currentSessionIndex: null,
        loginModalContext: null,
        deleteYn: (userDataFromServer as any).deleteYn, // deleteYn 추가 (서버 응답에 deleteYn이 있다고 가정)
        // 기타 필요한 정보들...
      };


      login(userForStore as any); // user 정보 저장 (TODO: User 타입 일치시키고 as any 제거)
      setIsLoggedIn(true);

      // 예시: 액세스 토큰을 로컬 스토리지에 저장 (apiClient 인터셉터에서 활용 가능)
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
      }

      closeLoginModal();
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
