import { pageLoaderController } from "@/contexts/PageLoaderContext";
import { devLog, devWarn } from "../utils/devLogger";

interface CallApiPostParams {
  title: string;
  url: string;
  accessToken?: string;
  body?: Record<string, any>;
  isCallPageLoader?: boolean;
}

export async function callApiPost<T = any>({
  title,
  url,
  accessToken,
  body = {},
  isCallPageLoader = false,
}: CallApiPostParams): Promise<T> {
  devLog(`📱 [${title}]`, url, body);
  if (isCallPageLoader) pageLoaderController.open();

  let returnValue = '';

  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (accessToken) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    returnValue = await response.text();
    devLog(`📱 [${title}] 응답`, returnValue) ;
  } catch (error) {
    devLog(`❌ [${title}] API 요청 에러`, error);
    returnValue = '[]';
  } finally {
    if (isCallPageLoader) pageLoaderController.close();
  }

  try {
    return JSON.parse(returnValue);
  } catch (e) {
    devWarn(`⚠️ [${title}] JSON 파싱 실패`, e);
    return [] as T;
  }
}
