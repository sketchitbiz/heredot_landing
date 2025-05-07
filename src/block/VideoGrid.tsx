'use client';

import styled from 'styled-components';
import { VideoCard } from '@/components/Landing/VideoCard';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { Breakpoints } from '@/constants/layoutConstants';

// --- props 정의 ---
interface VideoGridProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const videoData = [
  { id: 'v1', imageUrl: '/landing/review/1_snack.webp', videoUrl: 'https://youtu.be/_hQ-P3yVMXo' },
  { id: 'v2', imageUrl: '/landing/review/2_lime.webp', videoUrl: 'https://vimeo.com/513664697' },
  { id: 'v3', imageUrl: '/landing/review/3_k.webp', videoUrl: 'https://vimeo.com/512854897' },
  { id: 'v4', imageUrl: '/landing/review/4_cupa.webp', videoUrl: 'https://youtu.be/l1WIR1AF1c4' },
  { id: 'v5', imageUrl: '/landing/review/5_clean.webp', videoUrl: 'https://youtu.be/CGBWIDdiRl0' },
  { id: 'v6', imageUrl: '/landing/review/6_hwi.webp', videoUrl: 'https://youtu.be/l62PZ11lWeg' },
];

const Wrapper = styled.div`
  padding: 0 20px;     /* ✅ 좌우 여백 */
  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto; /* 모바일 이하에서 min-width 제거 */
  }
`;

const GridContainerForVideos = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr); /* 기본 3개 */
  gap: 24px;
  margin-bottom: 64px;

  @media (max-width: ${Breakpoints.mobile}px) {
    grid-template-columns: repeat(2, 1fr); /* ✅ 모바일은 2개씩 */
    margin-bottom: 0px;
  }
`;

export const VideoGrid: React.FC<VideoGridProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  return (
    <>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={onTopArrowClick}
        onBottomArrowClick={onBottomArrowClick}
      />

      <Wrapper>
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
      </Wrapper>
    </>
  );
};
