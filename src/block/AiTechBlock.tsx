'use client';

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useLang } from '../contexts/LangContext';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { Breakpoints } from '@/constants/layoutConstants';
import { AppColors } from '@/styles/colors';
import ResponsiveView from '@/layout/ResponsiveView';
import { userStamp } from '@/lib/api/user/api';

interface AiTechBlockProps {
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  title: string;
  description: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

interface CardData {
  id: number;
  icon: string;
  title: {
    ko: string;
    en: string;
  };
  content: {
    ko: string;
    en: string;
  };
}

const cardData: CardData[] = [
  {
    id: 1,
    icon: "/landing/recommendation/icon_1.svg",
    title: {
      ko: "AI 파일 분석",
      en: "AI File Analysis"
    },
    content: {
      ko: "PDF 파일 내\n텍스트를 분석하여\n맞춤 결과를 도출합니다",
      en: "Analyze text in PDF files\nto derive customized\nresults"
    }
  },
  {
    id: 2,
    icon: "/landing/recommendation/icon_2.svg",
    title: {
      ko: "AI URL 분석",
      en: "AI URL Analysis"
    },
    content: {
      ko: "URL 접속 후 페이지 내\n텍스트를 분석하여\n맞춤 결과를 도출합니다",
      en: "Access URLs and analyze\npage text to derive\ncustomized results"
    }
  },
  {
    id: 3,
    icon: "/landing/recommendation/icon_3.svg",
    title: {
      ko: "AI 이미지 검색",
      en: "AI Image Search"
    },
    content: {
      ko: "AI 이미지 검색 시 제품 정보,\n생산년도, 제조사 정보를\n일괄 수집 가능합니다",
      en: "AI image search enables\nbatch collection of product info,\nproduction year, and manufacturer"
    }
  },
  {
    id: 4,
    icon: "/landing/recommendation/icon_4.svg",
    title: {
      ko: "생성형 AI 챗봇",
      en: "Generative AI Chatbot"
    },
    content: {
      ko: "자연어 기반으로\n자연스럽게 대화할 수 있습니다",
      en: "Natural language-based\nconversation system"
    }
  },
  {
    id: 5,
    icon: "/landing/recommendation/icon_5.svg",
    title: {
      ko: "AI 맞춤 콘텐츠 추천",
      en: "AI Content Recommendation"
    },
    content: {
      ko: "사용자의 성향을 분석하여\n맞춤 콘텐츠를 추천합니다",
      en: "Analyze user preferences\nto recommend personalized\ncontent"
    }
  },
  {
    id: 6,
    icon: "/landing/recommendation/icon_6.svg",
    title: {
      ko: "AI 글로벌 의사소통",
      en: "AI Global Communication"
    },
    content: {
      ko: "전세계 언어로 자연스럽게\n대화가 가능합니다",
      en: "Natural conversation\nin languages worldwide"
    }
  },
  {
    id: 7,
    icon: "/landing/recommendation/icon_7.svg",
    title: {
      ko: "AI 견적서",
      en: "AI Quote Generation"
    },
    content: {
      ko: "자연어로 대화하며\n맞춤 견적을 실시간 제공합니다",
      en: "Real-time customized quotes\nthrough natural language\nconversation"
    }
  },
  {
    id: 8,
    icon: "/landing/recommendation/icon_8.svg",
    title: {
      ko: "AI 리포트",
      en: "AI Reports"
    },
    content: {
      ko: "데이터를 기반으로 AI가\n맞춤 리포트를 생성해줍니다",
      en: "AI generates customized\nreports based on\ndata analysis"
    }
  },
  {
    id: 9,
    icon: "/landing/recommendation/icon_9.svg",
    title: {
      ko: "AI 업무 자동화",
      en: "AI Work Automation"
    },
    content: {
      ko: "견적, 보고, 분류까지\n반복업무를 자동화합니다",
      en: "Automate repetitive tasks\nincluding quotes, reports,\nand classification"
    }
  }
];

const Wrapper = styled.div`
  width: 100%;
  /* background-color: blue; */
  /* background-color: red; */
  position: relative; /* RotatedContainer를 위한 position context */

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: 0;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 100px;
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
  }
`;

const NavigatorWrapper = styled.div`
  max-width: ${Breakpoints.desktop}px;
  margin: 0 auto;
  width: 100%;
  
  @media (max-width: ${Breakpoints.mobile}px) {
    max-width: 100%;
  }
`;

const AiTechBlockContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: auto;
  /* min-height: 100vh; */
  width: 100%;
  padding: 50px 0px;
  position: relative;
  overflow: hidden;
  /* gap: 60px; */
  
