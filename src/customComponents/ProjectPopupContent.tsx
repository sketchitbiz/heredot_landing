'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useLang } from '@/contexts/LangContext';
import { Breakpoints } from '@/constants/layoutConstants';

interface ProjectPopupContentProps {
  imageUrl: string;
  leftHeader?: React.ReactNode;
  projectIntro: React.ReactNode | null;
  featureList: React.ReactNode | null;
  projectScreenshots?: React.ReactNode | null;
  pjtConfirm?: React.ReactNode | null;
  pjtVolume?: React.ReactNode | null;
  pjtScope?: React.ReactNode | null;
  pjtStack?: React.ReactNode | null;
  pjtDuration?: React.ReactNode | null;
}

const I18N_LABEL = {
  ko: {
    intro: '📂 프로젝트 소개',
    features: '📂 주요 기능',
    screenshots: '📂 프로젝트 이미지',
    confirm: '📂 PJT 확인',
    volume: '📂 PJT 분량',
    scope: '📂 PJT 스콥',
    stack: '📂 PJT 스택',
    duration: '📂 PJT 기간',
  },
  en: {
    intro: '📂 Project Introduction',
    features: '📂 Main Features',
    screenshots: '📂 Screenshots',
    confirm: '📂 PJT Info',
    volume: '📂 PJT Volume',
    scope: '📂 PJT Scope',
    stack: '📂 PJT Stack',
    duration: '📂 PJT Duration',
  },
};

export const ProjectPopupContent: React.FC<ProjectPopupContentProps> = ({
  imageUrl,
  leftHeader,
  projectIntro,
  featureList,
  projectScreenshots,
  pjtConfirm,
  pjtVolume,
  pjtScope,
  pjtStack,
  pjtDuration,
}) => {
  const { lang } = useLang();
  const t = I18N_LABEL[lang];

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const leftContent = (
    <LeftColumn>
      {projectIntro && (
        <Block>
          <SectionTitle>{t.intro}</SectionTitle>
          {projectIntro}
        </Block>
      )}
      {featureList && (
        <Block>
          <SectionTitle>{t.features}</SectionTitle>
          {featureList}
        </Block>
      )}
      {projectScreenshots && (
        <Block>
          <SectionTitle>{t.screenshots}</SectionTitle>
          {projectScreenshots}
        </Block>
      )}
    </LeftColumn>
  );

  const rightContent = (
    <RightColumn>
      {pjtConfirm && (
        <InfoBlock>
          <SectionTitle>{t.confirm}</SectionTitle>
          {pjtConfirm}
        </InfoBlock>
      )}
      {pjtVolume && (
        <InfoBlock>
          <SectionTitle>{t.volume}</SectionTitle>
          {pjtVolume}
        </InfoBlock>
      )}
      {pjtScope && (
        <InfoBlock>
          <SectionTitle>{t.scope}</SectionTitle>
          {pjtScope}
        </InfoBlock>
      )}
      {pjtStack && (
        <InfoBlock>
          <SectionTitle>{t.stack}</SectionTitle>
          {pjtStack}
        </InfoBlock>
      )}
      {pjtDuration && (
        <InfoBlock>
          <SectionTitle>{t.duration}</SectionTitle>
          {pjtDuration}
        </InfoBlock>
      )}
    </RightColumn>
  );

  return (
    <Wrapper>
      <TopSection>
        {leftHeader && <LeftHeader>{leftHeader}</LeftHeader>}
        <PreviewImage src={imageUrl} alt="project" />
      </TopSection>

      <ContentSection>
        {isMobile ? (
          <>
            {rightContent}
            {leftContent}
          </>
        ) : (
          <>
            {leftContent}
            {rightContent}
          </>
        )}
      </ContentSection>
    </Wrapper>
  );
};

// ==========================
// Styled Components
// ==========================

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 50px; /* ✅ 하단 여백 */
`;

const TopSection = styled.div`
  position: relative;
  height: 350px;
  width: 100%;
`;

const LeftHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  z-index: 1;
`;

const PreviewImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
`;

const ContentSection = styled.div`
  display: flex;
  gap: 32px;

 @media (max-width: ${Breakpoints.mobile}px) {
    flex-direction: column;
    padding: 0 20px;
    gap: 40px;
    margin-bottom: 100px; /* ✅ 하단 여백 */
  }
`;

const LeftColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 20px;
  padding-right: 20px;
  border-right: 1px solid #ddd;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 0;
    border-right: none;
  }
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 20px;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 0;
  }
`;

const Block = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  color: #555;
`;

const Label = styled.div`
  font-weight: bold;
  font-size: 14px;
  color: #555;
`;

const SectionTitle = styled.h3`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;
