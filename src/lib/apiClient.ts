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
    // Zustand 스토어에서 직접 액세스 토큰 가져오기
    // `getState()`를 사용하여 훅 외부에서 스토어의 현재 상태에 접근합니다.
    const token = useAuthStore.getState().user?.accessToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      // console.log("Authorization token added:", token); // 디버깅용
    } else {
      // console.warn("No access token found in auth store."); // 디버깅용
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
    // 예: 401 Unauthorized 에러 시 로그인 페이지로 리다이렉트
    if (error.response && error.response.status === 401) {
      console.error(
        '401 Unauthorized: Token might be expired or invalid. Attempting logout and redirect.'
      );
      // Zustand 스토어의 로그아웃 액션을 호출하여 상태를 정리
      useAuthStore.getState().logout();
      // 로그인 페이지로 리다이렉트 (Next.js Link/router.push를 사용하는 것이 더 좋지만, window.location.href도 동작)
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
