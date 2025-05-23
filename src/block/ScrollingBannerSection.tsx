"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors";
import { useState, useEffect, useRef } from "react";
import { SectionHeader } from "../components/Landing/SectionHeader";
import { CustomNavigator } from "@/customComponents/CustomNavigator";

interface ScrollingBannerSectionProps {
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
}

// 스크롤링 배너 데이터
const bannerData = [
  { id: "b1", imageUrl: "/landing/banner/landing.webp", altText: "랜딩 배너" },
  { id: "b2", imageUrl: "/landing/banner/quote.webp", altText: "인용 배너" },
  { id: "b3", imageUrl: "/landing/banner/coupon.webp", altText: "쿠폰 배너" },
];

// 전체 캐러셀 컨테이너
const CarouselContainer = styled.div`
  position: relative; // 네비게이션 점 위치 기준
  width: 100%;
  max-width: 1000px; // 최대 너비 제한 (디자인에 맞게 조절)
  margin: 0 auto; // 중앙 정렬
  padding: 0px 0 100px 0; // 상하 패딩
  margin-bottom: 64px;
  overflow: hidden; // 내부 슬라이드 넘침 방지
`;

// 슬라이드들을 감싸는 래퍼
const SlideWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 2 / 1; // 배너 비율 (조절 가능)
  border-radius: 16px; // 모서리 둥글게
  overflow: hidden; // 내부 이미지 넘침 방지
  background-color: ${AppColors.backgroundDark}; // 이미지 로딩 전 배경
`;

// 개별 슬라이드 (이미지 컨테이너)
const Slide = styled.div<{ $isActive: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0)};
  transition: opacity 0.6s ease-in-out; // 부드러운 페이드 효과
  z-index: ${({ $isActive }) => ($isActive ? 1 : 0)}; // 활성 슬라이드가 위로
`;

const BannerImage = styled.img`
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

// 하단 네비게이션 점 컨테이너
const NavigationDots = styled.div`
  position: absolute;
  bottom: 20px; // 캐러셀 하단에서의 거리
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 12px;
  z-index: 2; // 슬라이드 위에 표시
`;

// 개별 네비게이션 점
const Dot = styled.button<{ $isActive: boolean }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $isActive }) => ($isActive ? AppColors.primary : "#cccccc")};
  border: none;
  padding: 0;
  cursor: pointer;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: ${AppColors.primary}; // 호버 시 활성 색상 (선택적)
  }
`;

export const ScrollingBannerSection: React.FC<ScrollingBannerSectionProps> = ({
  title,
  description,
  topLabel,
  centerLabel,
  bottomLabel,
}) => {

  const [currentIndex, setCurrentIndex] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // 자동 슬라이드 타이머 리셋 함수
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // 자동 슬라이드 효과
  useEffect(() => {
    resetTimeout(); // 기존 타이머 클리어
    timeoutRef.current = setTimeout(
      () => setCurrentIndex((prevIndex) => (prevIndex === bannerData.length - 1 ? 0 : prevIndex + 1)),
      5000 // 5초마다 전환 (조절 가능)
    );

    // 컴포넌트 언마운트 시 타이머 클리어
    return () => {
      resetTimeout();
    };
  }, [currentIndex]); // currentIndex가 바뀔 때마다 타이머 재시작

  // 네비게이션 점 클릭 핸들러
  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <>
          <CustomNavigator
            topLabel={topLabel}
            centerLabel={centerLabel}
            bottomLabel={bottomLabel}
            title={title} // ✅ title 추가
            description={description} // ✅ description 추가'
          />
      <CarouselContainer>
        <SlideWrapper>
          {bannerData.map((banner, index) => (
            <Slide key={banner.id} $isActive={index === currentIndex}>
              <BannerImage
  src={banner.imageUrl}
  alt={banner.altText || `Banner ${banner.id}`}
  style={{ width: "100%", height: "100%" }} // 명시적으로 크기 설정
  sizes="(max-width: 1100px) 90vw, 1000px"
/>
            </Slide>
          ))}
        </SlideWrapper>

        <NavigationDots>
          {bannerData.map((_, index) => (
            <Dot
              key={index}
              $isActive={index === currentIndex}
              onClick={() => handleDotClick(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </NavigationDots>
      </CarouselContainer>{" "}
    </>
  );
};
