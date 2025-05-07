"use client";

import styled from "styled-components";
// import { PhotoDataContainer } from "@/components/PhotoDataContainer"; // 사용 안 함
// import { ProfileDataContainer } from "@/components/ProfileDataContainer"; // 사용 안 함
import { Send } from "@mui/icons-material"; // AddPhotoAlternate 제거
import { AppColors } from "@/styles/colors";
// import { TestContext } from "node:test"; // 사용 안 함
import { AppTextStyles } from "../../styles/textStyles";
import { useState, useEffect, useRef } from "react";
import { AiChatQuestion } from "@/components/Ai/AiChatQuestion";
import { AiProgressBar } from "@/components/Ai/AiProgressBar";
import { customScrollbar } from "@/styles/commonStyles";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { AiChatMessage, Message } from "@/components/Ai/AiChatMessage";
import useAI from "@/hooks/useAI"; // 경로 확인 필요

// Material UI & File Upload Imports
// import AttachFileIcon from '@mui/icons-material/AttachFile'; // 이전 아이콘 제거
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate"; // 새 아이콘 추가
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { FileUploadData, uploadFiles } from "@/lib/firebase/firebase.functions"; // 경로 확인 필요
import { Part, FileData } from "firebase/vertexai"; // FileDataPart 제거
import TextareaAutosize from "react-textarea-autosize"; // 라이브러리 import

// --- 데이터 정의 ---
const stepData = [
  // Step 1:
  //  선택
  {
    id: "platform",
    title: "강유하",
    subtitle: "안녕하세요, AI 견적상담사 강유하입니다.\n제작을 원하시는 플랫폼을 선택해주세요.",
    selectionTitle: "플랫폼 선택 (중복 가능)",
    options: [
      { id: "pc", label: "PC Web" },
      { id: "mobile", label: "Mobile Web" },
      { id: "AOS", label: "AOS" },
      { id: "IOS", label: "IOS" },
      { id: "Windows", label: "Windows" },
    ],
    gridColumns: 5,
    selectionMode: "multiple" as const,
    showWebAppComponent: false, // 이 단계에서는 WEB/APP 없음
    infoText: "• AI 견적서는 90%의 정확도를 가지고 있습니다.\n• 확정 견적 문의는 '여기닷'으로 견적요청 바랍니다.",
    progress: { title: "개발 항목 선택", description: "PC, 모바일 등\n개발 환경 선택" },
  },
  // Step 2: 개발 분량 선택
  {
    id: "volume",
    title: "강유하",
    subtitle: "개발 분량을 선택해주세요.",
    selectionTitle: "페이지 수 선택 (단일 선택)",
    options: [
      { id: "lt5", label: "5장 미만" },
      { id: "lt10", label: "10장 미만" },
      { id: "lt20", label: "20장 미만" },
      { id: "lt30", label: "30장 미만" },
      { id: "lt40", label: "40장 미만" },
      { id: "lt50", label: "50장 미만" },
      { id: "lt70", label: "70장 미만" },
      { id: "lt90", label: "90장 미만" },
      { id: "gt100", label: "100장 이상" },
    ],
    gridColumns: 3,
    selectionMode: "single" as const,
    showWebAppComponent: false, // 이 단계에서는 WEB/APP 없음
    infoText:
      "• 기획서 또는 화면 설계서 기준 페이지 수 입니다.\n• 정확한 페이지 수를 모를 경우 예상 페이지 수를 선택해주세요.",
    progress: { title: "개발 분량 선택", description: "디자인 또는 기획서 기준\n페이지 수 선택" },
  },
  // Step 3: 개발 카테고리 선택
  {
    id: "category",
    title: "강유하",
    subtitle: "개발 카테고리를 선택해주세요.",
    selectionTitle: "카테고리 선택 (단일 선택)",
    options: [
      { id: "travel", label: "여행/교통" },
      { id: "iot", label: "IoT앱" },
      { id: "health", label: "건강/의료" },
      { id: "finance", label: "금융/펀드" },
      { id: "food", label: "식음료" },
      { id: "community", label: "커뮤니티" },
      { id: "shopping", label: "쇼핑(의류)" },
      { id: "reverse_auction", label: "역경매" },
      { id: "used_trade", label: "중고거래" },
      { id: "o2o", label: "O2O" },
      { id: "solution", label: "솔루션" },
      { id: "platform", label: "플랫폼" },
      { id: "erp", label: "전산" },
      { id: "manufacturing", label: "제조" },
      { id: "drone", label: "드론" },
      { id: "quote_sys", label: "견적Sys" },
      { id: "ai", label: "AI" },
      { id: "etc", label: "기타" },
    ],
    gridColumns: 3,
    selectionMode: "single" as const,
    showWebAppComponent: false, // 필요시 true로 변경하여 WEB/APP 섹션 표시 가능
    infoText: "• 제작하려는 서비스와 가장 유사한 카테고리를 선택해주세요.",
    progress: { title: "개발 카테고리 선택", description: "세부 기능 또는\n 산업군 선택" },
  },
  // --- 추가 단계 데이터 ---
];

