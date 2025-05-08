'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { Breakpoints } from '@/constants/layoutConstants';

interface CommunityBlockProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  sectionTitle: string;
  sectionDescription: string;
  imageUrl: string;
  buttonText?: string;
  onButtonClick?: () => void;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

// ✅ 줄바꿈 지원
const withLineBreaks = (text: string) =>
  text.split('\n').map((line, index) => (
    <span key={index}>
      {line}
      <br />
    </span>
  ));

// ✅ 배경 포함 섹션 전체 영역
const SectionWrapper = styled.div`

  padding: 0 20px;
  box-sizing: border-box;

  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

@media (max-width: ${Breakpoints.mobile}px) {
  min-width: auto; /* 모바일 이하에서 min-width 제거 */
}
`;

// ✅ 내부 컨텐츠 최대 너비 컨테이너
const Container = styled.div`
  max-width: ${Breakpoints.desktop}px;
  /* margin: 0 auto 64px; */
  display: flex;
  justify-content: space-between;
  background: #1c1c2b;
  align-items: center;
  gap: 40px;
  padding: 40px 20px;
  box-sizing: border-box;
  border-radius: 16px;

  @media (max-width: ${Breakpoints.mobile}px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const LeftTextBlock = styled.div`
  flex: 1;
`;

const Heading = styled.h3`
  font-size: 30px;
  font-weight: 700;
  color: white;
  margin-bottom: 0px;
  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 20px; // 모바일에서 폰트 크기 조정
    line-height: 1.4; // 모바일에서 줄 간격 조정
    }

`;

const SubText = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #ccc;
  margin-bottom: 24px;
  line-height: 1.6;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px; // 모바일에서 폰트 크기 조정
    line-height: 1.4; // 모바일에서 줄 간격 조정
    }
`;

const StyledButton = styled.button`
  font-size: 16px;
  background-color: #1c1c2b;
  color: #fff;
  border: none;
  cursor: pointer;
  padding: 0;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 12px; // 모바일에서 폰트 크기 조정
    line-height: 1.4; // 모바일에서 줄 간격 조정
    }
`;

const RightImage = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 610px;
    height: 460px;
    object-fit: cover;

    @media (max-width: ${Breakpoints.mobile}px) {
      width: 100%;
      height: auto;
    }
  }
`;

export const CommunityBlock: React.FC<CommunityBlockProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  sectionTitle,
  sectionDescription,
  imageUrl,
  buttonText = '커뮤니티 바로가기',
  onButtonClick,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  return (
    <>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={onTopArrowClick}
        onBottomArrowClick={onBottomArrowClick}
      />

      <SectionWrapper>
        <Container>
          <LeftTextBlock>
            <Heading>{withLineBreaks(sectionTitle)}</Heading>
            <SubText>{withLineBreaks(sectionDescription)}</SubText>
            <StyledButton onClick={onButtonClick}>
              {buttonText} &gt;
            </StyledButton>
          </LeftTextBlock>

          <RightImage>
            <Image
              src={imageUrl}
              alt="커뮤니티 이미지"
              width={610}
              height={460}
            />
          </RightImage>
        </Container>
      </SectionWrapper>
    </>
  );
};
