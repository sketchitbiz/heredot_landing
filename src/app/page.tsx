"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors"; // AppColors 임포트 추가
import ScreenWrapper from "@/layout/ScreenWrapper";
import { ContactSection } from "@/components/Landing/ContactSection"; // 추가
import { PortfolioGrid } from "@/components/block/PortfolioGrid";
import { MembersTabSection } from "@/components/block/MembersTabSection";
import { VideoGrid } from "@/components/block/VideoGrid";
import { ScrollingBannerSection } from "@/components/block/ScrollingBannerSection";

export default function HomePage() {
  return (
    <ScreenWrapper>
      <PageContainer>
        {/* --- 포트폴리오 그리드 섹션 --- */}
        <PortfolioGrid />

        {/* --- 멤버 탭 섹션 --- */}
        <MembersTabSection />

        {/* --- 비디오 그리드 섹션 --- */}
        <VideoGrid />

        {/* --- 스크롤링 배너 섹션 --- */}
        <ScrollingBannerSection />

        {/* --- 연락처 섹션 --- */}
        <ContactSection />
      </PageContainer>
    </ScreenWrapper>
  );
}

// --- 스타일 컴포넌트 ---
const PageContainer = styled.div`
  width: 1200px;
  padding: 40px 0; // 상하 패딩, 좌우는 각 섹션에서 처리
  background-color: ${AppColors.background};
  min-height: 100vh;
`;
