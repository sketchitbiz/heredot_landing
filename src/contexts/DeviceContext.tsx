// src/lib/contexts/DeviceContext.tsx
'use client';

/**
 * DeviceContext는 현재 브라우저의 화면 너비에 따라 모바일, 태블릿, 데스크톱 중
 * 어떤 디바이스 유형인지를 판단하고, 컴포넌트 트리에 공유합니다.
 * 반응형 UI 렌더링을 위한 기반 정보로 활용됩니다.
 *
 * DeviceContext provides the current device type (mobile, tablet, desktop) based on
 * the browser window width, and shares it across the component tree.
 * Useful for responsive UI rendering.
 */

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Breakpoints } from '@/constants/layoutConstants';
import type { DeviceType } from '@/types/device';

// Context 생성: 디바이스 타입을 기본값으로 desktop 설정
// Create context with default value 'desktop'
const DeviceContext = createContext<DeviceType>('desktop');

// Context를 쉽게 사용할 수 있도록 커스텀 훅 제공
// Custom hook to easily access device type
export const useDevice = () => useContext(DeviceContext);

// DeviceProvider 컴포넌트: 자식 요소에 디바이스 정보를 공급
// DeviceProvider component: provides device info to its children
export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;

      // 화면 너비에 따라 디바이스 타입 설정
      // Set device type based on window width
      if (width < Breakpoints.tablet) setDevice('mobile');
      else if (width < Breakpoints.desktop) setDevice('tablet');
      else setDevice('desktop');
    };

    handleResize(); // 초기 실행 | Initial invocation
    window.addEventListener('resize', handleResize); // 리사이즈 감지 | Listen to resize
    return () => window.removeEventListener('resize', handleResize); // 정리 | Cleanup on unmount
  }, []);

  return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>;
};
