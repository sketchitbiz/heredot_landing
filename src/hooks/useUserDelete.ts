import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ApiResponseError {
  customMessage?: string;
  message?: string;
}

interface ApiResponse {
  statusCode: number;
  message: string;
  error?: ApiResponseError | string | null;
}

type ApiUserDeleteResponse = ApiResponse[];

export const useUserDelete = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { logout, user } = useAuthStore();
  const router = useRouter();

  const deleteUserAccount = async (): Promise<boolean> => {
    if (!user?.uuid) {
      toast.error('사용자 정보를 찾을 수 없어 계정을 삭제할 수 없습니다.');
      return false;
    }

    setIsDeleting(true);
    setError(null);

    try {
      const response = await apiClient.post<ApiUserDeleteResponse>(
        '/user/delete'
      );

      const responseData = response.data?.[0];

      if (responseData && responseData.statusCode === 200) {
        toast.success('회원탈퇴가 성공적으로 처리되었습니다.'
        );
        logout(router);
        return true;
      } else {
        let errorMessage = '회원탈퇴 처리 중 오류가 발생했습니다.';
        if (responseData?.error && typeof responseData.error === 'object') {
          errorMessage =
            responseData.error.customMessage ||
            responseData.error.message ||
            errorMessage;
        } else if (typeof responseData?.error === 'string') {
          errorMessage = responseData.error;
        } else if (responseData?.message) {
          errorMessage = responseData.message;
        }
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err) {
      console.error('Delete user account error:', err);
      let errorMessage = '회원탈퇴 처리 중 심각한 오류가 발생했습니다.';
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
        };
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
      setIsDeleting(false);
    }
  };

  return {
    deleteUserAccount,
    isDeleting,
    error,
  };
};

export default useUserDelete;
