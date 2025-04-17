import { adminLogin } from '@/lib/api/admin';
import { getLoginStatus } from '@/lib/utils/apiLoginStatus';
import { handleLoginStatus } from '@/lib/utils/handleLoginStatus';
import { storeAdminToken } from '@/lib/store/authStorage';
import { devError, devWarn } from '../utils/devLogger';
type LoginAdminServiceParams = {
  id: string;
  password: string;
  showMessage?: (msg: string) => void;
  onSuccess?: (result: { id: string; accessToken: string }) => void;
};

/**
 * 관리자 로그인 서비스 / Admin login flow
 */
export async function loginAdminService({
  id,
  password,
  showMessage = (msg) => alert(msg),
  onSuccess,
}: LoginAdminServiceParams) {
  try {
    const response = await adminLogin({ userId: id, password });
    const message = response?.[0]?.message ?? 'unknown';
    const status = getLoginStatus(message);

    handleLoginStatus({
      status,
      message,
      showMessage,
      onSuccess: () => {
        const token = response?.[0]?.data?.[0]?.access_token ?? '';
        if (!token) {
          showMessage('엑세스 토큰이 존재하지 않습니다');
          return;
        }

        // ✅ 외부로 로그인 정보 전달 (context login에서 처리)
        onSuccess?.({ id, accessToken: token });
      },
      onFail: () => {
        devWarn('로그인 실패:', message);
      },
    });
  } catch (error) {
    devError('로그인 요청 중 오류 발생:', error);
    showMessage('로그인 중 오류가 발생했습니다.');
  }
}
