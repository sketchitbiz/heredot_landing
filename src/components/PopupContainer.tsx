'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';
import { useSwipeable } from 'react-swipeable';

interface PopupContainerProps {
  open: boolean;
  onClose: () => void;
  padding?: number;
  heightPercent?: number;
  appBarHeight?: number;
  selectedIndex: number;
  isFullScreen?: boolean;
  children: React.ReactNode | React.ReactNode[];
}

export const PopupContainer: React.FC<PopupContainerProps> = ({
  open,
  onClose,
  padding = 20,
  heightPercent = 80,
  appBarHeight = 56,
  selectedIndex,
  isFullScreen = false,
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const childArray = React.Children.toArray(children);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < childArray.length - 1 ? prev + 1 : prev));
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleNext(),
    onSwipedRight: () => handlePrev(),
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setCurrentIndex(selectedIndex);
    }
  }, [open, selectedIndex]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      // onClose();
    }
  };

  return (
    <Overlay $isFullScreen={isFullScreen} onClick={handleOverlayClick}>
      <NavZone $isOverlayed={isFullScreen} $position="left">
        <NavButton $isFullScreen={isFullScreen} onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowBackIos />
        </NavButton>
      </NavZone>

      <Popup $padding={padding} $heightPercent={heightPercent} $isFullScreen={isFullScreen}>
        <CloseButton $isFullScreen={isFullScreen} $appBarHeight={appBarHeight} onClick={onClose}>×</CloseButton>
        <Content {...swipeHandlers}>{childArray[currentIndex]}</Content>
      </Popup>

      <NavZone $isOverlayed={isFullScreen} $position="right">
        <NavButton $isFullScreen={isFullScreen} onClick={handleNext} disabled={currentIndex === childArray.length - 1}>
          <ArrowForwardIos />
        </NavButton>
      </NavZone>
    </Overlay>
  );
};

// ==========================
// Styled Components
// ==========================

const Overlay = styled.div<{ $isFullScreen?: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;

  ${({ $isFullScreen }) =>
    !$isFullScreen &&
    `
      min-width: 1200px;
    `}
`;

const NavZone = styled.div<{ $isOverlayed?: boolean; $position?: 'left' | 'right' }>`
  width: 200px;
  min-width: 200px;
  display: flex;
  justify-content: center;
  align-items: center;

  ${({ $isOverlayed, $position }) =>
    $isOverlayed &&
    `
      position: absolute;
      top: 0;
      bottom: 0;
      ${$position}: 0;
      width: 80px;
      min-width: unset;
      z-index: 10;
    `}
`;

const NavButton = styled.button<{ $isFullScreen?: boolean }>`
  background: none;
  border: none;
  color: ${({ $isFullScreen }) => ($isFullScreen ? '#ccc' : 'white')};
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 70px;
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.3);
    cursor: default;
  }
`;

const Popup = styled.div<{
  $padding: number;
  $heightPercent: number;
  $isFullScreen?: boolean;
}>`
  background: #fff;
  padding: 0;
  width: 800px;
  min-width: 800px;
  height: ${({ $isFullScreen, $heightPercent }) =>
    $isFullScreen ? '100vh' : `${$heightPercent}vh`};
  position: relative;
  border-radius: ${({ $isFullScreen }) => ($isFullScreen ? '0px' : '8px')};
  overflow: hidden;
  border: 2px solid #ccc;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  ${({ $isFullScreen }) =>
    $isFullScreen &&
    `
      width: 100vw;
      min-width: unset;
      border: none;
    `}
`;

const CloseButton = styled.button<{ $isFullScreen?: boolean; $appBarHeight?: number }>`
  position: absolute;
  top: ${({ $isFullScreen, $appBarHeight }) =>
    $isFullScreen ? `${($appBarHeight || 56) + 8}px` : '12px'};
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  z-index: 1001;

  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px;
    height: 48px;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    z-index: -1;
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
