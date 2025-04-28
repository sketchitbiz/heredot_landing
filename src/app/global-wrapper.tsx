// src/app/providers.tsx
"use client";

import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase/firebase.config";
import useAuthStore from "@/store/authStore";

/**
 * GlobalWrapper는 애플리케이션 전역에 필요한 컨텍스트와 스타일을 감싸주는 최상위 Provider 컴포넌트입니다.
 * 디바이스 정보, 페이지 로딩 상태, 글로벌 스타일 등을 일괄 적용하는 용도로 사용됩니다.
 * 또한, Firebase 인증 상태를 감지하고 전역 상태를 업데이트합니다.
 *
 * GlobalWrapper is the top-level provider component that wraps the app with global context and styles.
 * It applies device info, page loader state, and global styles across the application.
 * It also listens for Firebase authentication state changes and updates the global state.
 */

import { DeviceProvider } from "@/contexts/DeviceContext";
import { LangProvider } from "@/contexts/LangContext";
import { PageLoaderProvider } from "@/contexts/PageLoaderContext";
import GlobalStyle from "@/styles/GlobalStyles";

export function GlobalWrapper({ children }: { children: React.ReactNode }) {
  const { login, logout } = useAuthStore();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        login({ uid: user.uid, email: user.email });
      } else {
        logout();
      }
    });

    return () => unsubscribe();
  }, [login, logout]);

  return (
    <>
      {/* 페이지 로딩 상태 전역 관리 | Global page loading state */}
      <PageLoaderProvider>
        {/* 반응형 디바이스 정보 전역 제공 | Global device type context */}
        <LangProvider>
          <DeviceProvider>
            {/* 글로벌 스타일 적용 | Apply global base styles */}
            <GlobalStyle />
            {children}
          </DeviceProvider>
        </LangProvider>
      </PageLoaderProvider>
    </>
  );
}
