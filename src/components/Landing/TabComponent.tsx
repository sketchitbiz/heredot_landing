'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';


interface TabItem {
  key: string;
  label: string;
}

interface TabComponentProps {
  tabs: TabItem[];
  activeTabKey: string;
  onTabChange: (key: string) => void;
  children?: React.ReactNode;
}

const TabContainer = styled.div`
  display: flex;
  gap: 16px;
  padding-bottom: 40px;
  justify-content: center;
  flex-wrap: nowrap; /* ✅ 줄바꿈 금지 */
  box-sizing: border-box;
`;

const TabButton = styled.button<{ $isActive: boolean; $tabCount: number }>`
  ${AppTextStyles.body1}
  flex: 1; /* ✅ 동일 너비 자동 분배 */
  padding: 20px 16px;
  text-align: center;
  border-radius: ${({ $tabCount }) => ($tabCount >= 4 ? '32px' : '16px')};
  border: 3px solid #18181f;
  background-color: #18181f;
  color: ${AppColors.disabled};
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    border-color: #b5b5ea;
    background-color: ${AppColors.backgroundDark};
    color: white;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      border-color: #b5b5ea;
      background-color: ${AppColors.backgroundDark};
      color: white;
    `}

    @media (max-width: ${Breakpoints.mobile}px) {
    padding: 12px 2px; /* ✅ 모바일 시 패딩 축소 */
    font-size: 14px;
  }
`;

export const TabComponent: React.FC<TabComponentProps> = ({
  tabs,
  activeTabKey,
  onTabChange,
  children,
}) => {
  return (
    <div>
<TabContainer>
  {tabs.map(({ key, label }) => (
    <TabButton
      key={key}
      $isActive={activeTabKey === key}
      $tabCount={tabs.length}
      onClick={() => onTabChange(key)}
    >
      {label}
    </TabButton>
  ))}
</TabContainer>

      {children}
    </div>
  );
};
