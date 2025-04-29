"use client";
import styled, { css } from "styled-components";
import CheckCircleIcon from "@mui/icons-material/CheckCircle"; // 완료 아이콘
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; // 기본 아이콘
import RadioButtonCheckedIcon from "@mui/icons-material/RadioButtonChecked"; // 현재 진행 아이콘 (테두리 있는 원)
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";

// Transient props 인터페이스 (올바른 $ 사용)
interface StepStyleProps {
  $isActive: boolean;
  $isCompleted: boolean;
}

interface ConnectorStyleProps {
  $isActive: boolean; // 완료 상태 기준으로 변경
}

interface AiProgressBarProps {
  steps: { title: string; description: string }[];
  currentStep: number; // 0-based index
}

const ProgressBarContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start; // 왼쪽 정렬
  padding: 2rem; // 패딩 추가
  width: 100%; // 너비 설정
  max-width: 300px; // 최대 너비 설정 (디자인에 맞게 조절)
  margin-left: auto; // 오른쪽 정렬 효과 (MainContent와 ProgressContainer 분리)
`;

// StepStyleProps 사용 (올바른 $ 사용)
const StepContainer = styled.div<StepStyleProps>`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem; // 각 스텝 간격 조절
  position: relative; // Connector 위치 기준

  &:not(:last-child) {
    padding-bottom: 2.5rem; // 마지막 스텝 제외 아래쪽 패딩으로 Connector 공간 확보
  }
`;

// StepStyleProps 사용 (올바른 $ 사용)
const StepIconContainer = styled.div<StepStyleProps>`
  position: relative;
  z-index: 1; // Connector 위에 오도록 설정
  margin-right: 1rem;

  .MuiSvgIcon-root {
    // props 접근 시 올바른 $ 사용
    font-size: 1.75rem; // 아이콘 크기
    color: ${(props) =>
      props.$isCompleted
        ? "#546ACB" // 완료 시
        : props.$isActive
        ? "#546ACB" // 현재 진행 시
        : AppColors.disabled}; // 비활성 시
    transition: color 0.3s ease;
  }
`;

const StepContent = styled.div`
  margin-left: 1rem; // 아이콘과 텍스트 간격
`;

// StepStyleProps 사용 (올바른 $ 사용)
const StepTitle = styled.div<StepStyleProps>`
  ${AppTextStyles.body1}
  // props 접근 시 올바른 $ 사용
  color: ${(props) => (props.$isCompleted || props.$isActive ? AppColors.onBackground : AppColors.disabled)};
  transition: color 0.3s ease;
`;

// StepStyleProps 사용 (올바른 $ 사용)
const StepDescription = styled.div<StepStyleProps>`
  ${AppTextStyles.caption1}
  // props 접근 시 올바른 $ 사용
  color: ${(props) =>
    props.$isCompleted || props.$isActive ? AppColors.disabled /* onSurfaceVariant 대신 */ : AppColors.disabled};
  transition: color 0.3s ease;
  white-space: pre-wrap; // 설명 줄바꿈 허용
`;

// ConnectorStyleProps 사용 (올바른 $ 사용)
const Connector = styled.div<ConnectorStyleProps>`
  position: absolute;
  top: 2.4rem; // 아이콘 아래 시작 (아이콘 크기 + 약간의 간격)
  left: 0.875rem; // 아이콘 중앙 정렬 (아이콘 크기의 절반 정도)
  width: 2px; // 선 두께
  height: calc(100% - 1.3rem); // 다음 아이콘 상단까지 연결 (간격 고려)
  // props 접근 시 올바른 $ 사용
  background-color: ${(props) => (props.$isActive ? "#546ACB" : AppColors.disabled)};
  transition: background-color 0.3s ease;
  z-index: 0; // 아이콘 뒤로 가도록 설정
`;

export const AiProgressBar: React.FC<AiProgressBarProps> = ({ steps, currentStep }) => {
  return (
    <ProgressBarContainer>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLastStep = index === steps.length - 1;

        return (
          // transient props 전달 (올바른 $ 사용)
          <StepContainer key={index} $isActive={isActive} $isCompleted={isCompleted}>
            {/* transient prop 전달 (올바른 $ 사용) */}
            {!isLastStep && <Connector $isActive={isCompleted} />}
            {/* transient props 전달 (올바른 $ 사용) */}
            <StepIconContainer $isActive={isActive} $isCompleted={isCompleted}>
              {isCompleted ? (
                <CheckCircleIcon />
              ) : isActive ? (
                <RadioButtonCheckedIcon /> // 현재 스텝 아이콘
              ) : (
                <RadioButtonUncheckedIcon /> // 비활성 스텝 아이콘
              )}
            </StepIconContainer>
            <StepContent>
              {/* transient props 전달 (올바른 $ 사용) */}
              <StepTitle $isActive={isActive} $isCompleted={isCompleted}>
                {step.title}
              </StepTitle>
              {/* transient props 전달 (올바른 $ 사용) */}
              <StepDescription $isActive={isActive} $isCompleted={isCompleted}>
                {step.description}
              </StepDescription>
            </StepContent>
          </StepContainer>
        );
      })}
    </ProgressBarContainer>
  );
};
