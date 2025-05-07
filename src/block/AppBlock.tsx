'use client';

import React from 'react';
import ResponsiveView from '@/layout/ResponsiveView';
import AppWebBlock from './AppWebBlock';
import AppMobileBlock from './AppMobileBlock';

interface AppBlockProps {
  title: string;
  description: string;
}

/**
 * AppBlock은 화면 크기에 따라 WebBlock 또는 MobileBlock을 렌더링합니다.
 * AppBlock conditionally renders AppWebBlock or AppMobileBlock based on device type.
 */
export default function AppBlock(props: AppBlockProps) {
  return (
    <ResponsiveView
      mobileView={<AppMobileBlock {...props} />}
      desktopView={<AppWebBlock {...props} />}
    />
  );
}
