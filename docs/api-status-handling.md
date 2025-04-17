# API Status Handling Guide

이 문서는 프론트엔드에서 API 응답을 통일된 방식으로 처리하기 위한 `Status Enum + 공통 핸들러` 구조에 대한 가이드입니다.  
API 응답 결과에 따라 일관된 방식으로 UI 처리와 로직을 구성하여 유지보수성과 사용자 경험을 개선하는 것을 목표로 합니다.

This document provides a guide for handling API responses in a unified way using `Status Enum + shared handler` structure.  
It aims to improve maintainability and user experience by standardizing the handling of API results across the frontend.

---

##  사용 목적 / Purpose

- 다양한 API 응답을 `success`, `fail`, `noData`, `unknown`과 같은 공통된 상태로 구분  
  Standardize various API responses into unified statuses like `success`, `fail`, `noData`, and `unknown`.
- 상태에 따라 공통 처리 핸들러에서 UI 처리 및 후속 로직 실행  
  Delegate UI and follow-up logic to a common handler based on status.
- 메시지 출력 방식(예: `alert`, `toast`, `modal`)은 커스터마이징 가능  
  Allow customizable feedback (e.g., `alert`, `toast`, `modal`).
- 각 API의 성공/실패 시 동작을 콜백으로 분리해 코드 가독성과 유지보수성 향상  
  Improve readability and maintainability by separating callbacks per result.

---

##  적용 대상 기준 / When to Use

### 공통 처리(`ApiStatus` 및 `handleApiStatus`)를 사용하는 경우  
### When to use `ApiStatus` and `handleApiStatus`

- 프로젝트성 API (ex. 등록, 삭제, 검증 등 일반적인 기능들)  
  Project-specific APIs such as create, delete, validation, etc.
- 응답 메시지가 고정되어 있거나 예측 가능한 경우 (`"success"`, `"fail"`, `"no data"` 등)  
  Response messages are standardized or predictable.
- 응답 결과에 따라 단순한 UI 피드백 또는 setState 등 후속 처리가 필요한 경우  
  Needs simple UI feedback or straightforward follow-up logic.
- 공통적인 토스트 메시지, 모달 경고 등을 통일하고 싶을 경우  
  You want consistent toast or modal feedback for users.

> 이 경우, `ApiStatus` enum과 `handleApiStatus()` 공통 유틸 함수를 사용하세요.  
> In these cases, use `ApiStatus` and the `handleApiStatus()` utility.

---

### 예외 처리 – 별도 Status Enum/핸들러를 분리해야 하는 경우  
### Exceptions – When to create custom status enums and handlers

- 로그인, 회원가입, 인증 등 **특정 도메인에 종속적인 로직**  
  Domain-specific features like login, sign-up, or authentication.
- 상태 코드 또는 메시지가 다양하고 구체적인 경우  
  Cases with highly specific response codes/messages (e.g., password mismatch, deactivated account).
- 처리 후의 흐름이 일반적인 API와 완전히 다른 경우  
  If the handling involves redirection, token storage, or other complex flows.

> 이 경우, `ApiLoginStatus`, `handleLoginStatus()` 등의 별도 enum 및 핸들러 파일을 **분리하여 사용**하세요.  
> In such cases, create dedicated enums and handlers like `ApiLoginStatus` and `handleLoginStatus()`.

---

## 정리 / Summary Table

| 구분 / Case | 공통 핸들러 사용 / Use Common Handler | 별도 핸들러 분리 / Use Custom Handler |
|-------------|------------------------------|-------------------------------|
| 일반적인 API 응답 (`success`, `fail`, `no data`)<br/>Standard responses |  사용 권장<br/>Recommended |  |
| 도메인 특화 상태<br/>Domain-specific statuses |  | 분리 |
| UI 메시지 통일<br/>UI messaging consistency |  `customUI` 사용 가능 | 가능 (별도 정의 필요) |
| 복잡한 후속 처리<br/>Complex logic handling |  | ✅ 분리 필요 |

---

## 📁 파일 구조 제안 / Recommended File Structure

