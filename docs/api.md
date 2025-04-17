
#  API 가이드 / API Guidelines

이 문서는 프로젝트에서 사용하는 API 호출 방식과 구조를 정의합니다.  
This document defines the rules and structure for API usage in this project.

---

##  API 호출 기본 규칙 / API Call Basics

- 모든 요청은 `POST` 방식만 사용합니다.  
  All requests must use the `POST` method only.

- 모든 응답은 배열(`[]`) 형태로 반환되어야 합니다.  
  All API responses must return an array format (`[]`), even for empty data.

- 공통 API 호출 함수는 `lib/methods/callApiPost.ts`에 정의되어 있으며,  
  도메인별로 래핑된 함수(`callAdminApi.ts`, `callUserApi.ts`)를 통해 사용합니다.  
  The shared API caller is implemented in `lib/methods/callApiPost.ts`,  
  and used via domain-specific wrappers like `callAdminApi.ts`, `callUserApi.ts`.

- 응답 처리 로직은 응답 데이터 내 `message` 키 값을 기준으로 분기됩니다.  
  Response handling relies on the `message` key included in the API response.

- `message` 값은 서버와 사전에 정의된 규칙에 따라 처리되며, 클라이언트는 이에 기반한 분기 로직을 구현합니다.  
  The value of `message` is determined by a predefined agreement with the server, and the client uses this to drive response-based logic.

- 오래 걸리는 요청은 로딩 중복 호출 방지를 위해 `isCallPageLoader` 옵션을 사용합니다.  
  For long-running requests, the `isCallPageLoader` option is used to prevent duplicate calls.

- 응답 데이터는 `callNullCheck()` 함수를 통해 null-safe 처리를 수행합니다.  
  All responses should be passed through `callNullCheck()` for null-safety.

---

## 폴더 구조 / Folder Structure

API는 **도메인 기준**으로 디렉토리를 구분하며, 각 도메인은 다음 파일을 포함합니다:  
Each domain folder inside `lib/api/` contains:

- API 함수 정의 (`adminApi.ts`, `userApi.ts`)
- 파라미터 타입 정의 (`adminApi.types.ts`, `userApi.types.ts`)
- 공통 호출 래퍼 (`callAdminApi.ts`, `callUserApi.ts`)
- 인덱스 정리 (`index.ts`)

예시 구조:
```
lib/api/
├── admin/
│   ├── adminApi.ts
│   ├── adminApi.types.ts
│   └── callAdminApi.ts
├── user/
│   ├── userApi.ts
│   ├── userApi.types.ts
│   └── callUserApi.ts
```

---

## 요청 타입 정의 / Request Typing

모든 API는 명시적 `params` 객체를 기반으로 타입을 정의하고 전달합니다.  
This encourages predictable usage and reusability across the codebase.

타입은 `*.types.ts`에 정의하며, 여러 API에서 공통으로 사용할 수 있습니다.

---

##  API 호스트 설정 / API Host Configuration

API 서버 주소와 환경 변수는 다음 경로에서 관리됩니다:  
API host and environment variables are managed in the following file:

```
lib/config/apiHost.ts
```

- `API_HOST`: 요청의 베이스 URL / Base URL for all API requests  
- `ENV_NAME`: 현재 실행 중인 환경 구분용 / Indicates the current environment


---

##  토큰 처리 기준 / Token Strategy

### `admin/` API (Client Side Only)

- 관리자 API는 전적으로 **CSR 환경**에서 사용됩니다.  
  Admin APIs are strictly used in **client-side rendering (CSR)** environments.

- 인증 토큰은 `localStorage`에 저장된 값을 기반으로 처리합니다.  
  Access tokens are read from `localStorage`.

- 따라서 서버 측(Side Rendering)에서는 사용할 수 없습니다.  
  These APIs **cannot be used** in server-side rendering (SSR) contexts.

---

### `user/` API (CSR + SSR 지원)

- 사용자 API는 **SSR 환경에서도 호출 가능**하도록 설계되어야 합니다.  
  User APIs should support **both CSR and SSR**.

- 이 경우 `localStorage`를 사용할 수 없으므로, **쿠키 또는 헤더 기반의 인증**이 필요합니다.  
  Since `localStorage` is unavailable on the server, **use cookie- or header-based authentication**.

- 예시: Next.js SSR 함수에서 아래처럼 토큰 추출  
  Example: Extract token using Next.js server utilities

```ts
import { cookies } from 'next/headers';

const cookieStore = cookies();
const accessToken = cookieStore.get('user_access_token')?.value ?? '';
```

- 이 값을 `callApiPost()`에 전달할 때 `accessToken`으로 넘깁니다.  
  Pass this token as `accessToken` to `callApiPost()`:

```ts
await callUserApi({
  title: 'Get user info',
  url: `${BASE_URL}/api/user/getInfo`,
  accessToken,
  body: params,
});
```

> SSR에서 user API를 사용해야 할 경우, 반드시 `cookies()` 등 서버 전용 API로 토큰을 주입하세요.  
> When calling user APIs from SSR, **inject token using server-side APIs** like `cookies()`.


---

##  권장 사항 / Recommendations

- 도메인별 API는 `lib/api/[domain]/` 폴더로 분리하세요.  
  Separate APIs into `lib/api/[domain]/` folders.

- 각 도메인은 `index.ts`를 포함해 import를 간결하게 유지하세요.  
  Each domain should export through `index.ts` for simpler imports.

- `params` 타입을 명확하게 정의하여 코드 안정성과 가독성을 높이세요.  
  Define `params` types clearly to improve safety and readability.

- **admin API는 CSR만**, **user API는 CSR + SSR 모두 대응** 가능한 구조로 유지하세요.  
  Admin APIs should support only CSR; User APIs must support both CSR and SSR.

- `accessToken` 처리 방식은 도메인의 특성에 맞게 다르게 적용합니다.  
  Token strategy should vary by domain requirement.

---
