// src/components/ConsultingView.tsx
'use client';

import React from 'react';
import ResponsiveView from '@/layout/ResponsiveView';
import ConsultingWeb from './ConsultingWeb'; // 기존 데스크톱용 Consulting 컴포넌트
import ConsultingMobile from './ConsultingMobile'; // 새로 만든 모바일용

interface ConsultingProps {
  title: string;
  descriptions: string[];
  downloadText: string;
  gridHeaders: string[];
  gridContents: string[][];
  onEnterSection?: () => void; // ✅ 추가
}


const Consulting: React.FC<ConsultingProps> = (props) => {
  return (
    <ResponsiveView
      mobileView={<ConsultingMobile {...props} />}
      desktopView={<ConsultingWeb {...props} />}
    />
  );
};

export default Consulting;
