'use client';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

/**
 * AiProgressBar 컴포넌트
 *
 * 이 컴포넌트는 AI 견적 작성 과정의 단계를 시각적으로 표시합니다.
 * 화면 크기에 따라 가로 또는 세로 형태로 표시되며,
 * 모바일 환경(770px 이하)에서는 헤더 아래 가로로, 데스크톱에서는 오른쪽에 세로로 표시됩니다.
 *
 * 각 단계는 아이콘과 제목, 설명으로 구성되어 있으며
 * 현재 단계, 완료된 단계, 미완료 단계를 시각적으로 구분합니다.
 */

// 인터페이스 정의
interface StepStyleProps {
  $isActive: boolean; // 현재 활성화된 단계인지 여부
  $isCompleted: boolean; // 완료된 단계인지 여부
  $isMobile?: boolean; // 모바일 환경인지 여부
}

interface ConnectorStyleProps {
  $isActive: boolean; // 연결선이 활성화되었는지 여부(완료된 단계에 사용)
  $horizontal?: boolean; // 가로 모드인지 여부
}

interface ProgressBarContainerProps {
  $isMobile: boolean; // 모바일 환경인지 여부
}

interface StepContainerProps extends StepStyleProps {
  $isMobile: boolean; // 모바일 환경인지 여부
}

interface MobileStepDescriptionProps {
  $isActive: boolean; // 현재 활성화된 단계인지 여부 (모바일에서는 현재 단계만 표시)
}

interface AiProgressBarProps {
  steps: { title: string; description: string }[]; // 단계 정보 배열
  currentStep: number; // 현재 단계 (0부터 시작하는 인덱스)
}

// 스타일 컴포넌트 정의
const ProgressBarContainer = styled.div<ProgressBarContainerProps>`
  display: flex;
  flex-direction: ${(props) =>
    props.$isMobile
      ? 'row'
      : 'column'}; // 모바일에서는 가로, 데스크톱에서는 세로
  align-items: ${(props) => (props.$isMobile ? 'center' : 'flex-start')};
  justify-content: ${(props) => (props.$isMobile ? 'center' : 'flex-start')};
  padding: ${(props) => (props.$isMobile ? '1rem' : '1.5rem')};
  width: 100%;
  max-width: ${(props) => (props.$isMobile ? '100%' : '300px')};
  margin-left: ${(props) => (props.$isMobile ? '0' : '0')};
  margin-top: ${(props) => (props.$isMobile ? '0' : '50px')};

  overflow: hidden;
  background-color: ${(props) => (props.$isMobile ? '#080808' : 'transparent')};
  box-shadow: ${(props) =>
    props.$isMobile ? '0 2px 4px rgba(0, 0, 0, 0.1)' : 'none'};
  position: ${(props) => (props.$isMobile ? 'relative' : 'static')};
  top: ${(props) => (props.$isMobile ? '0' : 'auto')};
  z-index: ${(props) => (props.$isMobile ? '5' : '0')};
  height: ${(props) => (props.$isMobile ? '140px' : 'auto')};
  min-height: ${(props) => (props.$isMobile ? '140px' : 'auto')};
  max-height: ${(props) => (props.$isMobile ? '140px' : 'none')};
`;

// 모바일용 래퍼 컴포넌트
const MobileProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center; // 세로 가운데 정렬 추가
  width: 100%;
  height: 100%; // 높이를 꽉 채우도록 설정
  overflow: hidden;
`;

// 모바일 환경에서 아이콘들을 가로로 배치하는 컨테이너
const MobileStepsContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-bottom: 10px;
  overflow: visible;
  padding: 0 10px; // 양쪽 패딩 추가
`;

// 모바일 환경에서 현재 단계의 설명만 표시하는 컴포넌트
const MobileStepDescription = styled.div<MobileStepDescriptionProps>`
  display: ${(props) =>
    props.$isActive ? 'block' : 'none'}; // 현재 단계만 표시
  text-align: center;
  color: white; // 타이틀 색상 흰색으로 설정
  font-size: 1.2rem;
  font-weight: 600;
  line-height: 1.4;
  white-space: pre-wrap;
  padding: 0 20px;
  letter-spacing: 0.5px;

  span {
    display: block;
    color: ${AppColors.onPrimaryGray}; // 설명 색상 회색으로 설정
    font-size: 0.8rem;
    font-weight: 400;
    letter-spacing: normal;
  }
`;

