import { callAdminApi } from './callAdminApi';
import {
  AdminLoginParams,
  AdminGetListParams,
  AdminCreateParams,
  TermGetListParams,
} from './adminApi.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST!;

export async function adminLogin(
  params: AdminLoginParams) {
  return callAdminApi({
    title: '로그인',
    url: `${BASE_URL}/cms/admin/login`,
    body: { adminId: params.userId, password: params.password },
    isCallPageLoader: true,
  });
}

export async function adminGetList(
  params: AdminGetListParams) {
  return callAdminApi({
    title: '관리자 목록',
    url: `${BASE_URL}/cms/admin/get-list`,
    body: { keyword: params.keyword },
    isCallPageLoader: true,
  }
);
}

export async function adminCreate(
  params: AdminCreateParams) {
  return callAdminApi({
    title: '관리자 생성',
    url: `${BASE_URL}/cms/admin/create`,
    body: {
      adminId: params.adminId,
      password: params.password,
      name: params.name,
      cellphone: params.cellphone,
      description: params.description,
      email: params.email,
      emailYn: params.emailYn,
      smsYn: params.smsYn,
    },
    isCallPageLoader: true,
  });
} 


export async function termGetList() {
  return callAdminApi({
    title: '약관 목록',
    url: `${BASE_URL}/cms/term/get-list`,
    isCallPageLoader: true,
  });
}

export async function termUpdate(
  params: TermGetListParams) {
  return callAdminApi({
    title: '약관 수정',
    url: `${BASE_URL}/cms/term/update`,
    body: {
      index: params.index,
      title: params.title,
      termsType: params.termsType,
      content: params.content,
    },
    isCallPageLoader: true,
  });
}
