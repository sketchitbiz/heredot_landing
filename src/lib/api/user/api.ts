import { devLog } from '@/lib/utils/devLogger';
import { UserStampCreateParams, UserInquiryCreateParams } from './api.types';
import { callApi } from './callApi';
import useAuthStore from '@/store/authStore';
import { v4 as uuidv4 } from 'uuid';

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST!;

export function getLogId(): string | null {
  const authStore = useAuthStore.getState();

  //  1. 로그인한 사용자라면, zustand에 저장된 `user.uuid` 반환
  if (authStore.isLoggedIn && authStore.user?.uuid) {
    return authStore.user.uuid;
  }

  //  2. 로그인하지 않은 경우, 클라이언트에서만 localStorage['logId'] 값 반환
  return typeof window !== 'undefined'
    ? localStorage.getItem('logId')
    : null;
}


export async function userStamp(params: Omit<Partial<UserStampCreateParams>, 'uuid'>) {
  const uuid = getLogId();

  if (process.env.NODE_ENV === 'development') {
    devLog('[DEV] userStamp called with:', { ...params, uuid });
    return {
      success: true,
      message: 'Dev mode: stamp simulated.',
      data: { ...params, uuid },
    };
  }

  return callApi({
    title: '스탬프 찍기',
    url: `${BASE_URL}/user/stamp/create`,
    body: {
      uuid,
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

export async function userInquiry(params: UserInquiryCreateParams) {
  const uuid = getLogId() || uuidv4(); // UUID 생성

  // if (process.env.NODE_ENV === 'development') {
  //   devLog('[DEV] userInquiry called with:', { ...params, uuid });
  //   return {
  //     success: true,
  //     message: 'Dev mode: inquiry simulated.',
  //     data: { ...params, uuid },
  //   };
  // }

  return callApi({
    title: '문의하기',
    url: `${BASE_URL}/inquiry/create`,
    body: {
      uuid,
      ...params,
    },
    isCallPageLoader: false,
  });
}