// 각 단계를 감싸는 컨테이너
const StepContainer = styled.div<StepContainerProps>`
  display: flex;
  align-items: center;
  margin-bottom: ${(props) => (props.$isMobile ? '0' : '1.5rem')};
  margin-right: ${(props) =>
    props.$isMobile ? '2rem' : '0'}; // 모바일에서 간격 확대
  position: relative;
  min-width: ${(props) => (props.$isMobile ? 'auto' : 'auto')};
  height: ${(props) => (props.$isMobile ? 'auto' : 'auto')};

  &:not(:last-child) {
    padding-bottom: ${(props) => (props.$isMobile ? '0' : '2rem')};
    padding-right: ${(props) =>
      props.$isMobile ? '3.5rem' : '0'}; // 모바일에서 간격 확대
  }

  &:last-child {
    margin-right: ${(props) => (props.$isMobile ? '0' : '0')};
  }
`;

// 단계 아이콘 컨테이너
const StepIconContainer = styled.div<StepStyleProps>`
  position: relative;
  z-index: 1;
  margin-right: ${(props) => (props.$isMobile ? '0' : '0.5rem')};

  .MuiSvgIcon-root {
    font-size: ${(props) =>
      props.$isMobile ? '2rem' : '1.75rem'}; // 모바일에서 아이콘 크기 증가
    color: ${(props) =>
      props.$isCompleted
        ? '#546ACB' // 완료된 단계
        : props.$isActive
        ? '#546ACB' // 현재 단계
        : AppColors.disabled}; // 미완료 단계
    transition: color 0.3s ease;
  }
`;

// 단계 내용(제목, 설명) 컨테이너 - 모바일에서는 비표시
const StepContent = styled.div<{ $isMobile: boolean }>`
  margin-left: ${(props) => (props.$isMobile ? '0' : '0.5rem')};
  margin-top: ${(props) => (props.$isMobile ? '0' : '-0.5rem')};
  line-height: ${(props) => (props.$isMobile ? '1.3' : '1.6')};
  display: ${(props) => (props.$isMobile ? 'none' : 'block')};
`;

// 단계 제목 컴포넌트
const StepTitle = styled.div<StepStyleProps>`
  ${AppTextStyles.body1}
  color: ${(props) =>
    props.$isActive
      ? '#FFFFFF' // 현재 단계 - 흰색
      : props.$isCompleted
      ? '#E6E6E6' // 완료된 단계 - 흰색에 가까운 색상
      : AppColors.disabled}; // 미완료 단계
  transition: color 0.3s ease;
  font-size: ${(props) => (props.$isMobile ? '0.8rem' : '1.1rem')};
  font-weight: ${(props) => (props.$isActive ? '700' : '500')};
  white-space: nowrap;
  letter-spacing: 0.3px;
`;

// 단계 설명 컴포넌트
const StepDescription = styled.div<StepStyleProps & { $isMobile: boolean }>`
  ${AppTextStyles.caption1}
  color: ${(props) =>
    props.$isCompleted || props.$isActive
      ? AppColors.onPrimaryGray // 회색으로 설정
      : AppColors.disabled};
  transition: color 0.3s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: ${(props) => (props.$isMobile ? '100px' : 'none')};
  display: ${(props) => (props.$isMobile ? 'block' : 'block')};
  font-size: ${(props) => (props.$isMobile ? '0.7rem' : '0.85rem')};
  margin-top: 5px;
`;

// 단계 간 연결선 컴포넌트
const Connector = styled.div<ConnectorStyleProps>`
  position: absolute;
  background-color: ${(props) =>
    props.$isActive ? '#546ACB' : AppColors.disabled};
  transition: background-color 0.3s ease;
  z-index: 0;

  ${(props) =>
    props.$horizontal
      ? `
    /* 가로 모드 (모바일) */
    top: 1.1rem;
    left: 2.6rem;
    width: 4rem; /* 연결선 길이 증가 */
    height: 2px;
  `
      : `
    /* 세로 모드 (데스크탑) */
    top: 2rem;
    left: 0.875rem;
    width: 2px;
    height: calc(100% - 1.3rem);
  `}
`;

/**
 * AiProgressBar 컴포넌트 함수
 *
 * @param steps - 단계 정보 배열 (title: 단계 제목, description: 단계 설명)
 * @param currentStep - 현재 단계 (0부터 시작하는 인덱스)
 */
