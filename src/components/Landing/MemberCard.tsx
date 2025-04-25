import styled from "styled-components";
import Image from "next/image";
import { useEffect, useState } from "react";

interface MemberCardProps {
  imageUrl: string;
  name: string;
  messages?: {
    [key: string]: string | null; // 탭별 메시지, null이면 말풍선 없음
  };
  currentTab: string; // 현재 활성화된 탭
  width?: string | number;
  height?: string | number;
}

const CardWrapper = styled.div<{ width?: string | number; height?: string | number }>`
  position: relative;
  width: ${({ width }) => (width ? (typeof width === "number" ? `${width}px` : width) : "100%")};
  aspect-ratio: 1;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }
`;

const CardImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: top;
`;

const SpeechBubble = styled.div<{ $isVisible: boolean; $shouldRender: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(102, 102, 102, 0.6);
  padding: 12px 16px;
  border-radius: 50px;
  color: white;
  font-size: 14px;
  max-width: 80%;
  white-space: pre-line;
  text-align: center;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-10px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
  visibility: ${({ $shouldRender }) => ($shouldRender ? "visible" : "hidden")};
`;

const NameTag = styled.div`
  position: absolute;
  bottom: 12px;
  right: 12px;
  background-color: rgba(0, 0, 0, 0.6);
  padding: 6px 12px;
  border-radius: 12px;
  color: white;
  font-size: 14px;
`;

export const MemberCard: React.FC<MemberCardProps> = ({ imageUrl, name, messages = {}, currentTab, width, height }) => {
  const currentMessage = messages[currentTab];
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (currentMessage) {
      setShouldRender(true);
      // 요소가 DOM에 마운트된 직후에 보이도록 설정
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      // 페이드 아웃 애니메이션이 완료된 후 렌더링 제거
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300); // transition 시간과 동일하게 설정
      return () => clearTimeout(timer);
    }
  }, [currentMessage]);

  return (
    <CardWrapper width={width} height={height}>
      <CardImage
        src={imageUrl}
        alt={name}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        priority
      />
      <SpeechBubble $isVisible={isVisible} $shouldRender={shouldRender}>
        {currentMessage}
      </SpeechBubble>
      <NameTag>{name}</NameTag>
    </CardWrapper>
  );
};
