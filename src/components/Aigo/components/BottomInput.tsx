"use client";

import React, { useState, useRef, useEffect } from 'react';
import styled, { useTheme } from 'styled-components';
import Icon from './Icon';
import TextareaAutosize from 'react-textarea-autosize';
import { customScrollbar } from '@/styles/commonStyles';

const InputWrapper = styled.div<{ $embedded?: boolean }>`
  position: ${({ $embedded }) => ($embedded ? 'sticky' : 'fixed')};
  bottom: 0;
  ${({ $embedded }) => ($embedded ? '' : 'left: 0; right: 0;')}
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.body};
  border-top: 1px solid ${({ theme }) => theme.border};
  z-index: 1000;
  width: 100%;
  ${({ $embedded }) => ($embedded ? '' : `
    @media (min-width: 1024px) {
      padding: 12px 16px;
      max-width: 100vw;
      left: 50%;
      transform: translateX(-50%);
    }
  `)}
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: ${({ theme }) => theme.body};
  border-radius: 50px;
  border: 1px solid ${({ theme }) => theme.border};
  width: 100%;
  min-height: 56px;
  transition: min-height 0.2s ease-in-out;
  

  @media (min-width: 1024px) {
    max-width: 1024px;
    margin: 0 auto;
  }

`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 0;
  background: none;
  border: none;
  cursor: pointer;
  flex-shrink: 0;
  
  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.textarea`
  flex: 1;
  border: none;
  background: none;
  font-size: 14px;
  color: ${({ theme }) => theme.text};
  outline: none;
  padding: 8px 0;
  resize: none;
  min-height: 24px;
  line-height: 24px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: ${({ theme }) => `${theme.border} transparent`};

  &::placeholder {
    color: ${({ theme }) => theme.subtleText};
    white-space: pre-line;
  }

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${({ theme }) => theme.border};
    border-radius: 3px;
  }
`;


const AutoSizeInput = styled(TextareaAutosize)`
  flex: 1;
  display:flex;
  justify-content:center;
  align-items:center;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${({ theme }) => theme.text};
  resize: none; // 크기 조절 비활성화
  overflow-y: auto; // 내용 넘칠 경우 스크롤 (auto-resize와 함께 작동)
  min-height: 21px; // 최소 높이 (body2의 line-height * font-size 근사값)
  max-height: 300px; // 최대 높이 제한 (대략 10줄 = 21px * 10)
  padding-top: 0; // 내부 패딩 조정
  padding-bottom: 0;
  line-height: 1.5; // 줄 간격
  font-family: inherit; // 폰트 상속


  &::placeholder {
    color: ${({ theme }) => theme.subtleText};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.subtleText};
  }



  /* 스크롤바 스타일 추가 */
   ${customScrollbar({
     trackColor: '#262528', // 스크롤바 배경색
  })

}
`;

interface BottomInputProps {
  placeholder?: string;
  onSubmit?: (value: string) => void;
  embedded?: boolean;
}

const BottomInput: React.FC<BottomInputProps> = ({
  placeholder = "서비스 종류와 주요 기능, 예상 기간/예산을 입력! \ n예시: '온라인 쇼핑몰, 결제/배송/회원가입",
  onSubmit,
  embedded = false,
}) => {
  const [value, setValue] = useState('');
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const theme = useTheme();
  const isLightTheme = theme.body === '#FFFFFF';

  useEffect(() => {
    const handleResize = () => {
      if (document.activeElement === inputRef.current) {
        const visualViewport = window.visualViewport;
        if (visualViewport) {
          const isKeyboard = visualViewport.height < window.innerHeight;
          setIsKeyboardVisible(isKeyboard);
        }
      }
    };

    window.visualViewport?.addEventListener('resize', handleResize);
    return () => window.visualViewport?.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = () => {
    if (value.trim() && onSubmit) {
      onSubmit(value.trim());
      setValue('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <InputWrapper 
      $embedded={embedded}
      style={{ 
        bottom: embedded ? 0 : (isKeyboardVisible ? (window.visualViewport?.height as number) - window.innerHeight : 0)
      }}
    >
      <InputContainer>
        <IconButton type="button">
          <Icon 
            src={isLightTheme ? "/ai-estimate/add_image.png" : "/ai-estimate/add_image_dark.png"} 
            width={36}
            height={36} 
          />
        </IconButton>
                  {/* <Input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder={placeholder}
            rows={1}
          /> */}
           <AutoSizeInput
          minRows={1}
          maxRows={12}
          placeholder={placeholder}
          // disabled={!isFreeFormMode || loading}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit();
            }
          }}
          // onKeyDown={handleKeyDown}
          // onPaste={handlePaste}
        />
        <IconButton type="button" onClick={handleSubmit}>
          <Icon 
            src={isLightTheme ? "/ai-estimate/enter.png" : "/ai-estimate/enter_dark.png"} 
            width={36} 
            height={36} 
          />
        </IconButton>
      </InputContainer>
    </InputWrapper>
  );
};

export default BottomInput;