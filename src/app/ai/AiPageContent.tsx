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
import { auth } from '@/lib/firebase/firebase.config';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';
import AdditionalInfoModal from './AdditionalInfoModal';
import { useApiLimit } from '@/hooks/useApiLimit';
import useAiFlowStore from '@/store/aiFlowStore';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';
import { devLog } from '@/lib/utils/devLogger';

// 컴포넌트 임포트
import { getStepData, ChatDictionary } from './components/StepData';
import MessageInput from './components/MessageInput';
import ChatContent from './components/ChatContent';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client'; // React 18용
// import ReactDOM from 'react-dom'; // React 17용
import { PrintableInvoice } from '@/components/Ai/AiChatMessage'; // PrintableInvoice 임포트

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
    // 사용자에게 오류 메시지를 표시할 수 있습니다 (예: alert 또는 채팅 메시지).
    return;
  }

  const invoiceNode = document.createElement('div');
  invoiceNode.setAttribute('id', 'printable-invoice-container-for-pdf-wrapper');
  invoiceNode.style.position = 'absolute';
  invoiceNode.style.left = '-9999px';
  invoiceNode.style.top = '-9999px';
  invoiceNode.style.zIndex = '-1'; // 화면에 보이지 않도록
  document.body.appendChild(invoiceNode);

  // React 18+ createRoot 사용
  const root = createRoot(invoiceNode);
  root.render(
    <PrintableInvoice
      invoiceData={invoiceDetailsData.parsedJson}
      invoiceDetailsForPdf={invoiceDetailsData} // currentItems 포함된 전체 invoiceDetails 전달
      t={translations} // 전체 번역 객체 전달
      countryCode={userCountryCode}
      lang={currentLang}
    />
  );
  // React 17의 경우:
  // ReactDOM.render(<PrintableInvoice ... />, invoiceNode);

  try {
    // 잠시 기다려 DOM 업데이트 및 스타일 적용 시간 확보 (시간 증가)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const printableContent = invoiceNode.querySelector(
      '#printable-invoice-content'
    );
    if (!printableContent) {
      console.error(
        'PDF로 변환할 #printable-invoice-content 요소를 찾을 수 없습니다. invoiceNode 내부를 확인합니다:',
        invoiceNode.innerHTML
      );
      // 추가적인 디버깅을 위해 invoiceNode 자체를 캡처 시도 (스타일이 깨질 수 있음)
      // const canvas = await html2canvas(invoiceNode as HTMLElement, { ... });
      // devLog('invoiceNode를 직접 캡처 시도함.');
      return;
    }

    devLog(
      '#printable-invoice-content 요소를 찾았습니다. 캡처를 시도합니다.',
      printableContent
    );
    const canvas = await html2canvas(printableContent as HTMLElement, {
      scale: 2,
      useCORS: true,
      logging: process.env.NODE_ENV === 'development', // 개발 모드에서만 로깅 활성화
      backgroundColor: '#ffffff', // 배경색 흰색으로 명시
      scrollX: 0, // 내부 스크롤 고려 안함
      scrollY: -window.scrollY, // 현재 페이지 스크롤 위치 보정
      windowWidth: printableContent.scrollWidth, // 콘텐츠 너비 사용
      windowHeight: printableContent.scrollHeight, // 콘텐츠 높이 사용
    });

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'p',
      unit: 'mm',
      format: 'a4',
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const margin = 10; // 양쪽 여백 10mm
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

      // 원본 이미지에서 필요한 부분만 잘라서 복사
      ctx.drawImage(
        canvas,
        0,
        position, // 원본 이미지 시작 위치
        canvas.width,
        canvasPage.height, // 원본에서 자를 크기
        0,
        0, // 대상 캔버스 위치
        canvas.width,
        canvasPage.height // 대상 캔버스 크기
      );

      const imgDataPage = canvasPage.toDataURL('image/png');
      const imgHeight = (canvasPage.height * contentWidth) / canvasPage.width;

      pdf.addImage(imgDataPage, 'PNG', margin, margin, contentWidth, imgHeight);

      position += pxPageHeight;

      // 다음 페이지 추가 필요 시
      if (position < pxFullHeight) {
        pdf.addPage();
      }
    }

    const pdfBlob = pdf.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    const newWindow = window.open(pdfUrl, '_blank');

    // 새 창이 열린 후 URL을 해제하여 메모리 누수를 방지합니다.
    // 팝업 차단 등에 의해 새 창이 안 열릴 수도 있으므로 newWindow 객체 확인
    if (newWindow) {
      newWindow.onload = () => {
        URL.revokeObjectURL(pdfUrl);
      };
    } else {
      // 새 창 열기 실패 시 사용자에게 알림을 주거나 콘솔에 로깅할 수 있습니다.
      console.error(
        'PDF를 새 창으로 열지 못했습니다. 팝업 차단 설정을 확인해주세요.'
      );
      // 이 경우에도 URL을 즉시 해제합니다.
      URL.revokeObjectURL(pdfUrl);
      // 사용자에게 파일 다운로드를 유도할 수도 있습니다.
      // pdf.save(`견적서-${invoiceDetailsData.parsedJson.project || '내역'}.pdf`);
    }
  } catch (pdfError) {
    console.error('PDF 생성 중 오류 발생:', pdfError);
    // 사용자에게 오류 알림 (예: setMessages 사용)
  } finally {
    // React 18+ createRoot 사용 시
    root.unmount();
    // React 17의 경우:
    // ReactDOM.unmountComponentAtNode(invoiceNode);
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

  const [isFirebaseChecking, setIsFirebaseChecking] = useState(true);

  const { remainingCount, decreaseCount, isLimitInitialized } =
    useApiLimit(isLoggedIn);

  const fileInputRef = useRef<HTMLInputElement>(null);
  let isModelInitializing = false;
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
  }, [
    searchParams,
    stepData.length,
    setCurrentStep,
    setAiFlowStoreSelections,
    setIsFreeFormMode,
  ]);

  useEffect(() => {
    devLog('[AiPageContent] Firebase auth listener - MOUNTING');
    setIsFirebaseChecking(true); // 리스너 시작 시 체크 중으로 설정

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      // async 키워드 추가
      devLog(
        '[AiPageContent] onAuthStateChanged CALLBACK TRIGGERED. Firebase user:',
        user
      );
      if (user) {
        // 사용자가 이미 로그인되어 있는 경우 (일반 로그인 또는 이전 익명 로그인 포함)
        devLog(
          `[AiPageContent] Firebase user DETECTED (UID: ${user.uid}, Anonymous: ${user.isAnonymous})`
        );
        setIsFirebaseChecking(false); // 사용자 확인 후 체크 완료
      } else {
        // 로그인된 사용자가 없는 경우, 익명으로 로그인 시도
        devLog(
          '[AiPageContent] No Firebase user DETECTED. Attempting anonymous sign-in...'
        );
        try {
          await signInAnonymously(auth);
          devLog(
            '[AiPageContent] Firebase anonymous sign-in attempt successful. Waiting for new auth state.'
          );
          // 익명 로그인 성공 후, onAuthStateChanged가 새로운 user 정보와 함께 다시 호출됩니다.
          // 그때 위의 if (user) 블록이 실행되면서 setIsFirebaseChecking(false)가 호출될 것입니다.
          // 따라서 이 부분에서 즉시 setIsFirebaseChecking(false)를 호출할 필요는 없습니다.
        } catch (error) {
          console.error(
            '[AiPageContent] Firebase anonymous sign-in FAILED:',
            error
          );
          // 익명 로그인 시도 자체가 실패하면, 체크 상태를 false로 설정하여 무한 로딩 등을 방지합니다.
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
        true // 시스템 시작 프롬프트로 표시
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
        true // 시스템 시작 프롬프트로 표시
      );
    } else if (action === 'discount_ai_suggestion') {
      if (isModelInitializing) {
        devLog('[AiPageContent] 모델 초기화 중복 요청 방지됨.');
        return; // 이미 초기화 중이면 바로 리턴
      }
      isModelInitializing = true;

      const feedbackMsg =
        t.userActionFeedback?.discountAiSuggestion ||
        'AI 심층 분석 및 기능 제안을 요청했습니다.';
      addMessageToChat({ id: Date.now(), sender: 'user', text: feedbackMsg });

      setCurrentModelIdentifier('gemini-2.5-flash-preview-04-17');
      devLog(
        '[AiPageContent] Switched model for AI suggestion to gemini-2.5-flash-preview-04-17.'
      );

      try {
        await new Promise<void>((resolve, reject) => {
          const timeout = setTimeout(() => {
            clearInterval(interval);
            reject(new Error('모델 초기화 시간이 초과되었습니다.'));
          }, 5000); // 5초로 연장

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
        setCurrentModelIdentifier('gemini-2.0-flash');
        devLog(
          '[AiPageContent] Switched back to default model gemini-2.0-flash.'
        );
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

  const handleGeminiSubmit = async (
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

    // --- 네비게이션 제목 업데이트 로직 추가 시작 ---
    const queryParams = new URLSearchParams(window.location.search);
    const currentSessionId = queryParams.get('sessionId');

    // messages 배열이 비어있거나, 사용자의 첫번째 메시지라고 판단되는 시점에 실행
    // (actionPrompt가 없고, isSystemInitiatedPrompt가 false일 때 사용자가 직접 입력한 첫 메시지로 간주)
    if (
      currentSessionId &&
      !actionPrompt &&
      !isSystemInitiatedPrompt &&
      messages.filter((m) => m.sender === 'user').length === 0
    ) {
      if (submissionPrompt.trim()) {
        localStorage.setItem(
          `firstUserMessageFor_${currentSessionId}`,
          submissionPrompt
        );
        localStorage.setItem('updateQuoteTitleFor', currentSessionId);
        devLog(
          `[AiPageContent] First user message for session ${currentSessionId} saved to localStorage:`,
          submissionPrompt
        );
      }
    }
    // --- 네비게이션 제목 업데이트 로직 추가 끝 ---

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
    const messagesToAdd = [initialAiMessage];
    if (!isSystemInitiatedPrompt) {
      messagesToAdd.unshift(userMessage as Message);
    }
    setMessages((prev) => [...prev, ...messagesToAdd]);
    if (!actionPrompt && !isSystemInitiatedPrompt) {
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
      let aiResponseText = '';
      for await (const item of streamResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          aiResponseText += chunkText;
        }
      }
      devLog('AI 전체 응답 (aiResponseText):', aiResponseText);

      // --- AI 응답 저장 로직 추가 시작 ---
      if (currentSessionId && aiResponseText.trim()) {
        localStorage.setItem(
          `aiResponseFor_${currentSessionId}`,
          aiResponseText
        );
        devLog(
          `[AiPageContent] AI response for session ${currentSessionId} saved to localStorage.`
        );
      }
      // --- AI 응답 저장 로직 추가 끝 ---

      const jsonScriptRegex =
        /<script type="application\/json" id="invoiceData">([\s\S]*?)<\/script>/;
      const jsonMatch = aiResponseText.match(jsonScriptRegex);
      devLog('JSON 추출 시도 결과 (jsonMatch):', jsonMatch);
      let parsedInvoiceData: InvoiceDataType | null = null;
      let naturalLanguageText = aiResponseText;
      if (jsonMatch && jsonMatch[1]) {
        const jsonString = jsonMatch[1];
        devLog('추출된 JSON 문자열 (jsonString):', jsonString);
        try {
          parsedInvoiceData = JSON.parse(jsonString) as InvoiceDataType;
          devLog(
            '파싱된 견적서 JSON 객체 (parsedInvoiceData):',
            parsedInvoiceData
          );
          naturalLanguageText = aiResponseText
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
                ? { ...msg, text: aiResponseText, invoiceData: undefined }
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
