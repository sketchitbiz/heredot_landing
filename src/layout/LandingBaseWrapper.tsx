import React from 'react';
import styled from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';

interface LandingSection {
  id?: string; // ✅ 섹션 이동용 id 추가
  $backgroundColor?: string;
  content: React.ReactNode;
  $zIndex?: number;
  $isOverLayout?: boolean;
}

interface LandingBaseWrapperProps {
  sections: LandingSection[];
}

const SectionWrapper = styled.section<{
  $backgroundColor?: string;
  $zIndex?: number;
}>`
  width: 100%;
  background-color: ${({ $backgroundColor }) => $backgroundColor || 'transparent'};
  position: relative;
  z-index: ${({ $zIndex }) => $zIndex ?? 1};
`;

const ContentWrapper = styled.div<{ $isOverLayout?: boolean }>`
  width: ${({ $isOverLayout }) => ($isOverLayout ? '100%' : `${Breakpoints.desktop}px`)};
  margin: 0 auto;
  box-sizing: border-box;
`;

const LandingBaseWrapper: React.FC<LandingBaseWrapperProps> = ({ sections }) => {
  return (
    <>
      {sections.map(({ id, $backgroundColor, content, $zIndex, $isOverLayout }, idx) => (
        <SectionWrapper
          key={idx}
          id={id} // ✅ id 추가해서 scrollIntoView 가능
          $backgroundColor={$backgroundColor}
          $zIndex={$zIndex}
        >
          <ContentWrapper $isOverLayout={$isOverLayout}>
            {content}
          </ContentWrapper>
        </SectionWrapper>
      ))}
    </>
  );
};

export default LandingBaseWrapper;
