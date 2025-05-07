'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { SectionHeader } from '@/components/Landing/SectionHeader';
import { Breakpoints } from '@/constants/layoutConstants';

interface CustomNavigatorProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel?: string;
  title?: string;
  description?: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

// ✅ scroll container (고정된 너비를 유지하고 넘치면 스크롤)
const NavigatorWrapper = styled.div`
  margin-bottom: 100px; 
  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto; /* 모바일 이하에서 min-width 제거 */
    margin-bottom: 50px; 
  }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  margin: 200px auto 0 auto;
  padding: 0 24px;
  box-sizing: border-box;

  @media (max-width: ${Breakpoints.mobile}px) {
    flex-direction: column-reverse; /* ✅ 모바일에서는 아래쪽에 title이 오도록 */
    gap: 48px;
    align-items: flex-start;
    margin: 50px auto 0 auto;
  }
`;


const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const RightSection = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 36px;
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
  width: 185px;
  padding-left: 10px;
  font-weight: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.fontWeight : 500};
  font-size: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.fontSize : '14px'};
  line-height: ${({ $isCenter }) =>
    $isCenter ? AppTextStyles.title1.lineHeight : '14px'};
  color: ${({ $isCenter }) =>
    $isCenter ? AppColors.onBackground : 'rgba(247, 245, 245, 0.5)'};
  text-align: left;
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
`;

const ArrowButton = styled.button`
  background: transparent;
  border: none;
  font-size: 16px;
  color: ${AppColors.onBackground};
  cursor: pointer;
  padding: 0;
  line-height: 1;
`;

export const CustomNavigator: React.FC<CustomNavigatorProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  return (
    <NavigatorWrapper>
      <Wrapper>
        <LeftSection>
          {title && description && (
            <SectionHeader title={title} description={description} />
          )}
        </LeftSection>

        <RightSection>
          {/* Top */}
          <Row>
            <Radio />
            <Label>{topLabel}</Label>
            <Arrows>
              <ArrowButton onClick={() => onTopArrowClick?.()}>▲</ArrowButton>
            </Arrows>
          </Row>

          {/* Center */}
          <Row>
            <Radio $isCenter />
            <Label $isCenter>{centerLabel}</Label>
          </Row>

          {/* Bottom */}
          {bottomLabel && (
            <Row>
              <Radio />
              <Label>{bottomLabel}</Label>
              <Arrows>
                <ArrowButton onClick={() => onBottomArrowClick?.()}>▼</ArrowButton>
              </Arrows>
            </Row>
          )}
        </RightSection>
      </Wrapper>
    </NavigatorWrapper>
  );
};
