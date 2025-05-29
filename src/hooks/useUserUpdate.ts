import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';

export interface UserUpdatePayload {
  name?: string;
  email?: string;
  countryCode?: string;
  cellphone?: string;
  authNum?: number | string; // string도 허용 후 내부에서 파싱
}

interface ApiResponseError {
  customMessage?: string;
  message?: string;
}

interface ApiSuccessResponseData {
  uuid?: string;
  name?: string;
  email?: string;
  countryCode?: string;
  cellphone?: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  data?: ApiSuccessResponseData[] | ApiSuccessResponseData;
  error?: ApiResponseError | string | null;
}

type ApiUserUpdateResponse = ApiResponse[];

export const useUserUpdate = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser, updateUser: updateUserInStore } = useAuthStore();

  const updateUserProfile = async (
    payload: UserUpdatePayload
  ): Promise<boolean> => {
    if (!currentUser?.uuid) {
      toast.error('사용자 정보를 찾을 수 없어 업데이트할 수 없습니다.');
      return false;
    }

    const hasPhoneAuthFields =
      payload.countryCode || payload.cellphone || payload.authNum !== undefined;
    const allPhoneAuthFieldsPresent =
      payload.countryCode && payload.cellphone && payload.authNum !== undefined;

    if (hasPhoneAuthFields && !allPhoneAuthFieldsPresent) {
      toast.warn('국가, 휴대전화번호, 인증번호는 모두 함께 제공되어야 합니다.');
      setError('국가, 휴대전화번호, 인증번호를 모두 입력해주세요.');
      return false;
    }

    const apiPayload = { ...payload };
    if (
      apiPayload.authNum !== undefined &&
      typeof apiPayload.authNum === 'string'
    ) {
      const parsedAuthNum = parseInt(apiPayload.authNum, 10);
      if (isNaN(parsedAuthNum)) {
        toast.warn('인증번호는 숫자여야 합니다.');
        setError('인증번호는 숫자 형식이어야 합니다.');
        return false;
      }
      apiPayload.authNum = parsedAuthNum;
    } else if (
      apiPayload.authNum !== undefined &&
      typeof apiPayload.authNum === 'number'
    ) {
      // number 타입이면 그대로 사용
    } else if (hasPhoneAuthFields && apiPayload.authNum === undefined) {
      // 전화번호 관련 필드가 있는데 authNum이 undefined인 경우 (이 경우는 위의 allPhoneAuthFieldsPresent 에서 이미 걸러짐)
      // 하지만 방어적으로 한번 더 체크
      toast.warn('인증번호를 입력해주세요.');
      setError('인증번호를 입력해주세요.');
      return false;
    }

    setIsUpdating(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiUserUpdateResponse>(
        '/user/update',
        apiPayload
      );

      const responseData = response.data?.[0];

      if (responseData && responseData.statusCode === 200) {
        toast.success('회원정보가 업데이트되었습니다.');

        const updatedFields: Partial<typeof currentUser> = {};
        if (payload.name !== undefined) updatedFields.name = payload.name;
        if (payload.email !== undefined) updatedFields.email = payload.email;
        if (payload.countryCode !== undefined)
          updatedFields.countryCode = payload.countryCode;
        if (payload.cellphone !== undefined)
          updatedFields.cellphone = payload.cellphone;

        if (Object.keys(updatedFields).length > 0) {
          updateUserInStore(updatedFields);
        }

        return true;
      } else {
        let errorMessage = '회원정보 업데이트에 실패했습니다.';
        if (responseData?.error && typeof responseData.error === 'object') {
          // 객체인 경우 customMessage 또는 message 사용
          errorMessage =
            responseData.error.customMessage ||
            responseData.error.message ||
            errorMessage;
        } else if (typeof responseData?.error === 'string') {
          // 문자열인 경우 그대로 사용
          errorMessage = responseData.error;
        } else if (responseData?.message) {
          // error 필드가 없거나 객체가 아니지만 message 필드가 있는 경우
          errorMessage = responseData.message;
        }
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Update user profile error:', err);
      let errorMessage = '회원정보 업데이트 중 오류가 발생했습니다.';
      if (
        err &&
        typeof err === 'object' &&
        'response' in err &&
        err.response &&
        typeof err.response === 'object'
      ) {
        const errResponse = err.response as {
          data?:
            | ApiResponse[]
            | { message?: string; error?: ApiResponseError | string };
        }; // 타입 단언 구체화
        const errorData = Array.isArray(errResponse.data)
          ? errResponse.data[0]
          : errResponse.data;

        if (errorData && typeof errorData === 'object') {
          if (errorData.error && typeof errorData.error === 'object') {
            errorMessage =
              (errorData.error as ApiResponseError).customMessage ||
              (errorData.error as ApiResponseError).message ||
              errorMessage;
          } else if (typeof errorData.error === 'string') {
            errorMessage = errorData.error;
          } else if (
            errorData.message &&
            typeof errorData.message === 'string'
          ) {
            errorMessage = errorData.message;
          }
        }
      } else if (
        err &&
        typeof err === 'object' &&
        'message' in err &&
        typeof err.message === 'string'
      ) {
        errorMessage = err.message;
      }
      toast.error(errorMessage);
      setError(errorMessage);
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    updateUserProfile,
    isUpdating,
    error,
  };
};

export default useUserUpdate;
