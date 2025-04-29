'use client';

import React from "react";
import styled, { keyframes, css } from "styled-components";
import { useLang } from "@/contexts/LangContext"; // ✅ 언어 가져오기

// --- 애니메이션 정의 ---
const scrollX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

const common = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  white-space: nowrap;
  animation: ${scrollX} 20s linear infinite;
`;

const Marquee = styled.div`
  display: flex;
  width: 100%;
  height: 100px;
  overflow: hidden;
  user-select: none;
`;

const MarqueeGroup = styled.div`
  ${common}
`;

const MarqueeGroup2 = styled.div`
  ${common}
  animation-direction: reverse;
  animation-delay: -3s;
`;

const ImageGroup = styled.img`
  height: 40px;
  margin: 0 20px;
  object-fit: contain;
`;

// --- 롤링 컴포넌트 ---
const Rolling: React.FC = () => {
  const { lang } = useLang();
  const isKorean = lang === 'ko';

  // ✅ 총 이미지 개수 (수정 가능)
  const totalCount = 8;

  // ✅ 경로 자동 생성
  const getTopImageSrc = (index: number) =>
    isKorean
      ? `/assets/rolling/rolling_t${index}.svg`
      : `/assets/rolling/rolling_t${index}_e.svg`;

  const getBottomImageSrc = (index: number) =>
    isKorean
      ? `/assets/rolling/rolling_b${index}.svg`
      : `/assets/rolling/rolling_b${index}_e.svg`;

  return (
    <>
      {/* --- 위쪽 롤링 --- */}
      <Marquee>
        <MarqueeGroup>
          {Array.from({ length: totalCount }, (_, i) => (
            <ImageGroup key={`top-${i}`} src={getTopImageSrc(i + 1)} alt={`top-${i}`} />
          ))}
        </MarqueeGroup>
        <MarqueeGroup>
          {Array.from({ length: totalCount }, (_, i) => (
            <ImageGroup key={`top-dup-${i}`} src={getTopImageSrc(i + 1)} alt={`top-dup-${i}`} />
          ))}
        </MarqueeGroup>
      </Marquee>

      {/* --- 아래쪽 롤링 --- */}
      <Marquee>
        <MarqueeGroup2>
          {Array.from({ length: totalCount }, (_, i) => (
            <ImageGroup key={`bottom-${i}`} src={getBottomImageSrc(i + 1)} alt={`bottom-${i}`} />
          ))}
        </MarqueeGroup2>
        <MarqueeGroup2>
          {Array.from({ length: totalCount }, (_, i) => (
            <ImageGroup key={`bottom-dup-${i}`} src={getBottomImageSrc(i + 1)} alt={`bottom-dup-${i}`} />
          ))}
        </MarqueeGroup2>
      </Marquee>
    </>
  );
};

export default Rolling;
