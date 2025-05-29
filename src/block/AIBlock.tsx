'use client';

import { useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { Breakpoints } from '@/constants/layoutConstants';
import { AppColors } from '@/styles/colors';
import CommonButton from '@/components/CommonButton';
import { userStamp } from '@/lib/api/user/api';
import Gap from '@/components/Gap';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


interface AIBlockProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  buttonText?: string;
  buttonHeader: string;
  buttonDescription: string;
  buttonLink: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const SectionWrapper = styled.div`
  padding: 0 20px;
  box-sizing: border-box;
  min-width: ${Breakpoints.desktop}px;
  /* background-color: ${AppColors.error}; */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 100%;
    display: flex;
    justify-content: center;
    padding: 0;
  }
`;

const Container = styled.div`
  max-width: ${Breakpoints.desktop}px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 40px;
  /* padding: 40px 20px; */
  box-sizing: border-box;
  border-radius: 16px;

  @media (max-width: ${Breakpoints.mobile}px) {
    flex-direction: column-reverse;
    align-items: center;
    padding: 0px;
    margin: 0px;
    gap: 0px;
  }
`;

const PhoneFrameWrapper = styled.div`
  position: relative;
  width: 350px;
  height: 750px;
  /* background-color: #fff; */

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 100%;
    max-width: 650px;
    height: 720px;
    overflow: hidden;
  }
`;

const StyledVideo = styled.video`
  position: absolute;
  top: 13%;
  left: 7%;
  width: 86%;
  height: 80%;
  z-index: 1;
  object-fit: cover;
  border-radius: 20px;

  @media (max-width: ${Breakpoints.mobile}px) {
    top: 10%;
    left: 8%;
    width: 85%;
    height: 87%;
  }
`;

const LeftImageBlock = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 100%; /* 모바일에서 블록 전체 넓이 확보 */
    max-width: 350px;
  }

  img {
    width: 350px;
    height: 750px;
    object-fit: contain;

    @media (max-width: ${Breakpoints.mobile}px) {
      width: 100%;
      max-width: 350px;
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
  font-size: 40px;
  font-weight: 600;
  color: white;
  text-align: right;
  margin: 0;
  /* padding: 0 10px; */

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 25px;
    text-align: center;
  }

  &:not(:last-child) {
    margin-top: 16px; /* ✅ 필요시 간격 조절 */
    margin-bottom: 16px; /* ✅ 필요시 간격 조절 */
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
  const [isMobile, setIsMobile] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
const [buttonTransform, setButtonTransform] = useState({ x: 0, y: 0 });

const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
  const offsetX = ((e.clientX - left) / width - 0.5) * 2; // -1 ~ 1
  const offsetY = ((e.clientY - top) / height - 0.5) * 2;
  setMousePos({ x: offsetX, y: offsetY });
};

useEffect(() => {
  const frame = requestAnimationFrame(() => {
    const damping = 20; // 이동 강도
    setButtonTransform({
      x: mousePos.x * damping,
      y: mousePos.y * damping,
    });
  });

  return () => cancelAnimationFrame(frame);
}, [mousePos]);


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleClick = () => {
    void userStamp({
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
            <PhoneFrameWrapper>
              <Image
                src="/assets/phone_frame.svg"
                alt="AI 견적 이미지"
                width={540}
                height={1032}
                style={{ position: 'absolute', top: 0, left: 0, zIndex: 2 }}
              />
              <StyledVideo
                src="/assets/aigo.mov"
                autoPlay
                muted
                loop
                playsInline
              />
            </PhoneFrameWrapper>
          </LeftImageBlock>

          <RightTextBlock>
       
            <DescriptionText>{buttonHeader}</DescriptionText>
            <DescriptionText>{buttonDescription}</DescriptionText>
            <div style={{ height: isMobile ? '40px' : '80px' }} /> {/* 간격 추가 */}
            <CommonButton
              text={buttonText}
              isSkeletonText={true}
              width={isMobile ? '240px' : '360px'}
              fontSize={isMobile ? '16px' : '30px'}
              backgroundColor={AppColors.surface}
              borderRadius="75px"
              height={isMobile ? '50px' : '70px'}
              onClick={handleClick}
               $iconPosition='right'
              icon={<ArrowForwardIosIcon style={{ fontSize: '16px', color: AppColors.primary }} />} 
            />
          </RightTextBlock>
        </Container>
      </SectionWrapper>
    </>
  );
};
