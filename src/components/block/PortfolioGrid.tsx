"use client";

import styled from "styled-components";
import { LandingCard } from "@/components/Landing/LandingCard";
import { SectionHeader } from "../Landing/SectionHeader";

const cardData = [
  { id: 1, imageUrl: "/landing/portpolio/1_anti_drone.webp", title: "안티드론 솔루션" },
  { id: 2, imageUrl: "/landing/portpolio/2_ribling.webp", title: "명품 역경매" },
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
  padding: 0px 40px 100px 40px;
  /* 반응형 스타일 주석 처리됨 */
`;

export const PortfolioGrid = () => {
  return (
    <>
      {" "}
      <SectionHeader
        title="여기닷에서 만든 대표 프로젝트!"
        description="다양한 산업과 분야에서 성과를 이끌어낸 프로젝트 소개해요!"
      />
      <GridContainer>
        {cardData.map((item) => (
          <LandingCard key={item.id} imageUrl={item.imageUrl} title={item.title} />
        ))}
      </GridContainer>{" "}
    </>
  );
};
