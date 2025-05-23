"use client";

import styled from "styled-components";
import Image from "next/image";
import { Image as ImageIcon } from "@mui/icons-material"; // No-image placeholder 아이콘
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import { Breakpoints } from '@/constants/layoutConstants';

interface LandingCardProps {
  imageUrl?: string; // 선택 사항으로 변경
  title: string;
  altText?: string;
  contentType?: "image" | "text"; // 콘텐츠 타입 추가
  content?: React.ReactNode; // 텍스트 콘텐츠 추가
  showTitle?: boolean; // 제목 표시 여부 추가
  width?: string | number; // 너비 추가
  height?: string | number; // 높이 추가
  onClick?: () => void; 
}

const CardContainer = styled.div<Pick<LandingCardProps, "width" | "height">>`
  display: flex;
  cursor: pointer; 
  flex-direction: column;
  background-color: ${AppColors.surface};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
  width: ${({ width }) => (width ? (typeof width === "number" ? `${width}px` : width) : "100%")};
  height: ${({ height }) => (height ? (typeof height === "number" ? `${height}px` : height) : "auto")};

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardWrapper = styled.div<Pick<LandingCardProps, "width" | "height">>`
  display: flex;
  flex-direction: column;
  width: ${({ width }) => (width ? (typeof width === "number" ? `${width}px` : width) : "100%")};
`;

const ContentWrapper = styled.div`
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 16; // 기본 비율 (이미지 아닐 때도 공간 차지)
  background-color: ${AppColors.backgroundDark}; // 기본 배경색
  display: flex; // Placeholder 정렬 위해 추가
  align-items: center; // Placeholder 정렬 위해 추가
  justify-content: center; // Placeholder 정렬 위해 추가
  overflow: hidden; // 텍스트 콘텐츠 넘침 방지
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

// No Image Placeholder 스타일
const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  color: ${AppColors.disabled}; // Placeholder 색상
  height: 100%; // ContentWrapper 채우도록

  .MuiSvgIcon-root {
    // 아이콘 스타일
    font-size: 3rem; // 아이콘 크기 조절
    margin-bottom: 0.5rem;
  }
`;

// 텍스트 콘텐츠 스타일
const TextContentWrapper = styled.div`
  padding: 1rem; // 텍스트 패딩
  color: ${AppColors.onSurface}; // 텍스트 색상
  height: 100%; // ContentWrapper 채우도록
  overflow-y: auto; // 내용 길면 스크롤
`;

const CardTitle = styled.p`
  ${AppTextStyles.body1}
  font-size: 20px;
  color: white;
  padding: 12px 0;
  text-align: center;
  margin: 0;
  margin-top: 0px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 16px;
  }
`;

export const LandingCard: React.FC<LandingCardProps> = ({
  imageUrl,
  title,
  altText = title,
  contentType = "image",
  content,
  showTitle = true,
  width,
  height,
  onClick,
}) => {
  return (
    <CardWrapper width={width} height={height}>
  <CardContainer width={width} height={height} onClick={onClick}>
    <ContentWrapper>
      {contentType === "image" ? (
        imageUrl ? (
          <CardImage
          src={imageUrl}
          alt={altText}
          className="w-full h-full object-cover"
        />
        ) : (
          <PlaceholderContainer>
            <ImageIcon />
            <p>이미지 없음</p>
          </PlaceholderContainer>
        )
      ) : (
        <TextContentWrapper>{content}</TextContentWrapper>
      )}
    </ContentWrapper>
  </CardContainer>
  {showTitle && <CardTitle>{title}</CardTitle>}
</CardWrapper>

  );
};
