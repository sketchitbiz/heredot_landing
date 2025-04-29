"use client";

import React from "react";
import styled from "styled-components";
import Image from "next/image";
import { AppColors } from "@/styles/colors";

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

const CardImage = styled(Image)`
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

export const VideoCard: React.FC<VideoCardProps> = ({ imageUrl, videoUrl, title = "Video" }) => {
  return (
    <CardContainer
      href={videoUrl}
      target="_blank" // ✅ 새 탭에서 열기
      rel="noopener noreferrer"
    >
      <CardImage
        src={imageUrl}
        alt={title}
        fill
        sizes="(max-width: 768px) 50vw, 33vw"
      />
    </CardContainer>
  );
};
