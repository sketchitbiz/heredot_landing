'use client';

import React from 'react';
import styled from 'styled-components';

type CmsPopupProps = {
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

const PopupContent = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  padding-top: 64px; /* 닫기 버튼 높이 확보 */

  /* 스크롤바 숨김 */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE 10+ */
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari */
  }
`;

const CmsPopup: React.FC<CmsPopupProps> = ({ children, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <Overlay>
      <PopupContainer>
        <CloseButton onClick={onClose} aria-label="닫기">
          ×
        </CloseButton>
        <PopupContent>{children}</PopupContent>
      </PopupContainer>
    </Overlay>
  );
};

export default CmsPopup;
