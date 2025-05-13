'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';
import { useDevice } from '@/contexts/DeviceContext';
import type { DeviceType } from '@/types/device';
import { ButtonStyles } from '@/constants/componentConstants'; // 추가

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  $iconPosition?: 'left' | 'right';

  // 🎨 스타일 오버라이드 props
  width?: string;
  height?: string;
  borderRadius?: string;
  padding?: string;
  fontSize?: string;
}

const StyledButton = styled.button<{
  $width?: string;
  $maxWidth: string;
  $height: string;
  $borderRadius: string;
  $padding: string;
  $fontSize: string;
}>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: ${({ $width }) => $width || '100%'};
  max-width: ${({ $maxWidth }) => $maxWidth};
  height: ${({ $height }) => $height};
  padding: ${({ $padding }) => $padding};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  font-size: ${({ $fontSize }) => $fontSize};
  font-weight: ${AppTextStyles.label2.fontWeight};
  letter-spacing: ${AppTextStyles.label2.letterSpacing};

  background: ${AppColors.primary};
  color: ${AppColors.onPrimary};
  border: none;
  cursor: pointer;
  transition: color 0.3s ease;

  &:hover {
    color: ${AppColors.hoverText};
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
  ...buttonProps
}) => {
  const device = useDevice();

  return (
    <StyledButton
      {...buttonProps}
      $width={width}
      $maxWidth={ButtonStyles.containerMaxWidth[device]}
      $height={height || ButtonStyles.height[device]}
      $borderRadius={borderRadius || ButtonStyles.radius[device]}
      $padding={padding || ButtonStyles.padding[device]}
      $fontSize={fontSize || ButtonStyles.fontSize[device]}
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
