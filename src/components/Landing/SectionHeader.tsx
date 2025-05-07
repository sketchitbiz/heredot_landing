"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요
import { AppTextStyles } from "@/styles/textStyles"; // 경로 확인 필요

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
`;

const Description = styled.p`
  ${AppTextStyles.title1} // 텍스트 스타일 적용

  color: ${AppColors.onBackground}; // 약간 연한 색상
  margin: 0;
`;

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      <Description>{description}</Description>
    </HeaderContainer>
  );
};
