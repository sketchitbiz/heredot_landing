'use client';

import styled from "styled-components";
import { VideoCard } from "@/components/Landing/VideoCard";
import { CustomNavigator } from "@/customComponents/CustomNavigator"; // ✅ 추가

// --- props 정의 ---
interface VideoGridProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
}

const videoData = [
  { id: "v1", imageUrl: "/landing/review/1_snack.webp", videoUrl: "https://youtu.be/_hQ-P3yVMXo " },
  { id: "v2", imageUrl: "/landing/review/2_lime.webp", videoUrl: "https://vimeo.com/513664697 " },
  { id: "v3", imageUrl: "/landing/review/3_k.webp", videoUrl: "https://vimeo.com/512854897" },
  { id: "v4", imageUrl: "/landing/review/4_cupa.webp", videoUrl: "https://youtu.be/l1WIR1AF1c4" },
  { id: "v5", imageUrl: "/landing/review/5_clean.webp", videoUrl: "https://youtu.be/CGBWIDdiRl0" },
  { id: "v6", imageUrl: "/landing/review/6_hwi.webp", videoUrl: "https://youtu.be/l62PZ11lWeg " },
];

const GridContainerForVideos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 64px;
  padding: 0px 40px 100px 40px; // 좌우 여백 맞추기 (0 40px)
`;

export const VideoGrid: React.FC<VideoGridProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
}) => {
  return (
    <>
      {/* 🔥 CustomNavigator 추가 */}
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
      />

      {/* 🔥 Grid */}
      <GridContainerForVideos>
        {videoData.map((video) => (
          <VideoCard
            key={video.id}
            imageUrl={video.imageUrl}
            videoUrl={video.videoUrl}
            title={`Video ${video.id}`}
          />
        ))}
      </GridContainerForVideos>
    </>
  );
};
