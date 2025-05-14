"use client";

import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import CloseIcon from "@mui/icons-material/Close";
import useAuthStore from "@/store/authStore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import apiClient from "@/lib/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const DropdownContainer = styled.div<{ isOpen: boolean }>`
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
  display: ${(props) => (props.isOpen ? "block" : "none")};
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 연한 회색 배경 */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc; /* 기존 스크롤바 색상 유지 */
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

const CheckboxContainer = styled.div`
  margin-bottom: 16px;
  padding-top: 16px;
  border-top: 1px solid #dddddd;
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
  appearance: none;
  border: 1px solid #cccccc;
  border-radius: 4px;
  background-color: white;

  &:checked {
    background-color: #202055;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      display: block;
      left: 6px;
      top: 2px;
      width: 5px;
      height: 10px;
      border: solid white;
      border-width: 0 2px 2px 0;
      transform: rotate(45deg);
    }
  }

  &:focus {
    outline: none;
    border-color: #202055;
  }
`;

const CheckboxLabel = styled.label`
  ${AppTextStyles.body2}
  cursor: pointer;
`;

const PrivacyPolicyText = styled.div`
  ${AppTextStyles.caption1}
  color: #555555;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  height: 160px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 연한 회색 배경 */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc; /* 기존 스크롤바 색상 유지 */
    border-radius: 4px;
  }
`;

const TermsPolicyText = styled.div`
  ${AppTextStyles.caption1}
  color: #555555;
  background-color: white;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 24px;
  height: 120px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;

  /* 스크롤바 스타일 */
  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1; /* 연한 회색 배경 */
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cccccc; /* 기존 스크롤바 색상 유지 */
    border-radius: 4px;
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

// 이름, 이메일 입력 필드 스타일
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

// 에러 메시지 스타일
const ErrorMessage = styled.p`
  color: #e53935;
  font-size: 14px;
  margin-top: -12px;
  margin-bottom: 16px;
`;

// 커스텀 토스트 컨테이너 스타일
const StyledToastContainer = styled(ToastContainer)`
  .Toastify__toast {
    background-color: #323232;
    color: white;
  }

  .Toastify__toast-body {
    font-family: "Pretendard", sans-serif;
  }

  .Toastify__progress-bar {
    background-color: ${AppColors.secondary};
  }
`;

