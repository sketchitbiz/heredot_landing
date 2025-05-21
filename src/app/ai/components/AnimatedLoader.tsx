'use client';

import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';

// 이미지 경로 정의
const imagePaths = {
  google: '/ai/loader/load_google.png',
  youtube: '/ai/loader/load_youtube.png',
  gemi: '/ai/loader/load_gemi.png',
  gemini: '/ai/loader/load_gemini.png',
  chatDot1: '/ai/loader/chat-dots1.png',
  chatDot2: '/ai/loader/chat-dots2.png',
  chatDot3: '/ai/loader/chat-dots3.png',
};

// 챗닷 움직임 애니메이션
const dotAnimation1 = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-3px); }
`;

const dotAnimation2 = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(2px); }
`;

const dotAnimation3 = keyframes`
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-2px); }
`;

const LoaderContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 8px; // 아이콘과 챗닷 사이 간격
`;

const MainIconImage = styled.img`
  width: 40px; // 크기 조절 가능
  height: 40px;
  object-fit: contain;
`;

const ChatDotContainer = styled.div`
  display: flex;
  align-items: flex-end; // 챗닷 정렬 기준
  height: 20px; // 챗닷의 최대 높이 기준으로 컨테이너 높이 설정
`;

const ChatDotImage = styled.img<{ $animationRule?: ReturnType<typeof css> }>`
  width: 32px; // 크기 조절 가능
  height: 32px;
  margin-bottom: 15px;
  object-fit: contain;
  animation: ${(props) =>
    props.$animationRule
      ? css`
          ${props.$animationRule} 0.4s ease-in-out
        `
      : 'none'};
`;

const AnimatedLoader: React.FC = () => {
  const [currentMainIconIndex, setCurrentMainIconIndex] = useState(0);
  const [currentChatDotIndex, setCurrentChatDotIndex] = useState(0);

  const mainIcons = [
    imagePaths.google,
    imagePaths.youtube,
    imagePaths.gemi,
    imagePaths.gemini,
  ];
  const chatDots = [
    {
      src: imagePaths.chatDot1,
      $animationRule: css`
        ${dotAnimation1}
      `,
    },
    {
      src: imagePaths.chatDot2,
      $animationRule: css`
        ${dotAnimation2}
      `,
    },
    {
      src: imagePaths.chatDot3,
      $animationRule: css`
        ${dotAnimation3}
      `,
    },
  ];

  // 메인 아이콘 변경 로직 (1.6초마다)
  useEffect(() => {
    const mainIconInterval = setInterval(() => {
      setCurrentMainIconIndex(
        (prevIndex) => (prevIndex + 1) % mainIcons.length
      );
    }, 1600); // 각 메인 아이콘 표시 시간 (챗닷 3번 * ~0.5초 + 약간의 버퍼)
    return () => clearInterval(mainIconInterval);
  }, [mainIcons.length]);

  // 챗닷 변경 로직 (0.4초마다)
  useEffect(() => {
    const chatDotInterval = setInterval(() => {
      setCurrentChatDotIndex((prevIndex) => (prevIndex + 1) % chatDots.length);
    }, 400);
    return () => clearInterval(chatDotInterval);
  }, [chatDots.length]);

  return (
    <LoaderContainer>
      <MainIconImage
        key={`main-${currentMainIconIndex}`}
        src={mainIcons[currentMainIconIndex]}
        alt="Loading icon"
      />
      <ChatDotContainer>
        <ChatDotImage
          key={`dot-${currentMainIconIndex}-${currentChatDotIndex}`}
          src={chatDots[currentChatDotIndex].src}
          $animationRule={chatDots[currentChatDotIndex].$animationRule}
          alt="."
        />
      </ChatDotContainer>
    </LoaderContainer>
  );
};

export default AnimatedLoader;
