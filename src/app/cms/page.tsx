'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { TextField } from '@/components/TextField';
import ResponsiveView from '@/layout/ResponsiveView';
import { AppTextStyles } from '@/styles/textStyles';
import { loginAdminService } from '@/lib/services/loginAdminService';
import { usePageLoaderContext } from '@/contexts/PageLoaderContext';
import ScreenWrapper from '@/layout/ScreenWrapper';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

export default function HomePage() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [loginMessage, setLoginMessage] = useState<string | null>(null);

  const router = useRouter();

  const { login } = useAdminAuth();

  const handleLogin = async () => {
    setLoginMessage(null);
  
    await loginAdminService({
      id: userId,
      password,
      showMessage: (msg) => setLoginMessage(msg),
      onSuccess: (response) => {
        // response에서 id, token 받아서 context 로그인 호출
        login(response.id, response.accessToken);
        router.push('/cms/dashboard');
      },
    });
  };

//   const handleLogin = async () => {
//   setLoginMessage(null);

//   // 로딩 테스트만 수행
//   open(); // 로더 열기
//   console.log('로딩 시작 (이벤트 차단 테스트)');

//   setTimeout(() => {
//     close(); // 5초 후 로더 닫기
//     console.log('로딩 종료');
//   }, 5000);
// };
  

  return (
    <ScreenWrapper>
      <ResponsiveView
        mobileView={<h1 style={{ ...AppTextStyles.headline3 }}>cms (mobile)</h1>}
        tabletView={<h1 style={{ ...AppTextStyles.headline2 }}>cms (tablet)</h1>}
        desktopView={<h1 style={{ ...AppTextStyles.headline1 }}>cms (desktop)</h1>}
      />

      <TextField
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
        placeholder="아이디를 입력하세요"
        type="text"
        showSuffixIcon={false}
      />

      <TextField
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="비밀번호를 입력하세요"
        type="password"
        showSuffixIcon={true}
      />

      {/* 로그인 실패 메시지: 버튼 위에 표시 */}
      {loginMessage && (
        <div
          style={{
            marginTop: '12px',
            marginBottom: '8px',
            padding: '10px',
            backgroundColor: '#fff4f4',
            color: '#d32f2f',
            borderRadius: '6px',
            textAlign: 'center',
          }}
        >
          {loginMessage}
        </div>
      )}

      <button
        onClick={handleLogin}
        style={{
          marginTop: '12px',
          padding: '12px 20px',
          backgroundColor: '#1976D2',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        로그인
      </button>
    </ScreenWrapper>
  );
}
