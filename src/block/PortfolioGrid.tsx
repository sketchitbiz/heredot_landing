'use client';

import styled from 'styled-components';
import { LandingCard } from '@/components/Landing/LandingCard';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { useState } from 'react';

// 👉 여기 import 추가
import { AntiDronePopup } from '@/customComponents/AntiDronePopup';
import { ReBlingPopup } from '@/customComponents/ReBlingPopup';
import { RinguPopup } from '@/customComponents/RinguPopup';
import { TableOrderPopup } from '@/customComponents/TableOrderPopup';
import { ExitoPopup } from '@/customComponents/ExitoPopup';
import { WillChairPopup } from '@/customComponents/WillChairPopup';
import { FmgPopup } from '@/customComponents/FmgPopup';
import { LimeFoodPopup } from '@/customComponents/LimeFoodPopup';
import { LinkBPopup } from '@/customComponents/LinkBPopup';
import { RocketPopup } from '@/customComponents/RoketUpPopup';
import { PopupContainer } from '@/components/\bPopupContainer';
import { IotPopup } from '@/customComponents/IotPopup';
import { JSX } from 'react/jsx-runtime';

interface PortfolioGridProps {
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
}

const cardData = [
  { id: '1', imageUrl: "/landing/portpolio/1_anti_drone.webp" },
  { id: '2', imageUrl: "/landing/portpolio/2_ribling.webp" },
  { id: '3', imageUrl: "/landing/portpolio/3_ring9.webp" },
  { id: '4', imageUrl: "/landing/portpolio/4_table.webp" },
  { id: '5', imageUrl: "/landing/portpolio/5_exito.webp" },
  { id: '6', imageUrl: "/landing/portpolio/6_will.webp" },
  { id: '7', imageUrl: "/landing/portpolio/7_FMG.webp" },
  { id: '8', imageUrl: "/landing/portpolio/8_dongne.webp" },
  { id: '9', imageUrl: "/landing/portpolio/9_ungdda.webp" },
  { id: '10', imageUrl: "/landing/portpolio/10_roketup.webp" },
  { id: '11', imageUrl: "/landing/portpolio/11_lime.webp" },
  { id: '12', imageUrl: "/landing/portpolio/12_link.webp" },
];

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  margin-bottom: 64px;
`;

export const PortfolioGrid: React.FC<PortfolioGridProps> = ({
  title,
  description,
  topLabel,
  centerLabel,
  bottomLabel,
}) => {
  const { lang } = useLang();
  const t = dictionary[lang];

  const [popupOpen, setPopupOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0); // 🔥 추가

  const cardData = [
    { id: '1', imageUrl: "/landing/portpolio/1_anti_drone.webp" },
    { id: '2', imageUrl: "/landing/portpolio/2_ribling.webp" },
    { id: '3', imageUrl: "/landing/portpolio/3_ring9.webp" },
    { id: '4', imageUrl: "/landing/portpolio/4_table.webp" },
    { id: '5', imageUrl: "/landing/portpolio/5_exito.webp" },
    { id: '6', imageUrl: "/landing/portpolio/6_will.webp" },
    { id: '7', imageUrl: "/landing/portpolio/7_FMG.webp" },
    { id: '8', imageUrl: "/landing/portpolio/8_dongne.webp" },
    { id: '9', imageUrl: "/landing/portpolio/9_ungdda.webp" },
    { id: '10', imageUrl: "/landing/portpolio/10_roketup.webp" },
    { id: '11', imageUrl: "/landing/portpolio/11_lime.webp" },
    { id: '12', imageUrl: "/landing/portpolio/12_link.webp" },
  ];

  const popupComponents = [
    <AntiDronePopup />,
    <ReBlingPopup />,
    <RinguPopup />,
    <TableOrderPopup />,
    <ExitoPopup />,
    <WillChairPopup />,
    <FmgPopup />,
    <IotPopup />,
    <IotPopup />,
    <RocketPopup />,
    <LimeFoodPopup />,
    <LinkBPopup />,
  ];

  const handleCardClick = (card: { id: string; imageUrl: string }) => {
    const index = cardData.findIndex((item) => item.id === card.id);
    setSelectedIndex(index); // 🔥 클릭 시 index 기억
    setPopupOpen(true);
  };

  return (
    <>
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title}
        description={description}
      />

      <GridContainer>
        {cardData.map((item) => (
          <LandingCard
            key={item.id}
            imageUrl={item.imageUrl}
            title={(t.portfolioCards as Record<string, string>)[item.id]}
            onClick={() => handleCardClick(item)}
          />
        ))}
      </GridContainer>

      <PopupContainer selectedIndex={selectedIndex} open={popupOpen} onClose={() => setPopupOpen(false)}>
  {popupComponents}  {/* 🔥 바로 배열 전체 넘기기 */}
</PopupContainer>
    </>
  );
};