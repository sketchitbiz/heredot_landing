# 폴더 구조 가이드 / Folder Structure Guide

이 문서는 프로젝트의 폴더 구조와 각각의 목적 및 사용 기준을 정의합니다.  
This document defines the folder structure of the project and describes the purpose and usage of each directory.

---

## 1. 루트 폴더 구조 / Root-Level Structure

```
src/
├── app/               # 페이지 라우팅을 위한 Next.js App Router 디렉토리 / Routing and page-level files
├── blocks/            # 섹션 단위 UI 구성 블록 / Section-level UI blocks
├── components/        # 기능 중심의 재사용 가능한 UI 컴포넌트 / Reusable functional UI components
├── constants/         # 전역 상수 정의 / Shared constants
├── contexts/          # 전역 상태 관리 (React Context) / Global state management
├── customComponents/  # 프로젝트 특화 컴포넌트 / Project-specific components
├── elements/          # Atomic 스타일 요소 / Atomic styled visual elements
├── hooks/             # 커스텀 훅 / Custom hooks
├── layout/            # 공용 레이아웃 컨테이너 및 반응형 래퍼 / Shared layout containers (responsive, wrappers)
├── lib/               # 기능 로직, API 호출, 설정, 유틸 등 핵심 로직 모음 / Core logic and utility modules
├── styles/            # 전역 스타일 및 테마 / Global styles and themes
├── types/             # 타입스크립트 타입 정의 / TypeScript types
```

---

## 2. lib 폴더 상세 구조 / Detailed lib Folder Structure

```
lib/
├── api/                         # 도메인별 API 호출 모듈 / Domain-specific API modules
│   ├── admin/
│   │   ├── adminApi.ts         # 관리자 API 함수 정의 / Admin-specific API functions
│   │   ├── adminApi.types.ts   # 요청 파라미터 타입 정의 / API parameter type definitions
│   │   ├── callAdminApi.ts     # 토큰 포함 공통 API 래퍼 / Shared API wrapper with token
│   │   └── index.ts            # 관리자 API entry (도메인 단위 import용)
│   ├── user/
│   │   ├── userApi.ts          # 사용자 API 함수 정의 / User-specific API functions
│   │   ├── userApi.types.ts    # 요청 파라미터 타입 정의 / API parameter type definitions
│   │   ├── callUserApi.ts      # 사용자 API 공통 래퍼 / Shared API wrapper with token
│   │   └── index.ts            # 사용자 API entry (도메인 단위 import용)
├── config/                      # 앱 설정 / App configuration
│   └── apiHost.ts              # API 호스트 및 환경 설정 / API host and environment config
├── methods/                     # 실행 중심 메서드 모음 / Core procedural methods
│   └── callApiPost.ts          # POST 요청 공통 처리 / Common POST API function
├── services/                    # 도메인 단위 서비스 계층 / Business logic by domain
│   ├── loginService.ts         # 로그인 관련 서비스 / Login-related service
│   └── dashboardService.ts     # 대시보드 관련 서비스 / Dashboard-related service
├── store/                       # 로컬 스토리지 및 세션 저장소 / Local/session storage
│   └── authStorage.ts          # 토큰 저장 처리 / Token storage handler
├── utils/                       # API 응답 처리 및 상태 유틸 / Response utilities
│   ├── nullChecker.ts          # null-safe 응답 처리 / Safe response checker
│   └── apiStatusHandler.ts     # API 상태 처리 공통 로직 / Shared API status handler
```

> `lib/api/index.ts`는 사용하지 않으며, 도메인별로 명확히 import하는 것을 원칙으로 합니다.  
> We do not use `lib/api/index.ts`. Always import domain-specific modules directly.

---

## 3. app 폴더 상세 / Detailed app Folder Structure

```
app/
├── layout.tsx           # 앱 전체 공통 레이아웃 / Root layout
├── page.tsx             # 메인 페이지 / Home page
├── login/
│   └── page.tsx         # 로그인 페이지 / Login page
├── dashboard/
│   ├── layout.tsx       # 대시보드 전용 레이아웃 / Dashboard layout
│   └── page.tsx         # 대시보드 메인 화면 / Dashboard page
```

---

## 참고 / Notes

- `lib/api`는 `admin`, `user` 등 도메인 기준으로 폴더 분리되어 API를 모듈화합니다.  
  `lib/api` is organized into domain-specific folders like `admin` and `user` for modular API management.

- 각 도메인 폴더는 API 함수, 타입 정의, 공통 호출 유틸, `index.ts`를 포함하여 외부 import를 간결하게 유지합니다.  
  Each domain folder includes API functions, type definitions, shared API wrappers, and an `index.ts` for import convenience.

- `services/`는 여러 API 조합 및 상태 저장 등을 포함한 비즈니스 흐름을 처리합니다.  
  `services/` handles combinations of APIs, state updates, and core business logic flows.

- `store/`는 토큰, 세션 등 로컬/세션 저장소 로직을 정의합니다.  
  `store/` manages local and session storage such as tokens or user identifiers.

- `methods/`는 실행 중심 메서드를 포함하며, API 호출뿐 아니라 비즈니스 트리거 로직 등도 포함할 수 있습니다.  
  `methods/` contains executable methods including HTTP requests and business triggers.

- `utils/`는 API 응답 처리와 관련된 유틸리티 함수 및 상태 핸들링 로직을 포함합니다.  
  `utils/` contains utility functions for API response handling such as status parsing, null checks, and centralized handlers.

---

이 구조는 도메인 기반으로 기능을 분리하고, 확장성과 가독성을 극대화하는 것을 목표로 설계되었습니다.  
This structure is designed to separate concerns by domain and maximize scalability and clarity.
