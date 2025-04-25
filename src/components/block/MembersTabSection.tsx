"use client";

import styled from "styled-components";
import { useState } from "react";
import { TabComponent } from "@/components/Landing/TabComponent";
import { SectionHeader } from "@/components/Landing/SectionHeader";
import { MemberCard } from "@/components/Landing/MemberCard";

// --- 타입 정의 ---
type MessageMap = {
  [key: string]: string | null;
};

interface MemberData {
  id: number;
  imageUrl: string;
  name: string;
  messages: MessageMap;
}

// --- 데이터 ---
const tabItems = ["채팅 앱", "스트리밍 웹", "구독 플랫폼", "점심시간"];
const cardDataForTabs: MemberData[] = [
  {
    id: 1,
    imageUrl: "/landing/members/1_liam.webp",
    name: "개발자 Liam",
    messages: {
      "채팅 앱": "푸시는 앱 상태마다 다르게요",
      "스트리밍 웹": null,
      "구독 플랫폼": "등록이죠?\n 인증은 안 하나요?",
      점심시간: "배고파서 코드 안 짜짐",
    },
  },
  {
    id: 2,
    imageUrl: "/landing/members/2_martin.webp",
    name: "CEO Martin",
    messages: {
      "채팅 앱": "채팅앱 계약됐어요!",
      "스트리밍 웹": "유튜브처럼 만들어 주세요!",
      "구독 플랫폼": "구독 결제 서비스 계약됐어요!",
      점심시간: "밥 먹고 합시다.",
    },
  },
  {
    id: 3,
    imageUrl: "/landing/members/3_martin.webp",
    name: "이사 Martin",
    messages: {
      "채팅 앱": null,
      "스트리밍 웹": null,
      "구독 플랫폼": null,
      점심시간: "영수증 챙기셨어요?",
    },
  },
  {
    id: 4,
    imageUrl: "/landing/members/4_k.webp",
    name: "기획자 K",
    messages: {
      "채팅 앱": "1:N이면\n 부방장 기능도 필요하죠.",
      "스트리밍 웹": null,
      "구독 플랫폼": "잔액 부족 시 재결제는요?",
      점심시간: "요구사항? 일단 고기",
    },
  },
  {
    id: 5,
    imageUrl: "/landing/members/5_dony.webp",
    name: "개발자 Dony",
    messages: {
      "스트리밍 웹": "버퍼링 구현 방식도\n 정해야죠.",
      "구독 플랫폼": null,
      점심시간: "꼬르륵...",
    },
  },
  {
    id: 6,
    imageUrl: "/landing/members/6_day.webp",
    name: "개발자 Day",
    messages: {
      "채팅 앱": "트래픽 과금\n 미리 조율해야 해요.",
      "스트리밍 웹": "용량 부족하면\n 가용성 문제 생겨요.",
      "구독 플랫폼": "PG사 먼저 확인 필요해요.",
      점심시간: "API보다 급한 건 칼국수",
    },
  },
  {
    id: 7,
    imageUrl: "/landing/members/7_sien.webp",
    name: "디자이너 Sien",
    messages: {
      "채팅 앱": null,
      "스트리밍 웹": "화질 자동 전환 고려하셨어요?",
      "구독 플랫폼": null,
      점심시간: "햄버거 버튼 말고 햄버거 줘요",
    },
  },
  {
    id: 8,
    imageUrl: "/landing/members/8_theo.webp",
    name: "개발자 Theo",
    messages: {
      "채팅 앱": null,
      "스트리밍 웹": null,
      "구독 플랫폼": null,
      점심시간: "현재 상태: 배고픔...",
    },
  },
  {
    id: 9,
    imageUrl: "/landing/members/jaxon.png",
    name: "개발자 Jaxon",
    messages: {
      "채팅 앱": "help...",
      "스트리밍 웹": null,
      "구독 플랫폼": "I debug, therefore I am.",
      점심시간: "503 Service Unavailable (No Lunch)",
    },
  },
];

// --- 스타일 ---
const GridContainerForTabs = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  padding: 0 40px;
  margin-bottom: 64px;
  max-width: 900px; // 전체 너비 제한
  margin-left: auto;
  margin-right: auto;
`;

export const MembersTabSection = () => {
  const [activeTab, setActiveTab] = useState(tabItems[0]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <>
      <SectionHeader title="일감을 주세요!" description="아래 버튼을 클릭하여 직원들에게 일을 맡겨보아요!" />
      <TabComponent tabs={tabItems} initialActiveTab={activeTab} onTabChange={handleTabChange}>
        <GridContainerForTabs>
          {cardDataForTabs.map((item) => (
            <MemberCard
              key={item.id}
              imageUrl={item.imageUrl}
              name={item.name}
              messages={item.messages}
              currentTab={activeTab}
            />
          ))}
        </GridContainerForTabs>
      </TabComponent>
    </>
  );
};