// --- 스타일 컴포넌트 (기존 것 유지 및 일부 수정) ---
const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${AppColors.background}; // 변경
  color: ${AppColors.onBackground}; // 변경
  ${customScrollbar()}// customScrollbar 적용 (인자 없이 호출)
`;

const MainContent = styled.div`
  flex: 4; // 비율 조절
  display: flex;
  flex-direction: column; // 내부 요소 세로 정렬
  height: 100vh;
  max-width: 1920px; // 최대 너비 유지
  margin: 0 auto; // 중앙 정렬
  overflow: hidden; // 내부 스크롤 방지 (ChatContent에서 처리)
`;

const ChatContainer = styled.div`
  flex: 1; // 남은 공간 차지
  display: flex;
  width: 100%;
  flex-direction: column; // 내부 요소 세로 정렬
  height: 100%; // 부모 높이 채우기
  overflow: hidden; // 스크롤은 ChatContent에서
`;

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: flex-start;
`;

const ProfileImage = styled.img`
  height: 3rem;
  width: 3rem;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 1.5rem;
`;

const ChatContent = styled.div`
  flex: 1; // 메시지 영역이 남은 공간 차지
  padding: 2rem 4rem; // 패딩 조정
  display: flex;
  flex-direction: column;
  align-items: center; // 가로 중앙 정렬
  /* justify-content: center; // 세로 중앙 정렬 제거 (위에서부터 시작) */
  height: calc(100vh - 100px); // 헤더/푸터 제외한 높이 (MessageInput 높이 고려 필요)
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
  ${AppTextStyles.body2}

  &.error {
    color: ${AppColors.error};
  }
`;

const MessageInput = styled.div`
  padding: 2rem 2rem;
  border-top: 1px solid ${AppColors.border};
  background-color: ${AppColors.background};
  margin-top: auto;
`;

// Input styled-component는 이제 TextareaAutosize를 감싸도록 변경
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
    trackColor: "#262528", // 스크롤바 배경색
    // thumbColor: AppColors.scroll, // 막대 색상은 기본값 사용 (AppColors.scroll)
    // thumbHoverColor는 mixin에서 직접 지원하지 않으므로 제거
  })}
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
    background-color: ${AppColors.disabled}; // disabledHover -> disabled
  }

  .MuiSvgIcon-root {
    color: ${AppColors.iconPrimary};
    font-size: 1.25rem;
  }
`;

// --- 새 ProfileName 스타일 정의 ---
const ProfileName = styled.p`
  font-size: 20px;
  color: ${AppColors.onBackground};
  font-weight: bold;
  margin: 0; /* 마진 제거 */
  margin-top: 0.6rem; /* 아래쪽 간격 약간 추가 */
