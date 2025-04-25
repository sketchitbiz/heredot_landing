"use client";

import styled from "styled-components";
import { SectionHeader } from "@/components/Landing/SectionHeader";
import { VideoCard } from "@/components/Landing/VideoCard";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

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

// 개별 비디오 카드 래퍼 (애니메이션 타겟)
const VideoCardWrapper = styled.div`
  opacity: 0; // 초기 상태 숨김
  transform: scale(0.8); // 초기 상태 축소
`;

export const VideoGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    const cardItems = gsap.utils.toArray<HTMLDivElement>(
      (gridElement?.children as HTMLCollectionOf<HTMLDivElement>) || []
    );

    if (!gridElement || cardItems.length === 0) return;

    gsap.to(cardItems, {
      opacity: 1,
      scale: 1, // 원래 크기로 확대
      stagger: 0.1,
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: gridElement,
        start: "top 85%", // 그리드 상단이 뷰포트 85% 지점에 닿으면 시작
        toggleActions: "play reverse play reverse", // 스크롤 아웃 시 애니메이션 반대로 실행
        // markers: true,
      },
    });
  }, []);

  return (
    <>
      <SectionHeader title="사업가들이 말하는 여기닷" description="대표님들은 '여기닷'을 이렇게 기억합니다." />
      <GridContainerForVideos ref={gridRef}>
        {videoData.map((video) => (
          <VideoCardWrapper key={video.id}>
            <VideoCard imageUrl={video.imageUrl} videoUrl={video.videoUrl} title={`Video ${video.id}`} />
          </VideoCardWrapper>
        ))}
      </GridContainerForVideos>
    </>
  );
};
