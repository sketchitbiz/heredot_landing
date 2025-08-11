'use client';

import React, { useMemo, useState } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { AppColors } from '@/styles/colors';
import WidgetHeader from '@/components/Aigo/WidgetHeader'
import WidgetFooter from '@/components/Aigo/WidgetFooter'
import { useThemeStore } from '@/store/themeStore'
import { lightTheme, darkTheme } from '@/styles/theme'
import AiEstimatePage from '@/app/ai-esti/page'
import AiEstimateLayout from '@/app/ai-esti/layout'
import ConsultationPage from '@/components/Aigo/consultation/page'
import MyEstimatePage from '@/components/Aigo/my-estimate/page'
import SettingsPage from '@/components/Aigo/setting/page'
import { ToastProvider } from '@/components/Aigo/ToastProvider'

type TabKey = 'consult' | 'myEstimate' | 'settings' | 'aiEstimate';

export default function AiGoWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>('consult');
  const { isDarkMode } = useThemeStore();

  const titleByTab = useMemo(
    () => ({
      consult: '견적상담',
      myEstimate: '나의견적',
      settings: '설정',
    }),
    []
  );

  return (
    <>
      {!isOpen && (
        <LauncherButton
          aria-label="Open chat"
          onClick={() => setIsOpen(true)}
        >
          <LauncherInner>
            <BubbleIcon>💬</BubbleIcon>
          </LauncherInner>
        </LauncherButton>
      )}

      {isOpen && (
        <PanelWrapper role="dialog" aria-modal="true" aria-label="AiGo widget panel">
          <ThemeProvider theme={isDarkMode ? darkTheme : lightTheme}>
            <ToastProvider>
            {activeTab !== 'aiEstimate' && <WidgetHeader />}
            <PanelBody>
              {activeTab === 'consult' && <ConsultationPage onStartEstimate={() => setActiveTab('aiEstimate')} />}
              {activeTab === 'myEstimate' && <MyEstimatePage />}
              {activeTab === 'settings' && <SettingsPage />}
              {activeTab === 'aiEstimate' && (
                <AiEstimateLayout onBack={() => setActiveTab('consult')} embedded>
                  <AiEstimatePage embedMobile />
                </AiEstimateLayout>
              )}
            </PanelBody>
            {activeTab !== 'aiEstimate' && (
              <WidgetFooter activeTab={activeTab} onChangeTab={setActiveTab} />
            )}
            </ToastProvider>
          </ThemeProvider>

        </PanelWrapper>
      )}
    </>
  );
}

const Z_INDEX = 3000;

const LauncherButton = styled.button`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  padding: 0;
  background: linear-gradient(135deg, ${AppColors.primary} 0%, ${AppColors.secondary} 100%);
  color: #ffffff;
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.2);
  cursor: pointer;
  z-index: ${Z_INDEX};
`;

const LauncherInner = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const BubbleIcon = styled.span`
  font-size: 28px;
  line-height: 1;
`;

const PanelWrapper = styled.section`
  position: fixed;
  right: 18px;
  bottom: 24px;
  width: min(92vw, 420px);
  height: min(96vh, 860px);
  background: ${AppColors.surface};
  border-radius: 0px;
  border: 1px solid ${AppColors.border};
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 18px 48px rgba(0, 0, 0, 0.3);
  z-index: ${Z_INDEX};
`;

const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 12px 12px 16px;
  background: ${AppColors.background};
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
`;

const PanelTitle = styled.h2`
  font-size: 16px;
  font-weight: 600;
  margin: 0;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const MinimizeButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: ${AppColors.onSurface};

  &:hover {
    background: rgba(0, 0, 0, 0.06);
  }
`;

const PanelBody = styled.main`
  flex: 1;
  background: ${AppColors.surface};
  overflow: auto;
`;

const PlaceholderCenter = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  color: ${AppColors.onSurfaceVariant};

  h3 {
    margin: 0;
    font-size: 18px;
    color: ${AppColors.onSurface};
  }
  p {
    margin: 0;
    font-size: 14px;
  }
`;

const TabBar = styled.nav`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  height: 56px;
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: ${AppColors.background};
`;

const TabButton = styled.button<{ $active: boolean }>`
  appearance: none;
  border: none;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 13px;
  color: ${({ $active }) => ($active ? AppColors.primary : AppColors.onSurfaceVariant)};
  font-weight: ${({ $active }) => ($active ? 600 : 500)};

  &:hover {
    background: rgba(0, 0, 0, 0.04);
  }
`;


