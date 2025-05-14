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
  padding: 2rem 2rem;
  border-top: 1px solid ${AppColors.border};
  background-color: ${AppColors.background};
  margin-top: auto;
`;

const InputContainer = styled.form`
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 0.5rem;
  background-color: ${AppColors.inputDisabled};
  border: 1px solid ${AppColors.border};
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

interface MessageInputProps {
  promptText: string;
  setPromptText: (text: string) => void;
  handleGeminiSubmit: (e?: React.FormEvent | null) => void;
  handleKeyDown: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  isFreeFormMode: boolean;
  loading: boolean;
  uploadedFiles: FileUploadData[];
  uploadProgress: number;
  handleDeleteFile: (fileUri: string) => void;
  handleFileInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIconUploadClick: () => void;
  lang: 'ko' | 'en';
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
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const t = aiChatDictionary[lang];

  return (
    <MessageInputContainer>
      <FileUploadSection
        uploadedFiles={uploadedFiles}
        uploadProgress={uploadProgress}
        onDeleteFile={handleDeleteFile}
        lang={lang}
      />

      <InputContainer
        onSubmit={handleGeminiSubmit}
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
    </MessageInputContainer>
  );
};

export default MessageInput;
