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

const CardContainer = styled.a`
  position: relative;
  aspect-ratio: 16 / 9;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${AppColors.backgroundDark};
  display: block; /* a 태그를 block화 */

  &:hover img {
    transform: scale(1.05);
  }

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

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
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
    <CardContainer
      href={videoUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick} // ✅ 클릭시 스탬프 찍기
    >
<CardImage
  src={imageUrl}
  alt={title}
  className="w-full h-full object-cover"
/>
    </CardContainer>
  );
};