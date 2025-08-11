// src/app/ai-estimate/components/AiResponseMessage.tsx
"use client";

import React from 'react';
import styled from 'styled-components';

const MessageWrapper = styled.div`
  padding: 20px;
  background-color: ${({ theme }) => theme.surface1};
  border-radius: 8px;
  margin: 20px 0;
  line-height: 1.6;
`;

interface AiResponseMessageProps {
  message: string;
}

const AiResponseMessage: React.FC<AiResponseMessageProps> = ({ message }) => {
  // TODO: 타이핑 효과 추가
  return (
    <MessageWrapper>
      <p>{message}</p>
    </MessageWrapper>
  );
};

export default AiResponseMessage;

