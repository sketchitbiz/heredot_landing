import React from 'react';
import styled from 'styled-components';

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
  return (
    <Wrapper>
      {/* 상단 이미지 영역 */}
      <TopSection>
      {leftHeader && <LeftHeader>{leftHeader}</LeftHeader>} {/* 조건부 렌더링 */}
        <PreviewImage src={imageUrl} alt="project" />
      </TopSection>

      {/* 메인 콘텐츠 */}
      <ContentSection>
      <LeftColumn>
  {projectIntro && (
    <Block>
      <SectionTitle>📂 프로젝트 소개</SectionTitle>
      {projectIntro}
    </Block>
  )}
  {featureList && (
    <Block>
      <SectionTitle>📂 주요 기능</SectionTitle>
      {featureList}
    </Block>
  )}
  {projectScreenshots && (
    <Block>
      <SectionTitle>📂 프로젝트 이미지</SectionTitle>
      {projectScreenshots}
    </Block>
  )}
</LeftColumn>
<RightColumn>
  {pjtConfirm && (
    <InfoBlock>
      <Label>📂 PJT 확인</Label>
      {pjtConfirm}
    </InfoBlock>
  )}
  {pjtVolume && (
    <InfoBlock>
      <Label>📂 PJT 분량</Label>
      {pjtVolume}
    </InfoBlock>
  )}
  {pjtScope && (
    <InfoBlock>
      <Label>📂 PJT 스콥</Label>
      {pjtScope}
    </InfoBlock>
  )}
  {pjtStack && (
    <InfoBlock>
      <Label>📂 PJT 스택</Label>
      {pjtStack}
    </InfoBlock>
  )}
  {pjtDuration && (
    <InfoBlock>
      <Label>📂 PJT 기간</Label>
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
  position: relative; /* 스택 구조를 위해 relative 설정 */
  height: 350px;
  width: 100%;
`;


const LeftHeader = styled.div`
  position: absolute; /* 스택 구조를 위해 absolute 설정 */
  top: 0;
  left: 0;
  width: 100%; /* 부모 너비를 다 차지 */
  height: 100%; /* 부모 높이를 다 차지 */
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  z-index: 1; /* PreviewImage 위에 표시되도록 z-index 설정 */
`;

const PreviewImage = styled.img`
  width: 100%; /* 부모 너비를 다 차지 */
  height: 100%; /* 부모 높이를 다 차지 */
  object-fit: cover;
  position: absolute; /* 스택 구조를 위해 absolute 설정 */
  top: 0;
  left: 0;
  z-index: 0; /* LeftHeader 아래에 표시되도록 z-index 설정 */
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
  border-right: 1px solid #ddd; /* 오른쪽에 보더 추가 */
  padding-right: 20px; /* 보더와 콘텐츠 간 간격 추가 */
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
  /* color: #333; */
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

