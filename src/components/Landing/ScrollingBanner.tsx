"use client";

import styled from "styled-components";
import Image from "next/image";
import { AppColors } from "@/styles/colors";
import { useState, useRef, useEffect, useCallback } from "react";
import { gsap } from "gsap";

interface BannerProps {
  banners: { id: number | string; imageUrl: string; altText?: string }[];
}

// 전체 배너 영역을 감싸는 컨테이너
const BannerWrapper = styled.div`
  width: 100%;
  position: relative; // 자식 요소 absolute 배치 기준
  overflow: hidden; // 내부 track이 넘치지 않도록
  padding: 32px 0; // 상하 패딩 추가
  margin-bottom: 64px;
  cursor: grab; // 드래그 가능 표시 (실제 드래그는 구현 안됨)
  &:active {
    cursor: grabbing;
  }
`;

// 실제 배너 아이템들을 담고 움직이는 트랙
const BannerTrack = styled.div`
  display: flex;
  gap: 32px; // 배너 사이 간격 조정
  position: relative; // gsap 애니메이션 대상
  padding-left: calc(50% - (var(--item-width) / 2)); // 첫 아이템 중앙 정렬 위한 패딩
  padding-right: calc(50% - (var(--item-width) / 2)); // 마지막 아이템 중앙 정렬 위한 패딩
`;

// 개별 배너 아이템
const BannerItem = styled.div<{ $isActive: boolean }>`
  flex-shrink: 0; // 아이템 크기 줄어들지 않게
  width: var(--item-width); // CSS 변수로 너비 관리 (60vw)
  aspect-ratio: 16 / 9; // 배너 비율 유지
  border-radius: 16px; // 좀 더 둥글게
  overflow: hidden;
  position: relative;
  background-color: ${AppColors.backgroundDark};
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: scale(${({ $isActive }) => ($isActive ? 1 : 0.9)}); // 활성/비활성 크기 조절
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)}; // 활성/비활성 투명도 조절
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const BannerImage = styled(Image)`
  display: block;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

// 너비 계산을 위한 CSS 변수 설정
const BannerContainer = styled.div`
  --item-width: 60vw; // 배너 아이템 기본 너비
  @media (max-width: 992px) {
    --item-width: 70vw; // 화면 작을 때 너비
  }
  @media (max-width: 600px) {
    --item-width: 80vw; // 더 작을 때 너비
  }
`;

export const ScrollingBanner: React.FC<BannerProps> = ({ banners }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef(0); // 아이템 너비 저장
  const gapRef = useRef(32); // 갭 저장 (BannerTrack gap과 동일)
  const isWheelingRef = useRef(false); // 휠 이벤트 중복 방지

  // 아이템 너비 계산 및 업데이트
  const calculateItemWidth = useCallback(() => {
    if (wrapperRef.current) {
      const computedStyle = getComputedStyle(wrapperRef.current);
      const itemWidthVW = parseFloat(computedStyle.getPropertyValue("--item-width"));
      itemWidthRef.current = (window.innerWidth * itemWidthVW) / 100;
      // console.log("Calculated item width:", itemWidthRef.current);
    }
  }, []);

  useEffect(() => {
    calculateItemWidth();
    window.addEventListener("resize", calculateItemWidth);
    return () => window.removeEventListener("resize", calculateItemWidth);
  }, [calculateItemWidth]);

  // GSAP 애니메이션
  useEffect(() => {
    if (trackRef.current && itemWidthRef.current > 0) {
      const targetX = -currentIndex * (itemWidthRef.current + gapRef.current);
      // console.log(`Animating to index: ${currentIndex}, targetX: ${targetX}`);
      gsap.to(trackRef.current, {
        x: targetX,
        duration: 0.6,
        ease: "power3.out",
      });
    }
  }, [currentIndex]);

  // 휠 이벤트 처리
  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isWheelingRef.current) return;
      isWheelingRef.current = true;

      // console.log("Wheel deltaY:", event.deltaY);

      if (event.deltaY > 0) {
        // Scroll Down -> Next
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, banners.length - 1));
      } else if (event.deltaY < 0) {
        // Scroll Up -> Previous
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
      }

      // 휠 이벤트 처리 후 잠시 대기 (애니메이션 시간 고려 + 약간의 여유)
      setTimeout(() => {
        isWheelingRef.current = false;
      }, 700); // duration + buffer
    },
    [banners.length]
  );

  useEffect(() => {
    const wrapperElement = wrapperRef.current;
    if (wrapperElement) {
      wrapperElement.addEventListener("wheel", handleWheel, { passive: true });
      return () => wrapperElement.removeEventListener("wheel", handleWheel);
    }
  }, [handleWheel]);

  return (
    <BannerContainer ref={wrapperRef}>
      {" "}
      {/* 리사이즈 감지 및 CSS 변수 적용 */}
      <BannerWrapper>
        {" "}
        {/* 스크롤 및 기본 스타일링 */}
        <BannerTrack ref={trackRef}>
          {banners.map((banner, index) => (
            <BannerItem key={banner.id} $isActive={index === currentIndex}>
              <BannerImage
                src={banner.imageUrl}
                alt={banner.altText || `Banner ${banner.id}`}
                fill
                sizes="(max-width: 600px) 80vw, (max-width: 992px) 70vw, 60vw"
                priority={index === 0 || index === 1} // 처음 몇 개 이미지 우선 로드
              />
            </BannerItem>
          ))}
        </BannerTrack>
      </BannerWrapper>
    </BannerContainer>
  );
};
