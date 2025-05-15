'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/TextField';
import { loginAdminService } from '@/lib/services/loginAdminService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import ScreenWrapper from '@/layout/ScreenWrapper';
import CommonButton from '@/components/CommonButton';
import Image from 'next/image';
import { toast, ToastContainer } from 'react-toastify';

import Gap from '@/components/Gap';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAdminAuth();

  // 정규식 패턴
  const userIdRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,20}$/;
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?~^<>,.&+=])[A-Za-z\d$@$!%*#?~^<>,.&+=]{8,}$/;

  const handleLogin = async () => {
    setIdError(null);
    setPwdError(null);

    // 유효성 검사
    let hasError = false;

    if (!userIdRegex.test(userId)) {
      setIdError('아이디는 영문자와 숫자를 포함한 6~20자여야 합니다.');
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPwdError('비밀번호는 영문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.');
      hasError = true;
    }

    if (hasError) return;

    // 로그인 서비스 호출
    await loginAdminService({
      id: userId,
      password,
      showMessage: (msg) => {
        toast.error(msg); // 에러 메시지를 토스트로 표시
      },
      onSuccess: (response) => {
        login(response.id, response.accessToken);
        toast.success('로그인 성공!'); // 성공 메시지를 토스트로 표시
        router.push('/cms');
      },
    });
  };

  return (
    <ScreenWrapper>
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          flexDirection: 'column',
          padding: '16px',
        }}
      >
        {/* 로고 이미지 */}
        <Image
          src="/assets/logo.svg"
          alt="CMS Logo"
          width={250}
          height={100}
          style={{ marginBottom: '0px' }}
        />

        <TextField
          value={userId}
          label='아이디'
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디를 입력하세요"
          showSuffixIcon={false}
          errorMessage={idError || undefined}
        />

        <TextField
          value={password}
          label='비밀번호'
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          showSuffixIcon={true}
          errorMessage={pwdError || undefined}
        />
        <div style={{ height: '8px' }} />
        <CommonButton text="로그인" onClick={handleLogin} />
      </div>



      {/* 토스트 메시지 컨테이너 */}
      <ToastContainer
        position="top-center" // 위에서 아래로 내려오는 위치
        autoClose={3000} // 3초 후 자동 닫힘
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </ScreenWrapper>
  );
}