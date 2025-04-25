import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { FiDownload } from 'react-icons/fi'; // 다운로드 아이콘
import Gap from '@/components/Gap';

const HeaderBlockWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 1000px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
`;
const meteorDrip = keyframes`
  0% {
    transform: translateY(0px);
    opacity: 0;
  }

  100% {
    transform: translateY(80px);
    opacity: 0.9;
  }
`;

const Meteor = styled.div`
  position: absolute;
  top: 640px;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 80px;
  background: linear-gradient(to bottom, #08080f 0%, #7407ff 100%);
  border-radius: 1.5px;
  z-index: 0;

  /* animation에서 Y축만 조정 */
  animation: ${meteorDrip} 1.5s ease-in-out infinite;
`;

const LeftContent = styled.div`
  position: absolute;
  top: 164px;
  left: 0%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 2; /* 텍스트가 레이더보다 위에 위치 */
`;

const Title = styled.div`
  font-size: ${AppTextStyles.display2.fontSize};
  font-weight: ${AppTextStyles.display2.fontWeight};
  line-height: ${AppTextStyles.display2.lineHeight};
  color: ${AppColors.onBackground};
`;

const Subtitle = styled.div`
  font-size: ${AppTextStyles.display3.fontSize};
  font-weight: ${AppTextStyles.display3.fontWeight};
  line-height: ${AppTextStyles.display3.lineHeight};
  color: ${AppColors.onBackground};
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between; /* 좌우로 스트레치 */
  padding: 10px 25px; /* 양쪽에 패딩 추가 */
  font-size: ${AppTextStyles.label3.fontSize};
  font-weight: ${AppTextStyles.label3.fontWeight};
  line-height: ${AppTextStyles.label3.lineHeight};
  color: ${AppColors.onBackground}; /* 텍스트 색상 */
  background: ${AppColors.background};
  border: 2px solid ${AppColors.borderLight};
  border-radius: 75px;
  width: 207px;
  letter-spacing: 0.08em; 
  height: 50px; /* 버튼 높이 명시적으로 설정 */
  cursor: pointer;

  &:hover {
    border: 2px solid ${AppColors.primary}; /* hover 시 테두리 색상 변경 */
    /* background: ${AppColors.hoverText}; */
  }

  svg {
    font-size: 25px; /* 아이콘 크기 설정 */
    color: ${AppColors.onBackground}; /* 아이콘 색상 */
  }
`;
const RadarAnimation = keyframes`
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.35); // 552 * 1.35 ≒ 746
    opacity: 0.6;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
`;

const Radar = styled.div`
  position: absolute;
  width: 552px;
  height: 552px;
  border-radius: 50%;
  background: radial-gradient(circle, #000000 10%, #7951ad80 100%);
  animation: ${RadarAnimation} 3s infinite;
  z-index: 1;
  filter: blur(1px);

  &::before {
    content: '';
    position: absolute;
    width: 119px;
    height: 119px;
    border-radius: 100%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #7407ff;
    filter: blur(35px);
    z-index: 2;
  }
`;

interface HeaderBlockProps {
  title: string;
  subtitle: string;
  downloadLabel: string;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ title, subtitle, downloadLabel }) => {
  return (
    <HeaderBlockWrapper>
      <Radar />
      <LeftContent>
        <Title>{title}</Title>
        <Subtitle>{subtitle}</Subtitle>
        <Gap height="50px" />
        <DownloadButton>
          <FiDownload />
          {downloadLabel}
        </DownloadButton>
      </LeftContent>
      <Meteor />
    </HeaderBlockWrapper>
  );
};

export default HeaderBlock;
