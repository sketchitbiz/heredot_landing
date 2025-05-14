'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { useState, useEffect, useRef } from 'react';
import { AiProgressBar } from '@/components/Ai/AiProgressBar';
import { customScrollbar } from '@/styles/commonStyles';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Message, InvoiceDataType } from '@/components/Ai/AiChatMessage';
import useAI from '@/hooks/useAI';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { FileUploadData, uploadFiles } from '@/lib/firebase/firebase.functions';
import { Part, FileData } from 'firebase/vertexai';
import { SocialLoginModal } from './SocialLoginModal';
import authStore, { AuthState } from '@/store/authStore';
import AdditionalInfoModal from './AdditionalInfoModal';

// 컴포넌트 임포트
import { getStepData, ChatDictionary } from './components/StepData';
import MessageInput from './components/MessageInput';
import ChatContent from './components/ChatContent';

// 견적서 상세 정보 상태 인터페이스 정의 수정
interface InvoiceDetails {
  parsedJson?: InvoiceDataType;
  items: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >;
  currentTotal: number;
  currentTotalDuration: number; // 총 예상 기간 (일 단위 숫자)
  currentTotalPages: number; // 총 예상 페이지 수 (숫자)
}

// --- 스타일 컴포넌트 ---
const Container = styled.div<{ $isNarrowScreen?: boolean }>`
  display: flex;
  width: 100%;
  min-height: ${(props) =>
    props.$isNarrowScreen ? 'calc(100vh - 60px)' : '100vh'};
  background-color: ${AppColors.background};
  color: ${AppColors.onBackground};
  ${customScrollbar()}
`;

const MainContent = styled.div<{ $isNarrowScreen?: boolean }>`
  flex: 4;
  display: flex;
  flex-direction: column;
  height: ${(props) =>
    props.$isNarrowScreen ? 'calc(100vh - 60px)' : '100vh'};
  max-width: 1920px;
  margin: 0 auto;
  overflow: hidden;
`;

const ChatContainer = styled.div`
  flex: 1;
  display: flex;
  width: 100%;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
`;

