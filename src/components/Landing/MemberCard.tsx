import styled from "styled-components";
import { useEffect, useState } from "react";
import { useLang } from "@/contexts/LangContext";
import { dictionary } from "@/lib/i18n/lang";

// 윈도우 환경 감지 함수
const isWindows = () => {
  if (typeof window === 'undefined') return false;
  return /Windows/.test(navigator.userAgent);
};

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


const SpeechBubble = styled.div<{ 
  $isVisible: boolean; 
  $shouldRender: boolean; 
  $isWindows: boolean;
}>`
  position: absolute;
  top: 12px;
  right: 12px;
  background-color: rgba(102, 102, 102, 0.6);
  padding: ${({ $isWindows }) => $isWindows ? '10px 14px' : '12px 16px'};
  border-radius: 50px;
  color: white;
  font-size: ${({ $isWindows }) => $isWindows ? '13px' : '14px'};
  max-width: ${({ $isWindows }) => $isWindows ? '85%' : '80%'};
  white-space: pre-line;
  text-align: center;
  opacity: ${({ $isVisible }) => ($isVisible ? 1 : 0)};
  transform: ${({ $isVisible }) => ($isVisible ? "translateY(0)" : "translateY(-10px)")};
  transition: opacity 0.3s ease, transform 0.3s ease;
  visibility: ${({ $shouldRender }) => ($shouldRender ? "visible" : "hidden")};

  @media (max-width: 768px) {
    max-width: ${({ $isWindows }) => $isWindows ? '160%' : '150%'}; 
    padding: ${({ $isWindows }) => $isWindows ? '7px 7px' : '8px 8px'};
    border-radius: 30px;
    font-size: ${({ $isWindows }) => $isWindows ? '11px' : '12px'};
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

  // 윈도우 환경 감지 - 즉시 실행
  const [isWindowsEnv, setIsWindowsEnv] = useState(() => {
    if (typeof window !== 'undefined') {
      return isWindows();
    }
    return false;
  });

  // 윈도우 환경 감지 및 클래스 추가
  useEffect(() => {
    const windowsDetected = isWindows();
    console.log('윈도우 환경 감지:', windowsDetected); // 디버깅용
    setIsWindowsEnv(windowsDetected);
    
    if (windowsDetected) {
      document.body.classList.add('windows');
    }
    return () => {
      document.body.classList.remove('windows');
    };
  }, []);

  // ✅ key -> label 변환
  const tabLabel =
    currentTab === "chat"
      ? t.memberTabs?.[0]
      : currentTab === "streaming"
      ? t.memberTabs?.[1]
      : currentTab === "subscription"
      ? t.memberTabs?.[2]
      : t.memberTabs?.[3];

  // 초기 메시지 설정 - 첫 번째 탭의 메시지를 기본으로 표시
  const initialMessage = messages[tabLabel] ?? null;
  
  const [currentMessage, setCurrentMessage] = useState<string | null>(initialMessage);
  const [isVisible, setIsVisible] = useState(!!initialMessage); // 초기 메시지가 있으면 true
  const [shouldRender, setShouldRender] = useState(!!initialMessage); // 초기 메시지가 있으면 true

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
      <SpeechBubble 
        $isVisible={isVisible} 
        $shouldRender={shouldRender}
        $isWindows={isWindowsEnv}
      >
        {currentMessage}
      </SpeechBubble>
      <NameTag>{name}</NameTag>
    </CardWrapper>
  );
};
