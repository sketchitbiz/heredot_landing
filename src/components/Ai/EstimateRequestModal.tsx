'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CloseIcon from '@mui/icons-material/Close';
import ButtonElement from '@/elements/ButtonElement';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import type { ChatDictionary } from '@/app/ai/components/StepData';

interface EstimateRequestModalProps {
  $isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string; // Dynamic title part, e.g., "[#프로젝트명]"
  content?: string; // content prop 추가
  confirmButtonText?: string; // 확인 버튼 텍스트 prop 추가 (옵션)
  cancelButtonText?: string; // 취소 버튼 텍스트 prop 추가 (옵션)
}

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6); // 어둡게 조정
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px); // 블러 효과 추가
`;

const ModalContent = styled.div`
  background-color: ${AppColors.surface}; // AppColors.greyBackground -> AppColors.surface 로 변경
  color: ${AppColors.onSurface};
  padding: 24px; // 패딩 증가
  border-radius: 16px; // 더 둥글게
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 480px; // 최대 너비 설정
  display: flex;
  flex-direction: column;
  position: relative;
  text-align: start; // 텍스트 중앙 정렬
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: 16px; // 위치 조정
  right: 16px; // 위치 조정
  background: none;
  border: none;
  cursor: pointer;
  color: ${AppColors.onSurfaceVariant};

  .MuiSvgIcon-root {
    font-size: 28px;
  }

  &:hover {
    color: ${AppColors.onSurface};
  }
`;

const ModalTitle = styled.h2`
  ${AppTextStyles.headline3} // 스타일 조정
  font-size: 22px; // 폰트 크기 조정
  color: ${AppColors.onSurface};
  margin-top: 0;
  margin-bottom: 24px; // 간격 조정
`;

const ModalDescription = styled.p`
  ${AppTextStyles.body1}
  font-size: 16px; // 폰트 크기 조정
  color: ${AppColors.onSurfaceVariant}; // 색상 조정
  margin-bottom: 40px; // 간격 증가
  line-height: 1.6;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: end; // 버튼 중앙 정렬
  gap: 16px; // 버튼 사이 간격
`;

const StyledButton = styled(ButtonElement)`
  padding: 12px 24px; // 패딩 조정
  font-size: 16px;
  font-weight: 500;
  border-radius: 8px; // 버튼 둥글기 조정
  min-width: 120px; // 최소 너비

  &.confirm {
    background-color: ${AppColors.primary}; // 예 버튼 색상
    color: ${AppColors.onPrimary};
    &:hover:not(:disabled) {
      background-color: ${AppColors.primary}; // AppColors.primaryDark -> AppColors.primary 로 변경 (동일 색상)
    }
  }

  &.cancel {
    background-color: ${AppColors.surface}; // AppColors.surfaceVariant -> AppColors.surface 로 변경
    color: ${AppColors.onSurfaceVariant};
    border: 1px solid ${AppColors.primary}; // AppColors.outline -> AppColors.primary 로 변경 (테두리 색상)
    &:hover:not(:disabled) {
      background-color: ${AppColors.surface};
    }
  }
`;

export const EstimateRequestModal: React.FC<EstimateRequestModalProps> = ({
  $isOpen,
  onClose,
  onConfirm,
  title,
  content,
  confirmButtonText,
  cancelButtonText,
}) => {
  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;

  if (!$isOpen) {
    return null;
  }

  const handleConfirm = () => {
    onConfirm();
    onClose(); // 확인 후 모달 닫기
  };

  return (
    <ModalOverlay $isOpen={$isOpen} onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton onClick={onClose}>
          <CloseIcon />
        </StyledCloseButton>
        <ModalTitle>{title}</ModalTitle>
        <ModalDescription>
          {content ||
            t.estimateModal?.description ||
            '요청 완료후 영업일 기준 3일 이내에 연락드리겠습니다.'}
        </ModalDescription>
        <ButtonContainer>
          <StyledButton
            className="confirm"
            onClick={handleConfirm}
            isRounded={false}
          >
            {confirmButtonText || t.estimateModal?.confirmButton || '예'}
          </StyledButton>
          <StyledButton className="cancel" onClick={onClose} isRounded={false}>
            {cancelButtonText || t.estimateModal?.cancelButton || '아니오'}
          </StyledButton>
        </ButtonContainer>
      </ModalContent>
    </ModalOverlay>
  );
};
