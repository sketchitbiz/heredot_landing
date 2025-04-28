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
    title: "AIGO - 에이고",
    subtitle: "안녕하세요, AI 견적서 도우미 에이고입니다.\n제작을 원하시는 플랫폼을 선택해주세요.",
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
    title: "AIGO - 에이고",
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
    title: "AIGO - 에이고",
    subtitle: "개발 카테고리를 선택해주세요.",
    selectionTitle: "카테고리 선택 (단일 선택)",
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
    selectionMode: "single" as const,
    showWebAppComponent: false, // 필요시 true로 변경하여 WEB/APP 섹션 표시 가능
    infoText: "• 제작하려는 서비스와 가장 유사한 카테고리를 선택해주세요.",
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
  padding: 0;
  background-color: ${AppColors.background};
  border-radius: 8px;
  text-align: left;
  color: #9ca3af;
  line-height: 1.6;

  p {
    margin-bottom: 1rem;
    color: ${AppColors.onBackground};
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

    &::before {
      content: "•";
      position: absolute;
      left: 0;
      top: 0;
      color: ${AppColors.primary}; /* Bullet 색상 유지 */
    }

    strong {
      font-weight: bold;
      color: ${AppColors.primary};
    }
    span {
      color: ${AppColors.onPrimaryGray};
      display: block;
      margin-left: 0.5rem;
      margin-top: 0.25rem;
    }
  }
`;
// ------------------------------------

export default function AIPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const chatEndRef = useRef<HTMLDivElement>(null);

  const { chat, modelName } = useAI(); // modelName 추가

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

  // --- Gemini API 호출 함수 수정 ---
  const handleGeminiSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("handleGeminiSubmit called");
    console.log(
      `DEBUG: prompt='${prompt}', loading=${loading}, isFreeFormMode=${isFreeFormMode}, chat.current=${!!chat.current}, chat.current.sendMessage=${!!chat
        .current?.sendMessage}, modelName=${modelName}`
    );

    if (!prompt || loading || !isFreeFormMode || !chat.current?.sendMessage) {
      console.error("Submit prevented by conditions.");
      return;
    }

    // --- 기초 조사 선택 내용 문자열로 만들기 ---
    let selectionSummary = "선택된 기초 조사:\n";
    Object.entries(selections).forEach(([stepId, selectedOptions]) => {
      // stepData에서 해당 단계 정보 찾기 (선택 사항: 제목 표시용)
      const stepInfo = stepData.find((step) => step.id === stepId);
      const stepTitle = stepInfo ? stepInfo.selectionTitle : stepId; // 제목 없으면 ID 사용
      if (selectedOptions && selectedOptions.length > 0) {
        // 옵션 ID를 레이블로 변환 (선택 사항)
        const selectedLabels = selectedOptions.map((optionId) => {
          const option = stepInfo?.options.find((opt) => opt.id === optionId);
          return option ? option.label : optionId; // 레이블 없으면 ID 사용
        });
        selectionSummary += `- ${stepTitle}: ${selectedLabels.join(", ")}\n`;
      }
    });
    selectionSummary += "\n"; // 구분 위한 줄바꿈
    // ------------------------------------------

    const currentPrompt = prompt;
    const combinedPrompt = `${selectionSummary}사용자 질문:\n${currentPrompt}`;

    // 모델명 함께 출력하도록 수정
    console.log(`Model: ${modelName} | Combined Prompt:`, combinedPrompt);

    const userMessage: Message = { id: Date.now(), sender: "user", text: currentPrompt };
    setMessages((prev) => [...prev, userMessage]);
    setPrompt("");
    setLoading(true);
    setError("");

    try {
      const result = await chat.current.sendMessage(combinedPrompt);
      console.log("Raw AI Response Data:", result);

      const text = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text || "AI 응답 구조 확인 필요";
      console.log("AI Response Object (Legacy log):", result);
      const aiMessage: Message = { id: Date.now() + 1, sender: "ai", text };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(errorMessage);
      console.error("Error sending message via useAI:", err);
      const errorAiMessage: Message = { id: Date.now() + 1, sender: "ai", text: `오류: ${errorMessage}` };
      setMessages((prev) => [...prev, errorAiMessage]);
    } finally {
      setLoading(false);
    }
  };
  // ----------------------------------------------------

  // gridColumns 타입 수정
  const gridColumnsValue: number | undefined = currentStepData?.gridColumns;

  return (
    <Container>
      <MainContent>
        <ChatContainer>
          <ChatContent>
            <ChatMessagesContainer>
              {isFreeFormMode && (
                <FlexContainer>
                  <ProfileImage src="/pretty.png" alt="AI 프로필" />
                  <FreeFormGuide>
                    <ProfileName>AIGO - 에이고</ProfileName>
                    <div>
                      {/* ... */}
                      <p style={{ marginTop: "1.5rem" }}>다음과 같은 기능도 지원됩니다.</p>
                      <ul>
                        <li>
                          URL: 네이버, 다음 등 원하는 사이트 링크
                          <br />
                          <span>ex) &quot;www.naver.com 같은 사이트를 만들고 싶어요&quot;</span>
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
                    gridColumns={gridColumnsValue} // 수정된 타입 사용
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
            {/* <div style={{ textAlign: "center", fontSize: "12px", color: "gray", marginBottom: "10px" }}>
              <span>FreeForm: {String(isFreeFormMode)} | </span>
              <span>Loading: {String(loading)} | </span>
              <span>Prompt Empty: {String(!prompt)}</span>
            </div> */}
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
