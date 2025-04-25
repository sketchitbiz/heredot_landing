"use client";

import styled from "styled-components";
import { SectionHeader } from "@/components/Landing/SectionHeader";
import { VideoCard } from "@/components/Landing/VideoCard";

const videoData = [
  { id: "v1", imageUrl: "/landing/review/1_snack.webp", videoUrl: "YOUTUBE_VIDEO_ID_1" },
  { id: "v2", imageUrl: "/landing/review/2_lime.webp", videoUrl: "YOUTUBE_VIDEO_ID_2" },
  { id: "v3", imageUrl: "/landing/review/3_k.webp", videoUrl: "YOUTUBE_VIDEO_ID_3" },
  { id: "v4", imageUrl: "/landing/review/4_cupa.webp", videoUrl: "YOUTUBE_VIDEO_ID_4" },
  { id: "v5", imageUrl: "/landing/review/5_clean.webp", videoUrl: "YOUTUBE_VIDEO_ID_5" },
  { id: "v6", imageUrl: "/landing/review/6_hwi.webp", videoUrl: "YOUTUBE_VIDEO_ID_6" },
];

const GridContainerForVideos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); // 3열

  gap: 24px;
  padding: 0 40px 100px 0;

  margin-bottom: 64px; // 아래 섹션과의 간격

  /* @media (max-width: 768px) {
    // 화면 작으면 2열
    grid-template-columns: repeat(2, 1fr);
  }
  @media (max-width: 480px) {
    // 더 작으면 1열
    grid-template-columns: repeat(1, 1fr);
  } */
`;

export const VideoGrid = () => {
  return (
    <>
      <SectionHeader title="사업가들이 말하는 여기닷" description="대표님들은 '여기닷'을 이렇게 기억합니다." />
      <GridContainerForVideos>
        {videoData.map((video) => (
          <VideoCard key={video.id} imageUrl={video.imageUrl} videoUrl={video.videoUrl} title={`Video ${video.id}`} />
        ))}
      </GridContainerForVideos>
    </>
  );
};
