'use client';

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Breakpoints } from '@/constants/layoutConstants';
import { useLang } from '@/contexts/LangContext';
import { dictionary } from '@/lib/i18n/lang';
import { userStamp, userInquiry } from '@/lib/api/user';
import CommonButton from '@/components/CommonButton';
import { TextField } from '@/components/TextField';
import { Validators } from '@/lib/utils/validators';
import { toast } from 'react-toastify';
import { useRouter } from "next/navigation"; 

export const ContactContent = ({
  onClose,
}: {
  onClose?: () => void;
}) => {
  const { lang } = useLang();
  const t = dictionary[lang].contactPopup;
  const [isMobile, setIsMobile] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [budget, setBudget] = useState('');
  const [description, setDescription] = useState('');

  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [budgetError, setBudgetError] = useState('');
  const [descError, setDescError] = useState('');

  const router = useRouter(); // 컴포넌트 내부


  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < Breakpoints.mobile);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
const handleSave = async () => {
  let isValid = true;

  if (!Validators.required(name)) {
    setNameError(t.nameRequired || '이름을 입력해주세요.');
    isValid = false;
  } else {
    setNameError('');
  }

  if (!Validators.phone(phone)) {
    setPhoneError(t.phoneInvalid || '전화번호를 정확히 입력해주세요. (예: 01012345678)');
    isValid = false;
  } else {
    setPhoneError('');
  }

  if (!Validators.required(budget)) {
    setBudgetError(t.budgetRequired || '예산을 입력해주세요.');
    isValid = false;
  } else {
    setBudgetError('');
  }

  if (!Validators.required(description)) {
    setDescError(t.descRequired || '문의 내용을 입력해주세요.');
    isValid = false;
  } else {
    setDescError('');
  }

  if (!isValid) return;

  try {
    userStamp({ category: '팝업', content: 'Contact', memo: '문의하기' });

    const res = await userInquiry({
      name,
      cellphone: phone,
      budget,
      content: description,
    });

    if (res?.[0]?.message === 'success') {
      if (onClose) onClose(); // 팝업 닫기 (필요 시 주석 처리 가능)
      router.push("/complete"); // ✅ 완료 페이지로 이동
      setName('');
      setPhone('');
      setBudget('');
      setDescription('');
    } else {
      toast.error(res?.[0]?.error?.customMessage || t.submitFail || '제출에 실패했습니다. 다시 시도해주세요.');
    }
  } catch (error: any) {
    console.error('문의하기 에러:', error);
    toast.error(error?.message || t.unknownError || '오류가 발생했습니다. 관리자에게 문의해주세요.');
  }
};

// 하이픈 포맷 함수 추가
const formatPhone = (value: string) => {
  if (!value) return '';
  // 11자리만 처리
  const onlyNums = value.replace(/\D/g, '').slice(0, 11);
  if (onlyNums.length < 4) return onlyNums;
  if (onlyNums.length < 8) return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3)}`;
  return `${onlyNums.slice(0, 3)}-${onlyNums.slice(3, 7)}-${onlyNums.slice(7, 11)}`;
};

  return (
    <Wrapper>
      <ContentBox>
        <Title>{t.title1}</Title>
        <Title style={{ marginBottom: 30 }}>{t.title2}</Title>

        <FieldWrapper>
          <TextField
            radius="10px"
              fontSize={isMobile ? '13px' : '18px'}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t.namePlaceholder}
            errorMessage={nameError}
            $inputBackgroundColor="#0d0d1f"
            $textColor="#ffffff"
            $placeholderColor="#888888"
            $borderColor="transparent"

          />
        </FieldWrapper>

<FieldWrapper>
<TextField
  radius="10px"
  value={formatPhone(phone)}
  onChange={(e) => {
    const input = e.target.value.replace(/\D/g, '').slice(0, 11);
    setPhone(input);
  }}
  fontSize={isMobile ? '13px' : '18px'}
  placeholder={t.phonePlaceholder}
  errorMessage={phoneError}
  $inputBackgroundColor="#0d0d1f"
  $textColor="#ffffff"
  $placeholderColor="#888888"
  $borderColor="transparent"
  type="tel"            // ✅ 전화번호 타입
  inputMode="tel"       // ✅ 전화번호 키패드
/>

</FieldWrapper>

<FieldWrapper>
<TextField
  radius="10px"
  fontSize={isMobile ? '13px' : '18px'}
  value={budget === '' ? '' : Number(budget).toLocaleString()}
  onChange={(e) => {
    const input = e.target.value.replace(/,/g, '');
    if (/^\d*$/.test(input)) {
      setBudget(input);
    }
  }}
  placeholder={t.budgetPlaceholder}
  errorMessage={budgetError}
  $inputBackgroundColor="#0d0d1f"
  $textColor="#ffffff"
  $placeholderColor="#888888"
  $borderColor="transparent"
  type="text"            // ✅ 숫자지만 type="text" 유지
  inputMode="numeric"    // ✅ 숫자 키패드 유도
/>

</FieldWrapper>

        <LastFieldWrapper>
          <TextField
            radius="10px"
              fontSize={isMobile ? '13px' : '18px'}
            multiline
            minLines={4}
            maxLines={10}
            height="150px"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder={t.contentPlaceholder}
            errorMessage={descError}
            $inputBackgroundColor="#0d0d1f"
            $textColor="#ffffff"
            $placeholderColor="#888888"
            $borderColor="transparent"
          />
        </LastFieldWrapper>

        {/* 안내 문구 추가 */}
<NoticeText>{t.privacyNotice}</NoticeText>


        <ButtonWrapper>
          <CommonButton
            text={t.submitButton}
            isSkeletonText={true}
            width="100%"
            maxWidth="100%"
             fontSize={isMobile ? '13px' : '18px'}
            backgroundColor="white"
            height={isMobile ? '48px' : '56px'}
            borderRadius="30px"
            onClick={handleSave}
          />
        </ButtonWrapper>
      </ContentBox>
    </Wrapper>
  );
};

// ----------------- Styled -----------------

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  box-sizing: border-box;
  background: radial-gradient(
    circle at top left,
    #e7e7e7 0%,
    #bfcfff 3%,
    #2f2f64 30%,
    #1b1b3a 50%
  );
  border-radius: 16px;
`;

const NoticeText = styled.div`
  color: #bbbbbb;
  font-size: 16px;
  text-align: center;
  margin-bottom: 8px;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 13px;
  }
`;

const ContentBox = styled.div`
  width: 100%;
  max-width: 600px;
  padding: 15px 0px;
  box-sizing: border-box;
  border-radius: 16px;
  background: transparent;
`;

const Title = styled.h2`
  font-size: 35px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px;
  text-align: center;

  @media (max-width: ${Breakpoints.mobile}px) {
    font-size: 24px;
  }
`;

const FieldWrapper = styled.div`
  margin-bottom: 16px;

  @media (max-width: ${Breakpoints.mobile}px) {
    margin-bottom: 12px;
  }
`;

const LastFieldWrapper = styled(FieldWrapper)`
  margin-bottom: 32px;

  @media (max-width: ${Breakpoints.mobile}px) {
    margin-bottom: 20px;
  }
`;
const ButtonWrapper = styled.div`
  margin-top: 16px;
`;
