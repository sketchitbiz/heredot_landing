// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { mutate as swrMutate } from 'swr';
// ChatSession 인터페이스는 useChatSessionList 훅에서 가져오는 것이 더 적합하므로 여기서는 제거합니다.
// import { ChatSession } from '@/hooks/chat/useChatSessionList';

// SWR 캐시 키는 상수화하여 관리합니다.
const CHAT_SESSIONS_API_KEY = '/api/chat/sessions';

export interface UserData {
  uuid: string;
  name: string;
  countryCode: string | null;
  cellphone: string | null;
  email: string;
  providerId: string;
  withdrawYn: string;
  createdTime: string;
  updateTime: string | null;
  lastLoginTime: string;
  accessToken: string; // 이 accessToken은 인증 토큰이 아닌 사용자 데이터의 일부일 수 있습니다.
  profileUrl?: string;
}

export interface AuthState {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  isAdditionalInfoModalOpen: boolean;
  currentSessionIndex: number | null; // 현재 활성화된 채팅 세션 인덱스

  // 액션들
  login: (userData: UserData) => Promise<void>; // Promise 반환하도록 변경
  logout: (router: any) => void; // 로그아웃 시 라우터 주입받아 이동
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openAdditionalInfoModal: () => void;
  closeAdditionalInfoModal: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentSessionIndex: (index: number | null) => void;
  resetCurrentSession: () => void; // 명시적으로 현재 세션 초기화
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoggedIn: false,
      isLoginModalOpen: false,
      isAdditionalInfoModalOpen: false,
      currentSessionIndex: null, // 초기 상태

      // 로그인 액션: 사용자 데이터를 받아 상태를 업데이트하고 Promise를 반환합니다.
      login: (userData) =>
        new Promise<void>((resolve) => {
          set(
            { user: userData, isLoggedIn: true, isLoginModalOpen: false },
            () => {
              console.log(
                '[AuthStore] Login state updated, resolving promise.'
              );
              // 로그인 시점에 기존 세션 인덱스를 유지하거나,
              // 필요하다면 이곳에서 `setCurrentSessionIndex(null)`을 호출하여 초기화할 수도 있습니다.
              // 현재는 persist에 currentSessionIndex가 포함되어 있으므로 기존 값을 유지합니다.
              resolve();
            }
          );
        }),

      // 로그아웃 액션: 상태 초기화, SWR 캐시 갱신, 라우터 이동
      logout: (router) => {
        set({
          user: null,
          isLoggedIn: false,
          isAdditionalInfoModalOpen: false,
          currentSessionIndex: null, // 🚨 로그아웃 시 현재 세션 인덱스를 명시적으로 초기화
        });
        // 채팅 세션 목록 SWR 캐시를 강제로 갱신하여 로그아웃된 사용자에게는 빈 목록이 보이도록 합니다.
        swrMutate(CHAT_SESSIONS_API_KEY, undefined, { revalidate: true });
        // 로그아웃 후 /ai 경로로 이동하여 초기 채팅 화면을 보여줍니다.
        router.push('/ai');
        // router.refresh()를 추가하여 페이지 전체를 새로고침하는 효과를 줍니다.
        // 이는 클라이언트 컴포넌트의 상태를 포함하여 모든 것을 초기화하는 데 유용합니다.
        router.refresh();
        toast.info('로그아웃되었습니다.');
        console.log('[AuthStore] Logout complete, currentSessionIndex reset.');
      },

      // 로그인 모달 열기/닫기
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),

      // 추가 정보 모달 열기/닫기
      openAdditionalInfoModal: () => set({ isAdditionalInfoModalOpen: true }),
      closeAdditionalInfoModal: () => set({ isAdditionalInfoModalOpen: false }),

      // 로그인 상태 직접 설정 (외부에서 필요시)
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),

      // 현재 세션 인덱스 설정
      setCurrentSessionIndex: (newIndex) => {
        set((state) => {
          // 불필요한 렌더링을 줄이기 위해 값이 변경될 때만 로그를 출력합니다.
          if (state.currentSessionIndex !== newIndex) {
            console.log(
              `[AuthStore] currentSessionIndex 변경: ${state.currentSessionIndex} -> ${newIndex}`
            );
          }
          return { currentSessionIndex: newIndex };
        });
      },

      // 현재 세션 인덱스를 null로 명시적으로 초기화합니다.
      resetCurrentSession: () => {
        set({ currentSessionIndex: null });
        console.log('[AuthStore] currentSessionIndex reset to null.');
      },
    }),
    {
      name: 'auth-storage', // localStorage에 저장될 이름
      storage: createJSONStorage(() => localStorage),
      // localStorage에 저장할 상태를 정의합니다.
      // currentSessionIndex를 persist하여 브라우저 재시작 시에도 유지되도록 합니다.
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
        currentSessionIndex: state.currentSessionIndex, // ✅ currentSessionIndex를 localStorage에 유지
      }),
    }
  )
);

export default useAuthStore;