export const AiProgressBar: React.FC<AiProgressBarProps> = ({
  steps,
  currentStep,
}) => {
  // 모바일 환경 여부 상태
  const [isMobile, setIsMobile] = useState(false);

  // 언어 설정 가져오기
  const { lang } = useLang();
  const t = aiChatDictionary[lang];

  // 화면 크기에 따라 모바일 환경 여부 감지
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 770); // 770px 이하면 모바일로 간주
    };

    // 초기 체크
    checkMobile();

    // 리사이즈 이벤트 리스너
    window.addEventListener('resize', checkMobile);

    // 컴포넌트 언마운트 시 리스너 제거
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // 단계 제목과 설명 번역 처리 함수
  const getTranslatedStep = (
    index: number,
    original: { title: string; description: string }
  ) => {
    // 인덱스에 따라 해당하는 번역 텍스트 반환
    if (index === 0) {
      return t.progressBar.steps.platformSelect;
    } else if (index === 1) {
      return t.progressBar.steps.volumeSelect;
    } else if (index === 2) {
      return t.progressBar.steps.categorySelect;
    }
    // 해당하는 번역이 없으면 원본 텍스트 반환
    return original;
  };

  // 모바일 환경일 때 렌더링 (가로 배치 + 현재 단계만 설명 표시)
  if (isMobile) {
    return (<></>
      // <ProgressBarContainer $isMobile={isMobile}>
      //   <MobileProgressWrapper>
      //     {/* 단계 아이콘 가로 배치 */}
      //     <MobileStepsContainer>
      //       {steps.map((step, index) => {
      //         const isCompleted = index < currentStep;
      //         const isActive = index === currentStep;
      //         const isLastStep = index === steps.length - 1;

      //         return (
      //           <StepContainer
      //             key={index}
      //             $isActive={isActive}
      //             $isCompleted={isCompleted}
      //             $isMobile={isMobile}
      //           >
      //             {/* 마지막 단계가 아니면 연결선 표시 */}
      //             {!isLastStep && (
      //               <Connector $isActive={isCompleted} $horizontal={isMobile} />
      //             )}
      //             <StepIconContainer
      //               $isActive={isActive}
      //               $isCompleted={isCompleted}
      //               $isMobile={isMobile}
      //             >
      //               {/* 완료 여부와 현재 단계에 따라 다른 아이콘 표시 */}
      //               {isCompleted ? (
      //                 <CheckCircleIcon />
      //               ) : isActive ? (
      //                 <RadioButtonCheckedIcon />
      //               ) : (
      //                 <RadioButtonUncheckedIcon />
      //               )}
      //             </StepIconContainer>
      //           </StepContainer>
      //         );
      //       })}
      //     </MobileStepsContainer>

      //     {/* 현재 단계의 설명만 표시 - 가운데 정렬 */}
      //     {steps.map((step, index) => {
      //       const translatedStep = getTranslatedStep(index, step);
      //       return (
      //         <MobileStepDescription
      //           key={index}
      //           $isActive={index === currentStep}
      //         >
      //           {translatedStep.title}
      //           <span>{translatedStep.description}</span>
      //         </MobileStepDescription>
      //       );
      //     })}
      //   </MobileProgressWrapper>
      // </ProgressBarContainer>
    );
  }

  // 데스크톱 버전 렌더링 (세로 배치)
  return (
    <ProgressBarContainer $isMobile={isMobile}>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;
        const isLastStep = index === steps.length - 1;
        const translatedStep = getTranslatedStep(index, step);

        return (
          <StepContainer
            key={index}
            $isActive={isActive}
            $isCompleted={isCompleted}
            $isMobile={isMobile}
          >
            {/* 마지막 단계가 아니면 연결선 표시 */}
            {!isLastStep && (
              <Connector $isActive={isCompleted} $horizontal={isMobile} />
            )}
            <StepIconContainer
              $isActive={isActive}
              $isCompleted={isCompleted}
              $isMobile={isMobile}
            >
              {/* 완료 여부와 현재 단계에 따라 다른 아이콘 표시 */}
              {isCompleted ? (
                <CheckCircleIcon />
              ) : isActive ? (
                <RadioButtonCheckedIcon />
              ) : (
                <RadioButtonUncheckedIcon />
              )}
            </StepIconContainer>
            {/* 단계 내용 표시 (제목 + 설명) */}
            <StepContent $isMobile={isMobile}>
              <StepTitle
                $isActive={isActive}
                $isCompleted={isCompleted}
                $isMobile={isMobile}
              >
                {translatedStep.title}
              </StepTitle>
              <StepDescription
                $isActive={isActive}
                $isCompleted={isCompleted}
                $isMobile={isMobile}
              >
                {translatedStep.description}
              </StepDescription>
            </StepContent>
          </StepContainer>
        );
      })}
    </ProgressBarContainer>
  );
};
