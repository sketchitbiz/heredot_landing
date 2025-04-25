import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import LanguageSwitcher from './LanguageSwitcher';

interface LandingAppBarProps {
  logoSrc: string; // 로고 이미지 경로
  logoWidth?: string; // 로고 너비 (nullable)
  logoHeight?: string; // 로고 높이 (nullable)
  navLinks: { label: string; onClick: () => void }[]; // 네비게이션 링크 배열
  appBarHeight?: string; // AppBar 높이 (nullable)
  appBarPadding?: string; // AppBar 패딩 (nullable)
  hoverColor?: string; // 네비게이션 링크 hover 색상 (nullable)
  isShowLanguageSwitcher?: boolean; // 언어 스위처 표시 여부 (nullable)
}

const AppBar = styled.nav<{ height?: string; padding?: string }>`
  position: sticky;
  top: 0;
  left: 0;
  width: 100%;
  height: ${({ height }) => height || '80px'}; /* 기본값: 80px */
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ padding }) => padding || '0 18px'}; /* 기본값: 0 18px */
  z-index: 1000;
`;

const Logo = styled.img<{ width?: string; height?: string }>`
  width: ${({ width }) => width || 'auto'}; /* 기본값: auto */
  height: ${({ height }) => height || '40px'}; /* 기본값: 40px */
  cursor: pointer;
`;

const NavLinks = styled.div`
  display: flex;
  gap: 20px;
`;

const NavLink = styled.button<{ hoverColor?: string }>`
  background: none;
  border: none;
  font-size: ${AppTextStyles.label3.fontSize};
  font-weight: ${AppTextStyles.label3.fontWeight};
  line-height: ${AppTextStyles.label3.lineHeight};
  color: ${AppColors.onBackground};
  cursor: pointer;

  &:hover {
    color: ${({ hoverColor }) => hoverColor || AppColors.hoverText}; /* 기본값: AppColors.hoverText */
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
  return (
    <AppBar height={appBarHeight} padding={appBarPadding}>
      <Logo src={logoSrc} alt="Logo" width={logoWidth} height={logoHeight} />
      <NavLinks>
  {/* Nav 버튼 */}
  {navLinks.map((link, index) => (
    <NavLink key={index} onClick={link.onClick} hoverColor={hoverColor}>
      {link.label}
    </NavLink>
  ))}

  {/* 언어 스위처는 따로 배치 */}
  {isShowLanguageSwitcher && (
    <div style={{ marginLeft: '20px' }}>
      <LanguageSwitcher />
    </div>
  )}
</NavLinks>

    </AppBar>
  );
};

export default LandingAppBar;