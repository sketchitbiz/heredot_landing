'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { FiDownload } from 'react-icons/fi';
import Gap from '@/components/Gap';
import CommonButton from '@/components/CommonButton'; // ✅ 추가
import { Breakpoints } from '@/constants/layoutConstants';
import { userStamp } from '@/lib/api/user/api';

const HeaderBlockWrapper = styled.div`
  position: relative;
  width: 100%;
  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크톱에서 최소 너비 설정 */
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: start;
  overflow: hidden;

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 100vw;
    min-width: unset; /* 모바일에서는 최소 너비 제거 */
  }
`;


const meteorDrip = keyframes`
  0% { transform: translateY(0px); opacity: 0; }
  100% { transform: translateY(80px); opacity: 0.9; }
`;

const Meteor = styled.div`
  position: absolute;
  top: 80%;
  left: calc(50%); 
  transform: translateX(-50%);
  width: 3px;
  height: 80px;
  background: linear-gradient(to bottom, #08080f 0%, #7407ff 100%);
  border-radius: 1.5px;
  z-index: 0;
  animation: ${meteorDrip} 1.5s ease-in-out infinite;

  @media (max-width: ${Breakpoints.mobile}px) {
    top: 70%; /* 모바일에서도 동일한 top 값 */
  }
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
  gap: 10px;
  left: 20px; 
  position: absolute; /* 위치를 조정하기 위해 추가 */
  top: 200px; /* 기본값: top에서 200px 떨어짐 */

  @media (max-width: ${Breakpoints.mobile}px) {
    top: 200px; /* 모바일에서도 동일한 top 값 */
  
  }
`;

const Title = styled.div`
  ${AppTextStyles.display2};
  color: ${AppColors.onBackground};
  margin-bottom: 20px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 28px; /* 모바일에서 폰트 크기 변경 */
    margin-bottom: 10px; /* 모바일에서 마진 변경 */
  }
`;

const RadarAnimation = keyframes`
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.35); opacity: 0.6; }
  100% { transform: scale(1); opacity: 1; }
`;

const Radar = styled.div`
  position: absolute;
  width: 552px;
  height: 552px;
  border-radius: 50%;
  left: calc(50% - 276px);
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

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 330px;  /* 552px / 3 */
    height: 330px;
    left: calc(50% - 165px);

    &::before {
      width: 100px;  /* 119px / 3 */
      height: 100px;
      filter: blur(15px);
    }
  }
`;


interface HeaderBlockProps {
  title: string;
  subtitle: string;
  downloadLabel: string;
  downloadLink: string;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ title, subtitle, downloadLabel, downloadLink }) => {
  return (
    <HeaderBlockWrapper>
      <Radar />
      <LeftContent>
        <Title>{title}</Title>
        <Title>{subtitle}</Title>
        <a
          href={downloadLink}
          download
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
          onClick={() =>
            userStamp({
              uuid: localStorage.getItem('logId') ?? 'anonymous',
              category: '버튼',
              content: 'Header',
              memo: '기업 소개서 다운로드',
            })
          }
        >
          <CommonButton
            text={downloadLabel}
            icon={<FiDownload />}
            $iconPosition="left"
          />
        </a>
      </LeftContent>
      <Meteor />
    </HeaderBlockWrapper>
  );
};

export default HeaderBlock;
