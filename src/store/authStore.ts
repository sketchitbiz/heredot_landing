import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

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
  accessToken: string;
  profileUrl?: string;
}

export interface AuthState {
  user: UserData | null;
  isLoggedIn: boolean;
  isLoginModalOpen: boolean;
  isAdditionalInfoModalOpen: boolean;
  login: (userData: UserData) => void;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
  openAdditionalInfoModal: () => void;
  closeAdditionalInfoModal: () => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoggedIn: false,
      isLoginModalOpen: false,
      isAdditionalInfoModalOpen: false,
      login: (userData) =>
        set({ user: userData, isLoggedIn: true, isLoginModalOpen: false }),
      logout: () => {
        // 로컬 스토리지에서 사용자 관련 데이터 모두 삭제
        localStorage.removeItem('accessToken');
        localStorage.removeItem('logId');
        localStorage.removeItem('loginData');

        // 스토어 상태 초기화
        set({
          user: null,
          isLoggedIn: false,
          isAdditionalInfoModalOpen: false,
        });
      },
      openLoginModal: () => set({ isLoginModalOpen: true }),
      closeLoginModal: () => set({ isLoginModalOpen: false }),
      openAdditionalInfoModal: () => set({ isAdditionalInfoModalOpen: true }),
      closeAdditionalInfoModal: () => set({ isAdditionalInfoModalOpen: false }),
      setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
);

export default useAuthStore;
