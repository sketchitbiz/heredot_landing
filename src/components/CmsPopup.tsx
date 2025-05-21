'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';

type CmsPopupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  isWide?: boolean;
  showRequiredMark?: boolean;
};

const Overlay = styled.div<{ $scrollX: number }>`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  min-width: 1200px;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  overflow-x: auto;
  overflow-y: auto;
  padding: 40px 0;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  transform: translateX(${({ $scrollX }) => -$scrollX}px);
`;

const PopupContainer = styled.div<{ $isWide?: boolean }>`
  position: relative;
  width: ${({ $isWide }) => ($isWide ? '1200px' : '800px')};
  min-width: 1200px;
  height: 85vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  font-size: 24px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  z-index: 10;

  &:hover {
    color: #000;
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 50%;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  padding-right: 48px;
  font-size: 20px;
  font-weight: 600;
  color: #000;
`;

const RequiredMark = styled.span`
  font-size: 14px;
  font-weight: 500;
  color: ${AppColors.error};
`;

const PopupContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-top: 0;

  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
`;

const CmsPopup: React.FC<CmsPopupProps> = ({
  title,
  children,
  isOpen,
  onClose,
  isWide,
  showRequiredMark = false,
}) => {
  const [scrollX, setScrollX] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollX(window.scrollX || window.pageXOffset);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!isOpen) return null;

  return (
    <Overlay $scrollX={scrollX}>
      <PopupContainer $isWide={isWide}>
        <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>
        <HeaderRow>
          <span>{title}</span>
          {showRequiredMark && <RequiredMark>*필수값</RequiredMark>}
        </HeaderRow>
        <PopupContent>{children}</PopupContent>
      </PopupContainer>
    </Overlay>
  );
};

export default CmsPopup;
