import styled from "styled-components";
import Image from "next/image";
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
