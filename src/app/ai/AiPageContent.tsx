// src/app/ai/AiPageContent.tsx
'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { AiProgressBar } from '@/components/Ai/AiProgressBar';
import { customScrollbar } from '@/styles/commonStyles';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Message, InvoiceDataType } from '@/components/Ai/AiChatMessage';
import useAI from '@/hooks/useAI';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { FileUploadData, uploadFiles } from '@/lib/firebase/firebase.functions';
import { Part, FileData } from '@google/generative-ai';
import { SocialLoginModal } from './SocialLoginModal';
import authStore, { AuthState } from '@/store/authStore';
import { auth } from '@/lib/firebase/firebase.config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import AdditionalInfoModal from './AdditionalInfoModal';
import { useApiLimit } from '@/hooks/useApiLimit';
import useAiFlowStore from '@/store/aiFlowStore';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';
import { devLog } from '@/lib/utils/devLogger';
import useCreateChatMessage from '@/hooks/chat/useCreateChatMessage';
import useAuthStore from '@/store/authStore';
import { useGeminiChatSubmit } from '@/lib/utils/ai/useGeminiChatSubmit';

// 컴포넌트 임포트
import { getStepData, ChatDictionary } from './components/StepData';
import MessageInput from './components/MessageInput';
import ChatContent from './components/ChatContent';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { PrintableInvoice } from '@/components/Ai/AiChatMessage';

// ChatMessagePayload 인터페이스를 명확하게 정의합니다.
interface ChatMessagePayload {
  role: 'USER' | 'AI';
  sessionIndex: number;
  content: {
    message: string;
    files?: { name: string; uri: string; mimeType: string }[];
    invoiceData?: InvoiceDataType;
  };
  title?: string;
}

