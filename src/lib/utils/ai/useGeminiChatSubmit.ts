// src/lib/utils/ai/useGeminiChatSubmit.ts
import { useCallback } from 'react';
import { Part, FileData } from '@google/generative-ai';
import { ChatSession, GenerativeModel } from 'firebase/vertexai'; // GenerativeModel은 이제 사용하지 않음
import { devLog } from '@/lib/utils/devLogger';
import { useChatStream } from './useChatStream';
import { parseInvoiceData } from './invoiceParser';
import { Message, InvoiceDataType } from '@/components/Ai/AiChatMessage'; // AiChatMessage에서 Message와 InvoiceDataType 임포트
import { FileUploadData } from '@/lib/firebase/firebase.functions';
import { ChatMessagePayload } from '@/types/chat';
import useCreateChatMessage from '@/hooks/chat/useCreateChatMessage';
import { useApiLimit } from '@/hooks/useApiLimit';

// UseGeminiChatSubmitProps 인터페이스 수정: model 제거
export interface UseGeminiChatSubmitProps {
  chat: React.MutableRefObject<ChatSession | null>; 
  isInitialized: boolean; // useAI에서 AI 세션 전체의 초기화 상태를 나타냄
  promptText: string;
  setPromptText: (text: string) => void;
  uploadedFiles: FileUploadData[];
  setUploadedFiles: (files: FileUploadData[]) => void;
  setUploadProgress: (progress: number) => void;
  setLoading: (loading: boolean) => void;
  loading: boolean; 

  setError: (error: string) => void;
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  chatEndRef: React.RefObject<HTMLDivElement>;
  isLoggedIn: boolean;
  openLoginModal: () => void;
  isLimitInitialized: boolean;
  remainingCount: number;
  isFreeFormMode: boolean;
  selections: { [stepId: string]: string[] };
  stepData: any[]; // 구체적인 타입으로 대체하는 것이 좋음
  invoiceDetails: any; // 구체적인 타입으로 대체하는 것이 좋음 (InvoiceDetailsType 같은)
  setInvoiceDetails: (data: any) => void;
  isFirstApiUserMessageSent: boolean;
  setIsFirstApiUserMessageSent: (value: boolean) => void;
  currentSessionIndexFromStore: number | null;
  t: any; // 번역 함수/객체
  messages: Message[]; // 현재 메시지 배열 (useCallback 의존성으로 사용)
}

