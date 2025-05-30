import axios from 'axios';
import useAuthStore from '@/store/authStore'; // useAuthStore 스토어 임포트

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 (인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // localStorage에서 액세스 토큰 가져오기
    const token = localStorage.getItem('accessToken');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      // console.warn("No access token found in localStorage."); // 디버깅용
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (공통 에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error(
        '401 Unauthorized: Token might be expired or invalid. Attempting basic logout.'
      );
      // Zustand 스토어의 로그아웃 액션을 호출 (라우터 인스턴스 없이 기본 상태 초기화만 가정)
      // authStore의 logout 함수가 router 매개변수 없이 호출될 수 있도록 수정되었거나,
      // router가 필수라면 아래와 같이 호출할 수 없습니다.
      // 이 부분은 authStore.ts의 logout 구현에 따라 달라집니다.
      // useAuthStore.getState().logout(); // 린터 오류 발생 지점, authStore의 logout 시그니처 확인 필요

      // 우선 localStorage에서 토큰을 제거하고 스토어의 isLoggedIn 상태를 false로 변경 시도
      useAuthStore.getState().setIsLoggedIn(false); // 로그인 상태 false로 직접 변경
      localStorage.removeItem('accessToken');
      localStorage.removeItem('auth-storage');
      localStorage.removeItem('updateQuoteTitleFor');
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('firstUserMessageFor_')) {
          localStorage.removeItem(key);
        }
      });
      // 필요시 다른 스토어 상태도 초기화

      // 로그인 페이지로 리다이렉트
      if (typeof window !== 'undefined') {
        // 브라우저 환경에서만 실행
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
