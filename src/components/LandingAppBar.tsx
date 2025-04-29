'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { Breakpoints } from '@/constants/layoutConstants';
import LanguageSwitcher from './LanguageSwitcher';

interface LandingAppBarProps {
  logoSrc: string;
  logoWidth?: string;
  logoHeight?: string;
  navLinks: { label: string; targetId: string }[]; // ✅ onClick → targetId로 변경
  appBarHeight?: string;
  appBarPadding?: string;
  hoverColor?: string;
  isShowLanguageSwitcher?: boolean;
}

const AppBar = styled.nav<{ height?: string; padding?: string }>`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height || '80px'};
  background-color: ${AppColors.background};
  display: flex;
  justify-content: center;
  padding: ${({ padding }) => padding || '0 18px'};
  z-index: 1000;
`;

const ContentWrapper = styled.div`
  width: 100%;
  max-width: ${Breakpoints.desktop}px;
  min-width: ${Breakpoints.desktop}px; /* ✅ 추가: 최소 사이즈 고정 */
  display: flex;
  align-items: center;
  justify-content: space-between;
`;


const Logo = styled.img<{ width?: string; height?: string }>`
  width: ${({ width }) => width || 'auto'};
  height: ${({ height }) => height || '40px'};
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NavLink = styled.button<{ hoverColor?: string }>`
  ${AppTextStyles.label3};
  background: none;
  border: none;
  color: ${AppColors.onBackground};
  cursor: pointer;

  &:hover {
    color: ${({ hoverColor }) => hoverColor || AppColors.hoverText};
  }
`;

const LandingAppBar: React.FC<LandingAppBarProps> = ({
  logoSrc,
  logoWidth,
  logoHeight,
  navLinks,
  appBarHeight,
  appBarPadding,
  hoverColor,
  isShowLanguageSwitcher,
}) => {
  const handleScrollTo = (targetId: string) => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <AppBar height={appBarHeight} padding={appBarPadding}>
      <ContentWrapper>
        <Logo src={logoSrc} alt="Logo" width={logoWidth} height={logoHeight} />
        <NavLinks>
          {navLinks.map((link, index) => (
            <NavLink
              key={index}
              onClick={() => handleScrollTo(link.targetId)}
              hoverColor={hoverColor}
            >
              {link.label}
            </NavLink>
          ))}
          {isShowLanguageSwitcher && (
            <div style={{ marginLeft: '20px' }}>
              <LanguageSwitcher />
            </div>
          )}
        </NavLinks>
      </ContentWrapper>
    </AppBar>
  );
};

export default LandingAppBar;
