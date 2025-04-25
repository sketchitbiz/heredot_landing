"use client";

import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Gap from "@/components/Gap";
import DownloadIcon from "@mui/icons-material/Download";

gsap.registerPlugin(ScrollTrigger);

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 1080px;
  width: 100%;
  box-sizing: border-box;
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  width: 100%;
`;

const LeftTextContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px; /* 아래 섹션과 간격 */
`;

const DescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px; /* 각 텍스트 설명 간의 간격 */
  margin-bottom: 200px; /* 아래 섹션과 간격 */
`;

const DownloadContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end; /* 오른쪽 정렬 */
  margin-top: 16px; /* 위 섹션과 간격 */
`;

const TextTitle = styled.h2`
  font-size: 28px;
  font-weight: 700;
  line-height: 1.4;
  margin-bottom: 24px;
`;

const TextDescription = styled.p`
  font-size: 16px;
  color: #444;
  line-height: 1.8;
  white-space: pre-line;
  margin: 4px 0;
`;

const RightContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
`;

const StackWrapper = styled.div`
  position: relative;
  width: 780px;
  height: 780px;
`;

const Box = styled.div`
  position: absolute;
  border: 2px solid #000;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 16px;
  box-sizing: border-box;
  overflow: hidden;
`;

const DownloadLink = styled.a`
  font-size: 14px;
  color: #000000;
  margin-top: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
  text-decoration: none;

  animation: bounceY 1.5s ease-in-out infinite;

  @keyframes bounceY {
    0%,
    100% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 130px 220px 260px 130px;
  width: 100%;
`;

const Cell = styled.div<{ $visible: boolean }>`
  font-size: 14px;
  color: #000;
  text-align: center;
  white-space: normal;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease;
  line-height: 1.4;
`;

const GridHeader = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 780px;
  display: grid;
  grid-template-columns: 130px 220px 260px 130px;
  padding: 0 16px;
  z-index: 10;
`;

const GridHeaderCell = styled.div<{ $visible: boolean }>`
  font-size: 13px;
  font-weight: 600;
  text-align: center;
  color: #666;
  line-height: 1.4;
  padding: 16px 0;
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: opacity 0.4s ease;
`;

const Consulting = () => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const horizontalRefs = useRef<HTMLDivElement[]>([]);
  const verticalRefs = useRef<HTMLDivElement[]>([]);

  const [visibleMap, setVisibleMap] = useState<number[][]>(Array(3).fill([0, 0, 0, 0]));
  const [headerVisible, setHeaderVisible] = useState([0, 0, 0, 0]);

  const size = 150;
  const verticalWidth = 220;
  const gap = 20;
  const start = 45;
  const verticalStart = 150;

  const centerTop = 780 / 2 - size / 2;
  const centerLeft = 780 / 2;

  const horizontalTexts = [
    [
      "로그인",
      "보안강화목적<br /> USB로 로그인",
      "구글 OTP<br /> 2Factor 인증",
      "기존 윈도우 Only<br /> 접속 기기 다변화 수용",
    ],
    [
      "핵심/편의기능<br /> 구분",
      "한정된 예산 내<br /> 전체 기능 요구",
      "핵심/편의 기능 분리<br /> 단계별 개발 가이드",
      "예산에 맞춘<br /> 사업성장 최적화 지원",
    ],
    ["개인정보수집", "모든 정보 수집", "개인정보법, 정보통신법 안내<br /> 법적기준 개발 가이드", "준법 RISK 최소화"],
  ];

  const handleDownloadClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault(); // 기본 링크 이동 방지
    console.log("Download clicked!");
    // 여기에 파일 다운로드 로직 or 조건 판단 로직 추가
  };

  useEffect(() => {
    if (!wrapperRef.current) return;

    const initialMap = Array(3).fill([0, 0, 0, 0]);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrapperRef.current,
        start: "top top",
        end: "+=2000",
        pin: true,
        scrub: false,
        onEnter: () => {
          tl.restart();
          setVisibleMap(initialMap);
          setHeaderVisible([0, 0, 0, 0]);
        },
        onEnterBack: () => {
          tl.restart();
          setVisibleMap(initialMap);
          setHeaderVisible([0, 0, 0, 0]);
        },
        markers: false,
      },
    });

    horizontalRefs.current.forEach((el, i) => {
      const top = start + i * (size + gap);
      tl.to(
        el,
        {
          top,
          left: 0,
          duration: 0.3,
          ease: "power2.out",
        },
        i * 0.1
      );
    });

    verticalRefs.current.forEach((el, i) => {
      const left = verticalStart + i * (verticalWidth + gap);
      tl.to(
        el,
        {
          top: 0,
          left,
          duration: 0.3,
          ease: "power2.out",
        },
        i * 0.1
      );
    });

    horizontalRefs.current.forEach((el, i) => {
      const expandStart = 0.6 + i * 0.2;

      tl.to(
        el,
        {
          width: 780,
          height: size,
          borderRadius: 24,
          duration: 0.6,
          ease: "power3.out",
        },
        expandStart
      );

      tl.call(
        () => {
          setVisibleMap((prev) => {
            const next = [...prev];
            next[i] = [...next[i]];
            next[i][0] = 1;
            return next;
          });
          setHeaderVisible((prev) => {
            const next = [...prev];
            next[0] = 1; // 항목
            return next;
          });
        },
        [],
        expandStart + 0.05
      );
    });

    verticalRefs.current.forEach((el, i) => {
      const vExpandStart = 1.5 + i * 0.4;

      tl.to(
        el,
        {
          width: verticalWidth,
          height: 580,
          borderRadius: 24,
          duration: 0.6,
          ease: "power3.out",
        },
        vExpandStart
      );

      tl.call(
        () => {
          setVisibleMap((prev) =>
            prev.map((row) => {
              const updated = [...row];
              updated[i + 1] = 1;
              return updated;
            })
          );
          setHeaderVisible((prev) => {
            const next = [...prev];
            next[i + 1] = 1;
            return next;
          });
        },
        [],
        vExpandStart + 0.05
      );
    });

    tl.call(
      () => {
        setVisibleMap((prev) =>
          prev.map((row) => {
            const updated = [...row];
            updated[3] = 1;
            return updated;
          })
        );
        setHeaderVisible((prev) => {
          const next = [...prev];
          next[3] = 1;
          return next;
        });
      },
      [],
      "+=0.2"
    );

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  const horizontalBoxes = horizontalTexts.map((row, i) => (
    <Box
      key={`h-${i}`}
      ref={(el) => {
        if (el) horizontalRefs.current[i] = el;
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 100,
        zIndex: 2,
        top: centerTop,
        border: "1px solid #E6E6E6",
        backgroundColor: "rgba(248, 248, 248, 0.7)",
        left: centerLeft,
      }}>
      <Grid>
        {row.map((text, idx) => (
          <Cell key={idx} $visible={!!visibleMap[i]?.[idx]} dangerouslySetInnerHTML={{ __html: text }} />
        ))}
      </Grid>
    </Box>
  ));

  const verticalBoxes = [0, 1].map((i) => (
    <Box
      key={`v-${i}`}
      ref={(el) => {
        if (el) verticalRefs.current[i] = el;
      }}
      style={{
        width: size,
        height: size,
        borderRadius: 100,
        zIndex: 2,
        top: centerTop,
        left: centerLeft,
        border: "1px solid #E6E6E6",
        backgroundColor: "rgba(238, 203, 255, 0.7)",
      }}
    />
  ));

  return (
    <Wrapper ref={wrapperRef}>
      <Content>
        <LeftTextContainer>
          <TitleContainer>
            <TextTitle>
              여기닷은 "기능·설계·비용"
              <br />
              최적화 목적으로 활용합니다
            </TextTitle>
          </TitleContainer>

          <DescriptionContainer>
            <TextDescription>1. 견적 단계에서 분량 및 기능정리</TextDescription>
            <TextDescription>2. IT서비스 최적 설계 지원</TextDescription>
            <TextDescription>3. 일정관리 (WBS)로 활용해요</TextDescription>
          </DescriptionContainer>

          <DownloadContainer>
            <DownloadLink href="#" onClick={handleDownloadClick}>
              기능명세 다운로드
              <DownloadIcon style={{ fontSize: "16px" }} />
            </DownloadLink>
          </DownloadContainer>
        </LeftTextContainer>

        <RightContainer>
          <StackWrapper ref={stackRef}>
            <GridHeader>
              <GridHeaderCell $visible={!!headerVisible[0]}>항목</GridHeaderCell>
              <GridHeaderCell $visible={!!headerVisible[1]}>고객요구사항</GridHeaderCell>
              <GridHeaderCell $visible={!!headerVisible[2]}>여기닷 제안</GridHeaderCell>
              <GridHeaderCell $visible={!!headerVisible[3]}>효과</GridHeaderCell>
            </GridHeader>
            {verticalBoxes}
            {horizontalBoxes}
          </StackWrapper>
        </RightContainer>
      </Content>
    </Wrapper>
  );
};

export default Consulting;
