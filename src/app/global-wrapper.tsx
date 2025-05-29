'use client';

import { useEffect, Suspense } from 'react';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { DeviceProvider } from '@/contexts/DeviceContext';
import { LangProvider } from '@/contexts/LangContext';
import { PageLoaderProvider } from '@/contexts/PageLoaderContext';
import GlobalStyle from '@/styles/GlobalStyles';
import useAuthStore from '@/store/authStore';
import { v4 as uuidv4 } from 'uuid';
import { devLog } from '@/lib/utils/devLogger';

export function GlobalWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0);

    // ✅ 비로그인 사용자 uuid(localStorage 저장용)
    const logIdKey = 'logId';
    const auth = useAuthStore.getState();

    // 로그인하지 않은 경우에만 처리
    if (!auth.user?.uuid) {
      const existing = localStorage.getItem(logIdKey);
      if (!existing) {
        const newUuid = uuidv4();
        localStorage.setItem(logIdKey, newUuid);
        devLog('[GlobalWrapper] uuid 생성 및 저장:', newUuid);
      } else {
        devLog('[GlobalWrapper] 기존 uuid 사용:', existing);
      }
    }
  }, []);

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
}

export default GlobalWrapper;
