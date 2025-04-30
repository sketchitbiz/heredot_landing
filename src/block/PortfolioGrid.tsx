'use client';

import styled from 'styled-components';
import { LandingCard } from '@/components/Landing/LandingCard';
import { CustomNavigator } from '@/customComponents/CustomNavigator';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { useState } from 'react';

// 팝업 컴포넌트 import
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

interface PortfolioGridProps {
  title: string;
  description: string;
  topLabel: string;
  centerLabel: string;
  bottomLabel: string;
}

const cardData = [
  {
    id: '1',
    imageUrl: '/landing/portpolio/1_anti_drone.webp',
    component: <AntiDronePopup />,
  },
  {
    id: '2',
    imageUrl: '/landing/portpolio/2_ribling.webp',
    component: <ReBlingPopup />,
  },
  {
    id: '3',
    imageUrl: '/landing/portpolio/3_ring9.webp',
    component: <RinguPopup />,
  },
  {
    id: '4',
    imageUrl: '/landing/portpolio/4_table.webp',
    component: <TableOrderPopup />,
  },
  {
    id: '5',
    imageUrl: '/landing/portpolio/5_exito.webp',
    component: <ExitoPopup />,
  },
  {
    id: '6',
    imageUrl: '/landing/portpolio/6_will.webp',
    component: <WillChairPopup />,
  },
  {
    id: '7',
    imageUrl: '/landing/portpolio/7_FMG.webp',
    component: <FmgPopup />,
  },
  {
    id: '8',
    imageUrl: '/landing/portpolio/8_dongne.webp',
    component: <DongNePopup />,
  },
  {
    id: '9',
    imageUrl: '/landing/portpolio/9_ungdda.webp',
    component: <IotPopup />,
  },
  {
    id: '10',
    imageUrl: '/landing/portpolio/10_roketup.webp',
    component: <RocketPopup />,
  },
  {
    id: '11',
    imageUrl: '/landing/portpolio/11_lime.webp',
    component: <LimeFoodPopup />,
  },
  {
    id: '12',
    imageUrl: '/landing/portpolio/12_link.webp',
    component: <LinkBPopup />,
  },
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
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleCardClick = (index: number) => {
    setSelectedIndex(index);
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
      >
        {cardData.map((item) => item.component)}
      </PopupContainer>
    </>
  );
};
