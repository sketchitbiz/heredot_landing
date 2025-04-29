import React, { Suspense } from "react";
import AiPageContent from "./AiPageContent"; // 새로 만든 컴포넌트 임포트

// page.tsx는 이제 Suspense를 포함하는 래퍼 역할만 수행합니다.
export default function AIPage() {
  return (
    // Suspense로 AiPageContent 감싸기
    // fallback은 로딩 중에 보여줄 UI입니다. 간단한 텍스트나 로딩 스피너 컴포넌트를 사용할 수 있습니다.
    <Suspense fallback={<div>페이지 로딩 중...</div>}>
      <AiPageContent />
    </Suspense>
  );
}
