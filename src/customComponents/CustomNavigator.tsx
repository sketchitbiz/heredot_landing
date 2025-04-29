'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { SectionHeader } from '@/components/Landing/SectionHeader'; // ✅ 추가

interface CustomNavigatorProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title?: string;        // ✅ 추가
  description?: string;  // ✅ 추가
}

// --- 스타일 ---
const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start; /* 그대로 유지 */
  margin-top: 200px;
  padding: 0 10px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center; /* ✅ 추가 */
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;


const Row = styled.div`
  display: flex;
  align-items: center;
  height: 36px; /* ✅ 좀 더 촘촘하게 */
`;

const Radio = styled.div<{ $isCenter?: boolean }>`
  width: 12px;
  min-width: 12px;
  height: 12px;
  border: 1px solid ${({ $isCenter }) =>
    $isCenter ? 'transparent' : AppColors.onBackground};
  border-radius: 50%;
  visibility: ${({ $isCenter }) => ($isCenter ? 'hidden' : 'visible')};
`;

const Label = styled.div<{ $isCenter?: boolean }>`
  width: 220px;
  padding-left: 10px;
  font-family: ${AppTextStyles.body1.fontFamily};
  font-weight: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.fontWeight : 400};
  font-size: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.fontSize : '14px'};
  line-height: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.lineHeight : '20px'};
  color: ${({ $isCenter }) =>
    $isCenter ? AppColors.onBackground : 'rgba(247, 245, 245, 0.5)'};
  text-align: left;
`;

const Arrows = styled.div`
  width: 12px;
  min-width: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2px;
`;

const Arrow = styled.div<{ $isCenter?: boolean }>`
  font-size: 8px;
  line-height: 1;
  color: ${({ $isCenter }) =>
    $isCenter ? AppColors.onBackground : 'rgba(247, 245, 245, 0.5)'};
`;

// --- 컴포넌트 ---
export const CustomNavigator: React.FC<CustomNavigatorProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
}) => {
  return (
    <Wrapper>
      {/* 왼쪽 SectionHeader */}
      <LeftSection>
        {title && description && (
          <SectionHeader title={title} description={description} />
        )}
      </LeftSection>

      {/* 오른쪽 Navigator */}
      <RightSection>
        <Row>
          <Radio />
          <Label>{topLabel}</Label>
          <Arrows>
            <Arrow>▲</Arrow>
          </Arrows>
        </Row>

        <Row>
          <Radio $isCenter />
          <Label $isCenter>{centerLabel}</Label>
          <Arrows>
            <Arrow $isCenter>▲</Arrow>
            <Arrow $isCenter>▼</Arrow>
          </Arrows>
        </Row>

        <Row>
          <Radio />
          <Label>{bottomLabel}</Label>
          <Arrows>
            <Arrow>▼</Arrow>
          </Arrows>
        </Row>
      </RightSection>
    </Wrapper>
  );
};
