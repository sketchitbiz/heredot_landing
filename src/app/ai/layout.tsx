"use client";

import styled from "styled-components";
import AiNavigationBar from "@/components/Ai/AiNavigationBar";
// import PageLoader from "@/components/PageLoader"; // 일반 import 제거
import { useState, useEffect } from "react";
import dynamic from "next/dynamic"; // dynamic import 추가

// PageLoader를 클라이언트 사이드에서만 렌더링하도록 dynamic import
const ClientOnlyPageLoader = dynamic(() => import("@/components/PageLoader"), { ssr: false });

// 임시 데이터
const navigationItems = [
  {
    title: "오늘",
    items: [
      { name: "전산개발 견적", status: "진행" as const },
      { name: "IoT 앱 견적", status: "완료" as const },
      { name: "쇼핑 어플 견적 문의", status: "진행" as const },
    ],
  },
  {
    title: "일주일 전",
    items: [
      { name: "전산개발 견적", status: "완료" as const },
      { name: "IoT 앱 견적", status: "완료" as const },
      { name: "쇼핑 어플 견적 문의", status: "완료" as const },
    ],
  },
  {
    title: "3월",
    items: [
      { name: "전산개발 견적", status: "완료" as const },
      { name: "IoT 앱 견적", status: "완료" as const },
      { name: "쇼핑 어플 견적 문의", status: "완료" as const },
    ],
  },
];

export default function AiLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 페이지 초기 로딩 시뮬레이션
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LayoutContainer>
      {/* PageLoader 대신 ClientOnlyPageLoader 사용 */}
      <ClientOnlyPageLoader isOpen={isLoading} />
      <AiNavigationBar navigationItems={navigationItems} />
      <MainContent>{children}</MainContent>
    </LayoutContainer>
  );
}

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  background-color: white; /* 기존 AppColors.background 대신 임시로 white 사용, 필요시 AppColors 참조 추가 */
`;