// 헤더 스타일
const Header = styled.div`
  padding: 1rem 2rem;
  border-bottom: 1px solid ${AppColors.border};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h1`
  color: ${AppColors.onBackground};
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const HeaderControls = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
`;

// 컴포넌트 이름을 AiPageContent로 변경
export default function AiPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // 언어 설정 가져오기
  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;
  t.lang = lang; // 언어 설정 추가

  // 현재 언어에 맞는 stepData 생성
  const stepData = getStepData(t);

  const { chat } = useAI();

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isFreeFormMode, setIsFreeFormMode] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // --- File Upload State ---
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  // 견적서 상태 추가
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );

  // authStore에서 모달 상태 및 액션 가져오기
  const isLoginModalOpen = authStore(
    (state: AuthState) => state.isLoginModalOpen
  );
  const closeLoginModal = authStore(
    (state: AuthState) => state.closeLoginModal
  );
  const login = authStore((state: AuthState) => state.login);
  const openAdditionalInfoModal = authStore(
    (state: AuthState) => state.openAdditionalInfoModal
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  // 로컬 스토리지에서 로그인 데이터 확인
  useEffect(() => {
    try {
      const loginDataStr = localStorage.getItem('loginData');
      if (loginDataStr) {
        console.log('로컬 스토리지에서 로그인 데이터 발견');
        const loginData = JSON.parse(loginDataStr);

        // 로그인 데이터 처리
        if (Array.isArray(loginData) && loginData.length > 0) {
          const result = loginData[0];
          if (
            result.statusCode === 200 &&
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            const userData = result.data[0];

            // Zustand 스토어에 로그인 정보 저장
            login(userData);

            // cellphone 값이 없는 경우에만 추가 정보 입력 모달 표시
            if (!userData.cellphone) {
              console.log('전화번호 정보가 없어 추가 정보 모달 표시');
              openAdditionalInfoModal();
            } else {
              console.log('전화번호 정보가 이미 존재함');
            }

            // 처리 후 로컬 스토리지에서 삭제
            localStorage.removeItem('loginData');
            console.log('로그인 처리 완료 및 로컬 스토리지 데이터 삭제');
          }
        }
      }
    } catch (error) {
      console.error('로그인 데이터 처리 오류:', error);
    }
  }, [login, openAdditionalInfoModal]);

  // URL 파라미터 -> 상태 동기화 Effect
  useEffect(() => {
    const stepParam = searchParams.get('step');
    const selectionsParam = searchParams.get('selections');
    const modeParam = searchParams.get('mode');

    let step = 0;
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      if (
        !isNaN(parsedStep) &&
        parsedStep >= 0 &&
        parsedStep < stepData.length
      ) {
        step = parsedStep;
      }
    }

    let sels = {};
    if (selectionsParam) {
      try {
        sels = JSON.parse(selectionsParam);
      } catch (error) {
        console.error('Error parsing selections from URL:', error);
      }
    }

    const freeForm = modeParam === 'freeform';

    setCurrentStep(step);
    setSelections(sels);
    setIsFreeFormMode(freeForm);
  }, [searchParams, stepData.length]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const currentStepData = !isFreeFormMode ? stepData[currentStep] : null;
  const progressSteps = stepData.map((step) => step.progress);
  const initialSelection = currentStepData
    ? selections[currentStepData.id] || []
    : [];

  const updateUrlParams = (
    newParams: Record<string, string | number | undefined>
  ) => {
    const currentParams = new URLSearchParams(searchParams.toString());
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === undefined || value === null) {
        currentParams.delete(key);
      } else {
        currentParams.set(key, String(value));
      }
    });
    router.push(`${pathname}?${currentParams.toString()}`);
  };

  const handleNext = (selectedIds: string[]) => {
    if (!currentStepData) return;
    const updatedSelections = {
      ...selections,
      [currentStepData.id]: selectedIds,
    };
    const selectionsString = JSON.stringify(updatedSelections);
    if (currentStep < stepData.length - 1) {
      const nextStep = currentStep + 1;
      updateUrlParams({
        selections: selectionsString,
        step: nextStep,
        mode: undefined,
      });
    } else {
      updateUrlParams({
        selections: selectionsString,
        mode: 'freeform',
        step: undefined,
      });
    }
  };

  const handlePrevious = () => {
    if (isFreeFormMode) return;
    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      updateUrlParams({ step: prevStep, mode: undefined });
    }
  };

  const extractNumber = (textWithUnit: string | number | undefined): number => {
    if (typeof textWithUnit === 'number') return textWithUnit;
    if (typeof textWithUnit === 'string') {
      const match = textWithUnit.match(/\d+/);
      return match ? parseInt(match[0], 10) : 0;
    }
    return 0;
  };

  const calculateTotals = (
    items: Array<
      InvoiceDataType['invoiceGroup'][number]['items'][number] & {
        isDeleted: boolean;
      }
    >
  ) => {
    let totalAmount = 0;
    let totalDuration = 0;
    let totalPages = 0;
    items.forEach((item) => {
      if (!item.isDeleted) {
        totalAmount += typeof item.amount === 'number' ? item.amount : 0;
        totalDuration += extractNumber(item.duration);
        totalPages += extractNumber(item.pages);
      }
    });
    return { totalAmount, totalDuration, totalPages };
  };

  const handleActionClick = async (
    action: string,
    data?: { featureId?: string }
  ) => {
    if (action === 'delete_feature_json' && data?.featureId && invoiceDetails) {
      const featureIdToDelete = data.featureId;
      const newItems = invoiceDetails.items.map((item) => {
        if (item.id === featureIdToDelete) {
          return { ...item, isDeleted: !item.isDeleted };
        }
        return item;
      });
      const { totalAmount, totalDuration, totalPages } =
        calculateTotals(newItems);
      setInvoiceDetails((prev) => {
        if (prev) {
          return {
            ...prev,
            items: newItems,
            currentTotal: totalAmount,
            currentTotalDuration: totalDuration,
            currentTotalPages: totalPages,
          };
        }
        return null;
      });
      return;
    }
    const invoiceRequestText = '견적서를 보여줘';
    const discountOption1Text = '할인 옵션 1 (기간 연장)을 선택합니다.';
    const discountOption2Text = '할인 옵션 2 (기능 제거)를 선택합니다.';
    switch (action) {
      case 'show_invoice':
        setInvoiceDetails(null);
        await handleGeminiSubmit(null, invoiceRequestText);
        break;
      case 'discount_extend_3w_20p':
        await handleGeminiSubmit(null, discountOption1Text);
        break;
      case 'discount_remove_features':
        await handleGeminiSubmit(null, discountOption2Text);
        break;
      case 'download_pdf':
        alert('PDF 다운로드 기능은 로그인 후 사용할 수 있습니다. (구현 예정)');
        break;
      default:
        if (action !== 'delete_feature_json') {
          console.warn('Unknown button action:', action);
        }
    }
  };

  const handleIconUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGeminiSubmit(null);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    uploadFiles(Array.from(selectedFiles), {
      onUpload: (data) => setUploadedFiles((prev) => [...prev, data]),
      progress: (percent) => setUploadProgress(percent),
    });
    if (e.target) {
      e.target.value = '';
    }
  };

  const handleDropFiles = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = e.dataTransfer.files;
    if (!droppedFiles) return;
    uploadFiles(Array.from(droppedFiles), {
      onUpload: (data) => setUploadedFiles((prev) => [...prev, data]),
      progress: (percent) => setUploadProgress(percent),
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDeleteFile = (fileUri: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fileUri !== fileUri));
  };

  const handleGeminiSubmit = async (
    e?: React.FormEvent | null,
    actionPrompt?: string
  ) => {
    e?.preventDefault();
    const submissionPrompt = actionPrompt || promptText;
    if ((!submissionPrompt && uploadedFiles.length === 0) || loading) {
      return;
    }
    if (!isFreeFormMode) {
      return;
    }
    setLoading(true);
    setError('');
    let userMessageText = submissionPrompt;
    let userMessageImageUrl: string | undefined = undefined;
    let userMessageFileType: string | undefined = undefined;
    if (uploadedFiles.length > 0) {
      userMessageText += `\n\n(첨부 파일: ${uploadedFiles
        .map((f) => f.name)
        .join(', ')})`;
      const firstImageFile = uploadedFiles.find((file) =>
        file.mimeType.startsWith('image/')
      );
      if (firstImageFile) {
        userMessageImageUrl = firstImageFile.fileUri;
        userMessageFileType = firstImageFile.mimeType;
      } else if (uploadedFiles.length > 0) {
        userMessageFileType = uploadedFiles[0].mimeType;
      }
    }
    const userMessage = {
      id: Date.now(),
      sender: 'user' as const,
      text: userMessageText,
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
    setMessages((prev) => [...prev, userMessage as Message, initialAiMessage]);
    if (!actionPrompt) {
      setPromptText('');
    }
    const currentFiles = [...uploadedFiles];
    setUploadedFiles([]);
    setUploadProgress(0);
    if (
      actionPrompt !== '견적서를 보여줘' &&
      actionPrompt !== '견적 데이터 보기'
    ) {
      setInvoiceDetails(null);
    }
    try {
      const parts: Part[] = [];
      let selectionSummary = '';
      Object.entries(selections).forEach(([stepId, selectedOptions]) => {
        const stepInfo = stepData.find((step) => step.id === stepId);
        const stepTitle = stepInfo ? stepInfo.selectionTitle : stepId;
        if (selectedOptions && selectedOptions.length > 0) {
          const selectedLabels = selectedOptions.map((optionId) => {
            const option = stepInfo?.options.find((opt) => opt.id === optionId);
            return option ? option.label : optionId;
          });
          selectionSummary += `- ${stepTitle}: ${selectedLabels.join(', ')}\n`;
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
        invoiceDetails.items.forEach((item) => {
          currentInvoiceStateText += `- 항목: ${item.feature}, 금액: ${item.amount}, 삭제됨: ${item.isDeleted}\n`;
        });
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

      // chat 객체가 아직 초기화되지 않았는지 확인
      if (!chat.current) {
        console.error(
          '[AI] Chat session is not initialized. Waiting for initialization...'
        );

        // 5초간 초기화 대기 (최대 10회 시도)
        let retryCount = 0;
        const maxRetries = 10;
        const waitForInitialization = async (): Promise<boolean> => {
          if (chat.current) return true;
          if (retryCount >= maxRetries) return false;

          await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms 대기
          retryCount++;
          return waitForInitialization();
        };

        // 초기화 대기
        const initialized = await waitForInitialization();
        if (!initialized || !chat.current) {
          throw new Error(
            'AI 채팅 세션이 초기화되지 않았습니다. 페이지를 새로고침한 후 다시 시도해주세요.'
          );
        }
      }

      const streamResult = await chat.current.sendMessageStream(parts);
      let aiResponseText = '';
      for await (const item of streamResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          aiResponseText += chunkText;
        }
      }
      console.log('AI 전체 응답 (aiResponseText):', aiResponseText);
      const jsonScriptRegex =
        /<script type="application\/json" id="invoiceData">([\s\S]*?)<\/script>/;
      const jsonMatch = aiResponseText.match(jsonScriptRegex);
      console.log('JSON 추출 시도 결과 (jsonMatch):', jsonMatch);
      let parsedInvoiceData: InvoiceDataType | null = null;
      let naturalLanguageText = aiResponseText;
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1];
        console.log('추출된 JSON 문자열 (jsonString):', jsonString);
        try {
          parsedInvoiceData = JSON.parse(jsonString) as InvoiceDataType;
          console.log(
            '파싱된 견적서 JSON 객체 (parsedInvoiceData):',
            parsedInvoiceData
          );
          naturalLanguageText = aiResponseText
            .replace(jsonScriptRegex, '')
            .trim();
          console.log(
            'JSON 제거 후 자연어 텍스트 (naturalLanguageText):',
            naturalLanguageText
          );
          if (parsedInvoiceData && parsedInvoiceData.invoiceGroup) {
            const initialItems = parsedInvoiceData.invoiceGroup.flatMap(
              (group) =>
                group.items.map((item) => ({ ...item, isDeleted: false }))
            );
            const { totalAmount, totalDuration, totalPages } =
              calculateTotals(initialItems);
            setInvoiceDetails({
              parsedJson: parsedInvoiceData,
              items: initialItems,
              currentTotal: totalAmount,
              currentTotalDuration: totalDuration,
              currentTotalPages: totalPages,
            });
            setMessages((prevMessages: Message[]) => {
              return prevMessages.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      text: naturalLanguageText,
                      invoiceData: parsedInvoiceData ?? undefined,
                    }
                  : msg
              );
            });
          } else {
            setInvoiceDetails(null);
            setMessages((prevMessages: Message[]) => {
              return prevMessages.map((msg) =>
                msg.id === aiMessageId
                  ? {
                      ...msg,
                      text: naturalLanguageText,
                      invoiceData: undefined,
                    }
                  : msg
              );
            });
          }
        } catch (parseError) {
          console.error(
            '❌ Error parsing invoice JSON from AI response:',
            parseError
          );
          if (jsonString) {
            console.error('Invalid JSON String was:', jsonString);
          }
          setInvoiceDetails(null);
          setMessages((prevMessages: Message[]) => {
            return prevMessages.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: aiResponseText, invoiceData: undefined }
                : msg
            );
          });
        }
      } else {
        console.log(
          '스크립트 태그에서 견적서 JSON 데이터를 찾지 못했습니다. AI 응답을 자연어로만 처리합니다.'
        );
        setInvoiceDetails(null);
        setMessages((prevMessages: Message[]) => {
          return prevMessages.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: aiResponseText, invoiceData: undefined }
              : msg
          );
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error("❌ Error in handleGeminiSubmit's try block:", err);
      setMessages((prevMessages: Message[]) => {
        return prevMessages.map((msg) =>
          msg.id === aiMessageId
            ? { ...msg, text: `오류: ${errorMessage}`, invoiceData: undefined }
            : msg
        );
      });
      setInvoiceDetails(null);
    } finally {
      setLoading(false);
    }
  };

  const [isMobile, setIsMobile] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  // 화면 크기 감지하여 모바일 여부 설정
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsNarrowScreen(window.innerWidth <= 1200);
    };

    // 초기 체크
    checkScreenSize();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkScreenSize);

    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <Container $isNarrowScreen={isNarrowScreen}>
      <MainContent $isNarrowScreen={isNarrowScreen}>
        <ChatContainer>
          {/* 모바일에서는 프로그래스바를 상단에 표시 */}
          {!isFreeFormMode && isMobile && (
            <AiProgressBar steps={progressSteps} currentStep={currentStep} />
          )}

          <ChatContent
            isNarrowScreen={isNarrowScreen}
            isFreeFormMode={isFreeFormMode}
            currentStepData={currentStepData}
            initialSelection={initialSelection}
            isDragging={isDragging}
            messages={messages}
            loading={loading}
            error={error}
            invoiceDetails={invoiceDetails}
            handleActionClick={handleActionClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleDropFiles={handleDropFiles}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            lang={lang}
          />

          <MessageInput
            promptText={promptText}
            setPromptText={setPromptText}
            handleGeminiSubmit={handleGeminiSubmit}
            handleKeyDown={handleKeyDown}
            isFreeFormMode={isFreeFormMode}
            loading={loading}
            uploadedFiles={uploadedFiles}
            uploadProgress={uploadProgress}
            handleDeleteFile={handleDeleteFile}
            handleFileInputChange={handleFileInputChange}
            handleIconUploadClick={handleIconUploadClick}
            lang={lang}
          />
        </ChatContainer>
      </MainContent>

      {/* 데스크톱에서만 오른쪽에 프로그래스바 표시 */}
      {!isFreeFormMode && !isMobile && (
        <AiProgressBar steps={progressSteps} currentStep={currentStep} />
      )}

      <SocialLoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <AdditionalInfoModal />
    </Container>
  );
}
