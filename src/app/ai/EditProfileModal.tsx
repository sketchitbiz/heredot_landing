'use client';

import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CloseIcon from '@mui/icons-material/Close';
import useAuthStore from '@/store/authStore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { countryCodes } from '@/app/ai/countryCodesData'; // 경로 확인 필요
import useUserJoin from '@/hooks/useUserJoin'; // 이 훅이 사용자 정보 '수정'도 다루는지 확인 필요
import useUserUpdate, { UserUpdatePayload } from '@/hooks/useUserUpdate'; // UserUpdatePayload import 추가
import useUserDelete from '@/hooks/useUserDelete'; // useUserDelete 훅 import
import { EstimateRequestModal } from '@/components/Ai/EstimateRequestModal'; // EstimateRequestModal import
// import { useRouter } from 'next/navigation'; // 현재 사용 안함

const ModalOverlay = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.$isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContentWrapper = styled.div`
  background-color: #f5f5f5;
  color: ${AppColors.onSurface};
  padding: 40px 20px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  min-height: 500px; // 최소 높이 설정으로 내용물 적을 때도 형태 유지
  max-height: 560px; // 최대 높이 조정
  position: relative;
  border: 1px solid #e0e0e0;
  overflow: hidden;
`;

const ModalViewsContainer = styled.div<{ $viewMode: 'info' | 'phoneAuth' }>`
  display: flex;
  width: 200%;
  height: 100%;
  gap: 70px;
  transition: transform 0.5s ease-in-out;
  transform: ${(props) =>
    props.$viewMode === 'info' ? 'translateX(0%)' : 'translateX(-52%)'};
`;

const View = styled.div`
  width: 50%;
  max-height: 490px;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  /* padding: 0 10px; */ // View 자체의 좌우 패딩 제거
`;

const ScrollableContent = styled.div`
  flex-grow: 1;
  overflow-y: auto;
  /* padding-right: 10px; */ // 기본 패딩 제거
  /* margin-right: -10px; */

  &.info-view-scroll {
    padding: 0 10px 0 20px; // 첫 번째 뷰 내부 컨텐츠 좌우 패딩 (기존 wrapper 패딩 40px의 절반 느낌)
  }
  &.auth-view-scroll {
    padding: 0 20px 0 20px; // 두 번째 뷰 내부 컨텐츠 좌우 패딩
  }

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: #cccccc;
    border-radius: 3px;
  }
  scrollbar-width: thin;
  scrollbar-color: #cccccc transparent;
`;

const ModalTitle = styled.h2`
  ${AppTextStyles.title2}
  font-size: 24px;
  margin-bottom: 24px;
  text-align: start;
  flex-shrink: 0; // 타이틀 크기 고정
  padding: 0 20px;
`;

const FormGroup = styled.div`
  margin-bottom: 24px;
  flex-grow: 1; // 남은 공간 채우도록
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
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: white;
  color: black;
  font-size: 16px;
  text-align: left;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:hover {
    border-color: ${AppColors.secondary};
  }
  &:disabled {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 200px; // 드롭다운 최대 높이 조정
  overflow-y: auto;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 10;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  &::-webkit-scrollbar {
    width: 6px;
  }
  &::-webkit-scrollbar-track {
    background: #e0e0e0;
    border-radius: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background: #aaaaaa;
    border-radius: 3px;
  }
`;

const CountryOption = styled.div`
  padding: 10px 16px;
  cursor: pointer;
  &:hover {
    background-color: #f5f5f5;
  }
`;

const InputGroup = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
`;

const PhoneInput = styled.input`
  flex-grow: 1;
  padding: 12px 16px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: white;
  color: black;
  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
  &:read-only {
    background-color: #e9ecef;
    cursor: default; // 읽기 전용일때 커서 기본값
  }
`;

const ChangeButton = styled.button`
  padding: 12px 16px;
  background-color: #5a5a5a;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #404040;
  }
`;

const VerifyButton = styled.button`
  padding: 12px 16px;
  background-color: #202055;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  white-space: nowrap;
  &:hover {
    background-color: #2f2f7d;
  }
  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const VerificationInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 24px;
  background-color: white;
  color: black;
  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
`;

const ButtonContainer = styled.div`
  margin-top: auto;
  padding-top: 20px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CompleteButton = styled.button`
  width: 90%; // 사용자가 수정한 너비 유지
  padding: 12px 16px;
  /* margin-left: 20px; */ // ButtonContainer에서 align-items: center로 중앙 정렬하므로 제거 가능
  background-color: #202055;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  &:hover {
    background-color: #2f2f7d;
  }
  &:disabled {
    background-color: #cccccc;
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
  z-index: 1;
  .MuiSvgIcon-root {
    font-size: 28px;
  }
  &:hover {
    color: ${AppColors.onSurface};
  }
`;

