'use client';

import styled, { keyframes } from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';
import ResponsiveView from '@/layout/ResponsiveView';
import React, { useEffect, useRef, useState } from 'react';
import { useLang } from '@/contexts/LangContext';
import { userStamp } from '@/lib/api/user/api';
import ProjectInquiryCard from '@/customComponents/WebFloating';
import { useDevice } from '@/contexts/DeviceContext';


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

// Bottom Navigation Component
const BottomNavigation: React.FC<{
  isAutoScrollingRef?: React.MutableRefObject<boolean>;
  onAutoScrollStart?: () => void;
  onAutoScrollEnd?: () => void;
  onContactClick?: () => void;
}> = ({ isAutoScrollingRef, onAutoScrollStart, onAutoScrollEnd, onContactClick }) => {
  const [scrollX, setScrollX] = useState(0);
  const localIsAutoScrollingRef = useRef(false);
  const { lang } = useLang();
  
  // 전달받은 ref가 있으면 사용하고, 없으면 로컬 ref 사용
  const autoScrollRef = isAutoScrollingRef || localIsAutoScrollingRef;

  // 스탬프 로깅 함수
  const logButtonClick = async (content: string, memo: string) => {
    try {
      await userStamp({
        category: '바텀네비',
        content,
        memo,
      });
    } catch {
      // 실패 시 무시
    }
  };

  // 자동 스크롤 제어 함수들
  const startAutoScroll = () => {
    autoScrollRef.current = true;
    onAutoScrollStart?.();
  };

  const endAutoScroll = () => {
    autoScrollRef.current = false;
    onAutoScrollEnd?.();
  };

  // scrollToTargetId 함수 (page.tsx와 동일한 로직)
  const scrollToTargetId = (targetId: string, content: string, memo: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      // 자동 스크롤이 아닐 때만 스탬프 기록
      if (!autoScrollRef.current) {
        logButtonClick(content, memo);
      }
      
      startAutoScroll();
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });

      let scrollTimer: ReturnType<typeof setTimeout>;
      const handleScroll = () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
          endAutoScroll();
          window.removeEventListener('scroll', handleScroll);
        }, 300);
      };
      window.addEventListener('scroll', handleScroll);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX || window.pageXOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    {
      icon: '/landing/nav/home.svg',
      text: lang === 'ko' ? '홈' : 'Home',
      action: () => {
        logButtonClick('홈', '홈 버튼 클릭');
        window.location.href = '/';
      },
    },
    {
      icon: '/landing/nav/bubble.svg',
      text: lang === 'ko' ? 'AI 견적서' : 'AI Quote',
      action: () => {
        logButtonClick('AI 견적서', 'AI 견적서 버튼 클릭');
        window.open('/ai', '_blank', 'noopener,noreferrer');
      },
    },
    {
      icon: '/landing/nav/folder.svg',
      text: lang === 'ko' ? '포트폴리오' : 'Portfolio',
      action: () => {
        scrollToTargetId('portfolio', '포트폴리오', '포트폴리오 버튼 클릭');
      },
    },
    {
      icon: '/landing/nav/call.svg',
      text: lang === 'ko' ? '문의하기' : 'Contact',
      action: () => {
        logButtonClick('문의하기', '문의하기 버튼 클릭');
        onContactClick?.();
      },
    },
  ];

  return (
    <BottomNavWrapper $scrollX={scrollX}>
      <NavInnerWrapper>
        {navItems.map((item, index) => (
          <NavButton key={index} onClick={item.action}>
            <NavIcon>
              <img src={item.icon} alt={item.text} />
            </NavIcon>
            <NavText>{item.text}</NavText>
          </NavButton>
        ))}
      </NavInnerWrapper>
    </BottomNavWrapper>
  );
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
  isAutoScrollingRef?: React.MutableRefObject<boolean>;
  onAutoScrollStart?: () => void;
  onAutoScrollEnd?: () => void;
  onContactClick?: () => void;
  isContactModalOpen?: boolean;
}

