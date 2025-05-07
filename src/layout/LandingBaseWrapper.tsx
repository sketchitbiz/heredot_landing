'use client';

import styled from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';
import ResponsiveView from '@/layout/ResponsiveView';
import React, { useEffect, useRef, useState } from 'react';

interface LandingSection {
  id?: string;
  $backgroundColor?: string;
  content: React.ReactNode;
  $zIndex?: number;
  $isOverLayout?: boolean;
  isWithAppBar?: boolean;
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
  box-sizing: border-box;
  padding: 0 16px;
`;

const SectionWrapper = styled.section<{
  $backgroundColor?: string;
  $zIndex?: number;
  $hideAppBar?: boolean;
}>`
  width: 100%;
  background-color: ${({ $backgroundColor }) => $backgroundColor || 'transparent'};
  position: relative;
  z-index: ${({ $hideAppBar, $zIndex }) =>
    $hideAppBar ? 999 : $zIndex ?? 1};

  @media (max-width: ${Breakpoints.mobile}px) {
    overflow-x: hidden; /* ✅ 모바일~태블릿에서만 좌우 스크롤 방지 */
  }
`;


const ContentWrapper = styled.div<{ $isOverLayout?: boolean }>`
  width: 100%;
  margin: 0 auto;
  box-sizing: border-box;
  padding-left: 16px;
  padding-right: 16px;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding-left: 12px;
    padding-right: 12px;
  }

  @media (min-width: ${Breakpoints.desktop}px) {
    max-width: ${({ $isOverLayout }) =>
      $isOverLayout ? '100%' : `${Breakpoints.desktop}px`};
    min-width: ${({ $isOverLayout }) =>
      $isOverLayout ? '100%' : `${Breakpoints.desktop}px`}; /* ✅ 복원 */
  }

`;

const LandingBaseWrapper: React.FC<LandingBaseWrapperProps> = ({ sections, appBar }) => {
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX || window.pageXOffset);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      {appBar && (
        <FixedAppBarWrapper $scrollX={scrollX}>
          <AppBarContentWrapper>{appBar}</AppBarContentWrapper>
        </FixedAppBarWrapper>
      )}
      {sections.map(
        ({ id, $backgroundColor, content, $zIndex, $isOverLayout, isWithAppBar }, idx) => (
          <SectionWrapper
            key={idx}
            id={id}
            $backgroundColor={$backgroundColor}
            $zIndex={$zIndex}
            $hideAppBar={isWithAppBar === false}
          >
            <ResponsiveView
              desktopView={
                <ContentWrapper $isOverLayout={$isOverLayout}>{content}</ContentWrapper>
              }
              mobileView={
                <div style={{ width: '100%', boxSizing: 'border-box', padding: '0 0px' }}>
                  {content}
                </div>
              }
            />
          </SectionWrapper>
        )
      )}
    </>
  );
};

export default LandingBaseWrapper;