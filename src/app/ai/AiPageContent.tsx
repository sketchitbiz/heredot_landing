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
import { useApiLimit } from '@/hooks/useApiLimit';
import useAiFlowStore from '@/store/aiFlowStore';
import DropdownInput from '@/components/DropdownInput';
import { userStamp } from '@/lib/api/user/api';

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
      uuid: localStorage.getItem('logId') ?? 'anonymous',
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
      // console.log('invoiceNode를 직접 캡처 시도함.');
      return;
    }

    console.log(
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

    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * contentWidth) / imgProps.width;
    const currentPosition = margin;

    if (imgHeight <= pdfHeight - margin * 2) {
      // 한 페이지에 다 들어가는 경우
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        currentPosition,
        contentWidth,
        imgHeight
      );
    } else {
      // 여러 페이지에 걸쳐야 하는 경우 (여기서는 첫 페이지만 추가, 추후 개선 가능)
      console.warn(
        '견적서 내용이 길어 PDF 한 페이지를 초과합니다. 현재는 첫 페이지만 생성됩니다.'
      );
      pdf.addImage(
        imgData,
        'PNG',
        margin,
        currentPosition,
        contentWidth,
        pdfHeight - margin * 2
      );
      // TODO: 여러 페이지 지원 로직 추가 (예: 이미지를 잘라서 여러 페이지에 추가)
    }

    pdf.save(`견적서-${invoiceDetailsData.parsedJson.project || '내역'}.pdf`);
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
  const user = authStore((state: AuthState) => state.user);

  const { remainingCount, decreaseCount, isLimitInitialized } =
    useApiLimit(isLoggedIn);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const loginDataStr = localStorage.getItem('loginData');
      if (loginDataStr) {
        console.log('로컬 스토리지에서 로그인 데이터 발견');
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
              console.log('전화번호 정보가 없어 추가 정보 모달 표시');
              openAdditionalInfoModal();
            } else {
              console.log('전화번호 정보가 이미 존재함');
            }
            localStorage.removeItem('loginData');
            console.log('로그인 처리 완료 및 로컬 스토리지 데이터 삭제');
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
    console.log('[AiPageContent] handleActionClick called with:', action, data);

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
      console.log('PDF 다운로드 요청');
      if (invoiceDetails && invoiceDetails.parsedJson) {
        const userCountry = authStore.getState().user?.countryCode || 'KR';
        await generateInvoicePDF(invoiceDetails, lang, userCountry, t);
      } else {
        addMessageToChat({
          id: Date.now(),
          sender: 'ai',
          text:
            t.pdf?.downloadFailed ||
            t.pdfNotAvailable ||
            '다운로드할 견적서 데이터가 없습니다.',
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
        )}`
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
        )}`
      );
    } else if (action === 'discount_ai_suggestion') {
      const feedbackMsg =
        t.userActionFeedback?.discountAiSuggestion ||
        'AI 심층 분석 및 기능 제안을 요청했습니다.';
      addMessageToChat({ id: Date.now(), sender: 'user', text: feedbackMsg });
      setCurrentModelIdentifier('gemini-2.5-flash-preview-04-17');
      console.log(
        '[AiPageContent] Switched model for AI suggestion to gemini-2.5-flash-preview-04-17.'
      );
      await new Promise<void>((resolve) => {
        const interval = setInterval(() => {
          if (
            isInitialized.current &&
            modelName === 'gemini-2.5-flash-preview-04-17'
          ) {
            clearInterval(interval);
            console.log(
              '[AiPageContent] Advanced model initialized for suggestion.'
            );
            resolve();
          }
        }, 100);
      });
      let analysisPrompt = `현재 이 사용자의 견적서 정보는 다음과 같습니다: ${JSON.stringify(
        invoiceDetails?.parsedJson
      )}. 이 정보를 바탕으로 비즈니스 성장을 위해 추가적으로 필요하거나 개선할 수 있는 기능들을 심층적으로 분석하여 제안해주세요. 제안 시에는 각 기능의 필요성, 기대 효과, 예상되는 개발 규모 (간단, 보통, 복잡 등)를 포함해주세요.`;
      if (lang === 'en') {
        analysisPrompt = `The user\'s current estimate details are as follows: ${JSON.stringify(
          invoiceDetails?.parsedJson
        )}. Based on this information, please conduct an in-depth analysis and suggest additional features or improvements that could contribute to business growth. When making suggestions, include the necessity of each feature, expected benefits, and an estimated development scale (e.g., simple, moderate, complex).`;
      }
      try {
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
        console.log(
          '[AiPageContent] Switched back to default model gemini-2.0-flash.'
        );
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
            remainingCount={remainingCount}
            isLoggedIn={isLoggedIn}
            isApiLimitInitialized={isLimitInitialized}
            lang={lang}
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
