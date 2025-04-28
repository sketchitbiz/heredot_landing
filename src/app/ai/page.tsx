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
import { AiChatMessage } from "@/components/Ai/AiChatMessage";
import useAI from "@/hooks/useAI"; // 경로 확인 필요

// --- 데이터 정의 ---
const stepData = [
  // Step 1: 개발 항목 선택
  {
    id: "platform",
    title: "여기닷 AI",
    subtitle: "안녕하세요, AI 견적서 도우미입니다.\n제작을 원하시는 플랫폼을 선택해주세요.",
    selectionTitle: "플랫폼 선택 (중복 가능)",
    options: [
      { id: "pc", label: "PC" },
      { id: "mobile", label: "모바일" },
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
    title: "여기닷 AI",
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
    title: "여기닷 AI",
    subtitle: "개발 카테고리를 선택해주세요.",
    selectionTitle: "카테고리 선택 (중복 가능)",
    options: [
      { id: "board", label: "게시판앱" },
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
    selectionMode: "multiple" as const,
    showWebAppComponent: false, // 필요시 true로 변경하여 WEB/APP 섹션 표시 가능
    infoText:
      "• 제작하려는 서비스와 가장 유사한 카테고리를 선택해주세요.\n• 여러 카테고리에 해당될 경우 모두 선택 가능합니다.",
    progress: { title: "개발 카테고리 선택", description: "세부 기능 또는\n 산업군 선택" },
  },
  // --- 추가 단계 데이터 ---
];

// --- 메시지 타입 정의 (복구) ---
interface Message {
  id: number;
  sender: "user" | "ai";
  text: string;
}

// --- 스타일 컴포넌트 (기존 것 유지 및 일부 수정) ---
const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  background-color: ${AppColors.background}; // 변경
  color: ${AppColors.onBackground}; // 변경
  ${customScrollbar(AppColors.background)}// customScrollbar 적용
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
  ${customScrollbar(AppColors.background)}// customScrollbar 적용 (배경색은 Container와 동일)
`;

const ChatMessagesContainer = styled.div`
  width: 100%;
  max-width: 48rem;
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

const InputContainer = styled.form`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${AppColors.inputDisabled}; // 항상 비활성화 색상 유지
  border: 1px solid ${AppColors.border};
  border-radius: 9999px;
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

const Input = styled.input`
  flex: 1;
  background-color: transparent;
  border: none;
  outline: none;
  color: ${AppColors.onBackground};
  ${AppTextStyles.body2}

  &::placeholder {
    color: ${AppColors.disabled}; // onSurfaceVariant -> disabled
  }

  &:disabled {
    cursor: not-allowed;
    color: ${AppColors.disabled};
  }
`;

export default function AIPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { chat } = useAI(); // 경로 확인 필요

  const [currentStep, setCurrentStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string[]>>({});
  const [isFreeFormMode, setIsFreeFormMode] = useState(false);

  const [messages, setMessages] = useState<Message[]>([]); // 타입 복구
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      // 직접 상태 업데이트 제거 -> useEffect가 처리
      // setIsFreeFormMode(true);
    }
  };

  const handlePrevious = () => {
    if (isFreeFormMode) return; // 자유 질문 모드에서는 이전 불가

    if (currentStep > 0) {
      const prevStep = currentStep - 1;
      // 이전 단계로 이동 시 selections는 유지하고 step만 변경, mode 제거
      updateUrlParams({ step: prevStep, mode: undefined });
      // 직접 상태 업데이트 제거 -> useEffect가 처리
      // setCurrentStep(prevStep);
    }
  };

  // Gemini API 호출 함수 (디버깅 로그 유지)
  const handleGeminiSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("handleGeminiSubmit called");
    console.log(
      `DEBUG: prompt='${prompt}', loading=${loading}, isFreeFormMode=${isFreeFormMode}, chat.current=${!!chat.current}, chat.current.sendMessage=${!!chat
        .current?.sendMessage}`
    );

    if (!prompt || loading || !isFreeFormMode || !chat.current?.sendMessage) {
      console.error("Submit prevented by conditions.");
      return;
    }

    const userMessage: Message = { id: Date.now(), sender: "user", text: prompt }; // 타입 복구
    setMessages((prev) => [...prev, userMessage]);
    const currentPrompt = prompt;
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const result = await chat.current.sendMessage(currentPrompt);
      const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "AI 응답 구조 확인 필요";
      console.log("AI Response Object:", result);
      const aiMessage: Message = { id: Date.now() + 1, sender: "ai", text }; // 타입 복구
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error sending message via useAI:", err);
      const errorAiMessage: Message = { id: Date.now() + 1, sender: "ai", text: `오류: ${errorMessage}` }; // 타입 복구
      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setLoading(false);
    }
  };

  // gridColumns 임시 any 유지 (나중에 수정 권장)
  const gridColumnsValue = currentStepData?.gridColumns as any;

  return (
    <Container>
      <MainContent>
        <ChatContainer>
          <ChatContent>
            <ChatMessagesContainer>
              {/* 자유 질문 모드 안내 UI 복구 필요 */}
              {isFreeFormMode && (
                <FlexContainer>
                  <ProfileImage src="/pretty.png" alt="AI 프로필" />
                  {/* 여기에 FreeFormGuide 또는 유사한 안내 컴포넌트 렌더링 */}
                  <div>
                    <h3>이제 자유질문입니다!</h3>
                    <p>원하시는 질문 자유롭게 질문해주세요!</p>
                    {/* ... 더 자세한 안내 ... */}
                  </div>
                </FlexContainer>
              )}

              {!isFreeFormMode && currentStepData && (
                <FlexContainer>
                  <ProfileImage src="/pretty.png" alt="AI 프로필" />
                  <AiChatQuestion
                    key={currentStep}
                    {...currentStepData}
                    gridColumns={gridColumnsValue} // 임시 any
                    selectionMode={currentStepData.selectionMode}
                    initialSelection={initialSelection}
                    onNext={handleNext}
                    onPrevious={handlePrevious}
                  />
                </FlexContainer>
              )}

              {/* 메시지 맵핑 (타입 복구됨) */}
              {messages.map((msg) => (
                <AiChatMessage key={msg.id} sender={msg.sender} text={msg.text} />
              ))}

              {loading && <StatusMessage>AI 응답을 생성 중입니다...</StatusMessage>}
              {error && !loading && <StatusMessage className="error">오류: {error}</StatusMessage>}

              <div ref={chatEndRef} />
            </ChatMessagesContainer>
          </ChatContent>

          <MessageInput>
            {/* --- 디버깅용 상태 표시 --- */}
            <div style={{ textAlign: "center", fontSize: "12px", color: "gray", marginBottom: "10px" }}>
              <span>FreeForm: {String(isFreeFormMode)} | </span>
              <span>Loading: {String(loading)} | </span>
              <span>Prompt Empty: {String(!prompt)}</span>
            </div>
            {/* ------------------------ */}

            <InputContainer onSubmit={handleGeminiSubmit} data-active={isFreeFormMode && !loading}>
              <Input
                type="text"
                placeholder={isFreeFormMode ? "메시지를 입력하세요..." : "기초자료 조사는 입력이 불가합니다."}
                disabled={!isFreeFormMode || loading}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
              <IconContainer type="submit" disabled={!isFreeFormMode || loading || !prompt}>
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