export const useGeminiChatSubmit = (props: UseGeminiChatSubmitProps) => {
  const {
    chat,
    // model, // ⭐⭐⭐ 여기서 model을 비구조화 할당하지 않습니다. ⭐⭐⭐
    isInitialized,
    promptText,
    setPromptText,
    uploadedFiles,
    setUploadedFiles,
    setUploadProgress,
    setLoading,
    loading,
    setError,
    setMessages,
    chatEndRef,
    isLoggedIn,
    openLoginModal,
    isLimitInitialized,
    remainingCount,
    isFreeFormMode,
    selections,
    stepData,
    invoiceDetails,
    setInvoiceDetails,
    isFirstApiUserMessageSent,
    setIsFirstApiUserMessageSent,
    currentSessionIndexFromStore,
    t,
    messages,
  } = props;

  const { processStream } = useChatStream();
  const { createChatMessage } = useCreateChatMessage();
  const { decreaseCount } = useApiLimit();

  const handleGeminiSubmit = useCallback(
    async (
      e?: React.FormEvent | null,
      actionPrompt?: string,
      isSystemInitiatedPrompt?: boolean
    ) => {
      e?.preventDefault();

      if (!isLoggedIn && isLimitInitialized && remainingCount <= 0) {
        openLoginModal();
        return;
      }

      const submissionPrompt = actionPrompt || promptText;
      if ((!submissionPrompt && uploadedFiles.length === 0) || loading) {
        return;
      }
      if (!isFreeFormMode) {
        return;
      }

      if (!isLoggedIn && isLimitInitialized) {
        const canProceed = decreaseCount();
        if (!canProceed) {
          openLoginModal();
          return;
        }
      }

      setLoading(true);
      setError('');

      // ⭐⭐⭐ 이곳의 `!model` 검사를 제거합니다. ⭐⭐⭐
      // `chat.current`만 유효한지 검사하면 됩니다.
      if (!chat.current) {
        console.warn('[handleGeminiSubmit] 채팅 세션이 아직 준비되지 않았습니다. 전송을 중단합니다.');
        setError('AI 기능이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.');
        setLoading(false);
        return; // 여기서 함수 실행을 중단합니다.
      }

      let userMessageTextForUi = submissionPrompt;
      let userMessageImageUrl: string | undefined = undefined;
      let userMessageFileType: string | undefined = undefined;

      const currentFiles = [...uploadedFiles];

      if (currentFiles.length > 0) {
        userMessageTextForUi += `\n\n(첨부 파일: ${currentFiles
          .map((f) => f.name)
          .join(', ')})`;
        const firstImageFile = currentFiles.find((file) =>
          file.mimeType.startsWith('image/')
        );
        if (firstImageFile) {
          userMessageImageUrl = firstImageFile.fileUri;
          userMessageFileType = firstImageFile.mimeType;
        } else if (currentFiles.length > 0) {
          userMessageFileType = currentFiles[0].mimeType;
        }
      }

      const userMessageForUi: Message = {
        id: Date.now(),
        sender: 'user',
        text: userMessageTextForUi,
        imageUrl: userMessageImageUrl,
        fileType: userMessageFileType,
      };

      const aiMessageId = Date.now() + 1;
      const initialAiMessage: Message = {
        id: aiMessageId,
        sender: 'ai',
        text: '',
        invoiceData: undefined,
      };

      const messagesToAdd = [initialAiMessage];
      if (!isSystemInitiatedPrompt) {
        messagesToAdd.unshift(userMessageForUi);
      }

      setMessages((prev) => [...prev, ...messagesToAdd]);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

      if (!actionPrompt && !isSystemInitiatedPrompt) {
        setPromptText('');
      }
      setUploadedFiles([]);
      setUploadProgress(0);

      setInvoiceDetails(null);

      try {
        let sessionIndexForApiCall: number | null =
          currentSessionIndexFromStore;

        if (isLoggedIn) {
          const userApiPayload: ChatMessagePayload = {
            role: 'USER',
            ...(sessionIndexForApiCall !== null && {
              sessionIndex: sessionIndexForApiCall,
            }),
            content: {
              message: submissionPrompt,
              files: currentFiles.map((f) => ({
                name: f.name,
                uri: f.fileUri,
                mimeType: f.mimeType,
              })),
            },
            title:
              isFirstApiUserMessageSent ||
              messages.filter((m) => m.sender === 'user').length > 0
                ? undefined
                : '새로운 채팅',
          };

          devLog(
            '[useGeminiChatSubmit] Sending user message to custom API:',
            userApiPayload
          );
          const apiResponse = await createChatMessage(userApiPayload);

          if (
            apiResponse &&
            apiResponse.chatSession &&
            apiResponse.chatSession.index !== undefined
          ) {
            sessionIndexForApiCall = apiResponse.chatSession.index;
          } else if (
            isFirstApiUserMessageSent === false &&
            messages.filter((m) => m.sender === 'user').length === 0 &&
            sessionIndexForApiCall === null
          ) {
            console.error(
              '[useGeminiChatSubmit] Failed to create new session or get session index from API response on first message.'
            );
            setError(
              '세션 생성에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.'
            );
            setLoading(false);
            setMessages((prev) =>
              prev.filter(
                (msg) =>
                  msg.id !== userMessageForUi.id && msg.id !== aiMessageId
              )
            );
            return;
          }
          if (!isFirstApiUserMessageSent) {
            setIsFirstApiUserMessageSent(true);
          }
        } else if (!isLoggedIn) {
          devLog(
            '[useGeminiChatSubmit] Skipping user message API call for non-logged-in user.'
          );
        }

        if (
          isLoggedIn &&
          sessionIndexForApiCall !== null &&
          sessionIndexForApiCall !== undefined &&
          !actionPrompt &&
          !isSystemInitiatedPrompt &&
          messages.filter((m) => m.sender === 'user').length === 0
        ) {
          if (submissionPrompt.trim()) {
            localStorage.setItem(
              `firstUserMessageFor_${sessionIndexForApiCall}`,
              submissionPrompt
            );
            localStorage.setItem(
              'updateQuoteTitleFor',
              sessionIndexForApiCall.toString()
            );
            devLog(
              `[useGeminiChatSubmit] First user message for session ${sessionIndexForApiCall} saved to localStorage:`,
              submissionPrompt
            );
          }
        }

        const parts: Part[] = [];
        let selectionSummary = '';
        Object.entries(selections).forEach(([stepId, selectedOptions]) => {
          const stepInfo = stepData.find((step) => step.id === stepId);
          const stepTitle = stepInfo ? stepInfo.selectionTitle : stepId;
          if (selectedOptions && selectedOptions.length > 0) {
            const selectedLabels = selectedOptions.map((optionId) => {
              const option = stepInfo?.options.find(
                (opt) => opt.id === optionId
              );
              return option ? option.label : optionId;
            });
            selectionSummary += `- ${stepTitle}: ${selectedLabels.join(
              ', '
            )}\n`;
          }
        });
        selectionSummary += '\n';
        if (selectionSummary.trim()) parts.push({ text: selectionSummary });

        if (
          invoiceDetails &&
          invoiceDetails.items &&
          invoiceDetails.items.length > 0
        ) {
          let currentInvoiceStateText =
            '현재 사용자가 보고 있는 견적서 상태입니다. 일부 항목은 사용자에 의해 삭제 처리되었을 수 있습니다 (isDeleted: true로 표시됨):\n';
          currentInvoiceStateText += `현재 총액: ${invoiceDetails.currentTotal}, 총 기간: ${invoiceDetails.currentTotalDuration}일, 총 페이지: ${invoiceDetails.currentTotalPages}페이지\n`;
          parts.push({ text: currentInvoiceStateText });
        }

        if (submissionPrompt) parts.push({ text: submissionPrompt });

        currentFiles.forEach((file) => {
          parts.push({
            fileData: {
              mimeType: file.mimeType,
              fileUri: file.fileUri,
            } as FileData,
          });
        });

        // ⭐⭐⭐ chat.current만 검사합니다. ⭐⭐⭐
        if (!chat.current) {
          console.error(
            '[useGeminiChatSubmit] Chat session is not initialized. Waiting for initialization...'
          );
          let retryCount = 0;
          const maxRetries = 10;
          const waitForInitialization = async (): Promise<boolean> => {
            if (chat.current) return true;
            if (retryCount >= maxRetries) return false;
            await new Promise((resolve) => setTimeout(resolve, 500));
            retryCount++;
            return waitForInitialization();
          };
          const initialized = await waitForInitialization();
          if (!initialized || !chat.current) {
            throw new Error(
              'AI 채팅 세션이 초기화되지 않았습니다. 페이지를 새로고침한 후 다시 시도해주세요.'
            );
          }
        }

        const streamResult = await chat.current.sendMessageStream(parts);
        devLog('[useGeminiChatSubmit] Calling processStream for AI response.');

        const { accumulatedText, finalParsedInvoiceData, finalNaturalText } =
          await processStream(streamResult, {
            aiMessageId,
            setMessages,
            chatEndRef,
            setInvoiceDetails,
          });

        const dataForBackendApi = finalParsedInvoiceData;
        const textForBackendApi = finalNaturalText;

        // --- AI 응답을 백엔드 API로 전송 ---
        if (isLoggedIn && textForBackendApi.trim()) {
          if (
            sessionIndexForApiCall === null ||
            sessionIndexForApiCall === undefined
          ) {
            console.error(
              '[useGeminiChatSubmit] No valid session index found for sending AI response to API. (loggedIn but no session after initial message)'
            );
            setLoading(false);
          }
          try {
            const aiApiPayload: ChatMessagePayload = {
              role: 'AI',
              sessionIndex: sessionIndexForApiCall,
              content: {
                message: textForBackendApi,
                ...(dataForBackendApi && { invoiceData: dataForBackendApi }),
              },
            };
            devLog(
              '[useGeminiChatSubmit] Sending AI response to custom API:',
              aiApiPayload
            );
            await createChatMessage(aiApiPayload);
          } catch (apiCallError) {
            console.error(
              'Failed to send AI response to custom API:',
              apiCallError
            );
          }
        } else if (!isLoggedIn) {
          devLog(
            '[useGeminiChatSubmit] Skipping AI response API call for non-logged-in user.'
          );
        }

        decreaseCount();
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : '알 수 없는 오류가 발생했습니다.';
        setError(errorMessage);
        console.error("❌ Error in useGeminiChatSubmit's main try block:", err);
        setMessages((prevMessages: Message[]) => {
          const lastAiMessage = prevMessages.findLast(
            (m) => m.id === aiMessageId && m.sender === 'ai'
          );
          if (lastAiMessage) {
            return prevMessages.map((msg) =>
              msg.id === aiMessageId
                ? {
                    ...msg,
                    text: `${msg.text}\n오류: ${errorMessage}`,
                    invoiceData: undefined,
                  }
                : msg
            );
          }
          return [
            ...prevMessages,
            {
              id: aiMessageId,
              sender: 'ai',
              text: `오류: ${errorMessage}`,
              invoiceData: undefined,
            },
          ];
        });
        setInvoiceDetails(null);
      } finally {
        setLoading(false);
      }
    },
    [
      chat,
      // model, // ⭐⭐⭐ 여기에서도 model을 제거합니다. ⭐⭐⭐
      isInitialized,
      promptText,
      setPromptText,
      uploadedFiles,
      setUploadedFiles,
      setUploadProgress,
      setLoading,
      loading,
      setError,
      setMessages,
      chatEndRef,
      isLoggedIn,
      openLoginModal,
      isLimitInitialized,
      remainingCount,
      isFreeFormMode,
      selections,
      stepData,
      invoiceDetails,
      setInvoiceDetails,
      isFirstApiUserMessageSent,
      setIsFirstApiUserMessageSent,
      currentSessionIndexFromStore,
      t,
      messages,
      processStream,
      createChatMessage,
      decreaseCount,
    ]
  );

  return { handleGeminiSubmit };
};