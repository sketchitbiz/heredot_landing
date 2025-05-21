import { devLog } from '@/lib/utils/devLogger';
import { UserStampCreateParams } from './api.types';
import { callApi } from './callApi';

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST!;

export async function userStamp(params: Partial<UserStampCreateParams>) {
  if (process.env.NODE_ENV === 'development') {
    devLog('[DEV] userStamp called with:', params);
    return {
      success: true,
      message: 'Dev mode: stamp simulated.',
      data: params,
    };
  }

  return callApi({
    title: '스탬프 찍기',
    url: `${BASE_URL}/user/stamp/create`,
    body: {
      ...params,
      firstYn: params.firstYn || 'N',
    },
    isCallPageLoader: false,
  });
}


export async function termGetList() {
  return callApi({
    title: '약관 목록',
    url: `${BASE_URL}/user/terms/get-list`,
    isCallPageLoader: true,
  });
}