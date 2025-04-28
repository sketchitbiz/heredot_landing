"use client";

import styled, { css } from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import { useState, useEffect } from "react";

// 옵션 인터페이스
export interface QuestionOption {
  id: string;
  label: string;
}

// Props 인터페이스
interface AiChatQuestionProps {
  title: string; // 예: "여기닷 AI" 또는 단계별 타이틀
  subtitle: string; // 예: "안녕하세요..." 또는 단계별 설명
  selectionTitle: string; // 예: "중복 선택 가능", "중복 선택 불가"
  options: QuestionOption[];
  gridColumns: 1 | 2 | 3 | 4 | 5; // 컬럼 수
  selectionMode: "single" | "multiple"; // 선택 모드
  showWebAppComponent?: boolean; // WEB/APP 섹션 표시 여부
  infoText?: string; // 하단 안내 문구
  onNext: (selectedIds: string[]) => void; // 다음 버튼 클릭 핸들러
  onPrevious: () => void; // 이전 버튼 클릭 핸들러
  initialSelection?: string[]; // 초기 선택값 (이전 단계에서 돌아올 경우)
}

// --- 스타일 컴포넌트 정의 (기존 page.tsx에서 가져오거나 새로 정의) ---

const AIContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: start;
  text-align: left;
  width: 100%; // 너비 100% 추가
`;

const Title = styled.p`
  ${AppTextStyles.title2}
  color: ${AppColors.onBackground};
  margin-bottom: 0.5rem; // 간격 조절
  margin-top: 1rem;
`;

const Subtitle = styled.p`
  color: #9ca3af; // 필요시 AppColors 사용
  margin-bottom: 2rem;
  white-space: pre-wrap; // 줄바꿈 적용
`;

const SelectionTitle = styled.h3`
  ${AppTextStyles.body1} // 스타일 적용
  color: ${AppColors.onBackground};
  margin-bottom: 1rem;
`;

const OptionsGrid = styled.div<{ columns: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.columns}, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
  width: 100%;
`;

const OptionButton = styled.button<{ selected: boolean }>`
  ${AppTextStyles.body2}
  display: flex;
  flex-direction: column; // 세로 정렬로 변경
  align-items: center;
  justify-content: center;
  padding: 1rem;
  background-color: ${AppColors.backgroundDark};
  border: 1px solid ${AppColors.border};
  border-radius: 0.375rem;
  transition: background-color 0.2s, border-color 0.2s;
  color: ${AppColors.iconDisabled};
  cursor: pointer;
  text-align: center; // 텍스트 중앙 정렬

  ${(props) =>
    props.selected &&
    css`
      background-color: ${AppColors.primary};
      border-color: ${AppColors.primary};
      color: ${AppColors.onPrimary}; // 선택 시 텍스트 색상 변경
      .prefix {
        // 선택 시 '+' 아이콘 스타일 변경 (필요하다면)
        color: ${AppColors.onPrimary};
      }
    `}

  &:hover {
    background-color: ${
      (props) =>
        props.selected
          ? AppColors.primary /* primaryHover 대신 primary 사용 */
          : AppColors.backgroundDark /* backgroundDarkHover 대신 backgroundDark 사용 */
    }; // 호버 시 색상 변경 (AppColors 에 hover 색상이 없으므로 기본 색상 사용)
    border-color: ${
      (props) =>
        props.selected
          ? AppColors.primary /* primaryHover 대신 primary 사용 */
          : AppColors.border /* borderHover 대신 border 사용 */
    };
  }

  // Prefix 스타일 (예: '+')
  .prefix {
    /* margin-right: 0.5rem; // 오른쪽 마진 제거 */
    margin-bottom: 0.5rem; // 아래쪽 마진 추가
    font-size: 1.5rem; // 폰트 크기 증가 (필요에 따라 조절)
    line-height: 1; // 줄 높이 조절 (폰트 크기에 맞게)
    color: ${AppColors.iconDisabled}; // 기본 아이콘 색상
    transition: color 0.2s;
  }
`;

const WebAppSection = styled.div`
  display: flex;
  width: 100%;
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

const WebAppButton = styled(OptionButton)`
  // OptionButton 스타일 상속 및 수정
  flex-grow: ${(props) => (props.id === "web" ? 2 : 3)}; // 2:3 비율
  flex-basis: 0; // flex-grow 비율에 따라 너비 조절
