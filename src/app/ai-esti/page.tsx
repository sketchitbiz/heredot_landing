// src/app/ai-estimate/page.tsx
"use client";

import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';
import { IoChevronDown, IoChevronUp } from 'react-icons/io5';
import { useEstimateStore } from '../../store/estimateStore';
import { mockEstimateData } from './mockData';
import AiConsultantHeader from '@/components/Aigo/components/AiConsultantHeader';
import EstimateCard from '@/components/Aigo/components/EstimateCard';
import PeriodSlider from '@/components/Aigo/components/PeriodSlider';
import EstimateAccordion from '@/components/Aigo/components/EstimateAccordion';
import DetailModal from '@/components/Aigo/components/DetailModal';
import EstimateActionButtons from '@/components/Aigo/components/EstimateActionButtons';

const PageWrapper = styled.div`
  background-color: ${({ theme }) => theme.body};
  max-width: 1200px;
  min-height:90vh;
  margin: 0px auto;
  padding: 12px 20px;
`;

const AnimatedContainer = styled.div<{ $isvisible: boolean }>`
  display: grid;
  grid-template-rows: ${({ $isvisible }) => ($isvisible ? '1fr' : '0fr')};
  transition: grid-template-rows 0.5s ease-in-out;
  overflow: hidden;

  > * {
    min-height: 0;
  }
`;

const DetailsToggle = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 10px;
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 160%; 
  letter-spacing: 0.28px;
  color: ${({ theme }) => theme.subtleText};
  cursor: pointer;
  margin: -20px 0 20px;
`;

const DetailsToggleIcon = styled.div`
  margin-top: 4px;
  margin-left: 10px;
`;

const TopSection = styled.div<{ $embedMobile?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 20px;

  ${({ $embedMobile }) =>
    !$embedMobile &&
    css`
      @media (min-width: 1024px) {
        flex-direction: row;
        align-items: flex-start;
        gap: 24px;
      }
    `}
`;

const MainContent = styled.div<{ $embedMobile?: boolean }>`
  flex: 1;
  width: 100%;

  ${({ $embedMobile }) =>
    !$embedMobile &&
    css`
      @media (min-width: 1024px) {
        max-width: 800px;
      }
    `}
`;

const SideContent = styled.div<{ $embedMobile?: boolean }>`
  width: 100%;

  ${({ $embedMobile }) =>
    !$embedMobile &&
    css`
      @media (min-width: 1024px) {
        width: 320px;
        position: sticky;
        top: 120px;
      }
    `}
`;

type ClickItem = {
  name: string;
  price: string;
  description: string;
};

interface AiEstimatePageProps {
  toggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
  embedMobile?: boolean;
}

const AiEstimatePage: React.FC<AiEstimatePageProps> = ({ embedMobile }) => {
  const [isDetailsVisible, setIsDetailsVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<ClickItem | null>(null);

  const { 
    projectEstimate, 
    projectPeriod, 
    setProjectEstimate, 
    setProjectPeriod 
  } = useEstimateStore();

  useEffect(() => {
    setProjectEstimate(mockEstimateData);
  }, [setProjectEstimate]);

  const handleItemClick = (item: ClickItem) => {
    setSelectedItem(item);
  };

  const handleCloseModal = () => {
    setSelectedItem(null);
  };

  return (
      <PageWrapper>
        <AiConsultantHeader />
        
        {projectEstimate && (
          <>
            <TopSection $embedMobile={embedMobile}>
              <MainContent $embedMobile={embedMobile}>
                <EstimateCard estimate={projectEstimate} />
                <DetailsToggle onClick={() => setIsDetailsVisible(!isDetailsVisible)}>
                  상세견적 보기 {isDetailsVisible ? <DetailsToggleIcon><IoChevronUp size={24}/></DetailsToggleIcon> : <DetailsToggleIcon><IoChevronDown size={24}/></DetailsToggleIcon>
                }
                </DetailsToggle>
                <PeriodSlider value={projectPeriod} onChange={setProjectPeriod} />

                <AnimatedContainer $isvisible={isDetailsVisible}>
                  <EstimateAccordion data={projectEstimate} onItemClick={handleItemClick} />
                </AnimatedContainer>
              </MainContent>
              <SideContent $embedMobile={embedMobile}>
                <EstimateActionButtons 
                  embedMobile={embedMobile}
                  onConsult={() => console.log('문의하기')}
                  onAiEstimate={() => console.log('AI 예산 줄이기')}
                  onAiOptimize={() => console.log('AI 맞춤 추천')}
                />
              </SideContent>
            </TopSection>
          </>
        )}
      
      {selectedItem && <DetailModal item={selectedItem} onClose={handleCloseModal} />}
        </PageWrapper>
  );
};

export default AiEstimatePage;
