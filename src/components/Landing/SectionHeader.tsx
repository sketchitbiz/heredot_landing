"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요
import { AppTextStyles } from "@/styles/textStyles"; // 경로 확인 필요
import { Breakpoints } from '@/constants/layoutConstants';
import { useState, useEffect } from 'react';

interface SectionHeaderProps {
  title: string;
  description: string;
}

const HeaderContainer = styled.div`
  text-align: start;
  /* margin-bottom: 90px; */
   // 아래 콘텐츠와의 간격
  /* padding-top: 100px; */
`;

const Title = styled.h2`
  ${AppTextStyles.display3} // 텍스트 스타일 적용
  color: ${AppColors.onBackground}; // 텍스트 색상 (흰색 계열 가정)

  margin-bottom: 16px;
  margin-top: 0; // 필요 시 추가 조정

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 18px; // 모바일에서 폰트 크기 조정
    line-height: 1.2; // 모바일에서 줄간격 줄이기
  }
`;

const Description = styled.p`
  ${AppTextStyles.title1} // 텍스트 스타일 적용

  color: ${AppColors.onBackground}; // 약간 연한 색상
  margin: 0;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px; // 모바일에서 폰트 크기 조정
    line-height: 1.4; // 모바일에서 줄 간격 조정
    }
`;

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768); // Breakpoints.mobile 값 사용
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formatTitle = (text: string) => {
    if (isMobile) {
      // 모바일에서만 \n을 <br>로 변환
      return text.split('\n').map((line, index) => (
        <span key={index}>
          {line}
          {index < text.split('\n').length - 1 && <br />}
        </span>
      ));
    } else {
      // 웹에서는 \n을 공백으로 변환
      return text.replace(/\n/g, ' ');
    }
  };

  return (
    <HeaderContainer>
      <Title>{formatTitle(title)}</Title>
      <Description>{description}</Description>
    </HeaderContainer>
  );
};
