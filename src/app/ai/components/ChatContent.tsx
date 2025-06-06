'use client';

import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { customScrollbar } from '@/styles/commonStyles';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import {
  Message,
  AiChatMessage,
  InvoiceDataType,
  InvoiceFeatureItem,
} from '@/components/Ai/AiChatMessage';
import { AiChatQuestion, QuestionOption } from '@/components/Ai/AiChatQuestion';
import FreeFormGuide from './FreeFormGuide';
import AnimatedLoader from './AnimatedLoader';

// 스타일 컴포넌트
const ChatContentContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  flex: 1; // 메시지 영역이 남은 공간 차지
  padding: 1rem 1rem; // 패딩 조정
  display: flex;
  flex-direction: column;
  align-items: center; // 가로 중앙 정렬
  /* justify-content: center; // 세로 중앙 정렬 제거 (위에서부터 시작) */
  height: ${(props) =>
    props.$isNarrowScreen
      ? 'calc(100vh - 100px - 60px)' // 모바일: 헤더(60px) 제외, MessageInput(100px) 고려
      : 'calc(100vh - 100px)'}; // 데스크톱: MessageInput(100px) 고려
  ${customScrollbar()}// customScrollbar 적용 (인자 없이 호출)
`;

const ChatMessagesContainer = styled.div`
  width: 100%;
  max-width: 64rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StatusMessage = styled.div`
  width: 100%;
  max-width: 48rem;
  text-align: center;
  padding: 1rem;
  color: ${AppColors.onSurfaceVariant};

  &.error {
    color: ${AppColors.error};
  }
`;

const FlexContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  display: flex;
  width: 100%;
  flex-direction: ${(props) => (props.$isNarrowScreen ? 'column' : 'column')};
  align-items: ${(props) => (props.$isNarrowScreen ? 'center' : 'flex-start')};
`;

const ProfileContainer = styled.div<{ $isNarrowScreen?: boolean }>`
  display: flex;
  align-items: center;
  // margin-bottom: ${(props) => (props.$isNarrowScreen ? '0' : '0')};
  width: ${(props) => (props.$isNarrowScreen ? '100%' : '100%')};
  justify-content: flex-start; // 항상 왼쪽 정렬
`;

const ProfileImage = styled.img<{ $isNarrowScreen?: boolean }>`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1rem; /* 항상 오른쪽 여백 유지 */
`;

const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0; /* 마진 제거 */
`;

const DragDropOverlay = styled.div`
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 255, 0.1);
  border: 2px dashed ${AppColors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  /* color: ${AppColors.primary}; */
  color: #ffffff;
  pointer-events: none; /* Prevent interference */
  z-index: 10;
`;

interface InvoiceDetailsInterface {
  parsedJson?: InvoiceDataType;
  items: Array<InvoiceFeatureItem & { isDeleted: boolean }>;
  currentTotal: number;
  currentTotalDuration: number;
  currentTotalPages: number;
}

interface CurrentStepDataInterface {
  id: string;
  title: string;
  subtitle: string;
  selectionTitle: string;
  options: QuestionOption[];
  gridColumns: number;
  selectionMode: 'single' | 'multiple';
  showWebAppComponent?: boolean;
  infoText?: string;
}

interface ChatContentProps {
  isNarrowScreen: boolean;
  isFreeFormMode: boolean;
  currentStepData: CurrentStepDataInterface | null;
  initialSelection: string[];
  isDragging: boolean;
  messages: Message[];
  loading: boolean;
  error: string;
  invoiceDetails: InvoiceDetailsInterface | null;

  handleGeminiSubmit: (
    e?: React.FormEvent | null,
    actionPrompt?: string,
    isSystemInitiatedPrompt?: boolean
  ) => void;
  handleActionClick: (action: string, data?: { featureId?: string }) => void;
  handleNext: (selectedIds: string[]) => void;
  handlePrevious: () => void;
  handleDropFiles: (e: React.DragEvent<HTMLElement>) => void;
  handleDragOver: (e: React.DragEvent<HTMLElement>) => void;
  handleDragLeave: (e: React.DragEvent<HTMLElement>) => void;
  lang: 'ko' | 'en';
  onAddMessage: (message: Message) => void;
}

