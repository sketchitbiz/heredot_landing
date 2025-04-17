
#  Elements & Components 구조 가이드 / Element & Component Structure Guidelines

이 문서는 디자인 시스템 기반의 `elements`, `components`, `customComponents` 폴더 구조와 사용 규칙을 설명합니다.  
This document describes the folder structure and usage rules for `elements`, `components`, and `customComponents` based on the design system.

---

## 1.  Elements

###  설명 / Description
- 디자인 시스템에서 가장 하위 레벨의 시각적 단위입니다.  
- 스타일만 담당하며 상태(state)나 이벤트 로직은 포함하지 않습니다.  
- 재사용 가능한 스타일 컴포넌트로써, input, button, icon 등의 기본 구성 요소를 정의합니다.  
- **컴포넌트 이름은 `InputElement`, `ButtonElement` 형식으로 명명합니다.**

The most atomic visual unit in the design system.  
Only responsible for style and layout — no logic or state management.  
Used to define visual primitives like `InputElement`, `ButtonElement`, etc.

###  위치 / Location
```
src/elements/
```

###  예시 / Example
- `InputElement`
- `ButtonElement`
- `IconElement`

---

## 2.  Components

###  설명 / Description
- elements를 조합하여 만든 상태 포함 UI 단위입니다.  
- 입력 상태, 유효성 검사, 아이콘 토글 등 로직이 들어갑니다.  
- 다양한 UI에 재사용 가능한 범용 컴포넌트입니다.  
- **컴포넌트 이름은 `TextField`, `SelectBox` 등 역할 중심으로 명명합니다.**

Reusable logic-based UI components composed of `elements`.  
Includes logic like validation, toggle, and conditional rendering.  
Used in multiple places across the app.

###  위치 / Location
```
src/components/
```

###  예시 / Example
- `TextField` (uses `InputElement`)
- `IconButton`
- `Tabs`, `SelectBox`

---

## 3.  CustomComponents

###  설명 / Description
- 프로젝트 특화 UI 컴포넌트입니다.  
- 하나의 도메인 또는 특정 페이지에서만 사용되는 복잡한 구조를 캡슐화합니다.  
- 내부적으로 components와 elements를 조합하여 구현되며, 커스텀 로직과 도메인 모델을 포함할 수 있습니다.  
- **컴포넌트 이름은 반드시 `Custom` 접두사를 사용합니다.**  
  - 예: `CustomUploadImageButton`, `CustomProfileCard`

Project-specific components for domain- or feature-specific use.  
Encapsulate custom layout, logic, and visual structure.  
Always prefixed with `Custom`.

###  위치 / Location
```
src/customComponents/
```

### ✅예시 / Example
- `CustomUploadImageButton`
- `CustomUserProfileCard`
- `CustomDataSummaryChart`

---

## 4.  공통 명명 규칙 / Naming Rules

| Type               | Example                  | Naming Convention                |
|--------------------|--------------------------|----------------------------------|
| Element            | `ButtonElement`          | `기능 + Element`                 |
| Component          | `TextField`, `Tabs`      | `역할 기반 이름`                 |
| CustomComponent    | `CustomUploadImageCard`  | `Custom + 기능/도메인`           |

---

## 5.  구성 예시 구조 / Example Structure

```
src/
├── elements/
│   ├── InputElement.tsx
│   └── ButtonElement.tsx
├── components/
│   ├── TextField.tsx
│   └── IconButton.tsx
├── customComponents/
│   ├── CustomUploadImageButton.tsx
│   └── CustomUserProfileCard.tsx
```

---

##  요약 / Summary

- `elements` → 가장 작은 스타일 단위  
- `components` → 상태/로직 포함한 재사용 컴포넌트  
- `customComponents` → 특정 도메인 전용 복잡한 UI  
- 모든 구조는 **디자인 시스템 기준**을 따릅니다.  
- 커스텀 컴포넌트는 항상 `Custom` 접두사를 붙입니다.

> Use `elements` for atomic styles, `components` for logic-based reuse, and `customComponents` for project-specific UIs.  
> Follow the design system. All custom UIs must start with the `Custom` prefix.
