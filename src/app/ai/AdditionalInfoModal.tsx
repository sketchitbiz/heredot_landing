// src/app/ai/AdditionalInfoModal.tsx

'use client';

import { useState, useEffect, useRef } from 'react';
import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CloseIcon from '@mui/icons-material/Close';
import useAuthStore from '@/store/authStore';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import { ToastContainer, toast } from 'react-toastify'; // toast import 추가
import 'react-toastify/dist/ReactToastify.css';
import { countryCodes } from './countryCodesData';
import useUserJoin from '@/hooks/useUserJoin';
import TermsAgreement from '@/app/ai/components/TermsAgreement';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/navigation';

// ... (약관 내용 및 다른 styled-components 정의는 그대로 유지) ...
// 약관 내용 정의
const termsContentText = `
1. 목적<br />본 약관은 AI 견적서(이하 \"회사\")가 제공하는 서비스 이용과 관련하여 회사와 이용자의 권리·의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.<br /><br />
2. 이용계약의 성립<br />이용자는 본 약관에 동의함으로써 회사와 서비스 이용계약을 체결한 것으로 간주됩니다.<br /><br />
3. 서비스의 제공 및 변경<br />회사는 일정한 서비스를 지속적으로 제공하며, 필요한 경우 사전 고지 후 변경할 수 있습니다.<br /><br />
4. 회원의 의무<br />이용자는 허위 정보 제공, 타인 명의 도용 등의 행위를 하여서는 안 되며, 관계 법령 및 본 약관을 준수해야 합니다.<br /><br />
5. 회사의 의무<br />회사는 관련 법령과 본 약관에 따라 지속적이고 안정적인 서비스 제공을 위해 노력합니다.<br /><br />
6. 계약 해지 및 서비스 종료<br />이용자는 언제든지 서비스 해지를 요청할 수 있으며, 회사는 서비스 종료 시 사전 고지합니다.<br /><br />
7. 면책 조항<br />회사는 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.<br /><br />※ 본 약관에 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.
`;

const privacyContentText = `
회사는 AI 견적서 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.<br /><br />
회사명 : (주)여기닷<br /><br />
<strong>수집 항목</strong><br />- 이름, 이메일, 전화번호, 구글 계정 정보(이메일, 이름, 프로필 이미지)<br /><br />
<strong>수집 목적</strong><br />- 본인 식별 및 인증<br />- 견적 요청 및 결과 저장<br />- 사용자 맞춤 서비스 제공<br />- 고객 문의 응대<br /><br />
<strong>보유 및 이용 기간</strong><br />- 회원 탈퇴 또는 목적 달성 시까지<br />- 단, 관련 법령에 따라 일정 기간 보관될 수 있습니다<br />(전자상거래법 등)<br /><br />
※ 이용자는 위의 개인정보 수집 및 이용에 대해 동의를 거부할 권리가 있습니다.<br />단, 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.
`;

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

const ModalContent = styled.div<{ $viewingTerms?: boolean }>`
  background-color: #f5f5f5;
  color: ${AppColors.onSurface};
  padding: 40px;
  border-radius: 6px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease-out;

  ${(props) =>
    props.$viewingTerms &&
    css`
      /* 약관 보기 시 스타일 변경 (선택적) */
    `}
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
`;

const DropdownContainer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 240px;
  overflow-y: auto;
  background-color: white;
  border: 1px solid #cccccc;
  border-radius: 4px;
  margin-top: 4px;
  z-index: 10;
  display: ${(props) => (props.$isOpen ? 'block' : 'none')};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #e0e0e0; /* 연한 회색 배경 */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #aaaaaa; /* 회색 스크롤바 */
    border-radius: 4px;
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
`;

const PhoneInput = styled.input`
  flex: 1;
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

const CompleteButton = styled.button`
  width: 100%;
  padding: 12px 16px;
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
`;

const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background-color: #323232;
    color: white;
  }

  .Toastify__toast-body {
    font-family: 'Pretendard', sans-serif;
  }

  .Toastify__progress-bar {
    background-color: ${AppColors.secondary};
  }
`;

const TermsViewContainer = styled.div`
  padding-top: 0;
`;

const TermsTitle = styled.h3`
  ${AppTextStyles.title3}
  margin-bottom: 16px;
  text-align: center;
`;

const TermsContent = styled.div`
  ${AppTextStyles.body2}
  color: #333333;
  background-color: white;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  max-height: calc(80vh - 200px);
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  line-height: 1.6;

  &::-webkit-scrollbar {
    width: 8px;
  }
  &::-webkit-scrollbar-track {
    background: #e0e0e0;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #aaaaaa;
    border-radius: 4px;
  }
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

  .MuiSvgIcon-root {
    margin-right: 6px;
  }

  &:hover {
    color: ${AppColors.secondary};
  }
