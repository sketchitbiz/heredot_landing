'use client';

import styled from 'styled-components';
import { LandingCard } from '@/components/Landing/LandingCard';
import { SectionHeader } from '@/components/Landing/SectionHeader';
import { CustomNavigator } from '@/customComponents/CustomNavigator'; // ✅ import 추가
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';

// --- props 수정 ---
interface PortfolioGridProps {
  title: string;
  description: string;
  topLabel: string;      // ✅ 추가
  centerLabel: string;   // ✅ 추가
  bottomLabel: string;   // ✅ 추가
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
  /* padding: 0px 40px 100px 40px; */
  /* TODO: 반응형 추가 예정 */
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

  return (
    <>
      {/* 🔥 CustomNavigator 추가 */}
      <CustomNavigator
        topLabel={topLabel}
        centerLabel={centerLabel}
        bottomLabel={bottomLabel}
        title={title} // ✅ title 추가
        description={description} // ✅ description 추가'
      />

      {/* <SectionHeader title={title} description={description} /> */}
      <GridContainer>
        {cardData.map((item) => (
          <LandingCard
            key={item.id}
            imageUrl={item.imageUrl}
            title={(t.portfolioCards as Record<string, string>)[item.id]}
          />
        ))}
      </GridContainer>
    </>
  );
};
