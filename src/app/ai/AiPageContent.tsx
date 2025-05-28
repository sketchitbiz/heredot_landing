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
import { Part, FileData } from '@google/generative-ai'; // 'firebase/vertexai' 대신 '@google/generative-ai' 사용 권장
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
import useAuthStore from '@/store/authStore'; // useAuthStore 임포트

// 컴포넌트 임포트
import { getStepData, ChatDictionary } from './components/StepData';
import MessageInput from './components/MessageInput';
import ChatContent from './components/ChatContent';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client'; // React 18용
import { PrintableInvoice } from '@/components/Ai/AiChatMessage'; // PrintableInvoice 임포트

// ChatMessagePayload 인터페이스를 명확하게 정의합니다.
interface ChatMessagePayload {
  role: 'USER' | 'AI';
  sessionIndex: number; // 숫자 타입이어야 함
  content: {
    message: string;
    files?: { name: string; uri: string; mimeType: string }[];
    invoiceData?: InvoiceDataType; // InvoiceDataType 또는 관련 타입으로 대체 필요
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
  translations: ChatDictionary // 번역 객체 전달
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
  invoiceNode.style.zIndex = '-1'; // 화면에 보이지 않도록
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
    useState(false); // 첫 번째 사용자 메시지 전송 여부 추적

  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;
  t.lang = lang;

  const stepData = getStepData(t);
  const { chat, setCurrentModelIdentifier, modelName, isInitialized } = useAI();

  const {
    currentStep,
    isFreeFormMode,
    selections,
    setCurrentStep,
    setIsFreeFormMode,
    setSelections: setAiFlowStoreSelections,
    updateSelection,
  } = useAiFlowStore();

  const [messages, setMessages] = useState<Message[]>([]);
  const [promptText, setPromptText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [invoiceDetails, setInvoiceDetails] = useState<InvoiceDetails | null>(
    null
  );

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
  const user = authStore((state: AuthState) => state.user);
  const isAdditionalInfoModalOpen = useAuthStore(
    (state) => state.isAdditionalInfoModalOpen
  );

  const [isFirebaseChecking, setIsFirebaseChecking] = useState(true);

  const { remainingCount, decreaseCount, isLimitInitialized } =
    useApiLimit(isLoggedIn);
  const prevSelectionsParamRef = useRef<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  let isModelInitializing = false;

  useEffect(() => {
    // 로그인 상태이고, 사용자 정보가 로드되었지만, 이름 또는 전화번호가 없고,
    // 그리고 추가 정보 모달이 아직 열려있지 않을 때 모달을 강제로 엽니다.
    if (
      isLoggedIn &&
      user &&
      (!user.name || !user.name.trim() || !user.cellphone) &&
      !isAdditionalInfoModalOpen
    ) {
      console.log(
        '[AiPageContent] User has no name or cellphone, forcing AdditionalInfoModal.'
      );
      openAdditionalInfoModal();
    }
  }, [isLoggedIn, user, openAdditionalInfoModal, isAdditionalInfoModalOpen]); // 의존성 배열에 필요한 모든 것을 포함

  useEffect(() => {
    userStamp({
      category: '경로',
      content: 'AI',
      memo: 'AI',
      firstYn: 'N',
    });
  }, []);

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
    const currentSelectionsParam = searchParams.get('selections'); // 현재 URL의 selections 값

    // `selections` 파라미터가 변경되었는지 확인
    const isSelectionsChanged =
      prevSelectionsParamRef.current !== currentSelectionsParam;

    // 첫 렌더링 시에는 prevSelectionsParamRef.current가 null이므로,
    // currentSelectionsParam이 존재하면 변경으로 간주하여 초기화합니다.
    // 그 이후부터는 이전 값과 현재 값을 비교합니다.
    if (
      (prevSelectionsParamRef.current === null &&
        currentSelectionsParam !== null) ||
      (prevSelectionsParamRef.current !== null && isSelectionsChanged)
    ) {
      devLog(
        '[AiPageContent] "selections" URL param changed. Resetting chat state.'
      );
      setMessages([]); // 채팅 메시지 초기화
      setInvoiceDetails(null); // 견적서 상세 정보 초기화
      setPromptText(''); // 프롬프트 입력창 초기화
      setUploadedFiles([]); // 업로드된 파일 초기화
      setUploadProgress(0); // 업로드 진행률 초기화
      setError(''); // 에러 메시지 초기화
      setLoading(false); // 로딩 상태 초기화
      setIsFirstApiUserMessageSent(false); // 첫 API 메시지 플래그 초기화
    } else if (
      prevSelectionsParamRef.current === null &&
      currentSelectionsParam === null
    ) {
      // 컴포넌트가 처음 로드될 때 `selections` 파라미터가 없는 경우 (초기 상태)
      // 이 경우에도 필요한 초기화 작업을 수행할 수 있습니다.
      // 여기서는 추가적인 초기화 없이, 첫 API 메시지 플래그만 초기화합니다.
      // 만약 `selections` 없이 `sessionId`만 바뀌었을 때도 채팅이 초기화되어야 한다면,
      // 그 로직을 여기에 추가하거나 별도의 `if` 블록으로 다룰 수 있습니다.
      setIsFirstApiUserMessageSent(false);
      setCurrentSessionIndex(newSessionIndex); // sessionId는 동기화만
      devLog('[AiPageContent] No "selections" param present. Basic init.');
    } else {
      // `selections` 파라미터가 변경되지 않은 경우 (다른 파라미터만 변경되었거나, 변화 없음)
      devLog('[AiPageContent] "selections" param unchanged. No full reset.');
      // 이 경우에도 sessionId는 항상 최신 상태로 동기화해야 합니다.
      setCurrentSessionIndex(newSessionIndex);
    }

    // 🚨 현재 `selections` 파라미터 값을 Ref에 저장 (다음 렌더링을 위해)
    prevSelectionsParamRef.current = currentSelectionsParam;
  }, [searchParams]);

