// src/components/Landing/TabComponent.tsx
"use client";

import React, { useState } from "react";
import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors"; // 경로 확인 필요
import { AppTextStyles } from "@/styles/textStyles"; // 경로 확인 필요

interface TabComponentProps {
  tabs: string[]; // 탭 이름 배열
  initialActiveTab?: string; // 초기에 활성화될 탭 (선택 사항)
  onTabChange?: (tab: string) => void; // 탭 변경 시 호출될 콜백 (선택 사항)
  children?: React.ReactNode; // 탭 아래에 표시될 콘텐츠
}

const TabContainer = styled.div`
  display: flex;
  gap: 16px; // 탭 사이 간격
  margin-bottom: 60px; // 탭과 아래 콘텐츠 사이 간격
  padding: 0 40px; // 좌우 패딩 (page.tsx와 동일하게)
  justify-content: space-between; // 탭 중앙 정렬 (옵션)
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  ${AppTextStyles.body1} // 텍스트 스타일
  font-size: 24px;
  padding: 25px 70px; // 내부 패딩
  border-radius: 500px;
  border: 3px solid #18181f;
  background-color: #18181f; // 기본 배경색 (어두운 테마 가정)
  color: ${AppColors.disabled};
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    border: 3px solid #b5b5ea;
    background-color: ${AppColors.backgroundDark}; // 기본 배경색 (어두운 테마 가정)
    color: white;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      border: 3px solid #b5b5ea;
      background-color: ${AppColors.backgroundDark}; // 기본 배경색 (어두운 테마 가정)
      color: white;
    `}
`;

export const TabComponent: React.FC<TabComponentProps> = ({ tabs, initialActiveTab, onTabChange, children }) => {
  const [activeTab, setActiveTab] = useState(initialActiveTab || tabs[0]);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    if (onTabChange) {
      onTabChange(tab);
    }
  };

  return (
    <div>
      <TabContainer>
        {tabs.map((tab) => (
          <TabButton key={tab} $isActive={activeTab === tab} onClick={() => handleTabClick(tab)}>
            {tab}
          </TabButton>
        ))}
      </TabContainer>
      {/* 탭 아래 내용 렌더링 */}
      {children}
    </div>
  );
};