  @media (max-width: ${Breakpoints.mobile}px) {
    padding: 20px;
  }
`;

const LeftSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const RightSection = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
`;

const WebImage = styled(Image)`
  object-fit: contain;
  transition: opacity 0.3s ease-in-out;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 250px);
    grid-template-rows: repeat(3, 220px);
  gap: 20px;
  z-index: 10;
  position: relative;
`;

// 모바일용 컨테이너 스타일
const MobileContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
`;

// 모바일 앱 카드 스타일
const MobileAppCardContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
  margin-bottom: 12px;
`;

const MobileAppCard = styled.div<{ $isSelected: boolean }>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  min-height: 120px;
  
  opacity: ${props => props.$isSelected ? 1 : 0.7};
  transform: ${props => props.$isSelected ? 'scale(1.05)' : 'scale(1)'};
`;

const AppCardBackground = styled(Image)`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  z-index: 0;
`;

const MobileAppCardContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  z-index: 1;
  text-align: center;
`;

const MobileAppCardIcon = styled(Image)`
  object-fit: contain;
`;

const MobileAppCardTitle = styled.h4`
  color: white;
  font-size: 12px;
  font-weight: 600;
  margin: 0;
  line-height: 1.2;
  text-align: center;
  
  @media (max-width: 390px) {
    font-size: 10px;
  }
`;

const MobileWebImageContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px 0;
`;

const MobileWebImage = styled(Image)`
  object-fit: contain;
  transition: opacity 0.3s ease-in-out;
  max-width: 100%;
  height: auto;
`;

const Card = styled.div<{ $zIndex: number; $isRotated: boolean }>`
  width: 250px;
  height: 220px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  box-sizing: border-box;
  line-height: 0;
  z-index: ${props => props.$zIndex};
  transform: rotate(${props => props.$isRotated ? '-35deg' : '0deg'});
  transition: transform 0.3s ease-in-out;
  cursor: pointer;
  position: relative;
`;

const CardContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 20px;
  margin-bottom: 24px;
  z-index: 1;
  height: auto;
`;

const CardTitle = styled.h3`
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
  line-height: 1.2;
  text-align: center;
`;

const CardDescription = styled.p`
  color: #d4d4d4;
  font-size: 16px;
  font-weight: 400;
  margin: 0;
  margin-top: 12px;
  line-height: 1.4;
  white-space: pre-line;
  text-align: center;
  z-index: 1;
`;

const RotatedContainer = styled.div<{ $x: number; $y: number }>`
  width: 340px;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute; /* absolute로 다시 변경 */
  left: ${props => props.$x - 170}px;
  top: ${props => props.$y - 150}px;
  transition: all 0.1s ease-out;
  pointer-events: none;
  z-index: 9999; /* 다른 요소들 위에 표시 */
`;

const AnimatedImage = styled(Image)`
  filter: hue-rotate(0deg) saturate(1.2) brightness(1.1);
  animation: colorFlow 4s ease-in-out infinite;
  
  @keyframes colorFlow {
    0% {
      filter: hue-rotate(0deg) saturate(1.2) brightness(1.1) contrast(1.1);
    }
    25% {
      filter: hue-rotate(90deg) saturate(1.5) brightness(1.3) contrast(1.2);
    }
    50% {
      filter: hue-rotate(180deg) saturate(1.8) brightness(1.2) contrast(1.3);
    }
    75% {
      filter: hue-rotate(270deg) saturate(1.4) brightness(1.4) contrast(1.1);
    }
    100% {
      filter: hue-rotate(360deg) saturate(1.2) brightness(1.1) contrast(1.1);
    }
  }
`;

export const AiTechBlock: React.FC<AiTechBlockProps> = ({
  topLabel,
  centerLabel,
  bottomLabel,
  title,
  description,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  const { lang } = useLang();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMouseInSection, setIsMouseInSection] = useState(false);
  const [rotatedCards, setRotatedCards] = useState<Set<number>>(new Set());
  const [selectedCard, setSelectedCard] = useState<number>(0); // 기본값은 첫 번째 카드
  const containerRef = useRef<HTMLDivElement>(null);

  // 웹 이미지 경로와 확장자를 결정하는 함수
  const getWebImagePath = (cardIndex: number) => {
    const imageNumber = cardIndex + 1;
    const isPng = [5, 8, 9].includes(imageNumber);
    const extension = isPng ? 'png' : 'svg';
    return `/landing/recommendation/web_${imageNumber}.${extension}`;
  };

  const handleCardClick = useCallback((index: number) => {
    // 스탬프 호출
    const card = cardData[index];
    void userStamp({
      category: '버튼',
      content: 'AiTechBlock',
      memo: `AI 카드 클릭: ${card.title[lang]}`,
    });
    
    // 카드 선택 상태 업데이트
    setSelectedCard(index);
  }, [lang]);

  const handleCardMouseDown = useCallback((index: number) => {
    setRotatedCards(prev => {
      const newSet = new Set(prev);
      newSet.add(index);
      return newSet;
    });
    // 카드 선택만 처리 (스탬프는 별도로 처리)
    setSelectedCard(index);
  }, []);

  const handleCardMouseUp = useCallback((index: number) => {
    setRotatedCards(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      return newSet;
    });
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        // Wrapper를 기준으로 마우스 위치 계산
        const wrapper = containerRef.current.closest('[data-wrapper]') as HTMLElement;
        if (wrapper) {
          const wrapperRect = wrapper.getBoundingClientRect();
          const x = e.clientX - wrapperRect.left;
          const y = e.clientY - wrapperRect.top;
          
          // 마우스가 wrapper 영역 내에 있는지 확인
          const isInside = x >= 0 && x <= wrapperRect.width && y >= 0 && y <= wrapperRect.height;
          
          if (isInside) {
            setMousePosition({ x, y });
            setIsMouseInSection(true);
          } else {
            setIsMouseInSection(false);
          }
        }
      }
    };

