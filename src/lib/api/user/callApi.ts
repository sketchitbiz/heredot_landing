import { callApiPost } from '@/lib/methods/callApiPost';
import { callNullCheck } from '@/lib/utils/nullChecker';

export async function callApi<T = any>({
  title,
  url,
  body,
  isCallPageLoader = false,
}: {
  title: string;
  url: string;
  body?: Record<string, any>;
  isCallPageLoader?: boolean;
  onOpenLoader?: () => void;
  onCloseLoader?: () => void;
}): Promise<T[]> {
  const accessToken = localStorage.getItem('access_token') ?? '';

  const raw = await callApiPost({
    title,
    url,
    accessToken,
    body,
    isCallPageLoader,
  });

  return callNullCheck(raw);
}
