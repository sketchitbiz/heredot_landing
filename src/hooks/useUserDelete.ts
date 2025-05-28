import { useState } from 'react';
import apiClient from '@/lib/apiClient';
import useAuthStore from '@/store/authStore';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';

interface ApiResponse {
  statusCode: number;
  message: string;
  error?:
    | {
        customMessage?: string;
        message?: string;
      }
    | string
    | null;
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
        toast.success(
          responseData.message || '회원탈퇴가 성공적으로 처리되었습니다.'
        );
        logout(router);
        return true;
      } else {
        const errorMessage =
          responseData?.error?.customMessage ||
          responseData?.error?.toString() ||
          responseData?.message ||
          '회원탈퇴 처리 중 오류가 발생했습니다.';
        toast.error(errorMessage);
        setError(errorMessage);
        return false;
      }
    } catch (err: any) {
      console.error('Delete user account error:', err);
      const errorMessage =
        err.response?.data?.[0]?.error?.customMessage ||
        err.response?.data?.[0]?.message ||
        err.response?.data?.message ||
        err.message ||
        '회원탈퇴 처리 중 심각한 오류가 발생했습니다.';
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