// 견적서 상세 정보 상태 인터페이스 정의 수정
interface InvoiceDetails {
  parsedJson?: InvoiceDataType;
  items: Array<
    InvoiceDataType['invoiceGroup'][number]['items'][number] & {
      isDeleted: boolean;
    }
  >;
  currentTotal: number;
  currentTotalDuration: number;
  currentTotalPages: number;
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
  position: relative;
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

// 언어 변경 아이콘을 위한 스타일 컴포넌트
const AbsoluteLanguageSwitcherWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 0px;
  z-index: 10;
`;

// AiPageContent 내에서 사용할 언어 변경 컴포넌트
const PageLanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  const languageOptions = [
    { label: '한국어', value: 'ko' },
    { label: 'English', value: 'en' },
  ];

  const logLanguageChange = (selectedLang: 'ko' | 'en') => {
    userStamp({
      category: '버튼',
      content: 'PageLanguageSwitcher',
      memo: `언어 변경: ${selectedLang}`,
    });
  };

  return (
    <DropdownInput
      value={lang}
      onChange={(value) => {
        const newLang = value as 'ko' | 'en';
        setLang(newLang);
        logLanguageChange(newLang);
      }}
      options={languageOptions}
      $triggerBackgroundColor="transparent"
      $triggerFontSize="18px"
      $triggerTextColor="#BBBBCF"
      $contentBackgroundColor="#1a1b1e"
      $contentTextColor="#BBBBCF"
      $itemHoverBackgroundColor="#546ACB"
      $itemHoverTextColor="#FFFFFF"
      $triggerContent={
        <img src="/globe.svg" alt="Language Selector" width={28} height={28} />
      }
      width="auto"
    />
  );
};

// PDF 생성 함수
const generateInvoicePDF = async (
  invoiceDetailsData: InvoiceDetails,
  currentLang: 'ko' | 'en',
  userCountryCode: string,
  translations: ChatDictionary
) => {
  if (!invoiceDetailsData || !invoiceDetailsData.parsedJson) {
    console.error('PDF 생성을 위한 견적서 데이터가 없습니다.');
    return;
  }

  const invoiceNode = document.createElement('div');
  invoiceNode.setAttribute('id', 'printable-invoice-container-for-pdf-wrapper');
  invoiceNode.style.position = 'absolute';
  invoiceNode.style.left = '-9999px';
  invoiceNode.style.top = '-9999px';
  invoiceNode.style.zIndex = '-1';
  document.body.appendChild(invoiceNode);

  const root = createRoot(invoiceNode);
  root.render(
    <PrintableInvoice
      invoiceData={invoiceDetailsData.parsedJson}
      invoiceDetailsForPdf={invoiceDetailsData}
      t={translations}
      countryCode={userCountryCode}
      lang={currentLang}
    />
  );

  try {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const printableContent = invoiceNode.querySelector(
      '#printable-invoice-content'
    );
    if (!printableContent) {
      console.error(
        'PDF로 변환할 #printable-invoice-content 요소를 찾을 수 없습니다. invoiceNode 내부를 확인합니다:',
        invoiceNode.innerHTML
      );
      return;
    }

    devLog(
      '#printable-invoice-content 요소를 찾았습니다. 캡처를 시도합니다.',
      printableContent
    );
    const canvas = await html2canvas(printableContent as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: process.env.NODE_ENV === 'development',
      backgroundColor: '#ffffff',
      scrollX: 0,
      scrollY: -window.scrollY,
      windowWidth: printableContent.scrollWidth,
      windowHeight: printableContent.scrollHeight,
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    const contentWidth = pdfWidth - margin * 2;

    const pxFullHeight = canvas.height;
    const pxPageHeight =
      (canvas.width / contentWidth) * (pdfHeight - margin * 2);
    let position = 0;

    while (position < pxFullHeight) {
      const canvasPage = document.createElement('canvas');
      canvasPage.width = canvas.width;
      canvasPage.height = Math.min(pxPageHeight, pxFullHeight - position);

      const ctx = canvasPage.getContext('2d');
      if (!ctx) {
        console.error('Canvas context를 가져오지 못했습니다.');
        break;
      }

      ctx.drawImage(
        canvas,
        0,
        position,
        canvas.width,
        canvasPage.height,
        0,
        0,
        canvas.width,
        canvasPage.height
      );

      const imgDataPage = canvasPage.toDataURL('image/png');
      const imgHeight = (canvasPage.height * contentWidth) / canvasPage.width;

      pdf.addImage(imgDataPage, 'PNG', margin, margin, contentWidth, imgHeight);

      position += pxPageHeight;

      if (position < pxFullHeight) {
        pdf.addPage();
      }
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl, '_blank');

    if (newWindow) {
      newWindow.onload = () => {
        URL.revokeObjectURL(pdfUrl);
      };
    } else {
      console.error(
        'PDF를 새 창으로 열지 못했습니다. 팝업 차단 설정을 확인해주세요.'
      );
      URL.revokeObjectURL(pdfUrl);
    }
  } catch (pdfError) {
    console.error('PDF 생성 중 오류 발생:', pdfError);
  } finally {
    root.unmount();
    if (invoiceNode.parentNode) {
      invoiceNode.parentNode.removeChild(invoiceNode);
    }
  }
};

export default function AiPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  // useAuthStore에서 currentSessionIndex와 setCurrentSessionIndex 가져오기
  const currentSessionIndexFromStore = useAuthStore(
    (state) => state.currentSessionIndex
  );
  const setCurrentSessionIndex = useAuthStore(
    (state) => state.setCurrentSessionIndex
  );

  // useCreateChatMessage 훅 사용
  const { createChatMessage } = useCreateChatMessage();

  const [isFirstApiUserMessageSent, setIsFirstApiUserMessageSent] =
    useState(false);

  const { lang } = useLang();
  const t = useMemo(() => aiChatDictionary[lang] as ChatDictionary, [lang]);
  t.lang = lang;

  const stepData = useMemo(() => getStepData(t), [t]);

  const { chat, model, isInitialized, firebaseApp, firebaseAuth, setFirebaseInitialized } = useAI();

  const {
    currentStep,
    isFreeFormMode,
    selections,
    setCurrentStep,
    setIsFreeFormMode,
    setSelections: setAiFlowStoreSelections,
    updateSelection,
    // ⭐⭐⭐ invoiceDetails와 setInvoiceDetails를 useAiFlowStore에서 가져옵니다. ⭐⭐⭐
    invoiceDetails,
    setInvoiceDetails,
  } = useAiFlowStore();


  // 로컬 상태
  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
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
  const isLoggedIn = authStore((state: AuthState) => state.isLoggedIn);
  const openLoginModal = authStore((state: AuthState) => state.openLoginModal);

  const [isFirebaseChecking, setIsFirebaseChecking] = useState(true);

  const { remainingCount, decreaseCount, isLimitInitialized } =
    useApiLimit(isLoggedIn);
  const prevSelectionsParamRef = useRef<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  let isModelInitializing = false;

  // ⭐⭐⭐ useGeminiChatSubmit 훅 호출 ⭐⭐⭐
  const { handleGeminiSubmit } = useGeminiChatSubmit({
    chat,
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
    openLoginModal: () => setIsLoginModalOpen(true),
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
  });

  useEffect(() => {
    try {
      const loginDataStr = localStorage.getItem('loginData');
      if (loginDataStr) {
        devLog('로컬 스토리지에서 로그인 데이터 발견');
        const loginData = JSON.parse(loginDataStr);
        if (Array.isArray(loginData) && loginData.length > 0) {
          const result = loginData[0];
          if (
            result.statusCode === 200 &&
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            const userData = result.data[0];
            login(userData);
            if (!userData.cellphone) {
              devLog('전화번호 정보가 없어 추가 정보 모달 표시');
              openAdditionalInfoModal();
            } else {
              devLog('전화번호 정보가 이미 존재함');
            }
            localStorage.removeItem('loginData');
            devLog('로그인 처리 완료 및 로컬 스토리지 데이터 삭제');
          }
        }
      }
    } catch (error) {
      console.error('로그인 데이터 처리 오류:', error);
    }
  }, [login, openAdditionalInfoModal]);

  useEffect(() => {
    const urlSessionId = searchParams.get('sessionId');
    const newSessionIndex = null;
    const currentSelectionsParam = searchParams.get('selections');

    const isSelectionsChanged =
      prevSelectionsParamRef.current !== currentSelectionsParam;

    if (
      (prevSelectionsParamRef.current === null &&
        currentSelectionsParam !== null) ||
      (prevSelectionsParamRef.current !== null && isSelectionsChanged)
    ) {
      devLog(
        '[AiPageContent] "selections" URL param changed. Resetting chat state.'
      );
      setMessages([]);
      // ⭐⭐⭐ 여기서 useAiFlowStore의 setInvoiceDetails를 사용합니다. ⭐⭐⭐
      setInvoiceDetails(null);
      setPromptText('');
      setUploadedFiles([]);
      setUploadProgress(0);
      setError('');
      setLoading(false);
      setIsFirstApiUserMessageSent(false);
    } else if (
      prevSelectionsParamRef.current === null &&
      currentSelectionsParam === null
    ) {
      setIsFirstApiUserMessageSent(false);
      setCurrentSessionIndex(newSessionIndex);
      devLog('[AiPageContent] No "selections" param present. Basic init.');
    } else {
      devLog('[AiPageContent] "selections" param unchanged. No full reset.');
      setCurrentSessionIndex(newSessionIndex);
    }

    prevSelectionsParamRef.current = currentSelectionsParam;
  }, [searchParams, setInvoiceDetails, setCurrentSessionIndex]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    const selectionsParam = searchParams.get('selections');
    const modeParam = searchParams.get('mode');
    const sessionIdParam = searchParams.get('sessionId');

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
    setCurrentStep(step);

    let sels = {};
    if (selectionsParam) {
      try {
        sels = JSON.parse(selectionsParam);
      } catch (error) {
        console.error('Error parsing selections from URL:', error);
      }
    }
    setAiFlowStoreSelections(sels);

    const freeForm = modeParam === 'freeform';
    setIsFreeFormMode(freeForm);

    if (sessionIdParam) {
      const parsedSessionId = parseInt(sessionIdParam, 10);
      if (!isNaN(parsedSessionId)) {
        setCurrentSessionIndex(parsedSessionId);
        devLog(
          `[AiPageContent] URL에서 세션 ID '${parsedSessionId}'를 가져와 Zustand에 저장.`
        );
      }
    } else {
      devLog(
        '[AiPageContent] URL에 세션 ID가 없어, Zustand의 세션 ID를 초기화하거나 기존 값 유지.'
      );
    }
  }, [
    searchParams,
    stepData.length,
    setCurrentStep,
    setAiFlowStoreSelections,
    setIsFreeFormMode,
    setCurrentSessionIndex,
    t
  ]);

  useEffect(() => {
    devLog('[AiPageContent] Firebase auth listener - MOUNTING');
    setIsFirebaseChecking(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      devLog(
        '[AiPageContent] onAuthStateChanged CALLBACK TRIGGERED. Firebase user:',
        user
      );
      setIsFirebaseChecking(false);
      if (user) {
        devLog(
          `[AiPageContent] Firebase user DETECTED (UID: ${user.uid}, Anonymous: ${user.isAnonymous})`
        );
      } else {
        devLog(
          '[AiPageContent] No Firebase user DETECTED. Attempting anonymous sign-in...'
        );
        try {
          await signInAnonymously(auth);
          devLog(
            '[AiPageContent] Firebase anonymous sign-in attempt successful. Waiting for new auth state.'
          );
        } catch (error) {
          console.error(
            '[AiPageContent] Firebase anonymous sign-in FAILED:',
            error
          );
        }
      }
    });

    return () => {
      devLog(
        '[AiPageContent] Firebase auth listener - UNMOUNTING. Unsubscribing.'
      );
      unsubscribe();
    };
  }, []);

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
    updateSelection(currentStepData.id, selectedIds);
    const updatedSelections = {
      ...useAiFlowStore.getState().selections,
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
    let amount = 0;
    let duration = 0;
    let pages = 0;

    items.forEach((item) => {
      if (!item.isDeleted) {
        if (typeof item.amount === 'number') {
          amount += item.amount;
        }
        duration += extractNumber(item.duration);
        pages += extractNumber(item.pages);
      }
    });
    return { amount, duration, pages };
  };

  const handleActionClick = useCallback(
    async (
      action: string,
      data?: { featureId?: string }
    ) => {
      devLog('[AiPageContent] handleActionClick called with:', action, data);

      const addMessageToChat = (newMessage: Message) => {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      if (action === 'delete_feature_json') {
        if (data?.featureId && invoiceDetails) {
          const updatedItems = invoiceDetails.items.map((item) =>
            item.id === data.featureId
              ? { ...item, isDeleted: !item.isDeleted }
              : item
          );
          const {
            amount: currentTotal,
            duration: currentTotalDuration,
            pages: currentTotalPages,
          } = calculateTotals(updatedItems);

          setInvoiceDetails({
            ...invoiceDetails,
            items: updatedItems,
            currentTotal,
            currentTotalDuration,
            currentTotalPages,
          });
        }
      } else if (action === 'download_pdf') {
        devLog('PDF 다운로드 요청');
        if (invoiceDetails && invoiceDetails.parsedJson) {
          const userCountry = authStore.getState().user?.countryCode || 'KR';
          await generateInvoicePDF(invoiceDetails, lang, userCountry, t);
        } else {
          addMessageToChat({
            id: Date.now(),
            sender: 'ai',
            text: '견적서 데이터를 찾을 수 없어 PDF를 생성할 수 없습니다.',
          });
        }
        return;
      } else if (action === 'discount_extend_8w_20p') {
        const feedbackMsg =
          t.userActionFeedback?.discountExtend8w20p ||
          '첫 번째 할인 옵션을 선택했습니다.';
        addMessageToChat({ id: Date.now(), sender: 'user', text: feedbackMsg });
        await handleGeminiSubmit(
          null,
          `${feedbackMsg} 이 옵션을 적용하여 견적을 조정해주세요. 사용자의 현재 견적서는 다음과 같습니다: ${JSON.stringify(
            invoiceDetails?.parsedJson
          )}`,
          true
        );
      } else if (action === 'discount_remove_features_budget') {
        const feedbackMsg =
          t.userActionFeedback?.discountRemoveFeaturesBudget ||
          '두 번째 할인 옵션을 선택했습니다.';
        addMessageToChat({ id: Date.now(), sender: 'user', text: feedbackMsg });
        await handleGeminiSubmit(
          null,
          `${feedbackMsg} 현재 견적서에서 제거할 만한 핵심 보조 기능들을 제안해주세요. 사용자의 현재 견적서는 다음과 같습니다: ${JSON.stringify(
            invoiceDetails?.parsedJson
          )}`,
          true
        );
      } else if (action === 'discount_ai_suggestion') {
        if (isModelInitializing) {
          devLog('[AiPageContent] 모델 초기화 중복 요청 방지됨.');
          return;
        }
        isModelInitializing = true;

        const feedbackMsg =
          t.userActionFeedback?.discountAiSuggestion ||
          'AI 심층 분석 및 기능 제안을 요청했습니다.';
        addMessageToChat({ id: Date.now(), sender: 'user', text: feedbackMsg });

        try {
          if (!isInitialized || !chat.current) {
            console.warn('[handleActionClick] AI 모델 또는 채팅 세션이 아직 준비되지 않아 AI 제안을 처리할 수 없습니다.');
            addMessageToChat({ id: Date.now(), sender: 'ai', text: lang === 'ko' ? 'AI 기능이 아직 준비되지 않았습니다. 잠시 후 다시 시도해주세요.' : 'AI feature is not ready yet. Please try again later.' });
            return;
          }

          let analysisPrompt = `현재 이 사용자의 견적서 정보는 다음과 같습니다: ${JSON.stringify(
            invoiceDetails?.parsedJson
          )}. 이 정보를 바탕으로 비즈니스 성장을 위해 추가적으로 필요하거나 개선할 수 있는 기능들을 심층적으로 분석하여 제안해주세요. 제안 시에는 각 기능의 필요성, 기대 효과, 예상되는 개발 규모 (간단, 보통, 복잡 등)를 포함해주세요.`;
          if (lang === 'en') {
            analysisPrompt = `The user's current estimate details are as follows: ${JSON.stringify(
              invoiceDetails?.parsedJson
            )}. Based on this information, please conduct an in-depth analysis and suggest additional features or improvements that could contribute to business growth. When making suggestions, include the necessity of each feature, expected benefits, and an estimated development scale (e.g., simple, moderate, complex).`;
          }

          await handleGeminiSubmit(null, analysisPrompt, true);
        } catch (error) {
          console.error(
            '[AiPageContent] Error during AI suggestion submission:',
            error
          );
          const errorMsg =
            lang === 'ko'
              ? 'AI 제안 기능 처리 중 오류가 발생했습니다.'
              : 'An error occurred while processing the AI suggestion.';
          addMessageToChat({ id: Date.now(), sender: 'ai', text: errorMsg });
        } finally {
          isModelInitializing = false;
        }
      } else {
        console.warn(`[AiPageContent] Unknown button action: ${action}`);
      }
    },
    [handleGeminiSubmit, invoiceDetails, lang, t, isInitialized, chat, setLoading, setError, setMessages]
  );

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
    devLog(
      '[AiPageContent] handleFileInputChange triggered. Files:',
      selectedFiles
    );
    devLog(
      '[AiPageContent] Current Firebase User (auth.currentUser) before uploadFiles (via input change):',
      auth.currentUser
    );

    if (isFirebaseChecking) {
      alert('Firebase 인증 상태를 확인 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!auth.currentUser) {
      alert(
        'AI 기능 사용을 위한 Firebase 로그인이 필요합니다. (개발자/관리자)'
      );
      return;
    }

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
    devLog('[AiPageContent] handleDropFiles triggered. Files:', droppedFiles);
    devLog(
      '[AiPageContent] Current Firebase User (auth.currentUser) before uploadFiles (via drop):',
      auth.currentUser
    );

    if (isFirebaseChecking) {
      alert('Firebase 인증 상태를 확인 중입니다. 잠시 후 다시 시도해주세요.');
      return;
    }
    if (!auth.currentUser) {
      alert(
        'AI 기능 사용을 위한 Firebase 로그인이 필요합니다. (개발자/관리자)'
      );
      return;
    }

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

  const [isMobile, setIsMobile] = useState(false);
  const [isNarrowScreen, setIsNarrowScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 770);
      setIsNarrowScreen(window.innerWidth <= 1200);
    };
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return (
    <Container $isNarrowScreen={isNarrowScreen}>
      {!isNarrowScreen && (
        <AbsoluteLanguageSwitcherWrapper>
          <PageLanguageSwitcher />
        </AbsoluteLanguageSwitcherWrapper>
      )}
      <MainContent $isNarrowScreen={isNarrowScreen}>
        <ChatContainer>
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
            handleGeminiSubmit={handleGeminiSubmit}
            handleActionClick={handleActionClick}
            handleNext={handleNext}
            handlePrevious={handlePrevious}
            handleDropFiles={handleDropFiles}
            handleDragOver={handleDragOver}
            handleDragLeave={handleDragLeave}
            lang={lang}
            onAddMessage={(newMessage) =>
              setMessages((prev) => [...prev, newMessage])
            }
          />

          <MessageInput
            promptText={promptText}
            setPromptText={setPromptText}
            handleGeminiSubmit={handleGeminiSubmit}
            handleKeyDown={handleKeyDown}
            isFreeFormMode={isFreeFormMode}
            loading={loading || isFirebaseChecking}
            uploadedFiles={uploadedFiles}
            uploadProgress={uploadProgress}
            handleDeleteFile={handleDeleteFile}
            handleFileInputChange={handleFileInputChange}
            handleIconUploadClick={handleIconUploadClick}
            remainingCount={remainingCount}
            isLoggedIn={isLoggedIn}
            isApiLimitInitialized={isLimitInitialized}
            lang={lang}
          />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            style={{ display: 'none' }}
            multiple
            accept="image/*,application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-powerpoint,text/plain,text/csv"
          />
        </ChatContainer>
      </MainContent>

      {!isFreeFormMode && !isMobile && (
        <AiProgressBar steps={progressSteps} currentStep={currentStep} />
      )}

      <SocialLoginModal isOpen={isLoginModalOpen} onClose={closeLoginModal} />
      <AdditionalInfoModal />
    </Container>
  );
}