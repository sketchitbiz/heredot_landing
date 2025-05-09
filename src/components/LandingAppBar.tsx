'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import LanguageSwitcher from './LanguageSwitcher';
import ResponsiveView from '@/layout/ResponsiveView';
import MenuIcon from '@mui/icons-material/Menu';
import MobileMenuOverlay from './MobileMenuOverlay';
import { Breakpoints } from '@/constants/layoutConstants';

interface LandingAppBarProps {
  logoSrc: string;
  logoWidth?: string;
  logoHeight?: string;
  navLinks: { label: string; targetId: string; content: string; memo: string }[];
  onNavigate: (targetId: string, content: string, memo: string) => void;
  appBarHeight?: string;
  appBarPadding?: string;
  hoverColor?: string;
  isShowLanguageSwitcher?: boolean;
}

const AppBar = styled.nav<{ height?: string; padding?: string }>`
  position: sticky;
  top: 0;
  left: 0;
  min-width: ${Breakpoints.desktop}px;  
  background-color: ${AppColors.background};
  justify-content: center;
  z-index: 1000;
  padding: ${({ padding }) => padding || '0 20px'};
`;

const MobileAppBarWrapper = styled.nav`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  background-color: ${AppColors.background};
  z-index: 1000;
  box-sizing: border-box;
`;

const ContentWrapper = styled.div`
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

const MobileMenuButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: ${AppColors.onBackground};
`;

const MobileAppBar = ({
  logoSrc,
  navLinks,
  hoverColor,
  isShowLanguageSwitcher,
  onNavigate,
}: LandingAppBarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollTo = (targetId: string, content: string, memo: string) => {
    if (onNavigate) {
      onNavigate(targetId, content, memo);
    }
    setMenuOpen(false);
  };

  return (
    <>
      <MobileAppBarWrapper>
        <ContentWrapper>
          <Logo src={logoSrc} alt="Logo" width="84px" height="32px" />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            {isShowLanguageSwitcher && <LanguageSwitcher />}
            <MobileMenuButton onClick={() => setMenuOpen(true)}>
              <MenuIcon />
            </MobileMenuButton>
          </div>
        </ContentWrapper>
      </MobileAppBarWrapper>

      {menuOpen && (
        <MobileMenuOverlay
          navLinks={navLinks}
          onClose={() => setMenuOpen(false)}
          onNavigate={handleScrollTo}
        />
      )}
    </>
  );
};

const DesktopAppBar = ({
  logoSrc,
  logoWidth,
  logoHeight,
  navLinks,
  appBarHeight,
  appBarPadding,
  hoverColor,
  isShowLanguageSwitcher,
  onNavigate,
}: LandingAppBarProps) => {
  const handleScrollTo = (targetId: string, content: string, memo: string) => {
    if (onNavigate) {
      onNavigate(targetId, content, memo);
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
              onClick={() => handleScrollTo(link.targetId, link.content, link.memo)}
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

const LandingAppBar: React.FC<LandingAppBarProps> = (props) => {
  return (
    <ResponsiveView
      mobileView={<MobileAppBar {...props} />}
      desktopView={<DesktopAppBar {...props} />}
    />
  );
};

export default LandingAppBar;