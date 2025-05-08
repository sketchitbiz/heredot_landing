'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Breakpoints } from '@/constants/layoutConstants';
import type { DeviceType } from '@/types/device';

// 타입에서 'tablet' 제거
type SimplifiedDeviceType = 'mobile' | 'desktop';

const DeviceContext = createContext<SimplifiedDeviceType>('desktop');
export const useDevice = () => useContext(DeviceContext);

export const DeviceProvider = ({ children }: { children: React.ReactNode }) => {
  const [device, setDevice] = useState<SimplifiedDeviceType>('desktop');

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const ua = navigator.userAgent;

      console.log('User Agent:', ua); // User Agent 로그 추가

      const isIPad = /iPad/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); 
      const isMobileUA = /iPhone|Android.*Mobile/.test(ua);
      
      if (isIPad || width >= Breakpoints.mobile) {
        setDevice('desktop');
      } else if (isMobileUA || width < Breakpoints.mobile) {
        setDevice('mobile');
      }
    };

    detectDevice(); // 초기 실행
    window.addEventListener('resize', detectDevice);
    return () => window.removeEventListener('resize', detectDevice);
  }, []);

  return <DeviceContext.Provider value={device}>{children}</DeviceContext.Provider>;
};
