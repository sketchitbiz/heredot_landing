import { callAdminApi } from './callAdminApi';
import {
  AdminLoginParams,
  GetAdminDashboardParams,
  GetProductDetailParams,
} from './adminApi.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST!;

export async function adminLogin(
  params: AdminLoginParams) {
  return callAdminApi({
    title: '로그인',
    url: `${BASE_URL}/api/cms/login`,
    body: { adminId: params.userId, password: params.password },
    isCallPageLoader: true,
  });
}

export async function getAdminDashboard(params: GetAdminDashboardParams) {
  return callAdminApi({
    title: '대시보드',
    url: `${BASE_URL}/api/cms/dashboard`,
    body: params,
  });
}

export async function getProductDetail(params: GetProductDetailParams) {
  return callAdminApi({
    title: '상품 상세 구독자 목록',
    url: `${BASE_URL}/api/cms/getProductDetail`,
    body: params,
  });
}
