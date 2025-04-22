"use client";

import styled from "styled-components";
// import { PhotoDataContainer } from "@/components/PhotoDataContainer"; // 사용 안 함
// import { ProfileDataContainer } from "@/components/ProfileDataContainer"; // 사용 안 함
import { Send, AddPhotoAlternate } from "@mui/icons-material"; // Search, Edit 제거
import { AppColors } from "@/styles/colors";
// import { TestContext } from "node:test"; // 사용 안 함
import { AppTextStyles } from "../../styles/textStyles";
import { useState } from "react";
import { AiChatQuestion } from "@/components/Ai/AiChatQuestion"; // QuestionOption 제거
import { AiProgressBar } from "@/components/Ai/AiProgressBar";
import { customScrollbar } from "@/styles/commonStyles"; // customScrollbar import 추가

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
    selectionMode: "multiple",
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
    selectionMode: "single",
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
    selectionMode: "multiple",
    showWebAppComponent: false, // 필요시 true로 변경하여 WEB/APP 섹션 표시 가능
    infoText:
      "• 제작하려는 서비스와 가장 유사한 카테고리를 선택해주세요.\n• 여러 카테고리에 해당될 경우 모두 선택 가능합니다.",
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
  width: 100%; // 너비 100% 추가
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

const CenterContent = styled.div`
  text-align: center;
  width: 100%;
  max-width: 48rem; // 최대 너비 조정 (AiChatQuestion과 맞춤)
  display: flex; // 내부 FlexContainer 정렬 위해 추가
  justify-content: center; // 가로 중앙 정렬
`;

const ProfileImage = styled.img`
  height: 3rem; // 크기 조절
  width: 3rem; // 크기 조절
  border-radius: 50%; // 원형 이미지
  object-fit: cover;
  margin-right: 1.5rem; // 간격 조절
  margin-top: 0.5rem; // 타이틀과 정렬되도록 조정
`;

const MessageInput = styled.div`
  padding: 2rem 2rem;
  border-top: 1px solid ${AppColors.border};
  background-color: ${AppColors.background};
  margin-top: auto;
`;

const InputContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: ${AppColors.inputDisabled}; // 변경
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
  const [currentStep, setCurrentStep] = useState(0);
  // 각 단계별 선택 값을 저장할 상태 (객체 사용, key는 단계 id)
  const [selections, setSelections] = useState<Record<string, string[]>>({});

  const currentStepData = stepData[currentStep];
  const progressSteps = stepData.map((step) => step.progress); // 프로그레스 바 데이터 추출

  const handleNext = (selectedIds: string[]) => {
    // 현재 단계 선택 값 저장
    setSelections((prev) => ({ ...prev, [currentStepData.id]: selectedIds }));

    if (currentStep < stepData.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // 마지막 단계 처리 (예: 결과 표시 또는 제출)
      console.log("Final Selections:", { ...selections, [currentStepData.id]: selectedIds });
      alert("견적 요청 완료 (콘솔 확인)"); // 임시 알림
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // 현재 단계의 초기 선택값 가져오기 (이전 단계에서 돌아왔을 때)
  const initialSelection = selections[currentStepData.id] || [];

  return (
    <Container>
      <MainContent>
        <ChatContainer>
          <ChatContent>
            <CenterContent>
              <FlexContainer>
                {/* 프로필 이미지 렌더링 */}
                <ProfileImage src="/pretty.png" alt="AI 프로필" />
                {/* AiChatQuestion 컴포넌트를 중앙 컨텐츠 영역에 렌더링 */}
                <AiChatQuestion
                  key={currentStep} // 단계 변경 시 컴포넌트 리마운트 (상태 초기화 용도)
                  {...currentStepData} // 현재 단계 데이터 전달
                  gridColumns={currentStepData.gridColumns as any} // 타입 에러 해결 위한 캐스팅
                  initialSelection={initialSelection} // 현재 단계 초기 선택값 전달
                  onNext={handleNext}
                  onPrevious={handlePrevious}
                />
              </FlexContainer>
            </CenterContent>
          </ChatContent>

          {/* 메시지 입력창 */}
          <MessageInput>
            <InputContainer>
              {/* 파일 첨부 아이콘 버튼 */}
              <IconContainer>
                <AddPhotoAlternate />
              </IconContainer>
              <Input type="text" placeholder="기초자료 조사는 입력이 불가합니다." disabled />
              {/* 전송 아이콘 버튼 */}
              <IconContainer>
                <Send />
              </IconContainer>
            </InputContainer>
          </MessageInput>
        </ChatContainer>
      </MainContent>

      {/* Progress Bar */}
      <AiProgressBar steps={progressSteps} currentStep={currentStep} />
    </Container>
  );
}