const FixedAppBarWrapper = styled.div<{ $scrollX: number }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  min-width: 100%;
  transform: translateX(${({ $scrollX }) => -$scrollX}px);
  z-index: 1000;
  display: flex;
  justify-content: center;
  background-color: #08080f; /* AppColors.background와 동일한 색상 */
  
  @media (min-width: ${Breakpoints.desktop}px) {
    min-width: ${Breakpoints.desktop}px;
  }
`;

const AppBarContentWrapper = styled.div`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  box-sizing: border-box;
  
  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
    padding: 0 20px;
  }
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

// Bottom Navigation Styles
const BottomNavWrapper = styled.div<{ $scrollX: number }>`
  --scroll-x: ${({ $scrollX }) => `-${$scrollX}px`};
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  min-width: ${Breakpoints.desktop}px;
  transform: translateX(var(--scroll-x));
  background: rgba(42, 33, 53, 0.95);
  backdrop-filter: blur(10px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  opacity: 0;
  animation: ${slideUp} 0.4s ease-out forwards;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 8px 16px;
    min-width: 0;
  }
`;

const NavInnerWrapper = styled.div`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  min-width: ${Breakpoints.desktop}px;
  display: flex;
  justify-content: space-around;
  align-items: center;

  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
    min-width: 0;
  }
`;

const NavButton = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-width: 60px;

  &:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 6px 8px;
    min-width: 50px;
  }
`;

const NavIcon = styled.div`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
    filter: brightness(0) invert(1);
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 28px;
    height: 28px;
  }
`;

// Web Floating Styles
const WebFloatingWrapper = styled.div<{ $scrollX: number }>`
  --scroll-x: ${({ $scrollX }) => `-${$scrollX}px`};
  position: fixed;
  bottom: 20px;
  left: 20px;
  transform: translateX(var(--scroll-x));
  z-index: 9998;
  opacity: 0;
  animation: ${slideUp} 0.4s ease-out forwards;

  @media (max-width: ${Breakpoints.mobile}px) {
    display: none;
  }
`;

const RightFloatingWrapper = styled.div<{ $scrollX: number }>`
  --scroll-x: ${({ $scrollX }) => `-${$scrollX}px`};
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: red;
  transform: translateX(var(--scroll-x));
  z-index: 9998;
  opacity: 0;
  animation: ${slideUp} 0.4s ease-out forwards;
  height: 217px; /* WebFloating 카드와 같은 높이 */

  @media (max-width: ${Breakpoints.mobile}px) {
    display: none;
  }
`;

const NavText = styled.span`
  font-size: 12px;
  font-weight: 500;
  color: #fff;
  white-space: nowrap;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 10px;
  }
`;

const LandingBaseWrapper: React.FC<LandingBaseWrapperProps> = ({
  sections,
  appBar,
  isAutoScrollingRef,
  onAutoScrollStart,
  onAutoScrollEnd,
  onContactClick,
  isContactModalOpen = false,
}) => {
  const [scrollX, setScrollX] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const device = useDevice(); // DeviceContext 사용
  const isMobile = device === 'mobile';

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

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
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

      {/* 모바일에서는 isFloatingVisible 조건에 따라 바텀 네비게이션 표시 */}
      {isMobile && isFloatingVisible && !isContactModalOpen && (
        <BottomNavigation 
          isAutoScrollingRef={isAutoScrollingRef}
          onAutoScrollStart={onAutoScrollStart}
          onAutoScrollEnd={onAutoScrollEnd}
          onContactClick={onContactClick}
        />
      )}

      {/* 웹에서는 항상 WebFloating 카드를 하단 왼쪽에 표시 */}
      {!isMobile && (
        <>
          <WebFloatingWrapper $scrollX={scrollX}>
            <ProjectInquiryCard onContactClick={onContactClick} />
          </WebFloatingWrapper>
          
        </>
      )}

      {/* 기존 floating 컴포넌트 주석 처리
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
      */}
    </>
  );
};

export default LandingBaseWrapper;
