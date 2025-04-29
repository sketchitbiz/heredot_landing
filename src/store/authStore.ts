import { create } from "zustand";

interface AuthState {
  isAuthenticated: boolean;
  user: { uid: string; email: string | null } | null;
  login: (user: { uid: string; email: string | null }) => void;
  logout: () => void;
}

const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  login: (user) => set({ isAuthenticated: true, user }),
  logout: () => set({ isAuthenticated: false, user: null }),
}));

export default useAuthStore;
