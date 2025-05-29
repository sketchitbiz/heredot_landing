'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/TextField';
import { loginAdminService } from '@/lib/services/loginAdminService';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import CommonButton from '@/components/CommonButton';
import { toast, ToastContainer } from 'react-toastify';

export default function LoginPage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [idError, setIdError] = useState<string | null>(null);
  const [pwdError, setPwdError] = useState<string | null>(null);

  const router = useRouter();
  const { login } = useAdminAuth();

  const userIdRegex = /^(?=.*[A-Za-z])(?=.*[0-9])[A-Za-z0-9]{6,20}$/;
  const passwordRegex =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?~^<>,.&+=])[A-Za-z\d$@$!%*#?~^<>,.&+=]{8,}$/;

  const handleLogin = async () => {
    setIdError(null);
    setPwdError(null);

    let hasError = false;

    if (!userIdRegex.test(userId)) {
      setIdError('아이디는 영문자와 숫자를 포함한 6~20자여야 합니다.');
      hasError = true;
    }

    if (!passwordRegex.test(password)) {
      setPwdError(
        '비밀번호는 영문자, 숫자, 특수문자를 포함한 8자 이상이어야 합니다.'
      );
      hasError = true;
    }

    if (hasError) return;

    await loginAdminService({
      id: userId,
      password,
      showMessage: (msg) => {
        toast.error(msg);
      },
      onSuccess: (response) => {
        login(response.id, response.accessToken);
        toast.success('로그인 성공!');
        router.push('/cms');
      },
    });
  };

  return (
    <div
      style={{
        height: '100vh',
        width: '100vw', // 화면 전체를 감싸도록 설정
        backgroundColor: '#fff', // 배경 흰색
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          padding: '16px',
          maxWidth: '360px',
          minWidth: '360px',
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/* 로고와 설명 텍스트 (row) */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between', // 양쪽 끝으로 정렬
            marginBottom: '20px',
            width: '100%', // 부모 컨테이너의 너비를 기준으로 정렬
          }}
        >
          {/* 로고 이미지 */}
          <img src="/Logo_AIGO.svg" alt="CMS Logo" width={80} height={80} />

          {/* 설명 텍스트 */}
          <div
            style={{
              fontSize: '18px',
              fontWeight: 600,
              color: '#000', // 텍스트 색상 검정으로 변경
              whiteSpace: 'nowrap',
            }}
          >
            AI 견적서 관리자용
          </div>
        </div>

        {/* SIGN IN 텍스트 */}
        <div
          style={{
            fontSize: '30px',
            fontWeight: 500,
            color: '#000', // 텍스트 색상 검정으로 변경
            marginBottom: '10px',
            alignSelf: 'flex-start',
          }}
        >
          SIGN IN
        </div>

        {/* 아이디 입력 */}
        <TextField
          value={userId}
          radius="0px"
          onChange={(e) => setUserId(e.target.value)}
          placeholder="아이디를 입력하세요"
          showSuffixIcon={false}
          errorMessage={idError || undefined}
        />

        {/* 비밀번호 입력 */}
        <TextField
          value={password}
          radius="0px"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호를 입력하세요"
          isPasswordField={true}
          showSuffixIcon={true}
          errorMessage={pwdError || undefined}
        />

        {/* 버튼과 여백 */}
        <div style={{ height: '8px' }} />
        <CommonButton
          borderRadius="0px"
          borderColor="transparent"
          text="로그인"
          fontSize="18px"
          onClick={handleLogin}
        />

        {/* 하단 안내 문구 */}
        <div
          style={{
            marginTop: '50px',
            fontSize: '16px',
            fontWeight: 400,
            color: '#6c6969',
            textAlign: 'center',
          }}
        >
          시스템 계정이 없다면, 관리자에게 문의 바랍니다.
        </div>

        {/* 토스트 메시지 */}
        <ToastContainer
          position="top-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}
