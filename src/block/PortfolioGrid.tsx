'use client';

import styled from 'styled-components';
import { LandingCard } from '@/components/Landing/LandingCard';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { useState } from 'react';
import { Breakpoints } from '@/constants/layoutConstants';
import { useDevice } from '@/contexts/DeviceContext';
import { AntiDronePopup } from '@/customComponents/AntiDronePopup';
import { ReBlingPopup } from '@/customComponents/ReBlingPopup';
import { RinguPopup } from '@/customComponents/RinguPopup';
import { TableOrderPopup } from '@/customComponents/TableOrderPopup';
import { ExitoPopup } from '@/customComponents/ExitoPopup';
import { WillChairPopup } from '@/customComponents/WillChairPopup';
import { FmgPopup } from '@/customComponents/FmgPopup';
import { DongNePopup } from '@/customComponents/DongNePopup';
import { IotPopup } from '@/customComponents/IotPopup';
import { RocketPopup } from '@/customComponents/RoketUpPopup';
import { LimeFoodPopup } from '@/customComponents/LimeFoodPopup';
import { LinkBPopup } from '@/customComponents/LinkBPopup';
import { PopupContainer } from '@/components/PopupContainer';
import { userStamp } from '@/lib/api/user/api';

interface PortfolioGridProps {
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
  onTopArrowClick?: () => void;
  onBottomArrowClick?: () => void;
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin: 0 auto 64px;
  padding: 0 20px;

  min-width: ${Breakpoints.desktop}px;

  @media (max-width: ${Breakpoints.mobile}px) {
    min-width: auto;
    margin: 0 auto 10px;
  }

  @media (max-width: ${Breakpoints.mobile}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

// 언어에 따라 subtitle을 매핑하는 객체
const subtitles = {
  ko: {
    '1': '기업 맞춤 솔루션 개발',
    '2': '모바일 플랫폼 + AI 챗봇 개발',
    '3': '결제 플랫폼 개발',
    '4': 'IoT 서비스 개발',
    '5': '크롤링 기반 웹사이트 구축',
    '6': '네이버 지도 기반 모바일 앱 개발',
    '7': '골퍼 구독 결제 모바일 앱 개발',
    '8': 'GPS 기반 동네 소셜 앱 개발',
    '9': 'BLE 기반 앱 개발',
    '10': '서비스 PR 랜딩 홈페이지 개발',
    '11': '식자재 전산(ERP) 시스템 구축',
    '12': 'IoT 솔루션 개발',
  },
  en: {
    '1': 'Custom Corporate Solution Development',
    '2': 'Mobile Platform + AI Chatbot Development',
    '3': 'Payment Platform Development',
    '4': 'IoT Service Development',
    '5': 'Crawling-based Website Construction',
    '6': 'Naver Map-based Mobile App Development',
    '7': 'Golfer Subscription Payment Mobile App Development',
    '8': 'GPS-based Neighborhood Social App Development',
    '9': 'BLE-based App Development',
    '10': 'Service PR Landing Page Development',
    '11': 'Ingredient Ordering ERP System Construction',
    '12': 'IoT Solution Development',
  },
};

const cardData = [
  { id: '1', imageUrl: '/antidrone.webp', component: <AntiDronePopup /> },
  { id: '2', imageUrl: '/landing/portpolio/2_ribling.webp', component: <ReBlingPopup /> },
  { id: '3', imageUrl: '/landing/portpolio/3_ring9.webp', component: <RinguPopup /> },
  { id: '4', imageUrl: '/landing/portpolio/4_table.webp', component: <TableOrderPopup /> },
  { id: '5', imageUrl: '/landing/portpolio/5_exito.webp', component: <ExitoPopup /> },
  { id: '6', imageUrl: '/landing/portpolio/6_will.webp', component: <WillChairPopup /> },
  { id: '7', imageUrl: '/landing/portpolio/7_FMG.webp', component: <FmgPopup /> },
  { id: '8', imageUrl: '/landing/portpolio/8_dongne.webp', component: <DongNePopup /> },
  { id: '9', imageUrl: '/landing/portpolio/9_ungdda.webp', component: <IotPopup /> },
  { id: '10', imageUrl: '/landing/portpolio/10_roketup.webp', component: <RocketPopup /> },
  { id: '11', imageUrl: '/landing/portpolio/11_lime.webp', component: <LimeFoodPopup /> },
  { id: '12', imageUrl: '/landing/portpolio/12_link.webp', component: <LinkBPopup /> },
];

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  title,
  description,
  topLabel,
  centerLabel,
  bottomLabel,
  onTopArrowClick,
  onBottomArrowClick,
}) => {
  const { lang } = useLang();
  const t = dictionary[lang];
  const device = useDevice();
  const isFullScreen = device === 'mobile';

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
    setPopupOpen(true);
    const card = cardData[index];
    const cardTitle = (t.portfolioCards as Record<string, string>)[card.id];
    void userStamp({
      category: '버튼',
      content: 'Portfolio',
      memo: `포트폴리오: ${cardTitle}`,
    });
  };

  return (
    <>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
        onTopArrowClick={onTopArrowClick}
        onBottomArrowClick={onBottomArrowClick}
      />

      <GridContainer>
        {cardData.map((item, index) => (
          <LandingCard
            key={item.id}
            imageUrl={item.imageUrl}
            title={(t.portfolioCards as Record<string, string>)[item.id]}
            subtitle={subtitles[lang][item.id as keyof typeof subtitles['ko']]} // ✅ 언어에 맞는 subtitle을 동적으로 전달
            onClick={() => handleCardClick(index)}
          />
        ))}
      </GridContainer>

      <PopupContainer
        selectedIndex={selectedIndex}
        open={popupOpen}
        onClose={() => setPopupOpen(false)}
        isFullScreen={isFullScreen}
        onChangeIndex={(index) => {
          const card = cardData[index];
          const cardTitle = (t.portfolioCards as Record<string, string>)[card.id];
          void userStamp({
            category: '버튼',
            content: 'Portfolio',
            memo: `포트폴리오: ${cardTitle}`,
          });
        }}
      >
        {cardData.map((item) => item.component)}
      </PopupContainer>
    </>
  );
};