// Helper function to validate and cast gridColumns
const getValidGridColumns = (
  columns: number | undefined
): 1 | 2 | 3 | 4 | 5 => {
  const defaultColumns = 3;
  if (typeof columns !== 'number') return defaultColumns;
  if (columns >= 1 && columns <= 5) return columns as 1 | 2 | 3 | 4 | 5;
  return defaultColumns; // Return a default if out of range
};

const ChatContent: React.FC<ChatContentProps> = ({
  isNarrowScreen,
  isFreeFormMode,
  currentStepData,
  initialSelection,
  isDragging,
  messages,
  loading,
  error,
  invoiceDetails,
  handleGeminiSubmit,
  handleActionClick,
  handleNext,
  handlePrevious,
  handleDropFiles,
  handleDragOver,
  handleDragLeave,
  lang,
  onAddMessage,
}) => {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const t = aiChatDictionary[lang];

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <ChatContentContainer
      $isNarrowScreen={isNarrowScreen}
      onDrop={handleDropFiles}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {isDragging && <DragDropOverlay>{t.dragDrop}</DragDropOverlay>}

      <ChatMessagesContainer>
        {isFreeFormMode && (
          <FlexContainer $isNarrowScreen={isNarrowScreen}>
            <FreeFormGuide
              isNarrowScreen={isNarrowScreen}
              lang={lang}
              handleGeminiSubmit={handleGeminiSubmit}
              onAddMessage={onAddMessage} 
            />
          </FlexContainer>
        )}

        {!isFreeFormMode && currentStepData && (
          <FlexContainer $isNarrowScreen={isNarrowScreen}>
            {isNarrowScreen ? (
              <>
                <ProfileContainer $isNarrowScreen={isNarrowScreen}>
                  <ProfileImage
                    $isNarrowScreen={isNarrowScreen}
                    src="/ai/pretty.png"
                    alt="AI 프로필"
                  />
                  <ProfileName>
                    <strong>{currentStepData.title}</strong>
                  </ProfileName>
                </ProfileContainer>
                <AiChatQuestion
                  {...currentStepData}
                  gridColumns={getValidGridColumns(currentStepData.gridColumns)}
                  initialSelection={initialSelection}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </>
            ) : (
              <>
                <ProfileContainer $isNarrowScreen={isNarrowScreen}>
                  <ProfileImage
                    $isNarrowScreen={isNarrowScreen}
                    src="/ai/pretty.png"
                    alt="AI 프로필"
                  />
                  <ProfileName>
                    <strong>{currentStepData.title}</strong>
                  </ProfileName>
                </ProfileContainer>
                <AiChatQuestion
                  {...currentStepData}
                  gridColumns={getValidGridColumns(currentStepData.gridColumns)}
                  initialSelection={initialSelection}
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </>
            )}
          </FlexContainer>
        )}

        {messages.map((msg) => (
          <AiChatMessage
            key={msg.id}
            {...msg}
            lang={lang}
            onActionClick={handleActionClick}
            calculatedTotalAmount={invoiceDetails?.currentTotal}
            calculatedTotalDuration={invoiceDetails?.currentTotalDuration}
            calculatedTotalPages={invoiceDetails?.currentTotalPages}
            currentItems={invoiceDetails?.items}
          />
        ))}

        {loading && <AnimatedLoader />}
        {error && !loading && (
          <StatusMessage className="error">
            {t.status.error} {error}
          </StatusMessage>
        )}

        <div ref={chatEndRef} />
      </ChatMessagesContainer>
    </ChatContentContainer>
  );
};

export default ChatContent;
