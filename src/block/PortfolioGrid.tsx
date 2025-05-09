'use client';

import styled from 'styled-components';
import { LandingCard } from '@/components/Landing/LandingCard';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { useState } from 'react';
import { Breakpoints } from '@/constants/layoutConstants';
import { useDevice } from '@/contexts/DeviceContext';

// 팝업 컴포넌트들...
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

  min-width: ${Breakpoints.desktop}px; /* 기본값: 데스크탑 너비 강제 유지 */

@media (max-width: ${Breakpoints.mobile}px) {
  min-width: auto; /* 모바일 이하에서 min-width 제거 */
  margin: 0 auto 10px;
}

  @media (max-width: ${Breakpoints.mobile}px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

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
  
    // 버튼 스탬프 추가
    const card = cardData[index];
    const title = (t.portfolioCards as Record<string, string>)[card.id];
    void userStamp({
      uuid: localStorage.getItem("logId") ?? "anonymous",
      category: "버튼",
      content: "Portfolio",
      memo: `포트폴리오: ${title}`,
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
          const title = (t.portfolioCards as Record<string, string>)[card.id];
          void userStamp({
            uuid: localStorage.getItem("logId") ?? "anonymous",
            category: "버튼",
            content: "Portfolio",
            memo: `포트폴리오: ${title}`,
          });
        }}// ✅ 모바일일 때 전체화면
      >
        {cardData.map((item) => item.component)}
      </PopupContainer>
    </>
  );
};