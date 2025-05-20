import { callApiPost } from '@/lib/methods/callApiPost';
import { callNullCheck } from '@/lib/utils/nullChecker';
import { triggerAdminLogout } from '@/contexts/AdminAuthContext';

export async function callAdminApi<T = any>({
  title,
  url,
  body,
  isCallPageLoader = false,
}: {
  title: string;
  url: string;
  body?: Record<string, any>;
  isCallPageLoader?: boolean;
}): Promise<T[]> {
  const accessToken = localStorage.getItem('admin_access_token') ?? ''

  console.log('accessToken', accessToken);

  const raw = await callApiPost({
    title,
    url,
    accessToken,
    body,
    isCallPageLoader,
  });

  // 401 에러 감지
  if (
    Array.isArray(raw) &&
    raw[0]?.statusCode === 401 &&
    raw[0]?.message === 'token is invalid'
  ) {
    // 토큰 삭제
    localStorage.removeItem('admin_access_token');
    triggerAdminLogout();
    return []; // 안전하게 처리
  }

  return callNullCheck(raw);
}