`;

// --- FreeFormGuide 스타일 수정 ---
const FreeFormGuide = styled.div`
  width: 100%;
  max-width: 48rem;
  font-weight: 300;
  padding: 0;
  background-color: ${AppColors.background};
  border-radius: 8px;
  text-align: left;
  color: #9ca3af;
  line-height: 1.6;

  p {
    margin-bottom: 1rem;
    color: ${AppColors.onBackground};
    font-weight: 400;
    font-weight: 300;
  }

  ul {
    list-style: none;
    padding-left: 0;
    margin-bottom: 1.5rem;
  }

  li {
    margin-bottom: 0.75rem;
    ${AppTextStyles.body2};
    color: #ffffff; /* 흰색으로 변경 */
    padding-left: 1.25rem;
    position: relative;
    font-weight: 400;

    &::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      color: ${AppColors.primary}; /* Bullet 색상 유지 */
    }

    strong {
      font-weight: 400;
    }
    span {
      color: ${AppColors.onPrimaryGray};
      display: block;
      margin-left: 0.5rem;
      margin-top: 0.25rem;
      font-weight: 300;
    }
  }
`;
// ------------------------------------

// --- 새 파일 관련 스타일 ---
const UploadedFilePreview = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  background-color: ${AppColors.onSurfaceVariant};
  border-radius: 4px;
  margin-bottom: 0.5rem;
  max-width: fit-content; /* 내용물 크기에 맞춤 */

  span {
    font-size: 0.8rem;
    color: #ffffff;
    max-width: 150px; /* 파일 이름 최대 너비 */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

const UploadedFilesContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin: 0 auto 1rem auto; /* 위아래 마진 추가 및 중앙 정렬 */
  max-width: 48rem; /* InputContainer와 동일 너비 */
  justify-content: center; /* 파일 목록 중앙 정렬 */
  color: #ffffff;
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
// -------------------------

// 컴포넌트 이름을 AiPageContent로 변경
export default function AiPageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { chat } = useAI(); // chat 변수 주석 해제

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isFreeFormMode, setIsFreeFormMode] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // --- File Upload State ---
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadData[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  // -------------------------

  // URL 파라미터 -> 상태 동기화 Effect
  useEffect(() => {
    const stepParam = searchParams.get("step");
    const selectionsParam = searchParams.get("selections");
    const modeParam = searchParams.get("mode");

    // Step 파싱 및 유효성 검사
    let step = 0;
    if (stepParam) {
      const parsedStep = parseInt(stepParam, 10);
      if (!isNaN(parsedStep) && parsedStep >= 0 && parsedStep < stepData.length) {
        step = parsedStep;
      }
    }

    // Selections 파싱
    let sels = {};
    if (selectionsParam) {
      try {
        sels = JSON.parse(selectionsParam);
      } catch (error) {
        console.error("Error parsing selections from URL:", error);
        // 파싱 오류 시 빈 객체 사용
      }
    }

    // Mode 확인
    const freeForm = modeParam === "freeform";

    // 상태 업데이트
    setCurrentStep(step);
    setSelections(sels);
    setIsFreeFormMode(freeForm);
  }, [searchParams]); // searchParams가 변경될 때마다 실행

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const currentStepData = !isFreeFormMode ? stepData[currentStep] : null;
  const progressSteps = stepData.map((step) => step.progress);
  const initialSelection = currentStepData ? selections[currentStepData.id] || [] : [];

  // URL 업데이트 헬퍼 함수
  const updateUrlParams = (newParams: Record<string, string | number | undefined>) => {
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

    const updatedSelections = { ...selections, [currentStepData.id]: selectedIds };
    const selectionsString = JSON.stringify(updatedSelections);

    if (currentStep < stepData.length - 1) {
      const nextStep = currentStep + 1;
      updateUrlParams({ selections: selectionsString, step: nextStep, mode: undefined });
    } else {
      // 마지막 단계 완료 시: mode=freeform 추가, step 제거
      updateUrlParams({ selections: selectionsString, mode: "freeform", step: undefined });
    }
  };

  const handlePrevious = () => {
    if (isFreeFormMode) return; // 자유 질문 모드에서는 이전 불가

    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      // 이전 단계로 이동 시 selections는 유지하고 step만 변경, mode 제거
      updateUrlParams({ step: prevStep, mode: undefined });
    }
  };

  // --- 버튼 액션 처리 함수 수정 ---
  const handleActionClick = (action: string) => {
    console.log("Action clicked:", action);
    switch (action) {
      case "show_invoice":
        // AI에게 견적서 생성을 직접 요청
        handleGeminiSubmit(null, "견적서를 보여줘");
        break;
      case "discount_extend_3w_20p":
        // 할인 옵션 1 선택 메시지 직접 전송
        handleGeminiSubmit(null, "할인 옵션 1 (기간 연장)을 선택합니다.");
        break;
      case "discount_remove_features":
        // 할인 옵션 2 선택 메시지 직접 전송
        handleGeminiSubmit(null, "할인 옵션 2 (기능 제거)를 선택합니다.");
        break;
      case "download_pdf":
        alert("PDF 다운로드 기능은 로그인 후 사용할 수 있습니다. (구현 예정)");
        break;
      default:
        console.warn("Unknown button action:", action);
    }
  };

  // --- 파일 처리 핸들러 ---
  const handleIconUploadClick = () => {
    fileInputRef.current?.click();
  };

  // 엔터 키 처리 함수
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Enter 키 단독 입력 시 (Shift 키 X)
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // textarea의 기본 Enter 동작(줄바꿈) 막기
      handleGeminiSubmit(null); // 메시지 전송 함수 호출 (이벤트 객체 불필요)
    }
    // Shift + Enter는 기본 동작(줄바꿈) 수행
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    uploadFiles(Array.from(selectedFiles), {
      onUpload: (data) => setUploadedFiles((prev) => [...prev, data]),
      progress: (percent) => setUploadProgress(percent),
    });
    if (e.target) {
      e.target.value = "";
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
    // TODO: Optionally delete from Firebase Storage using deleteImage function
    // import { deleteImage } from '@/lib/firebase/firebase.functions';
    // deleteImage(fileUri, { onSuccess: () => console.log('Deleted from storage') });
  };
  // ------------------------

  // --- Gemini API 호출 함수 수정 (파일 처리 추가) ---
  const handleGeminiSubmit = async (e?: React.FormEvent | null, actionPrompt?: string) => {
    e?.preventDefault();
    const submissionPrompt = actionPrompt || prompt;

    // 파일 또는 프롬프트가 없으면 중단
    if ((!submissionPrompt && uploadedFiles.length === 0) || loading) {
      console.error("Submit prevented: No prompt or files, or already loading.");
      return;
    }

    // 기존 isFreeFormMode 체크 유지 (파일 업로드는 자유 질문 모드에서만 가능하다고 가정)
    if (!isFreeFormMode) {
      console.error("Submit prevented: File upload only in free form mode.");
      return;
    }

    console.log("handleGeminiSubmit called with prompt:", submissionPrompt, "Files:", uploadedFiles);
    setLoading(true);
    setError("");

    // 사용자 메시지 생성 (프롬프트 + 파일 목록 텍스트 + 이미지 정보)
    let userMessageText = submissionPrompt;
    let userMessageImageUrl: string | undefined = undefined;
    let userMessageFileType: string | undefined = undefined;

    if (uploadedFiles.length > 0) {
      userMessageText += `\n\n(첨부 파일: ${uploadedFiles.map((f) => f.name).join(", ")})`;
      const firstImageFile = uploadedFiles.find((file) => file.mimeType.startsWith("image/"));
      if (firstImageFile) {
        userMessageImageUrl = firstImageFile.fileUri;
        userMessageFileType = firstImageFile.mimeType;
      } else if (uploadedFiles.length > 0) {
        // 이미지가 아니더라도 첫 번째 파일의 타입을 기록 (선택 사항)
        userMessageFileType = uploadedFiles[0].mimeType;
      }
    }

    // Message 타입이 imageUrl 및 fileType을 포함하도록 업데이트되었다고 가정합니다.
    // 사용자가 직접 해당 파일을 수정해야 합니다.
    const userMessage = {
      id: Date.now(),
      sender: "user" as const,
      text: userMessageText,
      imageUrl: userMessageImageUrl,
      fileType: userMessageFileType,
    };

    // AI 메시지 객체도 일관성을 위해 동일한 구조를 가지지만, 여기서는 이미지 정보를 보내지 않습니다.
    const initialAiMessage = {
      id: Date.now() + 1,
      sender: "ai" as const,
      text: "",
      imageUrl: undefined,
      fileType: undefined,
    };

    // Type assertion is used here, assuming the user will update the Message type definition.
    setMessages((prev) => [...prev, userMessage as Message, initialAiMessage as Message]);

    if (!actionPrompt) {
      setPrompt("");
    }
    const currentFiles = [...uploadedFiles]; // 현재 파일 목록 복사
    setUploadedFiles([]); // 상태 초기화 (UI에서 제거)
    setUploadProgress(0); // 진행률 초기화

    try {
      // --- AI 요청 구성 ---
      const parts: Part[] = []; // 타입을 Part[]로 명시
      // 1. 기초 조사 요약 추가 (Part 객체 형태로)
      let selectionSummary = "";
      Object.entries(selections).forEach(([stepId, selectedOptions]) => {
        const stepInfo = stepData.find((step) => step.id === stepId);
        const stepTitle = stepInfo ? stepInfo.selectionTitle : stepId;
        if (selectedOptions && selectedOptions.length > 0) {
          const selectedLabels = selectedOptions.map((optionId) => {
            const option = stepInfo?.options.find((opt) => opt.id === optionId);
            return option ? option.label : optionId;
          });
          selectionSummary += `- ${stepTitle}: ${selectedLabels.join(", ")}\n`;
        }
      });
      selectionSummary += "\n";
      if (selectionSummary) parts.push({ text: selectionSummary + "\n" });

      // 2. 텍스트 프롬프트 추가 (Part 객체 형태로)
      if (submissionPrompt) parts.push({ text: submissionPrompt });

      // 3. 파일 데이터 추가 (기존 방식 유지 - 올바름)
      currentFiles.forEach((file) => {
        parts.push({ fileData: { mimeType: file.mimeType, fileUri: file.fileUri } as FileData });
      });
      // --- AI 요청 구성 완료 ---

      console.log("Sending parts to AI via ChatSession:", parts); // 로그 수정

      // chat 객체 존재 여부 확인
      if (!chat.current) {
        throw new Error("AI chat session is not initialized.");
      }

      // chat.sendMessageStream 사용 (model.generateContentStream 대신)
      const streamResult = await chat.current.sendMessageStream(parts); // parts 배열 직접 전달

      for await (const item of streamResult.stream) {
        const chunkText = item.candidates?.[0]?.content?.parts?.[0]?.text;
        if (chunkText) {
          // 메시지 업데이트 로직 (이전과 동일)
          setMessages((prevMessages: Message[]) => {
            const updatedMessages: Message[] = [...prevMessages];
            const lastMessageIndex = updatedMessages.length - 1;
            if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].sender === "ai") {
              const prevAiMessage = updatedMessages[lastMessageIndex];
              const newMessage: Message = {
                id: prevAiMessage.id,
                sender: prevAiMessage.sender,
                text: prevAiMessage.text + chunkText, // 이전 텍스트 + 새 청크
              };
              updatedMessages[lastMessageIndex] = newMessage;
            }
            return updatedMessages;
          });
        }
      }
    } catch (err) {
      // 오류 처리 (이전과 동일)
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error sending message with files:", err);
      setMessages((prevMessages: Message[]) => {
        const updatedMessages: Message[] = [...prevMessages];
        const lastMessageIndex = updatedMessages.length - 1;
        if (lastMessageIndex >= 0 && updatedMessages[lastMessageIndex].sender === "ai") {
          const prevAiMessage = updatedMessages[lastMessageIndex];
          const errorMessageObj: Message = {
            id: prevAiMessage.id,
            sender: prevAiMessage.sender,
            text: `오류: ${errorMessage}`,
          };
          updatedMessages[lastMessageIndex] = errorMessageObj;
        }
        return updatedMessages;
      });
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------------

  // gridColumns 타입 수정 및 기본값 설정
  const stepGridColumns = currentStepData?.gridColumns;
  // AiChatQuestion이 받는 타입 (1 | 2 | 3 | 4 | 5)으로 제한하고, 아니면 기본값 3 사용
  const gridColumnsForQuestion: 1 | 2 | 3 | 4 | 5 =
    typeof stepGridColumns === "number" && [1, 2, 3, 4, 5].includes(stepGridColumns)
      ? (stepGridColumns as 1 | 2 | 3 | 4 | 5)
      : 3; // 기본값 3

  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Container>
      <MainContent>
        <ChatContainer>
          <ChatContent onDrop={handleDropFiles} onDragOver={handleDragOver} onDragLeave={handleDragLeave}>
            {isDragging && <DragDropOverlay>파일을 여기에 놓으세요</DragDropOverlay>}
            <ChatMessagesContainer>
              {isFreeFormMode && (
                <FlexContainer>
                  <ProfileImage src="/pretty.png" alt="AI 프로필" />
                  <FreeFormGuide>
                    <ProfileName>
                      <strong>강유하</strong>
                    </ProfileName>
                    <div>
                      {/* ... */}
                      <p style={{ marginTop: "1.5rem" }}>다음과 같은 기능도 지원됩니다.</p>
                      <ul>
                        <li>
                          URL: 네이버, 다음 등 원하는 사이트 링크
                          <br />
                          {/* eslint-disable-next-line react/no-unescaped-entities */}
                          <span>ex) "www.naver.com 같은 사이트를 만들고 싶어요"</span>
                        </li>
                        <li>이미지: 캡처, JPG 등 이미지 파일</li>
                        <li>
                          PDF: 스토리보드 (설계/기획안) 등
                          <br />
                          <span>(※ 파워포인트, 엑셀 파일은 첨부 불가)</span>
                        </li>
                      </ul>
                      <p style={{ marginTop: "1.5rem" }}>
                        첨부와 함께 원하시는 내용을 설명해주시면 AI가 맞춤 견적을 제시해드립니다 😊
                      </p>
                    </div>
                  </FreeFormGuide>
                </FlexContainer>
              )}

              {!isFreeFormMode && currentStepData && (
                <FlexContainer>
                  <ProfileImage src="/pretty.png" alt="AI 프로필" />
                  <AiChatQuestion
                    key={currentStep}
                    {...currentStepData}
                    gridColumns={gridColumnsForQuestion} // 수정된 변수 사용
                    selectionMode={currentStepData.selectionMode}
                    initialSelection={initialSelection}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                </FlexContainer>
              )}

              {/* 메시지 맵핑: id prop 제거 */}
              {messages.map((msg) => (
                <AiChatMessage key={msg.id} sender={msg.sender} text={msg.text} onActionClick={handleActionClick} />
              ))}

              {loading && <StatusMessage>AI 응답을 생성 중입니다...</StatusMessage>}
              {error && !loading && <StatusMessage className="error">오류: {error}</StatusMessage>}

              <div ref={chatEndRef} />
            </ChatMessagesContainer>
          </ChatContent>

          <MessageInput>
            {/* 업로드된 파일 목록 표시 */}
            {uploadedFiles.length > 0 && (
              <UploadedFilesContainer>
                {uploadedFiles.map((file) => (
                  <UploadedFilePreview
                    key={file.fileUri}
                    style={{ height: file.mimeType.startsWith("image/") ? "100px" : "60px", alignItems: "center" }}>
                    {file.mimeType.startsWith("image/") ? (
                      <img
                        src={file.fileUri}
                        alt={file.name}
                        style={{
                          width: "100%", // 부모 높이에 맞춰 꽉 채우도록 수정 (UploadedFilePreview 높이 기준)
                          height: "100%",
                          objectFit: "contain",
                          borderRadius: "4px",
                          // marginRight는 UploadedFilePreview의 gap으로 처리되거나 필요시 유지
                        }}
                      />
                    ) : (
                      // 이미지가 아닌 파일: 아이콘 + 파일 이름 중앙 정렬을 위한 Flexbox
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                          textAlign: "center",
                        }}>
                        {/* TODO: 파일 타입별 아이콘 추가하면 좋음 */}
                        <span
                          title={file.name}
                          style={{
                            display: "block",
                            maxWidth: "120px",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}>
                          {file.name}
                        </span>
                      </div>
                    )}
                    <IconButton
                      onClick={() => handleDeleteFile(file.fileUri)}
                      size="small"
                      style={{ padding: "2px", marginLeft: "auto" }}
                      sx={{ color: "#FFFFFF" }} // 아이콘 색상을 흰색으로 변경
                    >
                      <CloseIcon fontSize="inherit" />
                    </IconButton>
                  </UploadedFilePreview>
                ))}
              </UploadedFilesContainer>
            )}
            {/* 업로드 진행률 표시 */}
            {uploadProgress > 0 && uploadProgress < 100 && (
              <div style={{ width: "100%", maxWidth: "48rem", margin: "0 auto 0.5rem auto" }}>
                <progress value={uploadProgress} max="100" style={{ width: "100%" }} />
              </div>
            )}

            <InputContainer onSubmit={handleGeminiSubmit} data-active={isFreeFormMode && !loading}>
              {/* 숨겨진 파일 입력 */}
              <input
                type="file"
                multiple
                accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,.xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,.txt,text/plain,.hwp,application/x-hwp" // 다양한 문서 타입 추가
                ref={fileInputRef}
                onChange={handleFileInputChange}
                style={{ display: "none" }}
                disabled={!isFreeFormMode || loading} // 자유모드 및 로딩 중 비활성화
              />
              {/* 파일 업로드 아이콘 버튼 (스타일 수정) */}
              <IconButton
                onClick={handleIconUploadClick}
                size="small"
                disabled={!isFreeFormMode || loading}
                sx={{
                  // sx prop으로 스타일 적용
                  padding: "0.5rem",
                  borderRadius: "50%",
                  background: AppColors.iconDisabled,
                  "&:hover": {
                    backgroundColor: AppColors.disabled,
                  },
                }}>
                <AddPhotoAlternateIcon sx={{ color: "#BBBBCF" }} /> {/* 아이콘 색상 적용 */}
              </IconButton>
              {/* Input 대신 AutoSizeInput 사용 */}
              <AutoSizeInput
                minRows={1} // 최소 줄 수
                maxRows={12} // 최대 줄 수 (max-height와 연동)
                placeholder={isFreeFormMode ? "메시지 또는 파일 첨부..." : "기초자료 조사는 입력이 불가합니다."}
                disabled={!isFreeFormMode || loading}
                value={prompt}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown} // 기존 핸들러 유지
              />
              <IconContainer
                type="submit"
                disabled={!isFreeFormMode || loading || (!prompt && uploadedFiles.length === 0)}>
                {" "}
                {/* 파일 없을때도 비활성화 */}
                <Send />
              </IconContainer>
            </InputContainer>
          </MessageInput>
        </ChatContainer>
      </MainContent>

      {!isFreeFormMode && <AiProgressBar steps={progressSteps} currentStep={currentStep} />}
    </Container>
  );
}
