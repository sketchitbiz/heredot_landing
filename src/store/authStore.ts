// src/store/authStore.ts

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { toast } from 'react-toastify';
import { mutate as swrMutate } from 'swr';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';
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
  loginModalContext: string | null; //  контекст для модального окна входа
  isAdditionalInfoModalOpen: boolean;
  currentSessionIndex: number | null; // 현재 활성화된 채팅 세션 인덱스
  isEditProfileModalOpen: boolean; // EditProfileModal 상태 추가

  // 액션들
  login: (userData: UserData) => Promise<void>; // Promise 반환하도록 변경
  logout: (router: AppRouterInstance) => void; // 로그아웃 시 라우터 주입받아 이동
  openLoginModal: (context?: string | unknown) => void; // openLoginModal теперь принимает контекст
  closeLoginModal: () => void;
  openAdditionalInfoModal: () => void;
  closeAdditionalInfoModal: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setCurrentSessionIndex: (index: number | null) => void;
  resetCurrentSession: () => void; // 명시적으로 현재 세션 초기화
  openEditProfileModal: () => void; // EditProfileModal 열기 액션 추가
  closeEditProfileModal: () => void; // EditProfileModal 닫기 액션 추가
  updateUser: (updatedData: Partial<UserData>) => void; // 사용자 정보 업데이트 액션 추가
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoginModalOpen: false,
      loginModalContext: null, // начальное состояние для контекста
      isAdditionalInfoModalOpen: false,
      currentSessionIndex: null, // 초기 상태
      isEditProfileModalOpen: false, // EditProfileModal 초기 상태 추가

      // 로그인 액션: 사용자 데이터를 받아 상태를 업데이트하고 Promise를 반환합니다.
      login: (userData) =>
        new Promise<void>((resolve) => {
          set({ user: userData, isLoggedIn: true, isLoginModalOpen: false }); // isLoginModalOpen도 false로 설정
          // set 호출 후 실행될 로직
          console.log('[AuthStore] Login state updated, resolving promise.');
          resolve();
        }),

      // 로그아웃 액션: 상태 초기화, SWR 캐시 갱신, 라우터 이동
      logout: (router) => {
        set({
          user: null,
          isLoggedIn: false,
          isAdditionalInfoModalOpen: false,
          currentSessionIndex: null, // 🚨 로그아웃 시 현재 세션 인덱스를 명시적으로 초기화
          loginModalContext: null, // При выходе из системы также сбрасываем контекст
        });

        localStorage.removeItem('accessToken');
        localStorage.removeItem('auth-storage');
        localStorage.removeItem('updateQuoteTitleFor');
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('firstUserMessageFor_')) {
            localStorage.removeItem(key);
          }
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
      openLoginModal: (context?: string | unknown) => {
        let modalContext: string | null = null;
        if (typeof context === 'string') {
          modalContext = context;
        } else if (context !== undefined && context !== null) {
          // 문자열이 아닌 예상치 못한 context가 들어온 경우 로깅 (개발/디버깅 목적)
          console.warn(
            '[AuthStore] openLoginModal received non-string context:',
            context
          );
          // 이 경우 modalContext는 null로 유지됩니다.
        }
        console.log(
          '[AuthStore] openLoginModal called. Effective context:',
          modalContext
        );
        set({
          isLoginModalOpen: true,
          loginModalContext: modalContext,
        });
      },
      closeLoginModal: () =>
        set({
          isLoginModalOpen: false,
          loginModalContext: null, // Сбрасываем контекст при закрытии модального окна
        }),

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

      // EditProfileModal 액션 구현
      openEditProfileModal: () => set({ isEditProfileModalOpen: true }),
      closeEditProfileModal: () => set({ isEditProfileModalOpen: false }),

      // 사용자 정보 업데이트 액션 구현
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
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
        loginModalContext: state.loginModalContext, // Сохраняем контекст в localStorage
      }),
    }
  )
);

export default useAuthStore;
