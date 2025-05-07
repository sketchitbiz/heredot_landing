'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';

interface CommonButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  icon?: React.ReactNode;
  $iconPosition?: 'left' | 'right';
}


const StyledButton = styled.button`
  ${AppTextStyles.label2};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 25px;
  color: ${AppColors.onBackground};
  background: ${AppColors.background};
  border: 2px solid ${AppColors.borderLight};
  border-radius: 75px;
  height: 50px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border: 2px solid ${AppColors.primary};
  }

  svg {
    font-size: 25px;
    color: ${AppColors.onBackground};
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 14px;
    font-weight: 700;
    padding: 8px 20px;
    height: 44px;

    svg {
      font-size: 20px;
    }
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
  ...buttonProps // This now excludes $iconPosition
}) => {
  return (
    <StyledButton {...buttonProps}>
      {icon && $iconPosition === 'left' && <IconWrapper $position="left">{icon}</IconWrapper>}
      {text}
      {icon && $iconPosition === 'right' && <IconWrapper $position="right">{icon}</IconWrapper>}
    </StyledButton>
  );
};

export default CommonButton;
