
# 버튼 가이드 / Button Guidelines

이 문서는 프로젝트에서 사용하는 버튼의 종류와 사용 기준, 설계 가이드를 정의합니다.  
This document defines the button types, usage principles, and implementation guide for this project.

---

## 버튼 분류 / Button Types

모든 버튼은 사용 목적에 따라 다음 3가지 유형으로 구분됩니다.  
All buttons are categorized into the following three types based on their purpose:

### 1.일반 버튼 / Standard Button
- 가장 기본적인 버튼
- 즉시 반응하는 클릭 이벤트
- 예: 로그인, 페이지 이동, 모달 열기 등

> Basic action buttons that immediately execute an event (e.g., login, open modal).

---

### 2.조건 기반 버튼 / Conditional Button
- 특정 조건이 충족되어야 활성화되는 버튼
- 예: 약관 동의, 필수 필드 입력 완료, 체크박스 선택 등
- 기본적으로 **비활성(disabled)** 상태에서 시작

> Buttons that become enabled when certain conditions are met (e.g., terms agreement, required fields).

---

### 3.내부 로딩 버튼 / Loading-Aware Button
- 서버 응답 또는 파일 처리 등 **비동기 작업 결과**에 따라 상태가 변경됨
- 클릭 시 로딩 스피너 표시 또는 상태 변경
- 예: 파일 업로드, 데이터 다운로드, 서버 처리 중 대기

> Buttons that indicate internal loading state, such as file uploads or API responses.

---

## 구현 방식 / Implementation Notes

### 기본 버튼은 `ButtonElement` 또는 디자인 시스템 기반 공통 컴포넌트로 구현  
Basic buttons should be implemented using `ButtonElement` or a standard button component.

### 상태 기반 버튼은 다음과 같은 `props` 설계를 권장  
For stateful buttons, use these props conventions:
- `disabled` (boolean): 조건 미충족 시
- `isLoading` (boolean): 비동기 처리 중

```tsx
<Button disabled={!isValid} isLoading={uploading}>제출</Button>
```

---

## 프로젝트 특화 버튼 / Custom Buttons

일반 버튼 외에 특수 로직이 포함되거나 비표준 UX가 필요한 경우  
**`customComponents/` 디렉토리에 분리하여 관리**합니다.

### 명명 규칙 / Naming Convention
> 모든 커스텀 버튼은 `Custom` 접두어를 사용합니다.  
> All custom buttons must start with the `Custom` prefix.

예시:
- `CustomUploadImageButton`
- `CustomDownloadCsvButton`
- `CustomConnectBluetoothButton`

---

## 디자인 시스템 적용 원칙 / Design System Rules

- 버튼의 색상, 텍스트 스타일, padding 등은 `styles/` 또는 `componentConstants.ts` 기준을 따릅니다.
- 디자인 시스템 내에서 재사용 가능한 컴포넌트로 우선 구현합니다.
- 비표준 UI나 특별한 버튼은 반드시 `customComponents/`로 분리합니다.

---

