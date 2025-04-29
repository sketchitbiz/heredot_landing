'use client';

import React from 'react';
import styled, { keyframes } from 'styled-components';

const move = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const BackgroundWrapper = styled.div`
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(270deg, rgba(200, 200, 255, 0.2), rgba(255, 200, 200, 0.2), rgba(200, 255, 200, 0.2));
    background-size: 600% 600%;
    animation: ${move} 30s ease infinite;
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Background1: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BackgroundWrapper>{children}</BackgroundWrapper>;
};

export default Background1;
