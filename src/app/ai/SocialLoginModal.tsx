"use client";

import styled from "styled-components";
import { AppColors } from "@/styles/colors";
import { AppTextStyles } from "@/styles/textStyles";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect, useState, useRef } from "react";
import useAuthStore from "@/store/authStore";
import type { UserData } from "@/store/authStore";

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
  display: ${(props) => (props.isOpen ? "flex" : "none")};
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
  width: 800px;
  height: 500px;
  display: flex;
  overflow: hidden;
  position: relative;
`;

const LeftPanel = styled.div`
  flex: 1;
  background-color: #1a1a2e; // 어두운 남색 계열 배경
  background-image: url("/ai/login_bg.webp"); // 배경 이미지 추가
  background-size: cover; // 배경 이미지 크기 설정
  background-position: center; // 배경 이미지 위치 설정
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center; // 가로축 가운데 정렬 추가
  text-align: center; // 텍스트 가운데 정렬 추가
  color: white;
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

const ModalTitle = styled.h2`
  ${AppTextStyles.title1}
  font-size: 28px;
  margin-bottom: 12px;
  color: white; // 왼쪽 패널 타이틀 색상
`;

const ModalSubtitle = styled.p`
  ${AppTextStyles.body1}
  font-size: 18px;
  color: #e0e0e0; // 약간 밝은 회색
  margin-bottom: 32px;
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
    content: "";
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

export const SocialLoginModal: React.FC<SocialLoginModalProps> = ({ isOpen, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const { login, openAdditionalInfoModal } = useAuthStore();
  const [manualJsonInput, setManualJsonInput] = useState("");

  const popupWindowRef = useRef<Window | null>(null); // 팝업창 참조
  const popupIntervalRef = useRef<NodeJS.Timeout | null>(null); // 인터벌 참조

  const openGoogleLoginPopup = () => {
    setIsLoading(true);
    setLoginError(null);

    // 리다이렉트 URI는 항상 현재 도메인 기준으로 설정 (로컬호스트 또는 실제 도메인)
    // 백엔드가 예상하는 경로인 /api/user/login/callback으로 변경
    const redirectUri = encodeURIComponent(`${window.location.origin}/api/user/login/callback`);

    // 항상 실제 서버의 로그인 API 사용 (로컬 서버에는 이 API가 없음)
    const googleLoginUrl = `https://heredotcorp.com/api/user/login?redirect_uri=${redirectUri}`;

    console.log(`로그인 URL: ${googleLoginUrl}`);

    // 팝업 방식 대신 현재 창에서 직접 리다이렉트
    window.location.href = googleLoginUrl;

    // 아래 팝업 관련 코드는 더 이상 사용하지 않음
    /*
    const width = 600;
    const height = 700;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;

    popupWindowRef.current = window.open(
      googleLoginUrl,
      "googleLoginPopup",
      `width=${width},height=${height},left=${left},top=${top}`
    );

    if (
      !popupWindowRef.current ||
      popupWindowRef.current.closed ||
      typeof popupWindowRef.current.closed === "undefined"
    ) {
      alert("팝업이 차단되었습니다. 팝업 차단을 해제하고 다시 시도해주세요.");
      setIsLoading(false);
      return;
    }

    // 팝업이 닫혔는지 주기적으로 확인
    if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
    popupIntervalRef.current = setInterval(() => {
      if (popupWindowRef.current && popupWindowRef.current.closed) {
        if (popupIntervalRef.current) clearInterval(popupIntervalRef.current);
        // 사용자가 직접 팝업을 닫았고, 아직 로그인 처리가 완료되지 않은 경우
        if (isLoading) {
          setIsLoading(false);
          setLoginError("로그인 프로세스가 완료되지 않았습니다.");
        }
      }
    }, 500);
    */
  };

  // JSON 수동 처리 함수
  const handleManualJsonSubmit = () => {
    if (!manualJsonInput.trim()) return;

    try {
      const jsonData = JSON.parse(manualJsonInput);

      // 실제 응답 구조에 맞게 파싱
      if (Array.isArray(jsonData) && jsonData.length > 0) {
        const result = jsonData[0];
        if (result.statusCode === 200 && result.data && Array.isArray(result.data) && result.data.length > 0) {
          const userData: UserData = result.data[0];
          login(userData);
          openAdditionalInfoModal();
          setManualJsonInput("");
          setLoginError(null);
        } else {
          setLoginError(result.message || "유효하지 않은 데이터 형식입니다.");
        }
      } else {
        setLoginError("유효하지 않은 데이터 형식입니다.");
      }
    } catch {
      setLoginError("JSON 파싱 오류: 올바른 형식의 JSON을 입력해주세요.");
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // API 호스트의 origin을 정확히 지정하는 것이 좋습니다.
      // 와일드카드(*)는 개발 중에만 사용하고, 실제 배포 시에는 구체적인 origin으로 변경하세요.
      // 예: if (event.origin !== process.env.NEXT_PUBLIC_API_HOST) return;

      if (event.data && event.data.type === "GOOGLE_LOGIN_SUCCESS") {
        if (popupIntervalRef.current) clearInterval(popupIntervalRef.current); // 인터벌 정리
        setIsLoading(false);
        if (popupWindowRef.current && !popupWindowRef.current.closed) {
          popupWindowRef.current.close();
        }

        const responseData = event.data.payload;
        if (responseData && Array.isArray(responseData) && responseData.length > 0) {
          const result = responseData[0];
          if (result.statusCode === 200 && result.data && Array.isArray(result.data) && result.data.length > 0) {
            const userData: UserData = result.data[0];

            login(userData);
            openAdditionalInfoModal(); // 추가 정보 입력 모달 열기
          } else {
            setLoginError(result.message || "로그인에 실패했거나 유효하지 않은 데이터 형식입니다.");
          }
        } else {
          setLoginError("잘못된 응답 데이터 형식입니다.");
        }
      } else if (event.data && event.data.type === "GOOGLE_LOGIN_FAILURE") {
        if (popupIntervalRef.current) clearInterval(popupIntervalRef.current); // 인터벌 정리
        setIsLoading(false);
        if (popupWindowRef.current && !popupWindowRef.current.closed) {
          popupWindowRef.current.close();
        }
        setLoginError(event.data.message || "Google 로그인 중 오류가 발생했습니다.");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => {
      window.removeEventListener("message", handleMessage);
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }
      // 컴포넌트 언마운트 시 열려있는 팝업이 있다면 닫기 (선택적)
      // if (popupWindowRef.current && !popupWindowRef.current.closed) {
      //   popupWindowRef.current.close();
      // }
    };
  }, [login, isLoading, openAdditionalInfoModal]); // 의존성 배열에서 setIsLoggedIn, closeModalFromStore 제거 (login에 통합)

  // 모달이 닫힐 때 로딩 상태와 에러 메시지 초기화 (부모 컴포넌트의 onClose와 연동)
  useEffect(() => {
    if (!isOpen) {
      setIsLoading(false);
      setLoginError(null);
      if (popupIntervalRef.current) {
        clearInterval(popupIntervalRef.current);
      }
      // 팝업이 열려있고 모달이 닫히면 팝업도 닫기
      if (popupWindowRef.current && !popupWindowRef.current.closed) {
        popupWindowRef.current.close();
      }
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <ModalOverlay
      isOpen={isOpen}
      onClick={() => {
        if (isLoading) return; // 로딩 중에는 닫기 방지 (선택적)
        onClose();
      }}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <StyledCloseButton onClick={onClose} disabled={isLoading}>
          <CloseIcon />
        </StyledCloseButton>
        <LeftPanel>
          <ModalSubtitle>복잡한 견적, AI로 간단하게.</ModalSubtitle>
          <ModalTitle>에이고(AIGO) AI 견적서</ModalTitle>
        </LeftPanel>
        <RightPanel>
          <RightPanelTitle>간편 구글 로그인으로 즐겨보세요</RightPanelTitle>
          <GoogleLoginButton onClick={openGoogleLoginPopup} disabled={isLoading}>
            {isLoading ? (
              "로그인 진행 중..."
            ) : (
              <>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                  alt="Google logo"
                />
                Google 계정으로 로그인
              </>
            )}
          </GoogleLoginButton>

          <OrDivider>
            <span>또는</span>
          </OrDivider>

          <div style={{ width: "100%" }}>
            <p style={{ fontSize: "14px", marginBottom: "5px", textAlign: "center" }}>
              콜백 URL에 표시된 JSON 데이터를 아래에 붙여넣기
            </p>
            <ManualJsonInput
              placeholder='[{"statusCode":200,"message":"success","data":[{"uuid":"...","name":"...","accessToken":"..."}]}]'
              value={manualJsonInput}
              onChange={(e) => setManualJsonInput(e.target.value)}
            />
            <ManualJsonButton onClick={handleManualJsonSubmit} disabled={!manualJsonInput.trim()}>
              데이터로 로그인
            </ManualJsonButton>
          </div>

          {loginError && <p style={{ color: "red", marginTop: "10px" }}>{loginError}</p>}
        </RightPanel>
      </ModalContent>
    </ModalOverlay>
  );
};
