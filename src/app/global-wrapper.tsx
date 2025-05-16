// src/app/providers.tsx
'use client';

import { useEffect } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';

/**
 * GlobalWrapper는 애플리케이션 전역에 필요한 컨텍스트와 스타일을 감싸주는 최상위 Provider 컴포넌트입니다.
 * 디바이스 정보, 페이지 로딩 상태, 글로벌 스타일 등을 일괄 적용하는 용도로 사용됩니다.
 * Firebase 인증 상태 감지 로직은 AiLayout으로 이동되었습니다.
 *
 * GlobalWrapper is the top-level provider component that wraps the app with global context and styles.
 * It applies device info, page loader state, and global styles across the application.
 * Firebase auth state listening logic has been moved to AiLayout.
 */

import { DeviceProvider } from '@/contexts/DeviceContext';
import { LangProvider } from '@/contexts/LangContext';
import { PageLoaderProvider } from '@/contexts/PageLoaderContext';
import GlobalStyle from '@/styles/GlobalStyles';

export function GlobalWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // ✅ 새로고침 또는 첫 진입 시 스크롤 맨 위로 이동
    window.scrollTo(0, 0);
  }, []);

  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}
    >
      <PageLoaderProvider>
        <LangProvider>
          <DeviceProvider>
            <GlobalStyle />
            {children}
          </DeviceProvider>
        </LangProvider>
      </PageLoaderProvider>
    </GoogleOAuthProvider>
  );
}
