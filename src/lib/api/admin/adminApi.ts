import { callAdminApi } from './callAdminApi';
import {
  AdminLoginParams,
  AdminGetListParams,
  AdminCreateParams,
  AdminUpdateParams,
  TermGetListParams,
  PromptGetListParams,
  PromptHistoryGetListParams,
  PromptUpdateParams,
  AdminPasswordUpdateParams,
  UnitPriceGetListParams,
} from './adminApi.types';

const BASE_URL = process.env.NEXT_PUBLIC_API_HOST!;

// ***************** 인증 관련

export async function adminLogin(
  params: AdminLoginParams) {
  return callAdminApi({
    title: '로그인',
    url: `${BASE_URL}/cms/admin/login`,
    body: { adminId: params.userId, password: params.password },
    isCallPageLoader: true,
  });
}

// ***************** 관리자

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

    console.log('params', params);

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

//test0521 a!111111

export async function adminUpdate(

  params: AdminUpdateParams) {
  console.log('params', params);
  return callAdminApi({
    title: '관리자 수정',
    url: `${BASE_URL}/cms/admin/update`,
    body: {
      targetAdminId: params.targetAdminId,
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

export async function adminPasswordUpdate(
  params: AdminPasswordUpdateParams) {
  return callAdminApi({
    title: '관리자 비밀번호 수정',
    url: `${BASE_URL}/cms/admin/password/update`,
    body: {
      targetAdminId: params.targetAdminId,
      password: params.password,
    },
    isCallPageLoader: true,
  });
}


// ***************** 약관

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
      termsType: params.termsType,
      content: params.content,
    },
    isCallPageLoader: true,
  });
}

// ***************** 프롬프트

export async function promptGetList(
  params: PromptGetListParams) {
  return callAdminApi({
    title: '프롬프트 목록',
    url: `${BASE_URL}/cms/ai/prompt/get-list`,
    body: { keyword: params.keyword },
    isCallPageLoader: true,
  });
}
export async function promptHistoryGetList(
  params: PromptHistoryGetListParams) {
  return callAdminApi({
    title: '프롬프트 히스토리 목록',
    url: `${BASE_URL}/cms/ai/prompt/history/get-list`,
    body: { index: params.index },
    isCallPageLoader: true,
  });
}

export async function promptUpdate(
  params: PromptUpdateParams) {
  return callAdminApi({
    title: '프롬프트 수정',
    url: `${BASE_URL}/cms/ai/prompt/update`,
    body: {
      index: params.index,
      content: params.content,
    },
    isCallPageLoader: true,
  });
}

// ***************** 가격
export async function unitPriceGetList(
  params: UnitPriceGetListParams) {
  return callAdminApi({
    title: '단가 리스트 조회',
    url: `${BASE_URL}/cms/ai/unit-price/get-list`,
    isCallPageLoader: true,
  });
}