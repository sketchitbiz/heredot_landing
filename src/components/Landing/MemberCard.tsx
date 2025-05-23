import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";

interface MemberCardProps {
  imageUrl: string;
  name: string;
  messages?: {
    [label: string]: string | null;
  };
  currentTab: string; // key (chat, streaming 등)
  width?: string | number;
  height?: string | number;
}

const CardWrapper = styled.div<{ width?: string | number; height?: string | number }>`
  position: relative;
  width: ${({ width }) => (width ? (typeof width === "number" ? `${width}px` : width) : "100%")};
  aspect-ratio: 1;
  border-radius: 8px;

  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: translateY(-4px);
  }

  @media (min-width: 769px) {
    overflow: hidden; /* 데스크탑: 말풍선이 안 튀어나오도록 */
  }

  @media (max-width: 768px) {
    overflow: visible; /* ✅ 모바일: 말풍선이 카드 밖으로 나와도 보이게 허용 */
  }
`;

const CardImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
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

  @media (max-width: 768px) {
    max-width: 150%; 
    padding: 8px 8px;
    border-radius: 30px;
    font-size: 12px;
    top: -30px; /* ✅ 모바일에서 위로 조금 더 올림 */
  }
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

  @media (max-width: 768px) {
    bottom: auto;
    top: 80%; /* ✅ 모바일에서 조금 더 아래쪽으로 */
  }
`;

export const MemberCard: React.FC<MemberCardProps> = ({
  imageUrl,
  name,
  messages = {},
  currentTab,
  width,
  height,
}) => {
  const { lang } = useLang();
  const t = dictionary[lang];

  // ✅ key -> label 변환
  const tabLabel =
    currentTab === "chat"
      ? t.memberTabs?.[0]
      : currentTab === "streaming"
      ? t.memberTabs?.[1]
      : currentTab === "subscription"
      ? t.memberTabs?.[2]
      : t.memberTabs?.[3];

  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const newMessage = messages[tabLabel] ?? null; // ✅ label 기준으로 찾는다
    setCurrentMessage(newMessage);

    if (newMessage) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        setIsVisible(true);
      });
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [messages, tabLabel]);

  return (
    <CardWrapper width={width} height={height}>
<CardImage
  src={imageUrl}
  alt={name}
  className="w-full h-full object-cover"
/>
      <SpeechBubble $isVisible={isVisible} $shouldRender={shouldRender}>
        {currentMessage}
      </SpeechBubble>
      <NameTag>{name}</NameTag>
    </CardWrapper>
  );
};