  useEffect(() => {
    const stepParam = searchParams.get('step');
    const selectionsParam = searchParams.get('selections');
    const modeParam = searchParams.get('mode');
    const sessionIdParam = searchParams.get('sessionId'); // URL에서 sessionId 가져오기

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

    // URL에서 sessionId를 가져와 Zustand 스토어에 저장
    if (sessionIdParam) {
      const parsedSessionId = parseInt(sessionIdParam, 10);
      if (!isNaN(parsedSessionId)) {
        setCurrentSessionIndex(parsedSessionId);
        devLog(
          `[AiPageContent] URL에서 세션 ID '${parsedSessionId}'를 가져와 Zustand에 저장.`
        );
      }
    } else {
      // URL에 sessionId가 없으면, 기존 currentSessionIndexFromStore 값을 유지하거나 null로 초기화
      // 여기서는 명시적으로 null로 설정하여 URL에 없을 경우 새로 시작할 수 있도록 합니다.
      // 또는 첫 진입 시 새로운 세션을 생성하도록 유도할 수 있습니다.
      // 필요에 따라 'ai?sessionId=new'와 같은 형태로 처리할 수도 있습니다.
      // 현재는 URL에 세션 ID가 없으면 '새로운 채팅'으로 간주될 가능성이 높습니다.
      // setCurrentSessionIndex(null);
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
    setCurrentSessionIndex, // 의존성 배열에 추가
  ]);

  useEffect(() => {
    devLog('[AiPageContent] Firebase auth listener - MOUNTING');
    setIsFirebaseChecking(true);

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      devLog(
        '[AiPageContent] onAuthStateChanged CALLBACK TRIGGERED. Firebase user:',
        user
      );
      if (user) {
        devLog(
          `[AiPageContent] Firebase user DETECTED (UID: ${user.uid}, Anonymous: ${user.isAnonymous})`
        );
        setIsFirebaseChecking(false);
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
          setIsFirebaseChecking(false);
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

  const handleActionClick = async (
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
      if (!user) {
        openLoginModal('pdfDownload');
        return;
      }
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
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            clearInterval(interval);
            reject(new Error('모델 초기화 시간이 초과되었습니다.'));
          }, 5000);

          const interval = setInterval(() => {
            clearInterval(interval);
            clearTimeout(timeout);
            devLog('[AiPageContent] 모델 초기화 조건 없이 바로 resolve.');
            resolve();
          }, 100);
        });

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

  // src/app/ai/AiPageContent.tsx (handleGeminiSubmit 함수 내)

  const handleGeminiSubmit = async (
    e?: React.FormEvent | null,
    actionPrompt?: string,
    isSystemInitiatedPrompt?: boolean
  ) => {
    e?.preventDefault();

    // 🚨🚨🚨 로그인 여부에 따른 처리 로직 강화 🚨🚨🚨
    // 비회원 사용량 제한 초과 시 로그인 모달
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

    // 비로그인 사용자 카운트 감소
    if (!isLoggedIn && isLimitInitialized) {
      const canProceed = decreaseCount();
      if (!canProceed) {
        openLoginModal();
        return;
      }
    }

    setLoading(true);
    setError('');

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

    // 사용자 UI 메시지 생성
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
      // 이 조건문이 빠져있을 수 있습니다.
      messagesToAdd.unshift(userMessageForUi);
    }
    // UI에 메시지 바로 추가 (로딩 상태를 보여주기 위해)
    setMessages((prev) => [...prev, ...messagesToAdd]);

    if (!actionPrompt && !isSystemInitiatedPrompt) {
      setPromptText('');
    }
    setUploadedFiles([]);
    setUploadProgress(0);

    if (
      actionPrompt !== '견적서를 보여줘' &&
      actionPrompt !== '견적 데이터 보기'
    ) {
      setInvoiceDetails(null);
    }

    try {
      // 세션 인덱스를 저장할 변수 (초기값은 현재 상태, API 호출 후 업데이트될 수 있음)
      let sessionIndexForApiCall: number | null = currentSessionIndexFromStore;

      // --- 사용자 메시지를 백엔드 API로 전송 ---
      // 🚨🚨🚨 로그인 상태일 때만 createChatMessage 호출 🚨🚨🚨
      if (isLoggedIn) {
        const userApiPayload: ChatMessagePayload = {
          role: 'USER',
          // currentSessionIndexFromStore가 null이면 새 세션 생성 (useCreateChatMessage 내부 로직)
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
          // 첫 사용자 메시지일 경우에만 title 설정.
          // useCreateChatMessage에서 sessionIndex가 undefined일 때 title을 사용하여 새 세션을 생성합니다.
          title: isFirstApiUserMessageSent ? undefined : '새로운 채팅',
        };

        devLog(
          '[AiPageContent] Sending user message to custom API:',
          userApiPayload
        );
        const apiResponse = await createChatMessage(userApiPayload);

        // API 응답으로 새로운 세션 인덱스를 받았으면 업데이트
        if (
          apiResponse &&
          apiResponse.chatSession &&
          apiResponse.chatSession.index !== undefined
        ) {
          sessionIndexForApiCall = apiResponse.chatSession.index;
          // useCreateChatMessage 내부에서 이미 setCurrentSessionIndex가 호출되었을 것입니다.
          // 하지만 혹시 모를 상황을 대비하여 명시적으로 다시 설정하거나,
          // 이 값을 이후 API 호출에만 활용하고 Zustand 상태는 useCreateChatMessage가 관리하도록 할 수 있습니다.
          // 여기서는 `sessionIndexForApiCall` 변수를 통해 일관성을 유지합니다.
        } else if (
          isFirstApiUserMessageSent === false &&
          sessionIndexForApiCall === null
        ) {
          // 첫 메시지인데 세션이 생성되지 않은 경우 (API 문제)
          console.error(
            '[AiPageContent] Failed to create new session or get session index from API response on first message.'
          );
          setError(
            '세션 생성에 실패했습니다. 페이지를 새로고침 후 다시 시도해주세요.'
          );
          setLoading(false);
          // 에러 발생 시 UI에 추가했던 메시지 제거
          setMessages((prev) =>
            prev.filter(
              (msg) => msg.id !== userMessageForUi.id && msg.id !== aiMessageId
            )
          );
          return;
        }
        if (!isFirstApiUserMessageSent) {
          setIsFirstApiUserMessageSent(true);
        }
      } else if (!isLoggedIn) {
        devLog(
          '[AiPageContent] Skipping user message API call for non-logged-in user.'
        );
        // 비로그인 시 세션 인덱스 로직은 건너뜁니다.
      }

      // --- 네비게이션 제목 업데이트 로직 추가 시작 ---
      // 로그인 상태이고, 유효한 세션 인덱스가 있으며, 첫 사용자 메시지 (시스템/액션 프롬프트 아님)일 경우
      // 이때의 `sessionIndexForApiCall`은 이제 확실히 유효한 세션 인덱스입니다.
      if (
        isLoggedIn &&
        sessionIndexForApiCall !== null &&
        sessionIndexForApiCall !== undefined &&
        !actionPrompt &&
        !isSystemInitiatedPrompt &&
        messages.filter((m) => m.sender === 'user').length === 0 // 첫 사용자 메시지
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
            `[AiPageContent] First user message for session ${sessionIndexForApiCall} saved to localStorage:`,
            submissionPrompt
          );
        }
      }
      // --- 네비게이션 제목 업데이트 로직 추가 끝 ---

