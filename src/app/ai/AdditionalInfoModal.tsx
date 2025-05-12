"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import CloseIcon from "@mui/icons-material/Close";
import useAuthStore from "@/store/authStore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: ${AppColors.surface};
  color: ${AppColors.onSurface};
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
`;

const ModalTitle = styled.h2`
  ${AppTextStyles.title2}
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  ${AppTextStyles.body1}
  margin-bottom: 8px;
  font-weight: 500;
`;

const CountrySelect = styled.div`
  position: relative;
  margin-bottom: 16px;
`;

const SelectButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${AppColors.outline};
  border-radius: 8px;
  background-color: ${AppColors.surface};
  color: ${AppColors.onSurface};
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: ${AppColors.secondary};
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
`;

const PhoneInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 1px solid ${AppColors.outline};
  border-radius: 8px;
  font-size: 16px;

  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
`;

const VerifyButton = styled.button`
  padding: 12px 16px;
  background-color: ${AppColors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;

  &:hover {
    background-color: ${AppColors.primaryDark};
  }

  &:disabled {
    background-color: ${AppColors.outlineVariant};
    cursor: not-allowed;
  }
`;

const VerificationInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid ${AppColors.outline};
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 24px;

  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
`;

const CheckboxContainer = styled.div`
  margin-bottom: 16px;
  border-top: 1px solid ${AppColors.outlineVariant};
  padding-top: 16px;
`;

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
`;

const Checkbox = styled.input`
  margin-right: 8px;
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const CheckboxLabel = styled.label`
  ${AppTextStyles.body2}
  cursor: pointer;
`;

const PrivacyPolicyText = styled.div`
  ${AppTextStyles.caption1}
  color: ${AppColors.onSurfaceVariant};
  background-color: ${AppColors.surfaceVariant};
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  height: 80px;
  overflow-y: auto;
`;

const CompleteButton = styled.button`
  width: 100%;
  padding: 12px 16px;
  background-color: ${AppColors.secondary};
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background-color: ${AppColors.primaryDark};
  }

  &:disabled {
    background-color: ${AppColors.outlineVariant};
    cursor: not-allowed;
  }
`;

const StyledCloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
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

export const AdditionalInfoModal = () => {
  const { isAdditionalInfoModalOpen, closeAdditionalInfoModal, user } = useAuthStore();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);

  // 모든 필수 조건이 충족되었는지 확인
  const isFormValid = isVerified && privacyAgreed;

  // 전체 동의 체크박스 처리
  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setPrivacyAgreed(newValue);
  };

  // 개별 체크박스 처리
  const handlePrivacyAgree = () => {
    const newValue = !privacyAgreed;
    setPrivacyAgreed(newValue);
    setAllAgreed(newValue);
  };

  // 인증번호 전송 처리
  const handleSendVerification = () => {
    if (!phoneNumber || phoneNumber.length < 10) return;

    setIsSendingCode(true);

    // TODO: 실제 인증번호 전송 API 연동
    setTimeout(() => {
      setIsSendingCode(false);
      setVerificationSent(true);
      // 콘솔에 가상 인증번호 출력 (개발 목적용)
      console.log("인증번호: 123456");
    }, 1500);
  };

  // 인증번호 확인 처리
  const handleVerifyCode = () => {
    if (!verificationCode) return;

    setIsVerifying(true);

    // TODO: 실제 인증번호 확인 API 연동
    // 지금은 단순히 "123456"이 맞는지 확인
    setTimeout(() => {
      if (verificationCode === "123456") {
        setIsVerified(true);
      } else {
        alert("인증번호가 일치하지 않습니다.");
      }
      setIsVerifying(false);
    }, 1000);
  };

  // 완료 버튼 클릭 처리
  const handleComplete = () => {
    if (!isFormValid) return;

    // TODO: 사용자 정보 업데이트 API 연동
    // 인증된 전화번호를 사용자 정보에 추가 및 서버 업데이트

    // 모달 닫기
    closeAdditionalInfoModal();
  };

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isAdditionalInfoModalOpen) {
      setPhoneNumber("");
      setVerificationCode("");
      setVerificationSent(false);
      setIsVerified(false);
      setAllAgreed(false);
      setPrivacyAgreed(false);
    }
  }, [isAdditionalInfoModalOpen]);

  // 이미 인증된 사용자인 경우 처리
  useEffect(() => {
    if (user?.cellphone) {
      setPhoneNumber(user.cellphone);
      setIsVerified(true);
    }
  }, [user]);

  if (!isAdditionalInfoModalOpen) {
    return null;
  }

  return (
    <ModalOverlay isOpen={isAdditionalInfoModalOpen}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton onClick={closeAdditionalInfoModal}>
          <CloseIcon />
        </StyledCloseButton>

        <ModalTitle>휴대폰 인증</ModalTitle>

        <FormGroup>
          <Label>국가</Label>
          <CountrySelect>
            <SelectButton>
              대한민국 +82
              <KeyboardArrowDownIcon />
            </SelectButton>
          </CountrySelect>

          <Label>휴대전화</Label>
          <InputGroup>
            <PhoneInput
              type="tel"
              placeholder="010-1234-5678"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isVerified}
            />
            <VerifyButton
              onClick={handleSendVerification}
              disabled={!phoneNumber || phoneNumber.length < 10 || isSendingCode || isVerified}>
              {isSendingCode ? "전송 중..." : isVerified ? "인증 완료" : "인증번호 받기"}
            </VerifyButton>
          </InputGroup>

          {verificationSent && !isVerified && (
            <>
              <VerificationInput
                type="text"
                placeholder="인증번호를 입력하세요"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
              <VerifyButton
                onClick={handleVerifyCode}
                disabled={!verificationCode || isVerifying}
                style={{ width: "100%", marginBottom: "24px" }}>
                {isVerifying ? "인증 중..." : "인증하기"}
              </VerifyButton>
            </>
          )}
        </FormGroup>

        <CheckboxContainer>
          <CheckboxGroup>
            <Checkbox type="checkbox" id="agree-all" checked={allAgreed} onChange={handleAllAgree} />
            <CheckboxLabel htmlFor="agree-all">전체 동의하기</CheckboxLabel>
          </CheckboxGroup>

          <CheckboxGroup>
            <Checkbox type="checkbox" id="agree-privacy" checked={privacyAgreed} onChange={handlePrivacyAgree} />
            <CheckboxLabel htmlFor="agree-privacy">[필수] 개인정보 수집 및 이용</CheckboxLabel>
          </CheckboxGroup>

          <PrivacyPolicyText>
            회사는 AI 견적서 서비스 제공을 위해
            <br />
            아래와 같이 개인정보를 수집 및 이용합니다.
            <br />
            <br />
            1. 수집 항목: 휴대폰 번호
            <br />
            2. 수집 목적: 서비스 이용 및 사용자 식별
            <br />
            3. 보관 기간: 회원 탈퇴 시까지
          </PrivacyPolicyText>
        </CheckboxContainer>

        <CompleteButton onClick={handleComplete} disabled={!isFormValid}>
          완료
        </CompleteButton>
      </ModalContent>
    </ModalOverlay>
  );
};

export default AdditionalInfoModal;
