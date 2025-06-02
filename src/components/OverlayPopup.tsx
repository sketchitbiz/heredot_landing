'use client';

import React, { useEffect, useState } from "react";
import styled, { keyframes } from "styled-components";
import { AppColors } from "@/styles/colors";
import { Breakpoints } from "@/constants/layoutConstants";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;
const ModalHeader = styled.div<{ $isMobile: boolean }>`
  position: relative;
  /* background-color:red; */
  height: ${({ $isMobile }) => ($isMobile ? '40px' : '60px')};
`;

interface ModalOverlayProps {
  $isMobile: boolean;
}

const ModalOverlay = styled.div<ModalOverlayProps>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  ${({ $isMobile }) => !$isMobile && `min-width: 1200px;`}
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.4);
  /* backdrop-filter: blur(8px); */
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${fadeIn} 0.3s ease-out;
    padding: ${({ $isMobile }) => ($isMobile ? '20px' : '0')};
`;

interface ModalContentProps {
  $isMobile: boolean;
}

const ModalContent = styled.div<ModalContentProps>`
  width: ${({ $isMobile }) => ($isMobile ? '100%' : '900px')};
  background-color: ${AppColors.background || "#fff"};
  border-radius: 16px;
  border: 1px solid ${AppColors.border || "#ccc"};
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button<{ $isMobile: boolean }>`
  position: absolute;
  top: ${({ $isMobile }) => ($isMobile ? '6px' : '8px')};
  right: ${({ $isMobile }) => ($isMobile ? '6px' : '8px')};
  background: #fff;
  color: #000;
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface OverlayPopupProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export const OverlayPopup: React.FC<OverlayPopupProps> = ({ isOpen, onClose, children }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  if (!isOpen) return null;

  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // prevent bubbling
    onClose();
  };

  return (
    <ModalOverlay $isMobile={isMobile}>
      <ModalContent
        $isMobile={isMobile}
        onClick={(e) => e.stopPropagation()} // prevent ModalContent click from closing the popup
      >
        <ModalHeader $isMobile={isMobile}>
          <CloseButton $isMobile={isMobile} onClick={handleCloseClick}>
            ✕
          </CloseButton>
        </ModalHeader>
        {children}
      </ModalContent>
    </ModalOverlay>
  );
};