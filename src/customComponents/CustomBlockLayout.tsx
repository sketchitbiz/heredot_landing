'use client';

import React, { forwardRef } from 'react';
import styled from 'styled-components';

interface LayoutProps {
  padding?: string;
  gap?: string;
  alignItems?: string;
  justifyContent?: string;
  children?: React.ReactNode;
}

interface SectionProps {
  flex?: number;
  alignItems?: string;
  justifyContent?: string;
  padding?: string;
}

const Container = styled.div<LayoutProps>`
  display: flex;
  width: 100%;
  min-height: 100vh;
  box-sizing: border-box;
  padding: ${({ padding }) => padding || '0 40px'};
  gap: ${({ gap }) => gap || '0'};
  align-items: ${({ alignItems }) => alignItems || 'center'};
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
`;

const Left = styled.div<SectionProps>`
  flex: ${({ flex }) => flex || 2};
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems || 'flex-start'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  padding: ${({ padding }) => padding || '0'};
`;

const Right = styled.div<SectionProps>`
  flex: ${({ flex }) => flex || 3};
  display: flex;
  flex-direction: column;
  align-items: ${({ alignItems }) => alignItems || 'flex-start'};
  justify-content: ${({ justifyContent }) => justifyContent || 'center'};
  padding: ${({ padding }) => padding || '0 0 0 20px'};
  position: relative;
`;

// ✅ forwardRef 사용
const CustomBlockLayoutBase = forwardRef<HTMLDivElement, LayoutProps>(
  ({ children, ...props }, ref) => (
    <Container {...props} ref={ref}>
      {children}
    </Container>
  )
);

// 네이밍 명확하게 Object.assign해서 Left, Right 달아줌
const CustomBlockLayout = Object.assign(CustomBlockLayoutBase, {
  Left,
  Right,
});

export default CustomBlockLayout;