      // Gemini API 호출을 위한 `parts` 생성 로직
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
        // `invoiceStateText`는 외부에 선언된 변수일 수 있습니다.
        // 여기서는 `currentInvoiceStateText`만 사용해도 무방합니다.
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

      if (!chat.current) {
        console.error(
          '[AI] Chat session is not initialized. Waiting for initialization...'
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
      let accumulatedText = ''; // 누적된 텍스트
      let accumulatedThought = ''; // 누적된 추론 요약 (만약 SDK가 지원한다면)

      // AI 응답이 시작되었음을 나타내는 로딩 상태 해제 (텍스트가 나올 것이므로)
      // setLoading(false); // 이 위치에서 해제하면 'AI is typing...'과 같은 효과가 안 나올 수 있음.
      // 아래 `setMessages`에서 텍스트가 추가될 때마다 `loading` 상태를 조정하는게 좋음.

      devLog('[AI 스트림 루프 진입 - 실시간 출력 시작]');
      for await (const item of streamResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;

        // ⭐ 텍스트 청크가 있을 때마다 UI를 업데이트 ⭐
        if (chunkText) {
          accumulatedText += chunkText;
          setMessages((prevMessages: Message[]) =>
            prevMessages.map((msg) =>
              msg.id === aiMessageId
                ? { ...msg, text: accumulatedText } // 텍스트를 점진적으로 업데이트
                : msg
            )
          );
          // 메시지가 추가될 때마다 스크롤을 맨 아래로 이동
          chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }

        // ⭐ 추론 요약(Thought Summaries) 처리 (SDK가 지원하는 경우) ⭐
        // 이 부분은 SDK의 실제 응답 구조를 디버깅하여 확인해야 합니다.
        // 현재 Firebase Vertex AI SDK의 `StreamGenerateContentResponse`의 `item` (Chunk) 객체는
        // `candidates[0].content.parts[0].text` 외에 `thought` 같은 속성을 직접 노출하지 않을 수 있습니다.
        // 만약 Google Cloud Vertex AI API의 `v1alpha` 버전에서만 `thinking_config`가 지원된다면,
        // 현재 `firebase/vertexai` SDK로는 직접 접근이 어려울 수 있습니다.
        // 하지만 만약을 위해 구조는 남겨둡니다.
        if (item.candidates && item.candidates.length > 0) {
          for (const candidate of item.candidates) {
            if (candidate.content && candidate.content.parts) {
              for (const part of candidate.content.parts) {
                if (
                  'thought' in part &&
                  typeof (part as any).thought === 'string' &&
                  (part as any).thought.length > 0
                ) {
                  accumulatedThought += (part as any).thought; // 생각 내용 자체를 누적
                  // 이 `accumulatedThought`를 별도의 UI 요소(예: "AI가 생각 중입니다..." 아래에 작은 텍스트)로 표시
                  // 또는 개발자 콘솔에만 로깅.
                  devLog(
                    '[AiPageContent] AI Thought Stream:',
                    (part as any).thought
                  );
                }
              }
            }
          }
        }
      }
      devLog('[AI 스트림 루프 종료 - 실시간 출력 완료]');
      // 최종 응답 텍스트는 `accumulatedText`에 모두 들어있으므로, 더 이상 `setMessages`를 반복 호출할 필요 없음.

      // JSON 추출 및 `setInvoiceDetails` 로직
      const jsonScriptRegex =
        /<script type="application\/json" id="invoiceData">([\s\S]*?)<\/script>/;
      const jsonMatch = accumulatedText.match(jsonScriptRegex); // ⭐ aiResponseText 대신 accumulatedText 사용 ⭐
      devLog('JSON 추출 시도 결과 (jsonMatch):', jsonMatch);
      let parsedInvoiceData: InvoiceDataType | null = null;
      let naturalLanguageText = accumulatedText; // ⭐ aiResponseText 대신 accumulatedText 사용 ⭐

      if (jsonMatch && jsonMatch[1]) {
        // ... (기존 JSON 파싱 로직 유지) ...
        const jsonString = jsonMatch[1];
        devLog('추출된 JSON 문자열 (jsonString):', jsonString);
        try {
          parsedInvoiceData = JSON.parse(jsonString) as InvoiceDataType;
          devLog(
            '파싱된 견적서 JSON 객체 (parsedInvoiceData):',
            parsedInvoiceData
          );
          naturalLanguageText = accumulatedText // 여기도 accumulatedText
            .replace(jsonScriptRegex, '')
            .trim();
          devLog(
            'JSON 제거 후 자연어 텍스트 (naturalLanguageText):',
            naturalLanguageText
          );

          if (parsedInvoiceData && parsedInvoiceData.invoiceGroup) {
            const initialItems = parsedInvoiceData.invoiceGroup.flatMap(
              (group) =>
                group.items.map((item) => ({ ...item, isDeleted: false }))
            );
            const { amount, duration, pages } = calculateTotals(initialItems);
            setInvoiceDetails({
              parsedJson: parsedInvoiceData,
              items: initialItems,
              currentTotal: amount,
              currentTotalDuration: duration,
              currentTotalPages: pages,
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
                ? { ...msg, text: accumulatedText, invoiceData: undefined } // 에러시에도 accumulatedText
                : msg
            );
          });
        }
      } else {
        devLog(
          '스크립트 태그에서 견적서 JSON 데이터를 찾지 못했습니다. AI 응답을 자연어로만 처리합니다.'
        );
        setInvoiceDetails(null);
        setMessages((prevMessages: Message[]) => {
          return prevMessages.map((msg) =>
            msg.id === aiMessageId
              ? { ...msg, text: naturalLanguageText, invoiceData: undefined } // 여기도 accumulatedText
              : msg
          );
        });
      }

      // --- AI 응답을 백엔드 API로 전송 ---
      if (isLoggedIn && accumulatedText.trim()) {
        // ⭐ aiResponseText 대신 accumulatedText 사용 ⭐
        if (
          sessionIndexForApiCall === null ||
          sessionIndexForApiCall === undefined
        ) {
          console.error(
            '[AiPageContent] No valid session index found for sending AI response to API. (loggedIn but no session after initial message)'
          );
          setLoading(false);
        }
        try {
          const aiApiPayload: ChatMessagePayload = {
            role: 'AI',
            sessionIndex: sessionIndexForApiCall,
            content: {
              message: naturalLanguageText || accumulatedText, // ⭐ accumulatedText 사용 ⭐
              ...(parsedInvoiceData && { invoiceData: parsedInvoiceData }),
            },
          };
          devLog(
            '[AiPageContent] Sending AI response to custom API:',
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
          '[AiPageContent] Skipping AI response API call for non-logged-in user.'
        );
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.';
      setError(errorMessage);
      console.error("❌ Error in handleGeminiSubmit's main try block:", err);
      setMessages((prevMessages: Message[]) => {
        // 오류 발생 시에도 마지막 AI 메시지를 찾아서 업데이트
        const lastAiMessage = prevMessages.findLast(
          (m) => m.id === aiMessageId && m.sender === 'ai'
        );
        if (lastAiMessage) {
          return prevMessages.map((msg) =>
            msg.id === aiMessageId
              ? {
                  ...msg,
                  text: `${accumulatedText}\n오류: ${errorMessage}`, // 누적된 텍스트 + 오류
                  invoiceData: undefined,
                }
              : msg
          );
        }
        // 만약 AI 메시지가 아직 추가되지 않았다면, 새롭게 오류 메시지 추가
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

  // Firebase 인증 상태 리스너 (AiPageContent 내에서 관리)
  useEffect(() => {
    devLog('[AiPageContent] Firebase auth listener - MOUNTING');
    setIsFirebaseChecking(true);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      devLog(
        '[AiPageContent] onAuthStateChanged CALLBACK TRIGGERED. Firebase user:',
        user
      );
      setIsFirebaseChecking(false);
      if (user) {
        devLog(`[AiPageContent] Firebase user DETECTED (UID: ${user.uid})`);
      } else {
        devLog('[AiPageContent] No Firebase user DETECTED.');
      }
    });
    return () => {
      devLog(
        '[AiPageContent] Firebase auth listener - UNMOUNTING. Unsubscribing.'
      );
      unsubscribe();
    };
  }, []); // 마운트 시 한 번만 실행

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
