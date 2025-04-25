"use client";

import styled from "styled-components";
import Image from "next/image";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요

interface BannerProps {
  banners: { id: number | string; imageUrl: string; altText?: string }[];
}

const BannerContainer = styled.div`
  width: 100%;
  overflow-x: auto; // 가로 스크롤 활성화
  scroll-snap-type: x mandatory; // 가로 스크롤 스냅 강제
  display: flex;
  gap: 24px; // 배너 사이 간격
  padding: 16px 40px; // 상하, 좌우 패딩
  margin-bottom: 64px; // 아래 콘텐츠와의 간격

  /* 스크롤바 숨기기 (선택적) */
  &::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const BannerItem = styled.div`
  flex: 0 0 calc(33.333% - 16px); // 기본 3개 보이도록 너비 계산 (gap 고려)
  scroll-snap-align: center; // 중앙 기준으로 스냅
  border-radius: 8px;
  overflow: hidden;
  position: relative;
  aspect-ratio: 21 / 9; // 배너 비율
  background-color: ${AppColors.backgroundDark};

  @media (max-width: 992px) {
    flex: 0 0 calc(50% - 12px); // 화면 작으면 2개
  }

  @media (max-width: 600px) {
    flex: 0 0 calc(80% - 10px); // 더 작으면 1개 크게
  }
`;

const BannerImage = styled(Image)`
  display: block;
  object-fit: cover;
`;

export const ScrollingBanner: React.FC<BannerProps> = ({ banners }) => {
  return (
    <BannerContainer>
      {banners.map((banner) => (
        <BannerItem key={banner.id}>
          <BannerImage
            src={banner.imageUrl}
            alt={banner.altText || `Banner ${banner.id}`}
            fill
            sizes="(max-width: 600px) 80vw, (max-width: 992px) 50vw, 33vw"
          />
        </BannerItem>
      ))}
    </BannerContainer>
  );
};
