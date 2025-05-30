'use client';

import React, { useState } from 'react';
import styled from 'styled-components';
import ResponsiveView from '@/layout/ResponsiveView';
import CustomSidebar, { MenuItemConfig } from './CustomSidebar';
import { MenuIcon } from 'lucide-react';
import { AppColors } from '@/styles/colors';

interface ResponsiveSidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  menuItems: MenuItemConfig[];
  footerIcon: React.ReactElement;
  onFooterClick: () => void;
  children: React.ReactNode;
  onMobileSidebarOpenChange?: (isOpen: boolean) => void;
}

const ResponsiveSidebar: React.FC<ResponsiveSidebarProps> = ({
  isCollapsed,
  toggleSidebar,
  menuItems,
  footerIcon,
  onFooterClick,
  children,
  onMobileSidebarOpenChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMobileSidebar = (next: boolean) => {
    setIsOpen(next);
    onMobileSidebarOpenChange?.(next);
  };

  return (
    <ResponsiveView
      desktopView={
        <CustomSidebar
          isCollapsed={isCollapsed}
          toggleSidebar={toggleSidebar}
          menuItems={menuItems}
          footerIcon={footerIcon}
          onFooterClick={onFooterClick}
        >
          {children}
        </CustomSidebar>
      }
      mobileView={
        <>
          <MobileToggleButton onClick={() => toggleMobileSidebar(true)}>
            <MenuIcon size={24} />
          </MobileToggleButton>

          {isOpen && (
            <>
              <SidebarOverlay onClick={() => toggleMobileSidebar(false)} />
              <MobileSidebarContainer>
                <CustomSidebar
                  isCollapsed={false}
                  toggleSidebar={() => toggleMobileSidebar(false)}
                  menuItems={menuItems}
                  footerIcon={footerIcon}
                  onFooterClick={onFooterClick}
                >
                  {children}
                </CustomSidebar>
              </MobileSidebarContainer>
            </>
          )}
        </>
      }
    />
  );
};

export default ResponsiveSidebar;

// --- Styled Components ---

const MobileToggleButton = styled.button`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%; /* ✅ 화면 너비 100% */
  height: 56px; /* ✅ 원하는 높이 */
  z-index: 1101;
  background-color: #2c2e3c;
  border: none;
  color: white;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start; /* 아이콘은 왼쪽 정렬 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  &:hover {
    opacity: 0.8;
  }
`;


const SidebarOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  z-index: 1100;
`;

const MobileSidebarContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 250px;
  height: 100vh;
  z-index: 1101;
  background-color: #2c2e3c;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  transform: translateX(-100%);
  animation: slideIn 0.3s ease-out forwards;

  @keyframes slideIn {
    to {
      transform: translateX(0);
    }
  }
`;