// 국가별 전화번호 코드 목록 (종합)
const countryCodes = [
  { name: "대한민국", code: "+82" },
  { name: "日本 (Japan)", code: "+81" },
  { name: "中国 (China)", code: "+86" },
  { name: "United States/Canada", code: "+1" },
  { name: "United Kingdom", code: "+44" },
  { name: "France", code: "+33" },
  { name: "Deutschland (Germany)", code: "+49" },
  { name: "Italia (Italy)", code: "+39" },
  { name: "España (Spain)", code: "+34" },
  { name: "Россия (Russia)", code: "+7" },
  { name: "Australia", code: "+61" },
  { name: "Brasil (Brazil)", code: "+55" },
  { name: "México (Mexico)", code: "+52" },
  { name: "भारत (India)", code: "+91" },
  { name: "Singapore", code: "+65" },
  { name: "ประเทศไทย (Thailand)", code: "+66" },
  { name: "Malaysia", code: "+60" },
  { name: "Việt Nam (Vietnam)", code: "+84" },
  { name: "Indonesia", code: "+62" },
  { name: "Philippines", code: "+63" },
  { name: "Afghanistan", code: "+93" },
  { name: "Albania", code: "+355" },
  { name: "Algeria", code: "+213" },
  { name: "American Samoa", code: "+1-684" },
  { name: "Andorra", code: "+376" },
  { name: "Angola", code: "+244" },
  { name: "Anguilla", code: "+1-264" },
  { name: "Antigua and Barbuda", code: "+1-268" },
  { name: "Argentina", code: "+54" },
  { name: "Armenia", code: "+374" },
  { name: "Aruba", code: "+297" },
  { name: "Austria", code: "+43" },
  { name: "Azerbaijan", code: "+994" },
  { name: "Bahamas", code: "+1-242" },
  { name: "Bahrain", code: "+973" },
  { name: "Bangladesh", code: "+880" },
  { name: "Barbados", code: "+1-246" },
  { name: "Belarus", code: "+375" },
  { name: "Belgium", code: "+32" },
  { name: "Belize", code: "+501" },
  { name: "Benin", code: "+229" },
  { name: "Bermuda", code: "+1-441" },
  { name: "Bhutan", code: "+975" },
  { name: "Bolivia", code: "+591" },
  { name: "Bosnia and Herzegovina", code: "+387" },
  { name: "Botswana", code: "+267" },
  { name: "British Virgin Islands", code: "+1-284" },
  { name: "Brunei", code: "+673" },
  { name: "Bulgaria", code: "+359" },
  { name: "Burkina Faso", code: "+226" },
  { name: "Burundi", code: "+257" },
  { name: "Cambodia", code: "+855" },
  { name: "Cameroon", code: "+237" },
  { name: "Cape Verde", code: "+238" },
  { name: "Cayman Islands", code: "+1-345" },
  { name: "Central African Republic", code: "+236" },
  { name: "Chad", code: "+235" },
  { name: "Chile", code: "+56" },
  { name: "Colombia", code: "+57" },
  { name: "Comoros", code: "+269" },
  { name: "Congo (Brazzaville)", code: "+242" },
  { name: "Congo (Kinshasa)", code: "+243" },
  { name: "Cook Islands", code: "+682" },
  { name: "Costa Rica", code: "+506" },
  { name: "Croatia", code: "+385" },
  { name: "Cuba", code: "+53" },
  { name: "Cyprus", code: "+357" },
  { name: "Czech Republic", code: "+420" },
  { name: "Denmark", code: "+45" },
  { name: "Djibouti", code: "+253" },
  { name: "Dominica", code: "+1-767" },
  { name: "Dominican Republic", code: "+1-809" },
  { name: "Ecuador", code: "+593" },
  { name: "Egypt", code: "+20" },
  { name: "El Salvador", code: "+503" },
  { name: "Equatorial Guinea", code: "+240" },
  { name: "Eritrea", code: "+291" },
  { name: "Estonia", code: "+372" },
  { name: "Eswatini", code: "+268" },
  { name: "Ethiopia", code: "+251" },
  { name: "Falkland Islands", code: "+500" },
  { name: "Faroe Islands", code: "+298" },
  { name: "Fiji", code: "+679" },
  { name: "Finland", code: "+358" },
  { name: "French Guiana", code: "+594" },
  { name: "French Polynesia", code: "+689" },
  { name: "Gabon", code: "+241" },
  { name: "Gambia", code: "+220" },
  { name: "Georgia", code: "+995" },
  { name: "Ghana", code: "+233" },
  { name: "Gibraltar", code: "+350" },
  { name: "Greece", code: "+30" },
  { name: "Greenland", code: "+299" },
  { name: "Grenada", code: "+1-473" },
  { name: "Guadeloupe", code: "+590" },
  { name: "Guam", code: "+1-671" },
  { name: "Guatemala", code: "+502" },
  { name: "Guinea", code: "+224" },
  { name: "Guinea-Bissau", code: "+245" },
  { name: "Guyana", code: "+592" },
  { name: "Haiti", code: "+509" },
  { name: "Honduras", code: "+504" },
  { name: "Hong Kong", code: "+852" },
  { name: "Hungary", code: "+36" },
  { name: "Iceland", code: "+354" },
  { name: "Iran", code: "+98" },
  { name: "Iraq", code: "+964" },
  { name: "Ireland", code: "+353" },
  { name: "Israel", code: "+972" },
  { name: "Ivory Coast", code: "+225" },
  { name: "Jamaica", code: "+1-876" },
  { name: "Jordan", code: "+962" },
  { name: "Kazakhstan", code: "+7" },
  { name: "Kenya", code: "+254" },
  { name: "Kiribati", code: "+686" },
  { name: "Kosovo", code: "+383" },
  { name: "Kuwait", code: "+965" },
  { name: "Kyrgyzstan", code: "+996" },
  { name: "Laos", code: "+856" },
  { name: "Latvia", code: "+371" },
  { name: "Lebanon", code: "+961" },
  { name: "Lesotho", code: "+266" },
  { name: "Liberia", code: "+231" },
  { name: "Libya", code: "+218" },
  { name: "Liechtenstein", code: "+423" },
  { name: "Lithuania", code: "+370" },
  { name: "Luxembourg", code: "+352" },
  { name: "Macau", code: "+853" },
  { name: "Madagascar", code: "+261" },
  { name: "Malawi", code: "+265" },
  { name: "Maldives", code: "+960" },
  { name: "Mali", code: "+223" },
  { name: "Malta", code: "+356" },
  { name: "Marshall Islands", code: "+692" },
  { name: "Martinique", code: "+596" },
  { name: "Mauritania", code: "+222" },
  { name: "Mauritius", code: "+230" },
  { name: "Mayotte", code: "+262" },
  { name: "Micronesia", code: "+691" },
  { name: "Moldova", code: "+373" },
  { name: "Monaco", code: "+377" },
  { name: "Mongolia", code: "+976" },
  { name: "Montenegro", code: "+382" },
  { name: "Montserrat", code: "+1-664" },
  { name: "Morocco", code: "+212" },
  { name: "Mozambique", code: "+258" },
  { name: "Myanmar", code: "+95" },
  { name: "Namibia", code: "+264" },
  { name: "Nauru", code: "+674" },
  { name: "Nepal", code: "+977" },
  { name: "Netherlands", code: "+31" },
  { name: "New Caledonia", code: "+687" },
  { name: "New Zealand", code: "+64" },
  { name: "Nicaragua", code: "+505" },
  { name: "Niger", code: "+227" },
  { name: "Nigeria", code: "+234" },
  { name: "Niue", code: "+683" },
  { name: "North Korea", code: "+850" },
  { name: "North Macedonia", code: "+389" },
  { name: "Northern Mariana Islands", code: "+1-670" },
  { name: "Norway", code: "+47" },
  { name: "Oman", code: "+968" },
  { name: "Pakistan", code: "+92" },
  { name: "Palau", code: "+680" },
  { name: "Palestine", code: "+970" },
  { name: "Panama", code: "+507" },
  { name: "Papua New Guinea", code: "+675" },
  { name: "Paraguay", code: "+595" },
  { name: "Peru", code: "+51" },
  { name: "Poland", code: "+48" },
  { name: "Portugal", code: "+351" },
  { name: "Puerto Rico", code: "+1-787" },
  { name: "Qatar", code: "+974" },
  { name: "Reunion", code: "+262" },
  { name: "Romania", code: "+40" },
  { name: "Rwanda", code: "+250" },
  { name: "Saint Kitts and Nevis", code: "+1-869" },
  { name: "Saint Lucia", code: "+1-758" },
  { name: "Saint Pierre and Miquelon", code: "+508" },
  { name: "Saint Vincent and the Grenadines", code: "+1-784" },
  { name: "Samoa", code: "+685" },
  { name: "San Marino", code: "+378" },
  { name: "Sao Tome and Principe", code: "+239" },
  { name: "Saudi Arabia", code: "+966" },
  { name: "Senegal", code: "+221" },
  { name: "Serbia", code: "+381" },
  { name: "Seychelles", code: "+248" },
  { name: "Sierra Leone", code: "+232" },
  { name: "Slovakia", code: "+421" },
  { name: "Slovenia", code: "+386" },
  { name: "Solomon Islands", code: "+677" },
  { name: "Somalia", code: "+252" },
  { name: "South Africa", code: "+27" },
  { name: "South Sudan", code: "+211" },
  { name: "Sri Lanka", code: "+94" },
  { name: "Sudan", code: "+249" },
  { name: "Suriname", code: "+597" },
  { name: "Sweden", code: "+46" },
  { name: "Switzerland", code: "+41" },
  { name: "Syria", code: "+963" },
  { name: "Taiwan", code: "+886" },
  { name: "Tajikistan", code: "+992" },
  { name: "Tanzania", code: "+255" },
  { name: "Togo", code: "+228" },
  { name: "Tokelau", code: "+690" },
  { name: "Tonga", code: "+676" },
  { name: "Trinidad and Tobago", code: "+1-868" },
  { name: "Tunisia", code: "+216" },
  { name: "Turkey", code: "+90" },
  { name: "Turkmenistan", code: "+993" },
  { name: "Turks and Caicos Islands", code: "+1-649" },
  { name: "Tuvalu", code: "+688" },
  { name: "Uganda", code: "+256" },
  { name: "Ukraine", code: "+380" },
  { name: "United Arab Emirates", code: "+971" },
  { name: "Uruguay", code: "+598" },
  { name: "Uzbekistan", code: "+998" },
  { name: "Vanuatu", code: "+678" },
  { name: "Vatican City", code: "+379" },
  { name: "Venezuela", code: "+58" },
  { name: "Wallis and Futuna", code: "+681" },
  { name: "Yemen", code: "+967" },
  { name: "Zambia", code: "+260" },
  { name: "Zimbabwe", code: "+263" },
];

