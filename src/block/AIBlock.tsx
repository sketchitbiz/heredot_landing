'use client';

import styled from 'styled-components';
import Image from 'next/image';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { Breakpoints } from '@/constants/layoutConstants';
import { AppColors } from '@/styles/colors';
import CommonButton from '@/components/CommonButton';
import { userStamp } from '@/lib/api/user/api';

interface AIBlockProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHeader: string;
  buttonDescription: string;
  buttonLink: string; // ✅ 버튼 링크 추가
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const SectionWrapper = styled.div`
  padding: 0 20px;
  box-sizing: border-box;
  min-width: ${Breakpoints.desktop}px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto;
    display: flex;
    justify-content: center;
  }
`;

const Container = styled.div`
  max-width: ${Breakpoints.desktop}px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  padding: 40px 20px;
  box-sizing: border-box;
  border-radius: 16px;

  @media (max-width: ${Breakpoints.mobile}px) {
    flex-direction: column-reverse;
    align-items: flex-start;
  }
`;

const LeftImageBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  img {
    width: 350px;
    height: 750px;
    object-fit: contain;

    @media (max-width: ${Breakpoints.mobile}px) {
      width: 100%;
      max-width: 350px;
      height: auto;
    }
  }
`;

const RightTextBlock = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;

  @media (max-width: ${Breakpoints.mobile}px) {
    align-items: center;
    width: 100%;
  }
`;

const Heading = styled.h3`
  font-size: 30px;
  font-weight: 700;
  color: white;
  margin-bottom: 0px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 20px;
    line-height: 1.4;
  }
`;

const SubText = styled.p`
  font-size: 20px;
  font-weight: 500;
  color: #ccc;
  margin-bottom: 24px;
  line-height: 1.6;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
    line-height: 1.4;
  }
`;

const DescriptionText = styled.p`
  font-size: 18px;
  font-weight: 600;
  color: white;
  text-align: right;
  padding: 0 10px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
    text-align: center;
  }
`;

export const AIBlock: React.FC<AIBlockProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  buttonText = 'Go to AI Quote',
  buttonHeader,
  buttonDescription,
  buttonLink,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  const handleClick = () => {
    void userStamp({
      uuid: localStorage.getItem('logId') ?? 'anonymous',
      category: '버튼',
      content: 'AIBlock',
      memo: `AI 버튼 클릭: ${buttonText}`,
    });

    window.open(buttonLink, '_blank');
  };

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
          <LeftImageBlock>
            <Image
              src="/assets/phone_frame.svg"
              alt="AI 견적 이미지"
              width={540}
              height={1032}
            />
          </LeftImageBlock>

          <RightTextBlock>
            <CommonButton
              text={buttonText}
              width="260px"
              backgroundColor={AppColors.background}
              borderRadius="75px"
              onClick={handleClick}
            />
            <DescriptionText>{buttonHeader}</DescriptionText>
            <DescriptionText>{buttonDescription}</DescriptionText>
          </RightTextBlock>
        </Container>
      </SectionWrapper>
    </>
  );
};
