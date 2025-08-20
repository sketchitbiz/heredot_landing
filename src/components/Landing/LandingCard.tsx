"use client";

import styled from "styled-components";
import Image from "next/image";
import { Image as ImageIcon } from "@mui/icons-material";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import { Breakpoints } from '@/constants/layoutConstants';

interface LandingCardProps {
  imageUrl?: string;
  title: string;
  subtitle?: string; // ✅ subtitle prop 추가
  altText?: string;
  contentType?: "image" | "text";
  content?: React.ReactNode;
  showTitle?: boolean;
  width?: string | number;
  height?: string | number;
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
  aspect-ratio: 16 / 16;
  background-color: ${AppColors.backgroundDark};
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
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

const PlaceholderContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 1rem;
  color: ${AppColors.disabled};
  height: 100%;

  .MuiSvgIcon-root {
    font-size: 3rem;
    margin-bottom: 0.5rem;
  }
`;

const TextContentWrapper = styled.div`
  padding: 1rem;
  color: ${AppColors.onSurface};
  height: 100%;
  overflow-y: auto;
`;

// ✅ CardTitle과 Subtitle을 감싸는 wrapper 추가
const CardTextWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 0;
  background-color: ${AppColors.background};
`;

const CardTitle = styled.p`
  ${AppTextStyles.body1};
  font-size: 20px;
  color: white;
  margin: 0;
  text-align: center;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 16px;
  }
`;

const CardSubtitle = styled.p`
  ${AppTextStyles.body2}; // 서브 타이틀용 스타일
  font-size: 14px;
  color: ${AppColors.textSecondary};
  margin: 4px 0 0; // 제목과의 간격
  text-align: center;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 12px;
  }
`;

export const LandingCard: React.FC<LandingCardProps> = ({
  imageUrl,
  title,
  subtitle, // ✅ subtitle prop 받기
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
      {showTitle && (
        <CardTextWrapper>
          <CardTitle>{title}</CardTitle>
          {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
        </CardTextWrapper>
      )}
    </CardWrapper>
  );
};