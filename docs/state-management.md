# 상태 관리 가이드 / State Management Guide

이 문서는 프로젝트 내에서 상태 관리가 필요한 상황, 사용 도구, 선택 기준을 정의합니다.  
This guide defines when and why to use state management, and how to apply it consistently in the project.

---

## 1. 언제 상태 관리가 필요한가? / When is state management necessary?

- 여러 컴포넌트 간에 상태를 공유해야 할 때  
  When multiple components need to share state
- 페이지 전환 후에도 유지되어야 하는 데이터가 있을 때  
  When data needs to persist across page navigations
- 서버 상태와 클라이언트 상태를 구분하고 동기화할 때  
  When separating and syncing server and client state
- 로딩, 에러, 캐시 등 복합적인 상태를 다룰 때  
  When managing complex states like loading, error, and cache
- **단, 실시간성 데이터는 상태 관리보다 API 또는 소켓 통신으로 처리해야 합니다.**  
  **However, real-time data should be handled through APIs or socket connections, not state management.**


> 단순한 로컬 UI 상태는 `useState` 또는 `useReducer`로 충분히 처리합니다.  
> Use `useState` or `useReducer` for isolated UI logic within a component.

---

## 2. 무엇을 써야 하는가? / What should we use?

| 도구 / Tool | 용도 (Korean) | Purpose (English) | 예시 / Example |
|-------------|----------------|--------------------|----------------|
| `useState` | 단순한 내부 상태 관리 | For simple local component state | 입력값, 모달 표시 여부 / form value, modal open |
| `useReducer` | 복잡한 상태 전이 처리 | For managing complex transitions | 폼 유효성, 다단계 상태 / form validation, wizard |
| `Context API` | 전역 공유값 (단순) | For simple global shared values | 테마, 언어 / theme, locale |
| `Zustand` | 가벼운 전역 상태 | Lightweight global state store | 필터 조건, 페이지 상태 / filters, page state |
| `React Query` | 서버 상태 관리 | Server state & cache management | API 결과, 페이징 / API result, pagination |

> 상태의 **출처**가 서버인지, 클라이언트인지 먼저 구분하세요.  
> First distinguish whether the state comes from the server or the client.

---

## 3. 왜 상태 관리가 필요한가? / Why use state management?

- **일관된 UI 상태 유지**  
  Maintain a consistent UI state
- **컴포넌트 간 결합도 감소**  
  Decouple logic across components
- **성능 최적화**  
  Optimize rendering and performance
- **서버와의 명확한 분리**  
  Clearly separate server-side data and UI logic

---

## 4. 도입 판단 기준 / How to decide if state management is needed

- 페이지 수준 이상에서 상태를 공유하는가?  
  Is the state shared beyond a single component?
- API 결과를 여러 곳에서 재사용해야 하는가?  
  Is the data reused across multiple views?
- 복합적인 상태 로직(동기화/조건/모드)이 필요한가?  
  Does it involve complex state logic?
- 수동 동기화 또는 리렌더링 문제가 자주 발생하는가?  
  Do you often manually sync state or struggle with render issues?

> 2개 이상에 해당된다면 별도의 상태 관리 도구 도입을 고려하세요.  
> If 2 or more apply, consider introducing a dedicated state tool.

---

## 5. 상태 관리 패턴 예시 / Practical Patterns

### 단순한 전역값 공유 (Context API)
- 디바이스 타입, 테마, 언어
- Device type, theme, locale

### 전역 클라이언트 상태 (Zustand)
- 필터 조건, 사용자 설정, 폼 임시 저장
- Filter options, user preferences, temporary form state

### 서버 상태 관리 (React Query)
- API 요청 결과, 비동기 캐시, 무한 스크롤
- API results, async cache, infinite scroll

---

## 요약 / Summary

| 목적 / Purpose | 도구 / Tool |
|----------------|-------------|
| 로컬 컴포넌트 상태 | `useState`, `useReducer` |
| 단순한 전역값 | `Context API` |
| 클라이언트 전역 상태 | `Zustand` |
| 서버 비동기 상태 | `React Query` |

> 상태 관리는 복잡하게 만들기 위해 존재하지 않습니다.  
> State management exists to reduce complexity, not create more.

> 공유와 동기화가 필요한 순간에만 도입하세요.  
> Use it only when data needs to be shared or synchronized.