`;

export const AdditionalInfoModal = () => {
  const { isAdditionalInfoModalOpen, closeAdditionalInfoModal, user, logout } =
    useAuthStore();
  const { joinUser, sendVerification, verifyCode, isSubmitting } =
    useUserJoin();
  const router = useRouter();

  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [viewingTermsType, setViewingTermsType] = useState<
    'terms' | 'privacy' | null
  >(null);

  const isFormValid =
    isVerified &&
    privacyAgreed &&
    termsAgreed &&
    name.trim() !== '' &&
    email.trim() !== '';

  useEffect(() => {
    if (isAdditionalInfoModalOpen && user) {
      // 모달이 열려있을 때만 user 값으로 상태 초기화
      setName(user.name||''); // 항상 빈 문자열로 시작
      setEmail(''); // 항상 빈 문자열로 시작
      if (user.cellphone) {
        setPhoneNumber(user.cellphone);
        setIsVerified(true); // 이미 전화번호가 있다면 인증된 것으로 간주
      } else {
        setPhoneNumber(''); // 전화번호가 없으면 초기화
        setIsVerified(false);
      }
      if (user.countryCode) {
        const country = countryCodes.find((c) => c.code === user.countryCode);
        if (country) setSelectedCountry(country);
        else setSelectedCountry(countryCodes[0]); // 못찾으면 기본값
      } else {
        setSelectedCountry(countryCodes[0]); // 국가 코드 없으면 기본값
      }
    }
  }, [isAdditionalInfoModalOpen, user]); // user와 isAdditionalInfoModalOpen 둘 다 의존성

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCloseModalAndCheckLogout = () => {
    if (user && (!user.name || !user.name.trim() || !user.cellphone)) {
      console.log(
        '[AdditionalInfoModal] Closing modal without required info, logging out.'
      );
      toast.info('필수 정보가 입력되지 않아 로그아웃됩니다.', {
        autoClose: 2000,
      });
      logout(router);
      // logout 액션이 isAdditionalInfoModalOpen 상태도 false로 변경해야 함
      // 만약 그렇지 않다면 여기서 closeAdditionalInfoModal() 호출이 필요할 수 있음
      // 하지만 일반적으로 logout 시 관련 모달 상태는 모두 초기화됨
    } else {
      closeAdditionalInfoModal();
    }
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
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError('이메일을 입력해주세요.');
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError('유효한 이메일 주소를 입력해주세요.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhone = () => {
    if (!phoneNumber.trim()) {
      setPhoneError('전화번호를 입력해주세요.');
      return false;
    }
    setPhoneError('');
    return true;
  };

  const handleAgreeChange = (
    newPrivacyAgreed: boolean,
    newTermsAgreed: boolean
  ) => {
    setPrivacyAgreed(newPrivacyAgreed);
    setTermsAgreed(newTermsAgreed);
  };

  const handleViewTermsDetails = (type: 'terms' | 'privacy') => {
    setViewingTermsType(type);
  };

  const handleSendVerification = async () => {
    if (!validatePhone()) return;
    const result = await sendVerification(selectedCountry.code, phoneNumber);
    if (result) {
      setVerificationSent(true);
    }
  };

  const handleVerifyCode = async () => {
    if (!verificationCode) return;
    const result = await verifyCode(
      selectedCountry.code,
      phoneNumber,
      verificationCode
    );
    if (result) {
      setIsVerified(true);
    }
  };

  const handleComplete = async () => {
    let currentName = name;
    let currentEmail = email;

    // user 객체에서 가져온 값이 있다면 (특히 소셜 로그인 직후) 그걸 우선 사용
    if (user && user.name && !name.trim()) currentName = user.name;
    if (user && user.email && !email.trim()) currentEmail = user.email;

    if (!currentName.trim()) {
      validateName(); // 에러 메시지 표시용
      return;
    }
    if (
      !currentEmail.trim() ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(currentEmail)
    ) {
      validateEmail(); // 에러 메시지 표시용
      return;
    }
    if (!isVerified) {
      toast.warn('휴대전화 인증을 완료해주세요.');
      return;
    }
    if (!privacyAgreed || !termsAgreed) {
      toast.warn('모든 약관에 동의해주세요.');
      return;
    }

    const result = await joinUser({
      name: currentName,
      email: currentEmail,
      cellphone: phoneNumber,
      countryCode: selectedCountry.code,
    });

    if (result) {
      closeAdditionalInfoModal();
      // 페이지 새로고침이나 특정 페이지로의 리디렉션은 여기서 제거하거나,
      // 필요하다면 authStore의 user 상태가 업데이트된 후 실행되도록 조정합니다.
      // window.location.href = '/ai'; // 바로 리디렉션하면 toast가 안 보일 수 있음
      // 대신, 사용자 정보가 성공적으로 업데이트되었음을 알리고 모달만 닫습니다.
      // /ai 페이지의 useEffect가 업데이트된 user 정보를 감지하고 다음 단계를 진행할 수 있도록 합니다.
    }
  };

  useEffect(() => {
    if (!isAdditionalInfoModalOpen) {
      // 모달이 닫힐 때 모든 로컬 상태를 초기화합니다.
      setPhoneNumber('');
      setVerificationCode('');
      setVerificationSent(false);
      setIsVerified(false);
      setPrivacyAgreed(false);
      setTermsAgreed(false);
      setIsCountryDropdownOpen(false);
      // 이름과 이메일은 user 상태에서 다시 가져오므로, 여기서는 명시적으로 초기화하지 않거나,
      // 또는 user 상태와 동기화하는 로직을 유지합니다 (현재 user 의존성 useEffect).
      // 일단은 다른 필드들처럼 초기화합니다.
      setName('');
      setEmail('');
      setNameError('');
      setEmailError('');
      setPhoneError('');
      setViewingTermsType(null);
      setSelectedCountry(countryCodes[0]); // 국가 코드도 기본값으로
    }
  }, [isAdditionalInfoModalOpen]);

  if (!isAdditionalInfoModalOpen) {
    return null;
  }

  return (
    <>
      <ModalOverlay $isOpen={isAdditionalInfoModalOpen}>
        <ModalContent
          onClick={(e) => e.stopPropagation()}
          $viewingTerms={!!viewingTermsType}
        >
          {viewingTermsType ? (
            <TermsViewContainer>
              <BackButton onClick={() => setViewingTermsType(null)}>
                <ArrowBackIcon />
                뒤로가기
              </BackButton>
              <TermsTitle>
                {viewingTermsType === 'terms'
                  ? '이용약관'
                  : '개인정보 수집 및 이용 동의'}
              </TermsTitle>
              <TermsContent
                dangerouslySetInnerHTML={{
                  __html:
                    viewingTermsType === 'terms'
                      ? termsContentText
                      : privacyContentText,
                }}
              />
            </TermsViewContainer>
          ) : (
            <>
              <StyledCloseButton onClick={handleCloseModalAndCheckLogout}>
                {' '}
                {/* 수정된 핸들러 연결 */}
                <CloseIcon />
              </StyledCloseButton>
              <ModalTitle>회원 정보 입력</ModalTitle>
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
                  placeholder="업무용 이메일을 입력하세요"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={validateEmail}
                />
                {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

                <Label>국가</Label>
                <CountrySelect ref={dropdownRef}>
                  <SelectButton
                    type="button"
                    onClick={() =>
                      setIsCountryDropdownOpen(!isCountryDropdownOpen)
                    }
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
                    placeholder={
                      selectedCountry.code === '+82'
                        ? '010-1234-5678'
                        : 'Phone Number'
                    }
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    disabled={isVerified || verificationSent} // 인증 완료 또는 인증번호 전송 후 비활성화
                    onBlur={validatePhone}
                  />
                  <VerifyButton
                    onClick={handleSendVerification}
                    disabled={
                      !phoneNumber.trim() ||
                      isVerified ||
                      verificationSent ||
                      isSubmitting
                    } // 이미 인증/전송/제출 중이면 비활성화
                  >
                    {isVerified
                      ? '인증 완료'
                      : verificationSent
                      ? isSubmitting
                        ? '전송 중...'
                        : '재전송' // 재전송 버튼 텍스트
                      : isSubmitting
                      ? '전송 중...'
                      : '인증번호 받기'}
                  </VerifyButton>
                </InputGroup>
                {phoneError && <ErrorMessage>{phoneError}</ErrorMessage>}

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
                      disabled={!verificationCode.trim() || isSubmitting} // 코드 미입력 또는 제출 중 비활성화
                      style={{ width: '100%', marginBottom: '24px' }}
                    >
                      {isSubmitting ? '인증 중...' : '인증하기'}
                    </VerifyButton>
                  </>
                )}
              </FormGroup>

              <TermsAgreement
                onAgreeChange={handleAgreeChange}
                initialPrivacyAgreed={privacyAgreed}
                initialTermsAgreed={termsAgreed}
                onViewDetails={handleViewTermsDetails}
              />

              <CompleteButton
                onClick={handleComplete}
                disabled={!isFormValid || isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '완료'}
              </CompleteButton>
            </>
          )}
        </ModalContent>
      </ModalOverlay>
      <StyledToastContainer limit={3} />{' '}
      {/* 토스트 메시지 중복 방지 옵션 추가 */}
    </>
  );
};

export default AdditionalInfoModal;
