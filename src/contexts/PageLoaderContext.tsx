'use client';

/**
 * PageLoaderContext는 페이지 전환 또는 비동기 작업 중에
 * 로딩 인디케이터를 전역적으로 표시/숨기기 위한 컨텍스트입니다.
 *
 * PageLoaderContext provides a global way to control the visibility
 * of a loading indicator during page transitions or async tasks.
 */

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import PageLoader from '@/components/PageLoader';

// ================================
// 🔹 글로벌 호출용 컨트롤러 정의
// ================================

let openFn = () => {};
let closeFn = () => {};

/**
 * 외부에서 사용할 수 있는 로딩 컨트롤러
 * Global page loader controller usable from anywhere
 */
export const pageLoaderController = {
  open: () => openFn(),
  close: () => closeFn(),
};

// ================================
// 🔹 Context 생성
// ================================

const PageLoaderContext = createContext<{
  open: () => void;
  close: () => void;
} | null>(null);

/**
 * PageLoaderContext 사용 훅
 * Custom hook to consume loader context
 */
export const usePageLoaderContext = () => {
  const context = useContext(PageLoaderContext);
  if (!context) throw new Error('PageLoaderContext not found');
  return context;
};

/**
 * PageLoaderProvider
 * 전역 로딩 상태 공급자 / Global loader state provider
 */
export const PageLoaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);

  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  // 컨트롤러에 등록
  useEffect(() => {
    openFn = open;
    closeFn = close;
  }, [open, close]);

  return (
    <PageLoaderContext.Provider value={{ open, close }}>
      {children}
      <PageLoader isOpen={isOpen} />
    </PageLoaderContext.Provider>
  );
};
