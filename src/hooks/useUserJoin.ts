import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';

interface UserJoinParams {
  name: string;
  email: string;
  cellphone: string;
  countryCode: string;
}

export const useUserJoin = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, login } = useAuthStore();

  // 토스트 메시지 표시 함수
  const showToast = (message: string) => {
    toast.success(message, {
      position: 'bottom-center',
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
      position: 'bottom-center',
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
  };

  // 유저 조인 API 요청 함수
  const joinUser = async (userData: UserJoinParams): Promise<boolean> => {
    setIsSubmitting(true);

    try {
      // AccessToken 가져오기 (user 객체 또는 로컬스토리지)
      const accessToken =
        user?.accessToken || localStorage.getItem('accessToken') || '';

      // 사용자 정보 업데이트 API 호출
      const response = await apiClient.post('/user/join', userData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data && response.data[0]?.statusCode === 200) {
        // 응답에서 받은 유저 데이터를 추출하여 상태에 저장
        if (
          response.data[0]?.data &&
          Array.isArray(response.data[0].data) &&
          response.data[0].data.length > 0
        ) {
          const backendUserData = response.data[0].data[0];

          // UserData 타입에 맞게 날짜 형식 등 필요한 값 변환/설정
          const processedUserData = {
            ...backendUserData,
            // Предполагая, что UserData интерфейс ожидает строки ISO для дат
            createdTime: backendUserData.createdTime
              ? new Date(backendUserData.createdTime).toISOString()
              : new Date().toISOString(),
            updateTime: backendUserData.updateTime
              ? new Date(backendUserData.updateTime).toISOString()
              : null,
            lastLoginTime: backendUserData.lastLoginTime
              ? new Date(backendUserData.lastLoginTime).toISOString()
              : new Date().toISOString(),
            // accessToken은 backendUserData에 이미 포함되어 있다고 가정
            // uuid, email 등 다른 필드들도 backendUserData에 존재해야 함
          };

          // useAuthStore의 login 함수를 사용하여 상태 업데이트
          login(processedUserData);
        }

        showToast('정보 입력이 완료되었습니다.');
        return true;
      } else {
        showErrorToast(
          response.data[0]?.message || '정보 저장에 실패했습니다.'
        );
        console.warn(
          'useUserJoin: joinUser 실패. 로그아웃 처리는 호출부에서 필요합니다.'
        );
        return false;
      }
    } catch (error) {
      console.error('정보 저장 오류:', error);
      showErrorToast('정보 저장 중 오류가 발생했습니다.');
      console.warn(
        'useUserJoin: joinUser 오류. 로그아웃 처리는 호출부에서 필요합니다.'
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 유저 전화번호 인증 전송 함수
  const sendVerification = async (
    countryCode: string,
    phoneNumber: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const formattedCountryCode = countryCode.startsWith('+')
        ? countryCode.substring(1)
        : countryCode;
      const response = await apiClient.post('/user/send-auth-num', {
        cellphone: phoneNumber,
        countryCode: formattedCountryCode,
      });

      if (response.data && response.data[0]?.statusCode === 200) {
        return true;
      } else {
        const errorMessage =
          response.data[0]?.message || '인증번호 발송에 실패했습니다.';
        showErrorToast(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('인증번호 발송 오류:', error);
      showErrorToast('인증번호 발송 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // 유저 전화번호 인증 확인 함수
  const verifyCode = async (
    countryCode: string, // countryCode는 현재 API에서 사용하지 않지만, 기존 함수 시그니처 유지를 위해 남겨둡니다.
    phoneNumber: string,
    authNum: string
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/user/verify-auth-num', {
        cellphone: phoneNumber,
        authNum: Number(authNum), // API 명세에 따라 authNum으로 전달
      });

      if (response.data && response.data[0]?.statusCode === 200) {
        showToast('전화번호 인증이 완료되었습니다.');
        return true;
      } else {
        const errorMessage =
          response.data[0]?.message || '인증번호 확인에 실패했습니다.';
        showErrorToast(errorMessage);
        return false;
      }
    } catch (error) {
      console.error('인증번호 확인 오류:', error);
      showErrorToast('인증번호 확인 중 오류가 발생했습니다.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    joinUser,
    sendVerification,
    verifyCode,
    isSubmitting,
  };
};

export default useUserJoin;
