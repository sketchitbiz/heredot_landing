"use client";

import React from "react";
import styled from "styled-components";
import { AppColors } from "@/styles/colors";
import { userStamp } from "@/lib/api/user/api";

interface VideoCardProps {
  imageUrl: string;
  videoUrl: string; // 전체 YouTube URL
  title?: string;   // alt 텍스트용
}

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  cursor: pointer;
  background-color: transparent;
  margin-top: 16px;

  &:nth-child(3n + 1) {
    align-self: flex-start;
  }

  &:nth-child(3n + 2) {
    align-self: center;
  }

  &:nth-child(3n) {
    align-self: flex-end;
  }
`;

const TitleContainer = styled.div`
  margin-bottom: 8px;
  height: 32px; /* 2줄 높이 고정 (12px * 1.3 line-height * 2줄 + 여유공간) */
  display: flex;
  align-items: flex-start; /* 상단 정렬 */
  
  @media (max-width: 768px) {
    height: 26px; /* 모바일에서는 10px 기준으로 조정 */
  }
`;

const TitleText = styled.h3`
  color: white;
  font-size: 14px;
  font-weight: 600;
  text-align: left;
  line-height: 1.3;
  margin: 0;
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* 최대 2줄로 제한 */
  -webkit-box-orient: vertical;
  
  @media (max-width: 768px) {
    font-size: 10px;
  }
`;

const ImageContainer = styled.a`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  display: block;
  background-color: ${AppColors.backgroundDark};

  &:hover .card-image {
    transform: scale(1.05);
  }
`;

const CardImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
  transition: transform 0.3s ease;
`;

export const VideoCard: React.FC<VideoCardProps> = ({ imageUrl, videoUrl, title = "Video" }) => {
  const handleClick = () => {
    void userStamp({
      category: "버튼",
      content: "Video",
      memo: `영상: ${title}`,
    });
  };

  return (
    <CardContainer>
      <TitleContainer>
        <TitleText>
          {title}
        </TitleText>
      </TitleContainer>
      <ImageContainer
        href={videoUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
      >
        <CardImage
          src={imageUrl}
          alt={title}
          className="card-image"
        />
      </ImageContainer>
    </CardContainer>
  );
};