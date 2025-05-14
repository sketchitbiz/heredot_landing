'use client';

import styled from 'styled-components';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import CloseIcon from '@mui/icons-material/Close';
import { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import type { UserData } from '@/store/authStore';
import { GoogleLogin, useGoogleLogin } from '@react-oauth/google';
import apiClient from '@/lib/apiClient';

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
  background-color: ${AppColors.background};
  color: ${AppColors.onBackground};
  padding: 0;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
  width: 450px;
  height: 500px;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const RightPanel = styled.div`
  flex: 1;
  background-color: ${AppColors.surface}; // 밝은 배경색 (흰색)
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: ${AppColors.onSurface}; // 오른쪽 패널 텍스트 색상
`;

const RightPanelTitle = styled.h3`
  ${AppTextStyles.title2} // 기존 스타일 활용 또는 커스텀
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 30px;
  color: ${AppColors.onSurface}; // 오른쪽 패널 타이틀 색상
`;

const GoogleLoginButton = styled.button`
  background-color: white;
  color: #333;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #f5f5f5;
  }

  img {
    width: 20px;
    height: 20px;
  }

  &:disabled {
    background-color: #f5f5f5;
    color: #888;
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
  color: ${AppColors.onSurfaceVariant}; // 오른쪽 패널 기준 아이콘 색상

  .MuiSvgIcon-root {
    font-size: 28px;
  }

  &:hover {
    color: ${AppColors.onSurface}; // 오른쪽 패널 기준 호버 색상
  }
`;

// 수동 입력용 스타일 추가
const ManualJsonInput = styled.textarea`
  width: 100%;
  height: 120px;
  margin-top: 20px;
  padding: 10px;
  border: 1px solid #cccccc; // AppColors.outline 대신 직접 색상 지정
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
    background-color: #3f51b5; // AppColors.primaryDark 대신 직접 색상 지정
  }

  &:disabled {
    background-color: #cccccc; // AppColors.outlineVariant 대신 직접 색상 지정
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
    background-color: #cccccc; // AppColors.outline 대신 직접 색상 지정
  }

  &::before {
    left: 0;
  }

  &::after {
    right: 0;
  }

  span {
    background-color: ${AppColors.surface};
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
  const [manualJsonInput, setManualJsonInput] = useState('');

  // 구글 로그인 API 엔드포인트 (백엔드)
  // baseURL에 이미 /api가 포함되어 있으므로 /api 제거
  const LOGIN_ENDPOINT = '/user/login';

  // Google 로그인 성공 후 처리 함수
  const handleLoginSuccess = (userData: UserData, responseData: any) => {
    // 로컬 스토리지에 사용자 데이터와 토큰 저장
    localStorage.setItem('loginData', JSON.stringify(responseData));

    // 전역 상태 업데이트
    login(userData);

    // name이 null, undefined 또는 빈 문자열인 경우 추가 정보 모달 표시
    if (!userData.name || userData.name.trim() === '') {
      console.log('사용자 이름이 없어 추가 정보 모달을 표시합니다:', userData);
      openAdditionalInfoModal();
    } else {
      // name이 있으면 AI 페이지로 이동
      console.log('사용자 이름이 있어 AI 페이지로 이동합니다:', userData);
      window.location.href = '/ai';
    }
  };

  // Google 로그인 버튼 클릭 핸들러 (useGoogleLogin 훅 사용)
  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setIsLoading(true);
      try {
        // Google에서 사용자 정보 가져오기
        const userInfoResponse = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          {
            headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
          }
        );

        const userInfo = await userInfoResponse.json();

        // 백엔드로 필요한 정보만 전송 (providerId, profileUrl)
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
            const userData: UserData = result.data[0];
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
    },
    flow: 'implicit', // 암시적 흐름 사용
  });

  // 기존의 백엔드 리다이렉트 방식 로그인
  const openGoogleLoginPopup = () => {
    setIsLoading(true);
    setLoginError(null);

    // 리다이렉트 URI는 항상 현재 도메인 기준으로 설정 (로컬호스트 또는 실제 도메인)
    const redirectUri = encodeURIComponent(
      `${window.location.origin}/api/user/login/callback`
    );

    // 환경 변수에 API 호스트가 설정됨
    const apiHost = process.env.NEXT_PUBLIC_API_HOST || '';

    // 리다이렉트 방식의 경우 전체 URL 필요
    const googleLoginUrl = `${apiHost}${LOGIN_ENDPOINT}?redirect_uri=${redirectUri}`;

    console.log(`로그인 URL: ${googleLoginUrl}`);

    // 현재 창에서 직접 리다이렉트
    window.location.href = googleLoginUrl;
  };

  // JSON 수동 처리 함수
  const handleManualJsonSubmit = () => {
    if (!manualJsonInput.trim()) return;

    try {
      const jsonData = JSON.parse(manualJsonInput);

      // 실제 응답 구조에 맞게 파싱
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const result = jsonData[0];
        if (
          result.statusCode === 200 &&
          result.data &&
          Array.isArray(result.data) &&
          result.data.length > 0
        ) {
          const userData: UserData = result.data[0];

          // 처리 함수로 전달
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

  // 콜백 메시지 수신
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
            const userData: UserData = result.data[0];

            // 처리 함수로 전달
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

  // 모달이 닫힐 때 상태 초기화
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
        if (isLoading) return; // 로딩 중에는 닫기 방지
        onClose();
      }}
    >
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton onClick={onClose} disabled={isLoading}>
          <CloseIcon />
        </StyledCloseButton>
        <RightPanel>
          <RightPanelTitle>간편 구글 로그인으로 즐겨보세요</RightPanelTitle>

          {/* @react-oauth/google의 GoogleLogin 컴포넌트 사용 */}
          <div style={{ marginBottom: '20px' }}>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                setIsLoading(true);
                // 백엔드로 ID 토큰에서 필요한 정보만 전송
                apiClient
                  .post(LOGIN_ENDPOINT, {
                    providerId: credentialResponse.clientId, // 또는 credentialResponse에서 추출 가능한 다른 ID
                    profileUrl: '', // ID 토큰에서는 프로필 URL을 직접 얻을 수 없으므로 빈 값으로 설정
                  })
                  .then((response) => {
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
                        const userData: UserData = result.data[0];

                        // 처리 함수로 전달
                        handleLoginSuccess(userData, response.data);
                      } else {
                        setLoginError(
                          result.message || '로그인에 실패했습니다.'
                        );
                      }
                    } else {
                      setLoginError('서버에서 올바른 응답을 받지 못했습니다.');
                    }
                  })
                  .catch((error) => {
                    console.error('로그인 처리 에러:', error);
                    setLoginError('로그인 처리 중 오류가 발생했습니다.');
                  })
                  .finally(() => {
                    setIsLoading(false);
                  });
              }}
              onError={() => {
                setLoginError('Google 로그인 중 오류가 발생했습니다.');
              }}
              locale="ko"
              theme="filled_blue"
              text="signin_with"
              shape="rectangular"
              width="250"
            />
          </div>

          {loginError && (
            <p style={{ color: 'red', marginTop: '10px' }}>{loginError}</p>
          )}
        </RightPanel>
      </ModalContent>
    </ModalOverlay>
  );
};
