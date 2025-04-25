import React from 'react';
import styled from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';

interface BlockWrapperProps {
  backgroundColor?: string;
  children: React.ReactNode;
}

const Wrapper = styled.section<{ backgroundColor?: string }>`
  width: 100%;
  background-color: ${({ backgroundColor }) => backgroundColor || 'transparent'};
`;

const Inner = styled.div`
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  padding: 60px 20px;
  box-sizing: border-box;

  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 40px 16px;
  }
`;

const BlockWrapper: React.FC<BlockWrapperProps> = ({ backgroundColor, children }) => (
  <Wrapper backgroundColor={backgroundColor}>
    <Inner>{children}</Inner>
  </Wrapper>
);

export default BlockWrapper;
