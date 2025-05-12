import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_HOST,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터 (예: 인증 토큰 추가)
apiClient.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('accessToken'); // 예시: 로컬 스토리지에서 토큰 가져오기
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (예: 공통 에러 처리)
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 예: 401 Unauthorized 에러 시 로그인 페이지로 리다이렉트
    // if (error.response && error.response.status === 401) {
    //   window.location.href = '/login';
    // }
    return Promise.reject(error);
  }
);

export default apiClient;
