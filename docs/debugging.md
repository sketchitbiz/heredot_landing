# 디버깅 가이드 / Debugging Guide

이 문서는 개발 중 디버깅을 효율적으로 진행하기 위한 환경 설정, 콘솔 로깅 유틸리티 사용, 배포 시 주의사항을 포함한 디버깅 규칙을 설명합니다.  
This document defines debugging standards including environment setup, logging utilities, and production considerations.

---

## 환경 설정 / Environment Setup

### 📁 환경 파일 구조 / Environment File Structure

```
.env.development
.env.production
```

- **개발 환경 (`.env.development`)**
  - `NODE_ENV=development`  
  - 디버깅 로그 활성화  
  - 테스트 서버 또는 mock API 연결 가능  
  - Debugging logs enabled, can connect to mock/test servers

- **운영 환경 (`.env.production`)**
  - `NODE_ENV=production`  
  - 디버깅 로그 비활성화  
  - 실제 운영 API 사용  
  - Debugging logs disabled, real API usage enabled

> Next.js는 `NODE_ENV`를 자동 설정하므로, 별도 수동 변경 없이 환경 파일만 분리하면 됩니다.  
> Next.js sets `NODE_ENV` automatically based on the build, so separate `.env` files are sufficient.

---

## devLog 유틸리티 / Logging Utility

개발 환경에서만 안전하게 로그를 출력하기 위한 유틸 함수입니다.  
This utility safely logs to console only during development.

### 사용 목적 / Purpose

- `console.log()` 등을 직접 사용하는 대신 안전한 래퍼 함수로 디버깅 로그를 관리  
  Replace raw `console.log()` with a safe wrapper for debugging output
- 배포 시 **불필요한 로그 자동 제거**  
  Automatically avoids output in production
- 가독성과 유지보수성을 높이기 위한 분리된 로깅 구조  
  Centralized and maintainable log usage

### 위치 / Location

```
src/lib/utils/devLogger.ts
```

### 제공 함수 / Available Functions

```ts
devLog(...args)   // console.log 대체 / Replaces console.log
devWarn(...args)  // console.warn 대체 / Replaces console.warn
devError(...args) // console.error 대체 / Replaces console.error
```

### 💡 예시 / Example

```ts
import { devLog, devWarn, devError } from '@/lib/utils/devLogger';

devLog('API 요청:', url, body);           // API Request
devLog('API 응답:', result);              // API Response
devWarn('파싱 실패:', responseText);       // Parsing failed
devError('API 요청 중 에러 발생:', error);  // Error occurred
```

> `NODE_ENV`가 `production`일 경우 아무런 출력도 하지 않습니다.  
> These functions will not log anything in `production` mode.

---

## 배포 시 로그 제거 / No Logging in Production

- `devLog`, `devWarn`, `devError`는 `NODE_ENV !== 'development'`일 경우 동작하지 않음  
  These logging functions are disabled in production.
- 콘솔에 민감한 정보가 노출되지 않도록 **직접적인 console 사용을 지양**하고 `devLogger`만 사용합니다.  
  Avoid direct `console.*` calls—use `devLogger` for safety and consistency.

---


