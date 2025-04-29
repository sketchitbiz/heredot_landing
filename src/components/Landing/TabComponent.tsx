'use client';

import React from 'react';
import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';

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
  justify-content: space-between;
`;

const TabButton = styled.button<{ $isActive: boolean }>`
  ${AppTextStyles.body1}
  font-size: 24px;
  padding: 25px 70px;
  border-radius: 500px;
  border: 3px solid #18181f;
  background-color: #18181f;
  color: ${AppColors.disabled};
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s, border-color 0.2s;

  &:hover {
    border: 3px solid #b5b5ea;
    background-color: ${AppColors.backgroundDark};
    color: white;
  }

  ${({ $isActive }) =>
    $isActive &&
    css`
      border: 3px solid #b5b5ea;
      background-color: ${AppColors.backgroundDark};
      color: white;
    `}
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
