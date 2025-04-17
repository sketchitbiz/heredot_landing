## 🍞 토스트 UI 가이드 / Toast UI Guidelines

### ✅ 목적 / Purpose

토스트는 화면 상단 또는 하단에 짧게 노출되는 일시적 메시지입니다.  
Toast is a temporary, non-intrusive message shown briefly on screen (usually top or bottom).

---

### 📐 구성 원칙 / Composition Rules

- 디자인 시스템에 따라 **색상, 폰트, 그림자, 패딩**을 지정합니다.  
  Follows design system for **color, typography, shadow, and spacing**.

- 메시지 내용은 **한 줄로 요약된 단문**으로 제한합니다.  
  Keep content short and in a **single-line format**.

- 사용자 행동이 필요한 경우에는 **Modal / Alert**을 사용하세요.  
  Use **Modal or Alert** for messages requiring user action.

- 기본 UI 외에 **custom UI가 필요한 경우**, 디자인 가이드에 맞춰 반영합니다.  
  If **custom UI** is required, implement it according to design guidelines.

---

### 🛠 구현 가이드 / Implementation

- 기본 토스트 UI는 `components/system/Toast.tsx`에 정의합니다.  
  Define the base toast UI in `components/system/Toast.tsx`.

- 모든 토스트는 공통 유틸(`toast.success()`, `toast.error()`)로 호출합니다.  
  Use utility methods (`toast.success()`, `toast.error()`) to call all toasts.

- **커스텀 UI를 적용할 경우**, 디자인 시스템을 기반으로 `customComponents/CustomToastXXX.tsx`로 분리합니다.  
  If custom UI is used, create a new file in `customComponents/` prefixed with `CustomToast`.

---

### 🔍 예시 / Example Use

```ts
toast.success('Saved successfully');
toast.error('Something went wrong. Please try again.');
