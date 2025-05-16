'use client';

import styled, { css } from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import type { UserData } from '@/store/authStore';
import { useGoogleLogin } from '@react-oauth/google';
import apiClient from '@/lib/apiClient';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';
import { ChatDictionary } from './components/StepData';

interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: ${(props) => (props.isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: white;
  color: ${AppColors.onSurface};
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  height: 500px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: white;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${AppColors.onSurface};
  text-align: center;
`;

const PageSubtitle = styled.p`
  ${AppTextStyles.body2}
  font-size: 14px;
  color: ${AppColors.onSurfaceVariant};
  margin-bottom: 8px;
  margin-left: 4px;
`;

const GradientTitleText = styled.h2`
  ${AppTextStyles.headline2}
  font-size: 32px;
  font-weight: bold;
  background: linear-gradient(to right, #63a4ff, #8e54e9);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  margin-top: 0;
  margin-bottom: 16px;
  line-height: 1.2;
`;

const MainSloganText = styled.h3`
  ${AppTextStyles.title1}
  font-size: 24px;
  font-weight: bold;
  color: ${AppColors.onSurface};
  margin-bottom: 40px;
  line-height: 1.3;
`;

const GoogleLoginButton = styled.button`
  background-color: white;
  color: #3c4043;
  border: 1px solid #dadce0;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  transition: background-color 0.2s;
  width: 100%;
  max-width: 320px;

  &:hover {
    background-color: #f8f9fa;
  }

  img {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    background-color: #f1f3f4;
    color: #bdc1c6;
    cursor: not-allowed;
    border-color: #f1f3f4;
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

const ManualJsonInput = styled.textarea`
  width: 100%;
  height: 120px;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #cccccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: monospace;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${AppColors.secondary};
  }
`;

const ManualJsonButton = styled.button`
  margin-top: 10px;
  padding: 8px 16px;
  background-color: ${AppColors.secondary};
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    background-color: #3f51b5;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;

const OrDivider = styled.div`
  width: 100%;
  text-align: center;
  margin: 20px 0;
  position: relative;

  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    width: 45%;
    height: 1px;
    background-color: #cccccc;
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background-color: white;
    padding: 0 10px;
    position: relative;
    z-index: 1;
    color: ${AppColors.onSurfaceVariant};
  }
`;

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, openAdditionalInfoModal } = useAuthStore();

  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;

  const LOGIN_ENDPOINT = '/user/login';

  const handleLoginSuccess = (
    userData: UserData,
    rawResponseData?: unknown
  ) => {
    // localStorage.setItem('loginData', JSON.stringify(rawResponseData)); // 이미 주석처리됨
    // if (userData.accessToken) { ... } // 이미 주석처리됨
    login(userData);
    if (!userData.name || userData.name.trim() === '') {
      openAdditionalInfoModal();
    } else {
      // window.location.href = '/ai';
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      setLoginError(null);
      try {
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );
        const userInfo = await userInfoResponse.json();
        const response = await apiClient.post(LOGIN_ENDPOINT, {
          providerId: userInfo.sub,
          profileUrl: userInfo.picture,
        });
        if (
          response.data &&
          Array.isArray(response.data) &&
          response.data.length > 0
        ) {
          const result = response.data[0];
          if (
            result.statusCode === 200 &&
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            const rawUserData: UserData = result.data[0];
            // 날짜 필드를 ISOString으로 변환
            const userData: UserData = {
              ...rawUserData,
              createdTime: new Date(rawUserData.createdTime).toISOString(),
              updateTime: rawUserData.updateTime
                ? new Date(rawUserData.updateTime).toISOString()
                : null,
              lastLoginTime: new Date(rawUserData.lastLoginTime).toISOString(),
            };
            handleLoginSuccess(userData, response.data);
          } else {
            setLoginError(result.message || '로그인에 실패했습니다.');
          }
        } else {
          setLoginError('서버에서 올바른 응답을 받지 못했습니다.');
        }
      } catch (error) {
        console.error('Google 로그인 에러:', error);
        setLoginError('로그인 처리 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    },
    onError: (error) => {
      console.error('Google 로그인 에러:', error);
      setLoginError('Google 로그인 중 오류가 발생했습니다.');
      setIsLoading(false);
    },
    flow: 'implicit',
  });

  const openGoogleLoginPopup = () => {
    setIsLoading(true);
    setLoginError(null);

    const redirectUri = encodeURIComponent(
      `${window.location.origin}/api/user/login/callback`
    );

    const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';

    const googleLoginUrl = `${apiHost}${LOGIN_ENDPOINT}?redirect_uri=${redirectUri}`;

    console.log(`로그인 URL: ${googleLoginUrl}`);

    window.location.href = googleLoginUrl;
  };

  const handleManualJsonSubmit = () => {
    if (!manualJsonInput.trim()) return;

    try {
      const jsonData = JSON.parse(manualJsonInput);

      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const result = jsonData[0];
        if (
          result.statusCode === 200 &&
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const userData: UserData = result.data[0];

          handleLoginSuccess(userData, jsonData);

          setManualJsonInput('');
          setLoginError(null);
        } else {
          setLoginError(result.message || '유효하지 않은 데이터 형식입니다.');
        }
      } else {
        setLoginError('유효하지 않은 데이터 형식입니다.');
      }
    } catch {
      setLoginError('JSON 파싱 오류: 올바른 형식의 JSON을 입력해주세요.');
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'GOOGLE_LOGIN_SUCCESS') {
        setIsLoading(false);

        const responseData = event.data.payload;
        if (
          responseData &&
          Array.isArray(responseData) &&
          responseData.length > 0
        ) {
          const result = responseData[0];
          if (
            result.statusCode === 200 &&
            result.data &&
            Array.isArray(result.data) &&
            result.data.length > 0
          ) {
            const rawUserData: UserData = result.data[0];
            // 날짜 필드를 ISOString으로 변환
            const userData: UserData = {
              ...rawUserData,
              createdTime: new Date(rawUserData.createdTime).toISOString(),
              updateTime: rawUserData.updateTime
                ? new Date(rawUserData.updateTime).toISOString()
                : null,
              lastLoginTime: new Date(rawUserData.lastLoginTime).toISOString(),
            };
            handleLoginSuccess(userData, responseData);
          } else {
            setLoginError(
              result.message ||
                '로그인에 실패했거나 유효하지 않은 데이터 형식입니다.'
            );
          }
        } else {
          setLoginError('잘못된 응답 데이터 형식입니다.');
        }
      } else if (event.data && event.data.type === 'GOOGLE_LOGIN_FAILURE') {
        setIsLoading(false);
        setLoginError(
          event.data.message || 'Google 로그인 중 오류가 발생했습니다.'
        );
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [login, openAdditionalInfoModal]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setLoginError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClick={() => {
        if (isLoading) return;
        onClose();
      }}
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton onClick={onClose} disabled={isLoading}>
          <CloseIcon />
        </StyledCloseButton>
        <RightPanel>
          <PageSubtitle>{t.socialLogin.pageSubtitle}</PageSubtitle>
          <GradientTitleText>{t.socialLogin.gradientTitle}</GradientTitleText>
          <MainSloganText>{t.socialLogin.mainSlogan}</MainSloganText>

          <GoogleLoginButton
            onClick={() => handleGoogleLogin()}
            disabled={isLoading}
          >
            <img src="/ai/google.png" alt="Google_logo" />
            <span>{t.socialLogin.googleLoginButtonText}</span>
          </GoogleLoginButton>

          {loginError && (
            <p style={{ color: 'red', marginTop: '20px', fontSize: '14px' }}>
              {loginError}
            </p>
          )}

          {/* 수동 JSON 입력 부분 (개발/테스트용으로 유지한다면) */}
          {/* <OrDivider><span>OR</span></OrDivider>
          <ManualJsonInput 
            value={manualJsonInput} 
            onChange={(e) => setManualJsonInput(e.target.value)}
            placeholder='로그인 응답 JSON 붙여넣기' 
          />
          <ManualJsonButton onClick={handleManualJsonSubmit} disabled={isLoading}>
            수동 로그인
          </ManualJsonButton> */}
        </RightPanel>
      </ModalContent>
    </ModalOverlay>
  );
};
