'use client';

import styled from 'styled-components';
import { useState, useRef, useEffect, useCallback } from 'react';
import { gsap } from 'gsap';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { SectionHeader } from '@/components/Landing/SectionHeader';
import { AppColors } from '@/styles/colors';

interface BannerProps {
  banners: { id: number | string; imageUrl: string; altText?: string }[];
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
}

// --- 스타일 ---
const BannerContainer = styled.div`
  --item-width: 60vw;

  @media (max-width: 992px) {
    --item-width: 70vw;
  }
  @media (max-width: 600px) {
    --item-width: 80vw;
  }
`;

const Wrapper = styled.div`
  margin-top: 100px;
  padding: 0 40px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  align-items: stretch;
`;

const LeftSection = styled.div`
  flex: 1;
  height: 100%;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  height: 100%;
`;

const BannerWrapper = styled.div`
  width: 100%;
  position: relative;
  overflow: hidden;
  padding: 32px 0;
  margin-bottom: 64px;
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
`;

const BannerTrack = styled.div`
  display: flex;
  gap: 32px;
  position: relative;
  padding-left: calc(50% - (var(--item-width) / 2));
  padding-right: calc(50% - (var(--item-width) / 2));
`;

const BannerItem = styled.div<{ $isActive: boolean }>`
  flex-shrink: 0;
  width: var(--item-width);
  aspect-ratio: 16/9;
  border-radius: 16px;
  overflow: hidden;
  position: relative;
  background-color: ${AppColors.backgroundDark};
  transition: transform 0.4s ease-out, opacity 0.4s ease-out;
  transform: scale(${({ $isActive }) => ($isActive ? 1 : 0.9)});
  opacity: ${({ $isActive }) => ($isActive ? 1 : 0.6)};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const BannerImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
`;

// --- 컴포넌트 ---
export const ScrollingBannerSection: React.FC<BannerProps> = ({
  banners,
  title,
  description,
  topLabel,
  centerLabel,
  bottomLabel,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemWidthRef = useRef(0);
  const gapRef = useRef(32);
  const isWheelingRef = useRef(false);

  const calculateItemWidth = useCallback(() => {
    if (wrapperRef.current) {
      const computedStyle = getComputedStyle(wrapperRef.current);
      const itemWidthVW = parseFloat(computedStyle.getPropertyValue('--item-width'));
      itemWidthRef.current = (window.innerWidth * itemWidthVW) / 100;
    }
  }, []);

  useEffect(() => {
    calculateItemWidth();
    window.addEventListener('resize', calculateItemWidth);
    return () => window.removeEventListener('resize', calculateItemWidth);
  }, [calculateItemWidth]);

  useEffect(() => {
    if (trackRef.current && itemWidthRef.current > 0) {
      const targetX = -currentIndex * (itemWidthRef.current + gapRef.current);
      gsap.to(trackRef.current, {
        x: targetX,
        duration: 0.6,
        ease: 'power3.out',
      });
    }
  }, [currentIndex]);

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      if (isWheelingRef.current) return;
      isWheelingRef.current = true;

      if (event.deltaY > 0) {
        setCurrentIndex((prev) => Math.min(prev + 1, banners.length - 1));
      } else if (event.deltaY < 0) {
        setCurrentIndex((prev) => Math.max(prev - 1, 0));
      }

      setTimeout(() => {
        isWheelingRef.current = false;
      }, 700);
    },
    [banners.length]
  );

  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener('wheel', handleWheel, { passive: true });
      return () => wrapper.removeEventListener('wheel', handleWheel);
    }
  }, [handleWheel]);

  return (
    <>
      <Wrapper>
        {/* 왼쪽 - SectionHeader */}
        <LeftSection>
          <SectionHeader title={title} description={description} />
        </LeftSection>

        {/* 오른쪽 - CustomNavigator */}
        <RightSection>
          <CustomNavigator topLabel={topLabel} centerLabel={centerLabel} bottomLabel={bottomLabel} />
        </RightSection>
      </Wrapper>

      {/* 배너 영역 */}
      <BannerContainer ref={wrapperRef}>
        <BannerWrapper>
          <BannerTrack ref={trackRef}>
            {banners.map((banner, index) => (
              <BannerItem key={banner.id} $isActive={index === currentIndex}>
                <BannerImage
  src={banner.imageUrl}
  alt={banner.altText || `Banner ${banner.id}`}
  className="w-full h-full object-cover"
/>
              </BannerItem>
            ))}
          </BannerTrack>
        </BannerWrapper>
      </BannerContainer>
    </>
  );
};
