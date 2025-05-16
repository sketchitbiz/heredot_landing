import React, { Suspense } from 'react';
import AiPageContent from './AiPageContent'; // 새로 만든 컴포넌트 임포트
import { LoadingText } from './LoadingText'; // 로딩 텍스트 컴포넌트 임포트

// page.tsx는 이제 Suspense를 포함하는 래퍼 역할만 수행합니다.
export default function AIPage() {
  return (
    <Suspense fallback={<LoadingText />}>
      <AiPageContent />
    </Suspense>
  );
}
