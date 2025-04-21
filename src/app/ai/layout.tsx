"use client";

import styled from "styled-components";
import AiNavigationBar from "@/components/AiNavigationBar";
import PageLoader from "@/components/PageLoader";
import { useState, useEffect } from "react";

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
      <PageLoader isOpen={isLoading} />
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
  background-color: white;
`;