export const AdditionalInfoModal = () => {
  const { isAdditionalInfoModalOpen, closeAdditionalInfoModal, user, login } = useAuthStore();

  // 기존 상태 변수들
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [allAgreed, setAllAgreed] = useState(false);
  const [privacyAgreed, setPrivacyAgreed] = useState(false);
  const [termsAgreed, setTermsAgreed] = useState(false);

  // 새로운 상태 변수들
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  // 국가 선택 드롭다운 상태
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 모든 필수 조건이 충족되었는지 확인
  const isFormValid = isVerified && privacyAgreed && termsAgreed && name.trim() !== "" && email.trim() !== "";

  // 사용자 정보 초기화
  useEffect(() => {
    if (user) {
      if (user.name) setName(user.name);
      if (user.email) setEmail(user.email);
      if (user.cellphone) {
        setPhoneNumber(user.cellphone);
        setIsVerified(true);
      }
      if (user.countryCode) {
        const country = countryCodes.find((c) => c.code === user.countryCode);
        if (country) setSelectedCountry(country);
      }
    }
  }, [user]);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 이름 유효성 검사
  const validateName = () => {
    if (!name.trim()) {
      setNameError("이름을 입력해주세요.");
      return false;
    }
    setNameError("");
    return true;
  };

  // 이메일 유효성 검사
  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setEmailError("이메일을 입력해주세요.");
      return false;
    }
    if (!emailRegex.test(email)) {
      setEmailError("유효한 이메일 주소를 입력해주세요.");
      return false;
    }
    setEmailError("");
    return true;
  };

  // 전화번호 유효성 검사
  const validatePhone = () => {
    if (!phoneNumber.trim()) {
      setPhoneError("전화번호를 입력해주세요.");
      return false;
    }
    setPhoneError("");
    return true;
  };

  // 토스트 메시지 표시 함수 - react-toastify 사용
  const showToast = (message: string) => {
    toast.success(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // 에러 토스트 메시지 표시 함수
  const showErrorToast = (message: string) => {
    toast.error(message, {
      position: "bottom-center",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // 전체 동의 체크박스 처리
  const handleAllAgree = () => {
    const newValue = !allAgreed;
    setAllAgreed(newValue);
    setPrivacyAgreed(newValue);
    setTermsAgreed(newValue);
  };

  // 개별 체크박스 처리
  const handlePrivacyAgree = () => {
    const newValue = !privacyAgreed;
    setPrivacyAgreed(newValue);
    // 모든 체크박스가 체크되었는지 확인
    if (newValue && termsAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  // 약관 동의 체크박스 처리
  const handleTermsAgree = () => {
    const newValue = !termsAgreed;
    setTermsAgreed(newValue);
    // 모든 체크박스가 체크되었는지 확인
    if (newValue && privacyAgreed) {
      setAllAgreed(true);
    } else {
      setAllAgreed(false);
    }
  };

  // 인증번호 전송 처리
  const handleSendVerification = async () => {
    if (!validatePhone()) return;

    setIsSendingCode(true);

    setVerificationSent(true);
    showToast("인증번호가 발송되었습니다.");

    // try {
    //   // 실제 인증번호 전송 API 연동
    //   const response = await apiClient.post("/user/send-verification", {
    //     countryCode: selectedCountry.code,
    //     phoneNumber: phoneNumber,
    //   });

    //   if (response.data && response.data[0]?.statusCode === 200) {
    //     setVerificationSent(true);
    //     showToast("인증번호가 발송되었습니다.");
    //   } else {
    //     showErrorToast("인증번호 발송에 실패했습니다.");
    //   }
    // } catch (error) {
    //   console.error("인증번호 발송 오류:", error);
    //   showErrorToast("인증번호 발송 중 오류가 발생했습니다.");
    // } finally {
    //   setIsSendingCode(false);
    // }
  };

  // 인증번호 확인 처리
  const handleVerifyCode = async () => {
    if (!verificationCode) return;

    setIsVerifying(true);

    setIsVerified(true);
    showToast("전화번호 인증이 완료되었습니다.");

    // try {
    //   // 실제 인증번호 확인 API 연동
    //   const response = await apiClient.post("/user/verify-code", {
    //     countryCode: selectedCountry.code,
    //     phoneNumber: phoneNumber,
    //     verificationCode: verificationCode,
    //   });

    //   if (response.data && response.data[0]?.statusCode === 200) {
    //     setIsVerified(true);
    //     showToast("전화번호 인증이 완료되었습니다.");
    //   } else {
    //     showErrorToast("인증번호가 일치하지 않습니다.");
    //   }
    // } catch (error) {
    //   console.error("인증번호 확인 오류:", error);
    //   showErrorToast("인증번호 확인 중 오류가 발생했습니다.");
    // } finally {
    //   setIsVerifying(false);
    // }
  };

  // 완료 버튼 클릭 처리
  const handleComplete = async () => {
    if (!isFormValid) return;

    // 유효성 검사
    if (!validateName() || !validateEmail()) return;

    setIsSubmitting(true);

    try {
      // 사용자 정보 업데이트 API 연동 - 인증 토큰을 헤더에 추가
      const response = await apiClient.post(
        "/user/join",
        {
          name: name,
          email: email,
          cellphone: phoneNumber,
          countryCode: selectedCountry.code,
        },
        {
          headers: {
            Authorization: `Bearer ${user?.accessToken || ""}`,
          },
        }
      );

      if (response.data && response.data[0]?.statusCode === 200) {
        // 응답에서 받은 유저 데이터를 추출하여 상태에 저장
        if (response.data[0]?.data && Array.isArray(response.data[0].data) && response.data[0].data.length > 0) {
          const userData = response.data[0].data[0];
          // useAuthStore의 login 함수를 사용하여 상태 업데이트
          login(userData);
        }

        showToast("정보 입력이 완료되었습니다.");

        // 모달 닫기
        closeAdditionalInfoModal();

        // AI 페이지로 리다이렉트
        setTimeout(() => {
          window.location.href = "/ai";
        }, 1000);
      } else {
        showErrorToast("정보 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error("정보 저장 오류:", error);
      showErrorToast("정보 저장 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
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
      setTermsAgreed(false);
      setIsCountryDropdownOpen(false);
      setName("");
      setEmail("");
      setNameError("");
      setEmailError("");
      setPhoneError("");
    }
  }, [isAdditionalInfoModalOpen]);

  if (!isAdditionalInfoModalOpen) {
    return null;
  }

  return (
    <>
      <ModalOverlay isOpen={isAdditionalInfoModalOpen}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <StyledCloseButton onClick={closeAdditionalInfoModal}>
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

            <Label>이메일</Label>
            <TextInput
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={validateEmail}
            />
            {emailError && <ErrorMessage>{emailError}</ErrorMessage>}

            <Label>국가</Label>
            <CountrySelect ref={dropdownRef}>
              <SelectButton type="button" onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}>
                {selectedCountry.name} {selectedCountry.code}
                {isCountryDropdownOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
              </SelectButton>

              <DropdownContainer isOpen={isCountryDropdownOpen}>
                {countryCodes.map((country) => (
                  <CountryOption
                    key={country.code}
                    onClick={() => {
                      setSelectedCountry(country);
                      setIsCountryDropdownOpen(false);
                    }}>
                    {country.name} {country.code}
                  </CountryOption>
                ))}
              </DropdownContainer>
            </CountrySelect>

            <Label>휴대전화</Label>
            <InputGroup>
              <PhoneInput
                type="tel"
                placeholder={selectedCountry.code === "+82" ? "010-1234-5678" : "Phone Number"}
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                disabled={isVerified}
                onBlur={validatePhone}
              />
              <VerifyButton onClick={handleSendVerification} disabled={!phoneNumber || isSendingCode || isVerified}>
                {isSendingCode ? "전송 중..." : isVerified ? "인증 완료" : "인증번호 받기"}
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
              <Checkbox type="checkbox" id="agree-terms" checked={termsAgreed} onChange={handleTermsAgree} />
              <CheckboxLabel htmlFor="agree-terms">[필수] 이용약관 동의</CheckboxLabel>
            </CheckboxGroup>

            <TermsPolicyText>
              1. 목적
              <br />
              본 약관은 AI 견적서(이하 &quot;회사&quot;)가 제공하는 서비스 이용과 관련하여 회사와 이용자의 권리·의무 및
              책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.
              <br />
              <br />
              2. 이용계약의 성립
              <br />
              이용자는 본 약관에 동의함으로써 회사와 서비스 이용계약을 체결한 것으로 간주됩니다.
              <br />
              <br />
              3. 서비스의 제공 및 변경
              <br />
              회사는 일정한 서비스를 지속적으로 제공하며, 필요한 경우 사전 고지 후 변경할 수 있습니다.
              <br />
              <br />
              4. 회원의 의무
              <br />
              이용자는 허위 정보 제공, 타인 명의 도용 등의 행위를 하여서는 안 되며, 관계 법령 및 본 약관을 준수해야
              합니다.
              <br />
              <br />
              5. 회사의 의무
              <br />
              회사는 관련 법령과 본 약관에 따라 지속적이고 안정적인 서비스 제공을 위해 노력합니다.
              <br />
              <br />
              6. 계약 해지 및 서비스 종료
              <br />
              이용자는 언제든지 서비스 해지를 요청할 수 있으며, 회사는 서비스 종료 시 사전 고지합니다.
              <br />
              <br />
              7. 면책 조항
              <br />
              회사는 천재지변, 기술적 장애 등 불가항력으로 인한 서비스 중단에 대해 책임을 지지 않습니다.
              <br />
              <br />※ 본 약관에 동의하지 않으실 경우 서비스 이용이 제한될 수 있습니다.
            </TermsPolicyText>

            <CheckboxGroup>
              <Checkbox type="checkbox" id="agree-privacy" checked={privacyAgreed} onChange={handlePrivacyAgree} />
              <CheckboxLabel htmlFor="agree-privacy">[필수] 개인정보 수집 및 이용</CheckboxLabel>
            </CheckboxGroup>

            <PrivacyPolicyText>
              회사는 AI 견적서 서비스 제공을 위해 아래와 같이 개인정보를 수집 및 이용합니다.
              <br />
              <br />
              회사명 : (주)여기닷
              <br />
              <br />
              <strong>수집 항목</strong>
              <br />
              - 이름, 이메일, 전화번호, 구글 계정 정보(이메일, 이름, 프로필 이미지)
              <br />
              <br />
              <strong>수집 목적</strong>
              <br />
              - 본인 식별 및 인증
              <br />
              - 견적 요청 및 결과 저장
              <br />
              - 사용자 맞춤 서비스 제공
              <br />
              - 고객 문의 응대
              <br />
              <br />
              <strong>보유 및 이용 기간</strong>
              <br />
              - 회원 탈퇴 또는 목적 달성 시까지
              <br />
              - 단, 관련 법령에 따라 일정 기간 보관될 수 있습니다
              <br />
              (전자상거래법 등)
              <br />
              <br />
              ※ 이용자는 위의 개인정보 수집 및 이용에 대해 동의를 거부할 권리가 있습니다.
              <br />
              단, 동의를 거부할 경우 서비스 이용이 제한될 수 있습니다.
            </PrivacyPolicyText>
          </CheckboxContainer>

          <CompleteButton onClick={handleComplete} disabled={!isFormValid || isSubmitting}>
            {isSubmitting ? "처리 중..." : "완료"}
          </CompleteButton>
        </ModalContent>
      </ModalOverlay>

      {/* 토스트 컨테이너 */}
      <StyledToastContainer />
    </>
  );
};

export default AdditionalInfoModal;
