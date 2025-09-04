'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AiChatContextType {
  isOpen: boolean;
  toggleChat: () => void;
  openChat: () => void;
  closeChat: () => void;
}

const AiChatContext = createContext<AiChatContextType | undefined>(undefined);

export const useAiChat = () => {
  const context = useContext(AiChatContext);
  if (context === undefined) {
    throw new Error('useAiChat must be used within an AiChatProvider');
  }
  return context;
};

interface AiChatProviderProps {
  children: ReactNode;
}

export const AiChatProvider: React.FC<AiChatProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleChat = () => {
    setIsOpen(prev => !prev);
  };

  const openChat = () => {
    setIsOpen(true);
  };

  const closeChat = () => {
    setIsOpen(false);
  };

  return (
    <AiChatContext.Provider value={{ isOpen, toggleChat, openChat, closeChat }}>
      {children}
    </AiChatContext.Provider>
  );
};
