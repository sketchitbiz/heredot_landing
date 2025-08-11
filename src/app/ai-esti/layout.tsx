// src/app/ai-estimate/layout.tsx
"use client";

import React, { useState, ReactNode } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { lightTheme, darkTheme } from '../../styles/theme';
import Icon from '@/components/Aigo/components/Icon';
import BottomInput from '@/components/Aigo/components/BottomInput';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${({ theme }) => theme.body};
    color: ${({ theme }) => theme.text};
    transition: all 0.25s linear;
  }
`;

const LayoutWrapper = styled.div<{ $embedded?: boolean }>`
  padding-top: ${({ $embedded }) => ($embedded ? '0' : '80px')};
  // padding-bottom: ${({ $embedded }) => ($embedded ? '0' : 'calc(76px + env(safe-area-inset-bottom))')};
  min-height: ${({ $embedded }) => ($embedded ? '100%' : 'calc(100vh - 80px)')};
  background-color: ${({ theme }) => theme.body};
`;

const TopNav = styled.nav<{ $embedded?: boolean }>`
  position: ${({ $embedded }) => ($embedded ? 'sticky' : 'fixed')};
  top: 0;
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.body};
  border-bottom: 1px solid ${({ theme }) => theme.border};
  z-index: 100;
  

  .left-icons, .right-icons {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    padding: 0;
    border-radius: 8px;

    &:hover {
      background-color: ${({ theme }) => `${theme.accent}1A`};
    }
  }
`;

const ThemeToggleButton = styled.button`
  position: fixed;
  bottom: 80px;
  right: 20px;
  padding: 10px 15px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.border};
  background-color: ${({ theme }) => theme.surface1};
  color: ${({ theme }) => theme.text};
  cursor: pointer;
  font-weight: bold;
  z-index: 1000;
  
  &:hover {
    opacity: 0.8;
  }
`;

interface AiEstimateLayoutProps {
  children: ReactNode;
  inputPlaceholder?: string;
  onInputSubmit?: (value: string) => void;
  onBack?: () => void;
  embedded?: boolean;
}

interface ChildWithThemeProps {
  toggleTheme?: () => void;
  themeMode?: 'light' | 'dark';
}

export default function AiEstimateLayout({ children, inputPlaceholder, onInputSubmit, onBack, embedded = false }: AiEstimateLayoutProps) {
  const [themeMode, setThemeMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setThemeMode(themeMode === 'light' ? 'dark' : 'light');
  };
  
  const currentTheme = themeMode === 'light' ? lightTheme : darkTheme;

  const isLightTheme = themeMode === 'light';
  const icons = {
    back: '/ai-estimate/arrow_back.png',
    share: isLightTheme ? '/ai-estimate/share.png' : '/ai-estimate/share_dark.png',
    new: isLightTheme ? '/ai-estimate/new.png' : '/ai-estimate/new_dark.png',
    estimate: isLightTheme ? '/ai-estimate/esti.png' : '/ai-estimate/esti_dark.png',
    profile: isLightTheme ? '/ai-estimate/profile.png' : '/ai-estimate/profile_dark.png',
  };

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <LayoutWrapper $embedded={embedded}>
        <TopNav $embedded={embedded}>
          <div className="left-icons">
            <button className="icon" aria-label="back" onClick={onBack}>
              <Icon src={icons.back} width={24} height={24} />
            </button>
          </div>
          <div className="right-icons">
             <span className="icon"><Icon src={icons.share} width={36} height={36} /></span>
             <span className="icon"><Icon src={icons.new} width={36} height={36} /></span>
             <span className="icon"><Icon src={icons.estimate} width={36} height={36} /></span>
             <span className="icon"><Icon src={icons.profile} width={36} height={36} /></span>
          </div>
        </TopNav>
        
        {React.Children.map(children, child => {
          if (React.isValidElement<ChildWithThemeProps>(child)) {
            return React.cloneElement(child, { toggleTheme, themeMode });
          }
          return child;
        })}

        <ThemeToggleButton onClick={toggleTheme}>
          {themeMode === 'light' ? '🌙' : '☀️'}
        </ThemeToggleButton>
        <BottomInput 
          placeholder={inputPlaceholder} 
          onSubmit={onInputSubmit}
          embedded
        />
      </LayoutWrapper>
    </ThemeProvider>
  );
}
