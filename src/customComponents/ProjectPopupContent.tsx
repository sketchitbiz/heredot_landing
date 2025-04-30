'use client';

import React from 'react';
import styled from 'styled-components';
import { useLang } from '@/contexts/LangContext';

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

  return (
    <Wrapper>
      <TopSection>
        {leftHeader && <LeftHeader>{leftHeader}</LeftHeader>}
        <PreviewImage src={imageUrl} alt="project" />
      </TopSection>

      <ContentSection>
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

        <RightColumn>
          {pjtConfirm && (
            <InfoBlock>
              <Label>{t.confirm}</Label>
              {pjtConfirm}
            </InfoBlock>
          )}
          {pjtVolume && (
            <InfoBlock>
              <Label>{t.volume}</Label>
              {pjtVolume}
            </InfoBlock>
          )}
          {pjtScope && (
            <InfoBlock>
              <Label>{t.scope}</Label>
              {pjtScope}
            </InfoBlock>
          )}
          {pjtStack && (
            <InfoBlock>
              <Label>{t.stack}</Label>
              {pjtStack}
            </InfoBlock>
          )}
          {pjtDuration && (
            <InfoBlock>
              <Label>{t.duration}</Label>
              {pjtDuration}
            </InfoBlock>
          )}
        </RightColumn>
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
`;

const LeftColumn = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding-left: 20px;
  border-right: 1px solid #ddd;
  padding-right: 20px;
`;

const RightColumn = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-right: 20px;
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