    // 전체 document에서 마우스 이벤트 감지
    document.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 모바일 카드 렌더링 함수
  const mobileCards = useMemo(() => {
    const cards = [];
    let cardIndex = 0;
    
    for (let row = 0; row < 3; row++) {
      // 한 행의 카드들 추가 (앱 카드 스타일)
      const rowCards = [];
      for (let col = 0; col < 3; col++) {
        if (cardIndex < cardData.length) {
          const card = cardData[cardIndex];
          const currentCardIndex = cardIndex; // 클로저 문제 방지
          
          rowCards.push(
            <MobileAppCard 
              key={`app-card-${currentCardIndex}`}
              $isSelected={selectedCard === currentCardIndex}
              onClick={() => {
                handleCardClick(currentCardIndex);
                handleCardMouseDown(currentCardIndex);
                setTimeout(() => handleCardMouseUp(currentCardIndex), 200);
              }}
            >
              {/* 앱 카드 배경 */}
              <AppCardBackground
                src={selectedCard === currentCardIndex 
                  ? "/landing/recommendation/app_card_select.svg" 
                  : "/landing/recommendation/app_card.svg"
                }
                alt="App Card Background"
                fill
              />
              
              {/* 카드 콘텐츠 */}
              <MobileAppCardContent>
                <MobileAppCardIcon
                  src={card.icon}
                  alt={card.title[lang]}
                  width={20}
                  height={20}
                />
                <MobileAppCardTitle>{card.title[lang]}</MobileAppCardTitle>
              </MobileAppCardContent>
            </MobileAppCard>
          );
          cardIndex++;
        }
      }
      
      // 카드 행 추가 (flex row로 변경)
      cards.push(
        <MobileAppCardContainer key={`app-row-${row}`}>
          {rowCards}
        </MobileAppCardContainer>
      );
      
      // 선택된 카드가 이 행에 있으면 WebImage 추가
      const selectedRow = Math.floor(selectedCard / 3);
      
      if (row === selectedRow) {
        cards.push(
          <MobileWebImageContainer key={`image-${row}-${selectedCard}`}>
            <MobileWebImage
              src={getWebImagePath(selectedCard)}
              alt={`Web Preview ${selectedCard + 1}`}
              width={280}
              height={520}
            />
          </MobileWebImageContainer>
        );
      }
    }
    
    return cards;
  }, [selectedCard, lang, handleCardClick, handleCardMouseDown, handleCardMouseUp]);

