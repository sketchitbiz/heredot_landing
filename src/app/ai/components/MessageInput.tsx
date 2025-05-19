'use client';

import React, { useRef } from 'react';
import styled from 'styled-components';
import { Send } from '@mui/icons-material';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import IconButton from '@mui/material/IconButton';
import TextareaAutosize from 'react-textarea-autosize';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { customScrollbar } from '@/styles/commonStyles';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import FileUploadSection from './FileUploadSection';
import { FileUploadData } from '@/lib/firebase/firebase.functions';

// 스타일 컴포넌트
const MessageInputContainer = styled.div`
  padding: 1rem 2rem 4rem 2rem;
  border-top: 1px solid ${AppColors.aiBorder};
  background-color: ${AppColors.background};
  margin-top: auto;

  @media (max-width: 770px) {
    padding: 1rem 1rem 2rem 1rem; // 모바일에서는 좌우 패딩을 줄이고, 하단 패딩도 조정합니다. 요청하신 1rem 2rem 4rem 2rem은 데스크탑과 동일하여 변경 효과가 없을 수 있어, 모바일에 적합하게 수정 제안합니다.
    // 만약 정확히 1rem 2rem 4rem 2rem을 원하시면 아래 주석을 해제하고 위 라인을 주석 처리해주세요.
    // padding: 1rem 2rem 4rem 2rem;
  }
`;

const InputContainer = styled.form`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  background-color: ${AppColors.inputDisabled};
  border: 1px solid ${AppColors.aiBorder};
  border-radius: 24px;
  padding: 0.5rem 1rem;
  max-width: 48rem;
  margin: 0 auto;
`;

const AutoSizeInput = styled(TextareaAutosize)`
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${AppColors.onBackground};
  ${AppTextStyles.body2}
  resize: none; // 크기 조절 비활성화
  overflow-y: auto; // 내용 넘칠 경우 스크롤 (auto-resize와 함께 작동)
  min-height: 21px; // 최소 높이 (body2의 line-height * font-size 근사값)
  max-height: 300px; // 최대 높이 제한 (대략 10줄 = 21px * 10)
  padding-top: 0; // 내부 패딩 조정
  padding-bottom: 0;
  line-height: 1.5; // 줄 간격
  font-family: inherit; // 폰트 상속

  &::placeholder {
    color: ${AppColors.disabled};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${AppColors.disabled};
  }

  /* 스크롤바 스타일 추가 */
  ${customScrollbar({
    trackColor: '#262528', // 스크롤바 배경색
  })}
`;

const IconContainer = styled.button`
  background: ${AppColors.iconDisabled}; // backgroundDarkHover -> backgroundDark
  border-radius: 50%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${AppColors.secondary}; // AppColors.primaryDark 대신 secondary 사용
  }

  .MuiSvgIcon-root {
    color: ${AppColors.iconPrimary};
    font-size: 1.25rem;
  }
`;

const RemainingCountText = styled.p`
  ${AppTextStyles.caption1}
  color: ${AppColors.onSurfaceVariant};
  text-align: center;
  margin-top: 0.5rem;
  margin-bottom: -1rem;
  font-size: 0.8rem;
`;

interface MessageInputProps {
  promptText: string;
  setPromptText: (text: string) => void;
  handleGeminiSubmit: (
    e?: React.FormEvent | null,
    actionPrompt?: string,
    isSystemInitiatedPrompt?: boolean
  ) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isFreeFormMode: boolean;
  loading: boolean;
  uploadedFiles: FileUploadData[];
  uploadProgress: number;
  handleDeleteFile: (fileUri: string) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIconUploadClick: () => void;
  lang: 'ko' | 'en';
  remainingCount: number;
  isLoggedIn: boolean;
  isApiLimitInitialized: boolean;
}

// aiChatDictionary의 input 타입에 대한 임시 인터페이스
interface AiChatInputDictionary {
  placeholder: string;
  remainingAttempts?: (count: number) => string;
}

const MessageInput: React.FC<MessageInputProps> = ({
  promptText,
  setPromptText,
  handleGeminiSubmit,
  handleKeyDown,
  isFreeFormMode,
  loading,
  uploadedFiles,
  uploadProgress,
  handleDeleteFile,
  handleFileInputChange,
  handleIconUploadClick,
  lang,
  remainingCount,
  isLoggedIn,
  isApiLimitInitialized,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = aiChatDictionary[lang];

  const showRemainingCount =
    !isLoggedIn && isFreeFormMode && isApiLimitInitialized;

  const remainingAttemptsText =
    (t.input as AiChatInputDictionary).remainingAttempts?.(remainingCount) ??
    `오늘 남은 횟수 (비회원): ${remainingCount}회`;

  const handlePaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    console.log('[MessageInput] handlePaste triggered'); // 로그 추가
    const items = event.clipboardData?.items;
    if (!items) {
      console.log('[MessageInput] No clipboard items found.'); // 로그 추가
      return;
    }

    const filesToUpload: File[] = [];
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        if (blob) {
          const fileName =
            blob.name ||
            `pasted_image_${Date.now()}.${blob.type.split('/')[1] || 'png'}`;
          const file = new File([blob], fileName, { type: blob.type });
          filesToUpload.push(file);
          console.log('[MessageInput] Image file prepared from paste:', file); // 로그 추가
        }
      }
    }

    if (filesToUpload.length > 0) {
      console.log('[MessageInput] Files to upload from paste:', filesToUpload); // 로그 추가
      const dataTransfer = new DataTransfer();
      filesToUpload.forEach((file) => dataTransfer.items.add(file));

      const pseudoEvent = {
        target: {
          files: dataTransfer.files,
        },
      } as unknown as React.ChangeEvent<HTMLInputElement>;
      handleFileInputChange(pseudoEvent); // AiPageContent의 handleFileInputChange 호출
    } else {
      console.log('[MessageInput] No image files found in pasted items.'); // 로그 추가
    }
  };

  return (
    <MessageInputContainer>
      <FileUploadSection
        uploadedFiles={uploadedFiles}
        uploadProgress={uploadProgress}
        onDeleteFile={handleDeleteFile}
        lang={lang}
      />

      <InputContainer
        onSubmit={(e) => {
          handleGeminiSubmit(e, undefined, false);
        }}
        data-active={isFreeFormMode && !loading}
      >
        <input
          type="file"
          multiple
          accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.txt,text/plain,.hwp,application/x-hwp"
          ref={fileInputRef}
          onChange={handleFileInputChange}
          style={{ display: 'none' }}
          disabled={!isFreeFormMode || loading}
        />
        <IconButton
          onClick={handleIconUploadClick}
          size="small"
          disabled={!isFreeFormMode || loading}
          sx={{
            padding: '0.5rem',
            borderRadius: '50%',
            background: AppColors.iconDisabled,
            '&:hover': {
              backgroundColor: AppColors.disabled,
            },
          }}
        >
          <AddPhotoAlternateIcon sx={{ color: '#BBBBCF' }} />
        </IconButton>
        <AutoSizeInput
          minRows={1}
          maxRows={12}
          placeholder={t.input.placeholder}
          disabled={!isFreeFormMode || loading}
          value={promptText}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setPromptText(e.target.value)
          }
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />
        <IconContainer
          type="submit"
          disabled={
            !isFreeFormMode ||
            loading ||
            (!promptText && uploadedFiles.length === 0)
          }
        >
          <Send />
        </IconContainer>
      </InputContainer>
      {showRemainingCount && (
        <RemainingCountText>{remainingAttemptsText}</RemainingCountText>
      )}
    </MessageInputContainer>
  );
};

export default MessageInput;
