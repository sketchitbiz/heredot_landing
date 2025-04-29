'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { FiDownload } from 'react-icons/fi';
import Gap from '@/components/Gap';
import CommonButton from '@/components/CommonButton'; // ✅ 추가

const HeaderBlockWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-left: 80px;
  overflow: hidden;
`;

const meteorDrip = keyframes`
  0% { transform: translateY(0px); opacity: 0; }
  100% { transform: translateY(80px); opacity: 0.9; }
`;

const Meteor = styled.div`
  position: absolute;
  top: 80%;
  left: 53%;
  transform: translateX(-50%);
  width: 3px;
  height: 80px;
  background: linear-gradient(to bottom, #08080f 0%, #7407ff 100%);
  border-radius: 1.5px;
  z-index: 0;
  animation: ${meteorDrip} 1.5s ease-in-out infinite;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  z-index: 2;
  gap: 10px;
`;

const Title = styled.div`
  ${AppTextStyles.display2};
  color: ${AppColors.onBackground};
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
  left: 30%;
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
  downloadLink: string;
}

const HeaderBlock: React.FC<HeaderBlockProps> = ({ title, subtitle, downloadLabel, downloadLink }) => {
  return (
    <HeaderBlockWrapper>
      <Radar />
      <LeftContent>
        <Title>{title}</Title>
        <Gap height="20px" />
        <Title>{subtitle}</Title>
        <Gap height="50px" />
        <a
          href={downloadLink}
          download
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: 'none' }}
        >
          <CommonButton
            text={downloadLabel}
            icon={<FiDownload />}
            iconPosition="left"
          />
        </a>
      </LeftContent>
      <Meteor />
    </HeaderBlockWrapper>
  );
};

export default HeaderBlock;
