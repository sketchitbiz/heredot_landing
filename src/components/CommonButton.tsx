'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';
import { useDevice } from '@/contexts/DeviceContext';
import type { DeviceType } from '@/types/device';
import { ButtonStyles } from '@/constants/componentConstants'; // 추가

interface CommonButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  $iconPosition?: 'left' | 'right';

  // 🎨 스타일 오버라이드 props
  width?: string;
  height?: string;
  borderRadius?: string; // 보더 반경 추가
  padding?: string;
  fontSize?: string;
  backgroundColor?: string; // 배경색 추가
  borderColor?: string; // 보더 색상 추가
}

const StyledButton = styled.button<{
  $width?: string;
  $maxWidth: string;
  $height: string;
  $borderRadius: string; // 보더 반경
  $padding: string;
  $fontSize: string;
  $backgroundColor: string; // 배경색
  $borderColor: string; // 보더 색상
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: ${({ $height }) => $height};
  padding: ${({ $padding }) => $padding};
  border-radius: ${({ $borderRadius }) => $borderRadius}; // 보더 반경 적용
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${AppTextStyles.label2.fontWeight};
  letter-spacing: ${AppTextStyles.label2.letterSpacing};

  background: ${({ $backgroundColor }) => $backgroundColor}; // 배경색 적용
  color: ${AppColors.onPrimary};
  border: 1px solid ${({ $borderColor }) => $borderColor}; // 보더 색상 적용
  cursor: pointer;
  transition: color 0.3s ease, border-color 0.3s ease;

  &:hover {
    color: ${AppColors.hoverText};
    border-color: ${AppColors.hoverText}; // 호버 시 보더 색상 변경
  }

  svg {
    font-size: 25px;
    color: inherit; // 텍스트 색상과 동일하게
  }
`;

const IconWrapper = styled.span<{ $position: 'left' | 'right' }>`
  display: flex;
  align-items: center;
  margin-right: ${({ $position }) => ($position === 'left' ? '8px' : '0')};
  margin-left: ${({ $position }) => ($position === 'right' ? '8px' : '0')};
`;

const CommonButton: React.FC<CommonButtonProps> = ({
  text,
  icon,
  $iconPosition = 'left',
  width,
  height,
  borderRadius,
  padding,
  fontSize,
  backgroundColor = AppColors.primary, // 기본 배경색
  borderColor = AppColors.border, // 기본 보더 색상
  ...buttonProps
}) => {
  const device = useDevice();

  return (
    <StyledButton
      {...buttonProps}
      $width={width}
      $maxWidth={ButtonStyles.containerMaxWidth[device]}
      $height={height || ButtonStyles.height[device]}
      $borderRadius={borderRadius || ButtonStyles.radius[device]} // 보더 반경 전달
      $padding={padding || ButtonStyles.padding[device]}
      $fontSize={fontSize || ButtonStyles.fontSize[device]}
      $backgroundColor={backgroundColor} // 배경색 전달
      $borderColor={borderColor} // 보더 색상 전달
    >
      {icon && $iconPosition === 'left' && (
        <IconWrapper $position="left">{icon}</IconWrapper>
      )}
      {text}
      {icon && $iconPosition === 'right' && (
        <IconWrapper $position="right">{icon}</IconWrapper>
      )}
    </StyledButton>
  );
};

export default CommonButton;
