"use client";

import styled from "styled-components";
import { LandingCard } from "@/components/Landing/LandingCard";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const cardData = [
  { id: 1, imageUrl: "/landing/portpolio/1_anti_drone.webp", title: "안티드론 솔루션" },
  { id: 2, imageUrl: "/landing/portpolio/2_ribling.webp", title: "명품역경매" },
  { id: 3, imageUrl: "/landing/portpolio/3_ring9.webp", title: "링구 - 링크간편구독" },
  { id: 4, imageUrl: "/landing/portpolio/4_table.webp", title: "테이블오더" },
  { id: 5, imageUrl: "/landing/portpolio/5_exito.webp", title: "엑시토" },
  { id: 6, imageUrl: "/landing/portpolio/6_will.webp", title: "윌체어" },
  { id: 7, imageUrl: "/landing/portpolio/7_FMG.webp", title: "FMG - 골프홀인원" },
  { id: 8, imageUrl: "/landing/portpolio/8_dongne.webp", title: "동네친구들 - 야식레이드" },
  { id: 9, imageUrl: "/landing/portpolio/9_ungdda.webp", title: "엉따 - IoT" },
  { id: 10, imageUrl: "/landing/portpolio/10_roketup.webp", title: "로켓업 - 지원사업 컨설팅" },
  { id: 11, imageUrl: "/landing/portpolio/11_lime.webp", title: "식자재발주시스템" },
  { id: 12, imageUrl: "/landing/portpolio/12_link.webp", title: "2차전지관제솔루션" },
];

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 64px;
  padding: 200px 40px 100px 40px;
  /* 반응형 스타일 주석 처리됨 */
`;

// 개별 카드 아이템 래퍼 (애니메이션 타겟)
const CardItemWrapper = styled.div`
  opacity: 0; // 초기 상태 숨김
  transform: translateY(30px); // 초기 상태 아래에서 시작
`;

export const PortfolioGrid = () => {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const gridElement = gridRef.current;
    // 카드 아이템들을 선택 (CardItemWrapper에 클래스 추가 필요 없음)
    const cardItems = gsap.utils.toArray<HTMLDivElement>(
      (gridElement?.children as HTMLCollectionOf<HTMLDivElement>) || []
    );

    if (!gridElement || cardItems.length === 0) return;

    gsap.to(cardItems, {
      opacity: 1,
      y: 0, // translateY(0)
      stagger: 0.1, // 순차 애니메이션 간격
      duration: 0.5,
      ease: "power2.out",
      scrollTrigger: {
        trigger: gridElement,
        start: "top 85%", // 그리드 상단이 뷰포트 85% 지점에 닿으면 시작
        // end: "bottom 20%", // 필요시 종료 지점 설정
        toggleActions: "play reverse play reverse", // 스크롤 아웃 시 애니메이션 반대로 실행
        // once: true, // 애니메이션 한 번만 실행 (선택적)
        // markers: true, // 개발용 마커
      },
    });

    // ScrollTrigger 인스턴스 자동 관리되지만, 명시적 제거 원할 시
    // return () => {
    //   ScrollTrigger.getAll().forEach(trigger => {
    //     if (trigger.trigger === gridElement) {
    //       trigger.kill();
    //     }
    //   });
    // };
  }, []);

  return (
    // gridRef 추가
    <GridContainer ref={gridRef}>
      {cardData.map((item) => (
        // 각 카드를 CardItemWrapper로 감싸기
        <CardItemWrapper key={item.id}>
          <LandingCard imageUrl={item.imageUrl} title={item.title} />
        </CardItemWrapper>
      ))}
    </GridContainer>
  );
};
