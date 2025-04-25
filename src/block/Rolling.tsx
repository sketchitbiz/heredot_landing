import React from "react";
import styled, { keyframes, css } from "styled-components";

// 이미지 배열
const row1 = [
  "/assets/rolling/rolling_b1.svg",
  "/assets/rolling/rolling_b2.svg",
  "/assets/rolling/rolling_b3.svg", // 주석 처리됨
  "/assets/rolling/rolling_b4.svg",
  "/assets/rolling/rolling_b5.svg",
  "/assets/rolling/rolling_b6.svg",
  "/assets/rolling/rolling_b7.svg",
  "/assets/rolling/rolling_b8.svg",
];

const row2 = [
  "/assets/rolling/rolling_t1.svg",
  "/assets/rolling/rolling_t2.svg",
  "/assets/rolling/rolling_t3.svg",
  "/assets/rolling/rolling_t4.svg",
  "/assets/rolling/rolling_t5.svg",
  "/assets/rolling/rolling_t6.svg",
  "/assets/rolling/rolling_t7.svg",
  "/assets/rolling/rolling_t8.svg",
];

// 애니메이션 정의
const scrollX = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-100%);
  }
`;

// 공통 스타일
const common = css`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-around;
  white-space: nowrap;
  animation: ${scrollX} 20s linear infinite;
`;


// 마퀴 스타일
const Marquee = styled.div`
  display: flex;
    width: 100%;
    /* width: 1200px; */
  height: 100px;
  overflow: hidden;
  user-select: none;


  /* @media (max-width: 769px) {
    width: 1200px;
  } */
`;

const MarqueeGroup = styled.div`
  ${common}
`;

const MarqueeGroup2 = styled.div`
  ${common}
  animation-direction: reverse;
  animation-delay: -3s;
`;

// 이미지 컴포넌트
const ImageGroup = styled.img`
  height: 40px;
  margin: 0 0px;
  object-fit: contain;
`;

// 롤링 이미지 컴포넌트
const Rolling: React.FC = () => {
  return (
    <>
      <Marquee>
        <MarqueeGroup>
          {row1.map((el, index) => (
            <ImageGroup key={`row1-${index}`} src={el} alt={`row1-${index}`} />
          ))}
        </MarqueeGroup>
        <MarqueeGroup>
          {row1.map((el, index) => (
            <ImageGroup key={`row1-duplicate-${index}`} src={el} alt={`row1-dup-${index}`} />
          ))}
        </MarqueeGroup>
      </Marquee>

      <Marquee>
        <MarqueeGroup2>
          {row2.map((el, index) => (
            <ImageGroup key={`row2-${index}`} src={el} alt={`row2-${index}`} />
          ))}
        </MarqueeGroup2>
        <MarqueeGroup2>
          {row2.map((el, index) => (
            <ImageGroup key={`row2-duplicate-${index}`} src={el} alt={`row2-dup-${index}`} />
          ))}
        </MarqueeGroup2>
      </Marquee>
    </>
  );
};

export default Rolling;
