'use client';

import React from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors'; // 이 줄 반드시 존재해야 색상 사용 가능

type CmsPopupProps = {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const PopupContainer = styled.div`
  position: relative;
  width: 800px;
  height: 85vh;
  background: white;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
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
  padding-right: 48px; /* CloseButton 영역 고려 */
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

const CmsPopup: React.FC<CmsPopupProps> = ({ title, children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <PopupContainer>
        <CloseButton onClick={onClose} aria-label="닫기">×</CloseButton>
        <HeaderRow>
          <span>{title}</span>
          <RequiredMark>*필수값</RequiredMark>
        </HeaderRow>
        <PopupContent>{children}</PopupContent>
      </PopupContainer>
    </Overlay>
  );
};

export default CmsPopup;
