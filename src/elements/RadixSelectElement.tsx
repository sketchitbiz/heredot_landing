import React from 'react';
import * as SelectPrimitive from '@radix-ui/react-select';
import styled from 'styled-components';

// -------------------------
// Types for styled props
// -------------------------
interface StyledTriggerProps {
 $height?: string;
  $radius?: string;
  $triggerFontSize?: string;
  $triggerFontWeight?: string;
  $triggerTextColor?: string;
  $triggerBackgroundColor?: string;
  $triggerHoverBackgroundColor?: string;
  $triggerHoverTextColor?: string;
  $isShowIcon?: boolean;
}

interface StyledContentProps {
  $contentFontSize?: string;
  $contentTextColor?: string;
  $contentBackgroundColor?: string;
}

interface StyledItemProps {
  $fontSize?: string;
  $textColor?: string;
  $itemHoverBackgroundColor?: string;
  $itemHoverTextColor?: string;
}

// -------------------------
// Core Wrappers
// -------------------------
export const SelectElement = SelectPrimitive.Root;
export const SelectGroupElement = SelectPrimitive.Group;
export const SelectValueElement = SelectPrimitive.Value;

// -------------------------
// Trigger
// -------------------------
export const SelectTriggerElement = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Trigger> & StyledTriggerProps
>(({ children, $isShowIcon = true, ...props }, ref) => (
  <StyledTrigger ref={ref} {...props}>
    {children}
    {$isShowIcon && <StyledIcon>▾</StyledIcon>}
  </StyledTrigger>
));
SelectTriggerElement.displayName = 'SelectTriggerElement';

// -------------------------
// Content
// -------------------------
export const SelectContentElement = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Content> & StyledContentProps
>(({ children, ...props }, ref) => (
  <SelectPrimitive.Portal>
    <StyledContent ref={ref} {...props}>
      <SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport>
    </StyledContent>
  </SelectPrimitive.Portal>
));
SelectContentElement.displayName = 'SelectContentElement';

// -------------------------
// Item
// -------------------------
export const SelectItemElement = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof SelectPrimitive.Item> & StyledItemProps
>(({ children, ...props }, ref) => (
  <StyledItem ref={ref} {...props}>
    <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
  </StyledItem>
));
SelectItemElement.displayName = 'SelectItemElement';

// ======================
// Styled Components
// ======================

const StyledTrigger = styled(SelectPrimitive.Trigger)<StyledTriggerProps>`
  $display: flex;
  $align-items: center;
  $justify-content: space-between;
  $height: ${({ $height }) => $height || '36px'};
  $padding: 0 12px;
  $border: 1px solid #ccc;
  $border-radius: ${({ $radius }) => $radius || '6px'};
  $background-color: ${({ $triggerBackgroundColor }) => $triggerBackgroundColor || 'white'};
  $color: ${({ $triggerTextColor }) => $triggerTextColor || '#000'};
  $font-size: ${({ $triggerFontSize }) => $triggerFontSize || '14px'};
  $font-weight: ${({ $triggerFontWeight }) => $triggerFontWeight || '400'};
  cursor: pointer;

  /* &:focus {
    outline: none;
    border-color: #666;
  } */

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  &:hover {
    background-color: ${({ $triggerHoverBackgroundColor }) => $triggerHoverBackgroundColor || 'transparent'};
    color: ${({ $triggerHoverTextColor }) => $triggerHoverTextColor || 'inherit'};
  }
`;

const StyledIcon = styled.span`
  $margin-left: 8px;
  $font-size: 12px;
  $pointer-events: none;
`;

const StyledContent = styled(SelectPrimitive.Content)<StyledContentProps>`
  $margin-top: 4px;
  $border: 1px solid #ccc;
  $border-radius: 6px;
  $background-color: white;
  $overflow: hidden;
  $box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08);
  $z-index: 1000;
  $background-color: ${({ $contentBackgroundColor }) => $contentBackgroundColor || 'white'};
  $color: ${({ $contentTextColor }) => $contentTextColor || '#000'};
  $font-size: ${({ $contentFontSize }) => $contentFontSize || '14px'};


`;

const StyledItem = styled(SelectPrimitive.Item)<StyledItemProps>`
  padding: 8px 12px;
  font-size: ${({ $fontSize }) => $fontSize || '14px'};
  color: ${({ $textColor }) => $textColor || '#000'};
  cursor: pointer;

  &:hover {
    background-color: ${({ $itemHoverBackgroundColor }) => $itemHoverBackgroundColor || '#f0f0f0'};
    color: ${({ $itemHoverTextColor }) => $itemHoverTextColor || '#000'};
  }

  &[data-disabled] {
    color: #aaa;
    cursor: not-allowed;
  }

  &[data-state='checked'] {
    font-weight: bold;
  }
`;
