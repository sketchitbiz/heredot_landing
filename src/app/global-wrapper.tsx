// src/app/providers.tsx
'use client';

/**
 * GlobalWrapper는 애플리케이션 전역에 필요한 컨텍스트와 스타일을 감싸주는 최상위 Provider 컴포넌트입니다.
 * 디바이스 정보, 페이지 로딩 상태, 글로벌 스타일 등을 일괄 적용하는 용도로 사용됩니다.
 *
 * GlobalWrapper is the top-level provider component that wraps the app with global context and styles.
 * It applies device info, page loader state, and global styles across the application.
 */

import { DeviceProvider } from "@/contexts/DeviceContext";
import { PageLoaderProvider } from "@/contexts/PageLoaderContext";
import GlobalStyle from "@/styles/GlobalStyles";

export function GlobalWrapper({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* 페이지 로딩 상태 전역 관리 | Global page loading state */}
      <PageLoaderProvider>
        {/* 반응형 디바이스 정보 전역 제공 | Global device type context */}
        <DeviceProvider>
          {/* 글로벌 스타일 적용 | Apply global base styles */}
          <GlobalStyle />
          {children}
        </DeviceProvider>
      </PageLoaderProvider>
    </>
  );
}
