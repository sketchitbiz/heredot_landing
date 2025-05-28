'use client';

import styled from 'styled-components';
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
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';

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
  white-space: pre-line;
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
interface SocialLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const store = useAuthStore();
  const login = store.login;
  const openAdditionalInfoModal = store.openAdditionalInfoModal;
  const loginModalContext =
    'loginModalContext' in store ? store.loginModalContext : null;

  const router = useRouter();

  const { lang } = useLang();
  const t = aiChatDictionary[lang] as ChatDictionary;

  const LOGIN_ENDPOINT = '/user/login';

  const handleLoginSuccess = async (userData: UserData) => {
    await login(userData);

    if (!userData.name || userData.name.trim() === '' || !userData.cellphone) {
      openAdditionalInfoModal();
      onClose();
      return;
    }

    onClose();
    router.push('/ai');
    toast.success('로그인되었습니다!');
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
          email: userInfo.email,
          name: userInfo.name,
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
            const rawUserData: UserData & { accessToken?: string } =
              result.data[0];

            if (rawUserData.accessToken) {
              localStorage.setItem('accessToken', rawUserData.accessToken);
            } else {
              console.warn(
                'Access token not found in login response from SocialLoginModal'
              );
            }

            const userData: UserData = {
              ...rawUserData,
              createdTime: new Date(rawUserData.createdTime).toISOString(),
              updateTime: rawUserData.updateTime
                ? new Date(rawUserData.updateTime).toISOString()
                : null,
              lastLoginTime: new Date(rawUserData.lastLoginTime).toISOString(),
            };
            await handleLoginSuccess(userData);
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

  useEffect(() => {
    const handleMessage = async (event: MessageEvent) => {
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
            const rawUserData: UserData & { accessToken?: string } =
              result.data[0];

            if (rawUserData.accessToken) {
              localStorage.setItem('accessToken', rawUserData.accessToken);
            } else {
              console.warn(
                'Access token not found in popup login response from SocialLoginModal'
              );
            }

            const userData: UserData = {
              ...rawUserData,
              createdTime: new Date(rawUserData.createdTime).toISOString(),
              updateTime: rawUserData.updateTime
                ? new Date(rawUserData.updateTime).toISOString()
                : null,
              lastLoginTime: new Date(rawUserData.lastLoginTime).toISOString(),
            };
            await handleLoginSuccess(userData);
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
  }, [login, openAdditionalInfoModal, router]);

  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setLoginError(null);
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const mainSlogan =
    loginModalContext === 'pdfDownload'
      ? lang === 'ko'
        ? '로그인을 하시면 바로\nPDF 견적서를 다운받으실 수 있어요!'
        : 'Log in to download your PDF estimate right away!'
      : t.socialLogin.mainSlogan;

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
          <MainSloganText>{mainSlogan}</MainSloganText>

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
        </RightPanel>
      </ModalContent>
    </ModalOverlay>
  );
};
