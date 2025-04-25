"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Image from "next/image";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요
import CloseIcon from "@mui/icons-material/Close"; // 모달 닫기 아이콘

interface VideoCardProps {
  imageUrl: string;
  videoUrl: string; // Youtube Video ID 또는 전체 URL
  title?: string; // alt 텍스트용
}

const CardContainer = styled.div`
  position: relative;
  aspect-ratio: 16 / 9; // 비디오 비율
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  background-color: ${AppColors.backgroundDark};

  &:hover img {
    transform: scale(1.05);
  }
`;

const CardImage = styled(Image)`
  display: block;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

// --- Modal Styles ---
const ModalBackdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000; // 다른 요소 위에 표시
`;

const ModalContent = styled.div`
  position: relative;
  background-color: black;
  padding: 20px;
  border-radius: 8px;
  max-width: 90vw; // 너비 제한
  max-height: 90vh; // 높이 제한
  aspect-ratio: 16 / 9; // 비디오 비율 유지
  width: 80%; // 기본 너비
`;

const CloseButton = styled.button`
  position: absolute;
  top: -10px;
  right: -10px;
  background: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  color: black;
  z-index: 1001; // 비디오 위에 표시

  .MuiSvgIcon-root {
    font-size: 1.2rem;
  }
`;

const VideoFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
`;

export const VideoCard: React.FC<VideoCardProps> = ({ imageUrl, videoUrl, title = "Video" }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // videoUrl이 전체 URL인지 ID인지 판별하여 src 구성 (간단 예시)
  const getEmbedUrl = (url: string) => {
    if (url.includes("youtube.com/watch?v=")) {
      const videoId = url.split("v=")[1].split("&")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`; // 자동 재생 추가
    } else if (url.includes("youtu.be/")) {
      const videoId = url.split("youtu.be/")[1].split("?")[0];
      return `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    }
    // 단순 ID로 가정 (예: 'dQw4w9WgXcQ')
    return `https://www.youtube.com/embed/${url}?autoplay=1`;
  };

  const embedUrl = getEmbedUrl(videoUrl);

  return (
    <>
      <CardContainer onClick={openModal}>
        <CardImage src={imageUrl} alt={title} fill sizes="(max-width: 768px) 50vw, 33vw" />
      </CardContainer>

      {isModalOpen && (
        <ModalBackdrop onClick={closeModal}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            {" "}
            {/* 내부 클릭 시 닫히지 않게 */}
            <CloseButton onClick={closeModal}>
              <CloseIcon />
            </CloseButton>
            {/* --- YouTube Iframe --- */}
            <VideoFrame
              src={embedUrl}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen></VideoFrame>
            {/* -------------------- */}
          </ModalContent>
        </ModalBackdrop>
      )}
    </>
  );
};
 