const TextInput = styled.input`
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #cccccc;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 16px;
  background-color: white;
  color: black;
  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
  &::placeholder {
    color: #aaaaaa;
  }
  &:read-only {
    background-color: #e9ecef;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: ${AppColors.primary};
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  padding: 8px 0;
  flex-shrink: 0; // 뒤로가기 버튼 크기 고정

  .MuiSvgIcon-root {
    margin-right: 6px;
  }

  &:hover {
    color: ${AppColors.secondary};
  }
`;

const WithdrawLink = styled.button`
  background: none;
  border: none;
  color: ${AppColors.onSurfaceVariant};
  text-decoration: underline;
  cursor: pointer;
  font-size: 14px;
  padding: 8px;
  margin-top: 20px; // Form 마지막 요소와의 간격
  display: block; // 추가: 오른쪽 정렬을 위해
  margin-left: auto; // 추가: 오른쪽 정렬
  margin-right: 0; // 추가: 오른쪽 정렬

  &:hover {
    color: ${AppColors.error};
  }
`;

export const EditProfileModal = () => {
  const { isEditProfileModalOpen, closeEditProfileModal, user } =
    useAuthStore();
  const { sendVerification, isSubmitting: isSendingVerification } =
    useUserJoin();
  const {
    updateUserProfile,
    isUpdating,
    error: userUpdateError,
  } = useUserUpdate();
  const {
    deleteUserAccount,
    isDeleting: isDeletingAccount,
    error: userDeleteError,
  } = useUserDelete(); // 새 훅 사용

  const [viewMode, setViewMode] = useState<'info' | 'phoneAuth'>('info');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [newPhoneNumber, setNewPhoneNumber] = useState('');
  const [authSelectedCountry, setAuthSelectedCountry] = useState(
    countryCodes[0]
  );
  const [isAuthCountryDropdownOpen, setIsAuthCountryDropdownOpen] =
    useState(false);
  const authDropdownRef = useRef<HTMLDivElement>(null);

  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [isWithdrawConfirmModalOpen, setIsWithdrawConfirmModalOpen] =
    useState(false); // 회원탈퇴 확인 모달 상태

  const isInfoFormValid = name.trim() !== '' && email.trim() !== '';

  useEffect(() => {
    if (userUpdateError) {
      setVerificationError(userUpdateError);
    }
    if (userDeleteError) {
      toast.error(userDeleteError);
    }
  }, [userUpdateError, userDeleteError]);

  useEffect(() => {
    if (isEditProfileModalOpen && user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCurrentPhoneNumber(user.cellphone || '');
      setNewPhoneNumber('');
      setVerificationSent(false);
      setVerificationCode('');

      const initialCountry = user.countryCode
        ? countryCodes.find((c) => c.code === user.countryCode) ||
          countryCodes[0]
        : countryCodes[0];
      setSelectedCountry(initialCountry);
      setAuthSelectedCountry(initialCountry);

      setViewMode('info');
      setNameError('');
      setPhoneError('');
    } else if (!isEditProfileModalOpen) {
      setViewMode('info');
      setNewPhoneNumber('');
      setVerificationCode('');
      setVerificationSent(false);
      setNameError('');
      setPhoneError('');
    }
  }, [isEditProfileModalOpen, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
      if (
        authDropdownRef.current &&
        !authDropdownRef.current.contains(event.target as Node)
      ) {
        setIsAuthCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCloseModal = () => {
    closeEditProfileModal();
  };

  const validateName = () => {
    if (!name.trim()) {
      setNameError('이름을 입력해주세요.');
      return false;
    }
    setNameError('');
    return true;
  };

  const validateEmail = () => {
    if (!email.trim()) {
      toast.warn('이메일을 입력해주세요.');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.warn('유효한 이메일 형식이 아닙니다.');
      return false;
    }
    return true;
  };

  const validateNewPhone = () => {
    if (!newPhoneNumber.trim()) {
      setPhoneError('새로운 휴대전화 번호를 입력해주세요.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleChangePhoneClick = () => {
    const currentCountry = user?.countryCode
      ? countryCodes.find((c) => c.code === user.countryCode) || countryCodes[0]
      : countryCodes[0];
    setAuthSelectedCountry(currentCountry);
    setIsAuthCountryDropdownOpen(false);
    setViewMode('phoneAuth');
  };

  const handleBackToInfoClick = () => {
    setViewMode('info');
    setPhoneError('');
  };

  const handleSendVerification = async () => {
    if (!validateNewPhone()) return;
    setVerificationError('');
    const result = await sendVerification(
      authSelectedCountry.code,
      newPhoneNumber
    );
    if (result) {
      setVerificationSent(true);
      toast.success('인증번호가 발송되었습니다.');
    } else {
      setVerificationError(
        '인증번호 발송에 실패했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.'
      );
    }
  };

  const handleUpdateProfile = async () => {
    if (!validateName() || !validateEmail()) {
      toast.warn('이름과 이메일을 확인해주세요.');
      return;
    }
    setVerificationError('');

    const payload: UserUpdatePayload = {};
    if (user && name !== user.name) payload.name = name;
    if (user && email !== user.email) payload.email = email;

    if (Object.keys(payload).length === 0) {
      toast.info('변경된 내용이 없습니다.');
      return;
    }

    const success = await updateUserProfile(payload);
    if (success) {
      closeEditProfileModal();
    }
  };

  const handleCompletePhoneAuthAndUpdate = async () => {
    if (!validateName() || !validateEmail()) {
      toast.warn('이름과 이메일 정보를 확인해주세요. (이전 화면에서 수정)');
      setViewMode('info');
      return;
    }
    if (!newPhoneNumber.trim()) {
      toast.warn('새로운 휴대전화 번호를 입력해주세요.');
      return;
    }
    setVerificationError('');

    const payload: UserUpdatePayload = {
      name: name,
      email: email,
      countryCode: authSelectedCountry.code,
      cellphone: newPhoneNumber,
      authNum: verificationCode,
    };

    const success = await updateUserProfile(payload);
    if (success) {
      closeEditProfileModal();
    }
  };

  const handleWithdraw = async () => {
    const success = await deleteUserAccount();
    if (success) {
      closeEditProfileModal(); // 회원탈퇴 성공 시 프로필 모달도 닫기
      setIsWithdrawConfirmModalOpen(false); // 확인 모달 닫기
    }
    // 실패 시에는 useUserDelete 훅 내부에서 토스트 메시지가 표시되고, 확인 모달은 열려있을 수 있음
  };

  const openWithdrawConfirmModal = () => {
    setIsWithdrawConfirmModalOpen(true);
  };

  const closeWithdrawConfirmModal = () => {
    setIsWithdrawConfirmModalOpen(false);
  };

  if (!isEditProfileModalOpen) {
    return null;
  }

  return (
    <>
      <ModalOverlay $isOpen={isEditProfileModalOpen} onClick={handleCloseModal}>
        <ModalContentWrapper onClick={(e) => e.stopPropagation()}>
          <StyledCloseButton onClick={handleCloseModal}>
            <CloseIcon />
          </StyledCloseButton>

          <ModalViewsContainer $viewMode={viewMode}>
            <View>
              <ModalTitle>회원정보 수정</ModalTitle>
              <ScrollableContent className="info-view-scroll">
                <FormGroup>
                  <Label>이름</Label>
                  <TextInput
                    type="text"
                    placeholder="이름을 입력하세요"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={validateName}
                  />
                  {nameError && <ErrorMessage>{nameError}</ErrorMessage>}

                  <Label>회사 이메일</Label>
                  <TextInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="이메일을 입력하세요"
                  />

                  <Label>국가</Label>
                  <CountrySelect ref={dropdownRef}>
                    <SelectButton
                      type="button"
                      onClick={() =>
                        setIsCountryDropdownOpen(!isCountryDropdownOpen)
                      }
                      disabled
                    >
                      {selectedCountry.name} {selectedCountry.code}
                      {isCountryDropdownOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </SelectButton>
                    <DropdownContainer $isOpen={isCountryDropdownOpen}>
                      {countryCodes.map((country) => (
                        <CountryOption
                          key={country.code}
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsCountryDropdownOpen(false);
                          }}
                        >
                          {country.name} {country.code}
                        </CountryOption>
                      ))}
                    </DropdownContainer>
                  </CountrySelect>

                  <Label>휴대전화</Label>
                  <InputGroup>
                    <PhoneInput
                      type="tel"
                      value={currentPhoneNumber || '정보 없음'}
                      readOnly
                    />
                    <ChangeButton onClick={handleChangePhoneClick}>
                      변경하기
                    </ChangeButton>
                  </InputGroup>
                </FormGroup>
                <WithdrawLink
                  onClick={openWithdrawConfirmModal} // 확인 모달 열기
                  disabled={isDeletingAccount || isUpdating}
                >
                  {isDeletingAccount ? '처리 중...' : '회원탈퇴'}
                </WithdrawLink>
              </ScrollableContent>
              <ButtonContainer>
                <CompleteButton
                  onClick={handleUpdateProfile}
                  disabled={!isInfoFormValid || isUpdating}
                >
                  {isUpdating ? '처리 중...' : '수정 완료'}
                </CompleteButton>
              </ButtonContainer>
            </View>

            <View>
              <BackButton onClick={handleBackToInfoClick}>
                <ArrowBackIcon />
                뒤로가기
              </BackButton>
              <ModalTitle>휴대전화 번호 변경</ModalTitle>
              <ScrollableContent className="auth-view-scroll">
                <FormGroup>
                  <Label>국가</Label>
                  <CountrySelect ref={authDropdownRef}>
                    <SelectButton
                      type="button"
                      onClick={() =>
                        setIsAuthCountryDropdownOpen(!isAuthCountryDropdownOpen)
                      }
                    >
                      {authSelectedCountry.name} {authSelectedCountry.code}
                      {isAuthCountryDropdownOpen ? (
                        <KeyboardArrowUpIcon />
                      ) : (
                        <KeyboardArrowDownIcon />
                      )}
                    </SelectButton>
                    <DropdownContainer $isOpen={isAuthCountryDropdownOpen}>
                      {countryCodes.map((country) => (
                        <CountryOption
                          key={country.code}
                          onClick={() => {
                            setAuthSelectedCountry(country);
                            setIsAuthCountryDropdownOpen(false);
                          }}
                        >
                          {country.name} {country.code}
                        </CountryOption>
                      ))}
                    </DropdownContainer>
                  </CountrySelect>

                  <Label style={{ marginTop: '16px' }}>
                    새로운 휴대전화 번호
                  </Label>
                  <InputGroup>
                    <PhoneInput
                      type="tel"
                      placeholder={
                        authSelectedCountry.code === '+82'
                          ? '010-1234-5678'
                          : 'Phone Number'
                      }
                      value={newPhoneNumber}
                      onChange={(e) => setNewPhoneNumber(e.target.value)}
                      disabled={verificationSent}
                      onBlur={validateNewPhone}
                    />
                    <VerifyButton
                      onClick={handleSendVerification}
                      disabled={
                        !newPhoneNumber.trim() ||
                        verificationSent ||
                        isSendingVerification
                      }
                    >
                      {verificationSent
                        ? isSendingVerification
                          ? '전송 중...'
                          : '재전송'
                        : isSendingVerification
                        ? '전송 중...'
                        : '인증번호 받기'}
                    </VerifyButton>
                  </InputGroup>
                  {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}

                  {verificationSent && (
                    <>
                      <VerificationInput
                        type="text"
                        placeholder="인증번호를 입력하세요"
                        value={verificationCode}
                        onChange={(e) => {
                          setVerificationCode(e.target.value);
                          if (verificationError) setVerificationError('');
                        }}
                      />
                      {verificationError && (
                        <ErrorMessage
                          style={{ marginTop: '-12px', marginBottom: '12px' }}
                        >
                          {verificationError}
                        </ErrorMessage>
                      )}
                    </>
                  )}
                </FormGroup>
              </ScrollableContent>
              <ButtonContainer>
                <CompleteButton
                  onClick={handleCompletePhoneAuthAndUpdate}
                  disabled={
                    !newPhoneNumber.trim() ||
                    !verificationCode.trim() ||
                    isUpdating
                  }
                >
                  {isUpdating ? '처리 중...' : '수정 완료'}
                </CompleteButton>
              </ButtonContainer>
            </View>
          </ModalViewsContainer>
        </ModalContentWrapper>
      </ModalOverlay>

      {/* 회원탈퇴 확인 모달 */}
      <EstimateRequestModal
        $isOpen={isWithdrawConfirmModalOpen}
        onClose={closeWithdrawConfirmModal}
        onConfirm={handleWithdraw} // 실제 탈퇴 로직 연결
        title="회원탈퇴 확인"
        content="정말로 회원탈퇴를 진행하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmButtonText="탈퇴하기"
        cancelButtonText="취소"
      />
    </>
  );
};

export default EditProfileModal;
