'use client';

import React from 'react';
import styled from 'styled-components';

const BackgroundWrapper = styled.div`
  position: relative;
  overflow: hidden;

  &::before, &::after {
    content: '';
    position: absolute;
    border-radius: 50%;
    filter: blur(100px);
    opacity: 0.3;
    z-index: 0;
  }

  &::before {
    width: 400px;
    height: 400px;
    top: -100px;
    left: -100px;
    background: #a5d8ff;
  }

  &::after {
    width: 500px;
    height: 500px;
    bottom: -150px;
    right: -150px;
    background: #ffe0e0;
  }

  > * {
    position: relative;
    z-index: 1;
  }
`;

const Background2: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <BackgroundWrapper>{children}</BackgroundWrapper>;
};

export default Background2;
