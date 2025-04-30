'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { ArrowBackIos, ArrowForwardIos } from '@mui/icons-material';

interface PopupContainerProps {
  open: boolean;
  onClose: () => void;
  padding?: number;
  heightPercent?: number;
  appBarHeight?: number;
  selectedIndex: number;
  children: React.ReactNode | React.ReactNode[];
}

export const PopupContainer: React.FC<PopupContainerProps> = ({
  open,
  onClose,
  padding = 20,
  heightPercent = 80,
  selectedIndex,
  children,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const childArray = React.Children.toArray(children);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    //  클릭 시 팝업 닫기
    if (e.target === e.currentTarget) {
      // onClose();
    }
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < childArray.length - 1 ? prev + 1 : prev));
  };

  return (
    <Overlay onClick={handleOverlayClick} >
      <NavZone>
        <NavButton onClick={handlePrev} disabled={currentIndex === 0}>
          <ArrowBackIos />
        </NavButton>
      </NavZone>

      <Popup $padding={padding} $heightPercent={heightPercent}>
        <CloseButton onClick={onClose}>×</CloseButton>
        <Content>{childArray[currentIndex]}</Content>
      </Popup>

      <NavZone>
        <NavButton onClick={handleNext} disabled={currentIndex === childArray.length - 1}>
          <ArrowForwardIos />
        </NavButton>
      </NavZone>
    </Overlay>
  );
};

// ==========================
// Styled Components
// ==========================

const Overlay = styled.div`
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

  /* ✅ 최소 1200px 이상 유지 */
  min-width: 1200px;
`;

const NavZone = styled.div`
  width: 200px;
  min-width: 200px; /* 고정 크기 유지 */
  display: flex;
  justify-content: center;
  align-items: center;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 70px; // 🔥 아이콘 자체 키움
  }

  &:disabled {
    color: rgba(255, 255, 255, 0.3);
    cursor: default;
  }
`;

const Popup = styled.div<{
  $padding: number;
  $heightPercent: number;
}>`
  background: #fff;
  padding: 0;
  width: 800px;
  min-width: 800px;
  height: ${({ $heightPercent }) => $heightPercent}vh;
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #ccc;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;

  /* ✅ 부모 최소 크기 확보 */
  min-width: 800px;
`;


const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 24px;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
  z-index: 10; /* CloseButton을 항상 위에 표시 */

  /* 원형 배경 추가 */
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 48px; /* 원형의 크기 */
    height: 48px;
    background: rgba(0, 0, 0, 0.1); /* 반투명 검정 배경 */
    border-radius: 50%; /* 원형으로 만들기 */
    z-index: -1; /* 버튼 뒤로 배치 */
  }
`;

const Content = styled.div`
  flex: 1;
  overflow-y: auto;
  position: relative; /* CloseButton과의 z-index 충돌 방지 */
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;