`;

const ButtonGroup = styled.div`
  display: flex;
  width: 100%;
  justify-content: end;
  gap: 1rem;
  margin-bottom: 3rem; // 간격 조절
`;

const Button = styled.button<{ variant?: "primary" | "secondary" }>`
  padding: 0.5rem 1.5rem;
  border-radius: 0.375rem;
  border: none;
  background-color: ${(props) => (props.variant === "primary" ? AppColors.primary : AppColors.disabled)};
  color: white; // 필요시 AppColors.onPrimary 등 사용
  transition: background-color 0.2s;
  cursor: pointer;

  &:hover {
    background-color: ${
      (props) =>
        props.variant === "primary"
          ? AppColors.primary /* primaryHover 대신 primary */
          : AppColors.disabled /* disabledHover 대신 disabled */
    };
  }

  &:disabled {
    background-color: ${AppColors.disabled};
    cursor: not-allowed;
  }
`;

const InfoList = styled.div`
  color: ${AppColors.disabled}; // onSurfaceVariant 대신 disabled 사용
  ${AppTextStyles.caption1} // 스타일 적용
  text-align: left;
  white-space: pre-wrap;
  width: 100%;
  border-top: 1px solid ${AppColors.border};
  padding-top: 1rem;
`;

export const AiChatQuestion: React.FC<AiChatQuestionProps> = ({
  title,
  subtitle,
  selectionTitle,
  options,
  gridColumns,
  selectionMode,
  showWebAppComponent = false,
  infoText,
  onNext,
  onPrevious,
  initialSelection = [],
}) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(initialSelection);

  // initialSelection이 변경되면 상태 업데이트
  useEffect(() => {
    setSelectedIds(initialSelection);
  }, [initialSelection]);

  const handleOptionClick = (id: string) => {
    setSelectedIds((prevSelectedIds) => {
      if (selectionMode === "single") {
        return [id]; // 단일 선택 모드: 클릭한 것만 선택
      } else {
        // 다중 선택 모드: 이미 선택된 경우 제거, 아닌 경우 추가
        if (prevSelectedIds.includes(id)) {
          return prevSelectedIds.filter((selectedId) => selectedId !== id);
        } else {
          return [...prevSelectedIds, id];
        }
      }
    });
  };

  const handleWebClick = () => handleOptionClick("web");
  const handleAppClick = () => handleOptionClick("app");

  const isNextDisabled = selectedIds.length === 0; // 선택된 항목이 없으면 다음 버튼 비활성화

  return (
    <AIContent>
      <Title>{title}</Title>
      <Subtitle>{subtitle}</Subtitle>
      <SelectionTitle>{selectionTitle}</SelectionTitle>

      {/* WEB/APP 섹션 */}
      {showWebAppComponent && (
        <WebAppSection>
          <WebAppButton id="web" selected={selectedIds.includes("web")} onClick={handleWebClick}>
            WEB
          </WebAppButton>
          <WebAppButton id="app" selected={selectedIds.includes("app")} onClick={handleAppClick}>
            APP
          </WebAppButton>
        </WebAppSection>
      )}

      {/* 옵션 그리드 */}
      <OptionsGrid columns={gridColumns}>
        {options.map((option) => (
          <OptionButton
            key={option.id}
            selected={selectedIds.includes(option.id)}
            onClick={() => handleOptionClick(option.id)}>
            {selectionMode === "multiple" && <span className="prefix">+</span>}
            {/* 다중 선택 시 + 아이콘 표시 (선택 여부와 관계 없이) */}
            {option.label}
          </OptionButton>
        ))}
      </OptionsGrid>

      {/* 버튼 그룹 */}
      <ButtonGroup>
        <Button variant="secondary" onClick={onPrevious}>
          이전
        </Button>
        <Button
          variant="primary"
          onClick={() => onNext(selectedIds)}
          disabled={isNextDisabled} // 비활성화 조건 적용
        >
          다음
        </Button>
      </ButtonGroup>

      {/* 하단 안내 문구 */}
      {infoText && <InfoList>{infoText}</InfoList>}
    </AIContent>
  );
};
