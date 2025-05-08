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

const NavigatorWrapper = styled.div`
  margin-bottom: 100px;
  min-width: ${Breakpoints.desktop}px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto;
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
    flex-direction: column-reverse;
    gap: 48px;
    align-items: stretch; /* ✅ stretch to allow Row to expand */
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

  @media (max-width: ${Breakpoints.mobile}px) {
    width: 100%; /* ✅ allow Row to stretch fully */
  }
`;

const Row = styled.div`
  display: flex;
  align-items: center;
  height: 36px;

  @media (max-width: ${Breakpoints.mobile}px) {
    justify-content: space-between;
    width: 100%;
  }
`;

const LeftGroup = styled.div`
  display: flex;
  align-items: center;
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

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: ${({ $isCenter }) =>
    $isCenter ?  '18px': '12px'};
  }
`;

const Arrows = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 32px; /* optional stability for icon side */
  }
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
            <LeftGroup>
              <Radio />
              <Label>{topLabel}</Label>
            </LeftGroup>
            <Arrows>
              <ArrowButton onClick={onTopArrowClick}>▲</ArrowButton>
            </Arrows>
          </Row>

          {/* Center */}
          <Row>
            <LeftGroup>
              <Radio $isCenter />
              <Label $isCenter>{centerLabel}</Label>
            </LeftGroup>
          </Row>

          {/* Bottom */}
          {bottomLabel && (
            <Row>
              <LeftGroup>
                <Radio />
                <Label>{bottomLabel}</Label>
              </LeftGroup>
              <Arrows>
                <ArrowButton onClick={onBottomArrowClick}>▼</ArrowButton>
              </Arrows>
            </Row>
          )}
        </RightSection>
      </Wrapper>
    </NavigatorWrapper>
  );
};
