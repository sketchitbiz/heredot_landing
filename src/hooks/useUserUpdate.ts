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
        toast.success(
          responseData.message || '회원정보가 성공적으로 업데이트되었습니다.'
        );

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
        const errorMessage =
          responseData?.error?.customMessage ||
          responseData?.message ||
          responseData?.error?.toString() ||
          '회원정보 업데이트에 실패했습니다.';
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error('Update user profile error:', err);
      const errorMessage =
        err.response?.data?.[0]?.error?.customMessage ||
        err.response?.data?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        '회원정보 업데이트 중 오류가 발생했습니다.';
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