  // 데스크톱 뷰
  const desktopView = (
    <Content>
      <AiTechBlockContainer ref={containerRef}>
        {/* 왼쪽 섹션 - 웹 이미지 */}
        <LeftSection>
          <WebImage
            src={getWebImagePath(selectedCard)}
            alt={`Web Preview ${selectedCard + 1}`}
            width={375}
            height={700}
          />
        </LeftSection>

        {/* 오른쪽 섹션 - 카드 그리드 */}
        <RightSection>
          {/* 카드 그리드 */}
          <CardGrid>
            {cardData.map((card, index) => (
              <Card 
                key={card.id}
                $zIndex={9 - index}
                $isRotated={rotatedCards.has(index)}
                onMouseDown={() => {
                  handleCardClick(index);
                  handleCardMouseDown(index);
                }}
                onMouseUp={() => handleCardMouseUp(index)}
                onMouseLeave={() => handleCardMouseUp(index)}
              >
                {/* 배경 이미지 */}
                <Image
                  src="/card_container.svg"
                  alt="Card Container"
                  width={250}
                  height={220}
                  style={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    objectFit: 'contain',
                    zIndex: 0
                  }}
                />
                
                {/* 카드 콘텐츠 */}
                <CardContent>
                  <Image
                    src={card.icon}
                    alt={card.title[lang]}
                    width={24}
                    height={24}
                    style={{ 
                      objectFit: 'contain',
                      verticalAlign: 'middle',
                      display: 'block'
                    }}
                  />
                  <CardTitle>{card.title[lang]}</CardTitle>
                </CardContent>
                
                <CardDescription>{card.content[lang]}</CardDescription>
              </Card>
            ))}
          </CardGrid>
        </RightSection>
      </AiTechBlockContainer>
    </Content>
  );

  // 모바일 뷰
  const mobileView = (
    <MobileContainer>
      {mobileCards}
    </MobileContainer>
  );

  return (
    <Wrapper data-wrapper>
      <NavigatorWrapper>
        <CustomNavigator
          topLabel={topLabel}
          centerLabel={centerLabel}
          bottomLabel={bottomLabel}
          title={title}
          description={description}
          onTopArrowClick={onTopArrowClick}
          onBottomArrowClick={onBottomArrowClick}
        />
      </NavigatorWrapper>

      <ResponsiveView
        mobileView={mobileView}
        desktopView={desktopView}
      />

      {/* 마우스 추적 이미지 - 섹션 내에서만 표시 */}
      {isMouseInSection && (
        <RotatedContainer $x={mousePosition.x} $y={mousePosition.y}>
          <AnimatedImage
            src="/pointer.svg"
            alt="Pointer"
            width={340}
            height={340}
            style={{ objectFit: 'contain' }}
          />
        </RotatedContainer>
      )}
    </Wrapper>
  );
};

export default AiTechBlock;
