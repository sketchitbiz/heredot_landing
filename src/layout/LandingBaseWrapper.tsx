'use client';

import styled, { keyframes } from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';
import ResponsiveView from '@/layout/ResponsiveView';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';


const slideUp = keyframes`
  0% {
    transform: translateY(100%) translateX(var(--scroll-x, 0));
    opacity: 0;
  }
  100% {
    transform: translateY(0) translateX(var(--scroll-x, 0));
    opacity: 1;
  }
`;

const slideDown = keyframes`
  0% {
    transform: translateY(-100%) translateX(var(--scroll-x, 0));
    opacity: 0;
  }
  100% {
    transform: translateY(0) translateX(var(--scroll-x, 0));
    opacity: 1;
  }
`;

// 텍스트 그라데이션 스켈레톤 애니메이션
const textGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const bgGradient = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

// 텍스트 스켈레톤 스타일
const SkeletonText = styled.span`
  background: linear-gradient(90deg, #5708fb, #be83ea, #5708fb);
  background-size: 300% 100%;
  animation: ${textGradient} 3s ease-in-out infinite;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  -webkit-text-fill-color: transparent;
  font-weight: 700;
`;

const IconWrapper = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: linear-gradient(135deg, #5708fb, #be83ea, #5708fb);
  background-size: 300% 100%;
  animation: ${bgGradient} 3s ease-in-out infinite;
  display: flex;
  align-items: center;
  justify-content: center;
`;



// ✅ ResponsiveDescription: isMobile props를 받아 조건 처리
const ResponsiveDescription: React.FC<{ text: string; isMobile: boolean }> = ({
  text,
  isMobile,
}) => {
  const [firstLine] = text.split('\n');
  return <LeftDescription>{isMobile ? firstLine : text}</LeftDescription>;
};

interface LandingSection {
  id?: string;
  $backgroundColor?: string;
  content: React.ReactNode;
  $zIndex?: number;
  $isOverLayout?: boolean;
  isWithAppBar?: boolean;
  showFloatingBox?: boolean;
}

interface LandingBaseWrapperProps {
  sections: LandingSection[];
  appBar?: React.ReactNode;
}

const FixedAppBarWrapper = styled.div<{ $scrollX: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  transform: translateX(${({ $scrollX }) => -$scrollX}px);
  z-index: 1000;
  display: flex;
  justify-content: center;
`;

const AppBarContentWrapper = styled.div`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  box-sizing: border-box;
`;

const SectionWrapper = styled.section<{
  $backgroundColor?: string;
  $zIndex?: number;
  $hideAppBar?: boolean;
}>`
  width: 100%;
  background-color: ${({ $backgroundColor }) =>
    $backgroundColor || 'transparent'};
  position: relative;
  z-index: ${({ $hideAppBar, $zIndex }) => ($hideAppBar ? 999 : $zIndex ?? 1)};

  @media (max-width: ${Breakpoints.mobile}px) {
    overflow-x: hidden;
  }
`;

const ContentWrapper = styled.div<{ $isOverLayout?: boolean }>`
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;

  @media (min-width: ${Breakpoints.desktop}px) {
    max-width: ${({ $isOverLayout }) =>
      $isOverLayout ? '100%' : `${Breakpoints.desktop}px`};
    min-width: ${({ $isOverLayout }) =>
      $isOverLayout ? '100%' : `${Breakpoints.desktop}px`};
  }
`;

const FloatingToggleButton = styled.div<{ $scrollX: number }>`
  --scroll-x: ${({ $scrollX }) => `-${$scrollX}px`};
  position: fixed;
  bottom: 100px;
  left: 0;
  width: 100%;
  min-width: ${Breakpoints.desktop}px;
  transform: translateX(var(--scroll-x));
  display: flex;
  justify-content: center;
  z-index: 1001;
  pointer-events: none;
  opacity: 0;
  animation: ${slideDown} 0.4s ease-out forwards;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 100%;
  }
`;


const FloatingToggleButtonInner = styled.div`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  min-width: ${Breakpoints.desktop}px;
  display: flex;
  justify-content: flex-end;
  padding: 0 20px;
  pointer-events: auto;

  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
    min-width: 0;
    padding: 0 34px;
  }
`;

const ArrowToggle = styled.div`
  background-color: #2a2135;
  border-radius: 50%;
  padding: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-color: #727171;
  border-width: 1px;
  border-style: solid;
`;

const BottomFloatingBox = styled.div<{
  $isCollapsed: boolean;
  $scrollX: number;
}>`
  --scroll-x: ${({ $scrollX }) => `-${$scrollX}px`};
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-width: ${Breakpoints.desktop}px;
  transform: translateX(var(--scroll-x));
  background: ${({ $isCollapsed }) =>
    $isCollapsed
      ? 'transparent'
      : 'linear-gradient(to top, #2a2135 100%, #625791 0%)'};
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 32px;
  overflow: hidden;
  height: 120px;
  opacity: 0;
  animation: ${slideUp} 0.4s ease-out forwards;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 0 16px;
    min-width: 0;
  }
`;


const BoxInnerWrapper = styled.div<{ $isCollapsed: boolean }>`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  min-width: ${Breakpoints.desktop}px;
  display: flex;
  justify-content: ${({ $isCollapsed }) =>
    $isCollapsed ? 'center' : 'space-between'};
  align-items: center;
  gap: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '32px')};
  padding: 20px;

  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
    min-width: 0;
    gap: ${({ $isCollapsed }) => ($isCollapsed ? '0' : '16px')};
  }
`;

const LeftColumn = styled.div<{ $isCollapsed: boolean }>`
  display: ${({ $isCollapsed }) => ($isCollapsed ? 'none' : 'flex')};
  flex-direction: column;
  gap: 20px;
`;

const LeftTitle = styled.div`
  font-size: 18px;
  font-weight: 700;
  color: #fff;
`;

const LeftDescription = styled.div`
  font-size: 16px;
  line-height: 1.4;
  white-space: pre-line;
  color: #fff;

  @media (max-width: ${Breakpoints.mobile}px) {
    white-space: normal;
    /* font-size: 12px; */
  }
`;

const RightRow = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 700;
  color: #fff;
  cursor: pointer;  

  img {
    width: 50px;
    height: 50px;
    object-fit: contain;
  }
`;

const LandingBaseWrapper: React.FC<LandingBaseWrapperProps> = ({
  sections,
  appBar,
}) => {
  const [scrollX, setScrollX] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false); // ✅ 모바일 감지용 state

  const { lang } = useLang();
  const t = dictionary[lang].landingBottomBox;

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX || window.pageXOffset);

      const visibleIndex = sectionRefs.current.findIndex((ref, i) => {
        if (!ref || !sections[i].showFloatingBox) return false;
        const rect = ref.getBoundingClientRect();
        return (
          rect.top < window.innerHeight &&
          rect.bottom + 500 > window.innerHeight
        );
      });

      setIsFloatingVisible(visibleIndex !== -1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  return (
    <>
      {appBar && (
        <FixedAppBarWrapper $scrollX={scrollX}>
          <AppBarContentWrapper>{appBar}</AppBarContentWrapper>
        </FixedAppBarWrapper>
      )}

      {sections.map(
        (
          {
            id,
            $backgroundColor,
            content,
            $zIndex,
            $isOverLayout,
            isWithAppBar,
          },
          idx
        ) => (
          <SectionWrapper
            key={idx}
            id={id}
            ref={(el) => {
              sectionRefs.current[idx] = el;
            }}
            $backgroundColor={$backgroundColor}
            $zIndex={$zIndex}
            $hideAppBar={isWithAppBar === false}
          >
            <ResponsiveView
              desktopView={
                <ContentWrapper $isOverLayout={$isOverLayout}>
                  {content}
                </ContentWrapper>
              }
              mobileView={
                <div style={{ width: '100%', boxSizing: 'border-box' }}>
                  {content}
                </div>
              }
            />
          </SectionWrapper>
        )
      )}

      {isFloatingVisible && (
        <>
          <FloatingToggleButton $scrollX={scrollX}>
            <FloatingToggleButtonInner>
              <ArrowToggle onClick={() => setIsCollapsed((prev) => !prev)}>
                {isCollapsed ? (
                  <ChevronUp color="white" width={'32'} height={'32'} />
                ) : (
                  <ChevronDown color="white" width={'32'} height={'32'} />
                )}
              </ArrowToggle>
            </FloatingToggleButtonInner>
          </FloatingToggleButton>

          <BottomFloatingBox $isCollapsed={isCollapsed} $scrollX={scrollX}>
            <BoxInnerWrapper $isCollapsed={isCollapsed}>
              <LeftColumn $isCollapsed={isCollapsed}>
                <LeftTitle>{t.title}</LeftTitle>
                <ResponsiveDescription text={t.description} isMobile={isMobile} />
              </LeftColumn>
              <RightRow
  onClick={() =>
    window.open('/ai', '_blank', 'noopener,noreferrer')
  }
  style={{ marginLeft: isCollapsed ? 'auto' : undefined }}
>
  {!isCollapsed && <SkeletonText>{t.aiButton}</SkeletonText>}
  <IconWrapper>
  <img src="/floating2.svg" alt="AI Icon" style={{ width: 40, height: 40 }} />
  </IconWrapper>
</RightRow>


            </BoxInnerWrapper>
          </BottomFloatingBox>
        </>
      )}
    </>
  );
};

export default LandingBaseWrapper;
