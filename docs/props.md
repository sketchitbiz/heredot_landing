# Props 설계 가이드 / Props Design Guide

이 문서는 프로젝트 내 모든 컴포넌트의 props 설계에 대한 기준을 정의합니다.  
This document defines the design convention for props used across all components in the project.

---

## 1. 기본 원칙 / Core Principles

- **명시적인 props를 사용합니다.**  
  모든 UI 동작과 상태는 직접적으로 이해 가능한 이름으로 전달합니다.

- **기능과 스타일 props를 구분합니다.**  
  로직/동작과 스타일 관련 속성을 분리합니다.

- **복잡한 구조는 타입 객체로 캡슐화합니다.**  
  props 수가 많거나 도메인 특화된 경우 `propGroup: PropType` 형태로 구성합니다.

---

## 2. Props 분류 기준 (국문)

| 구분          | 설명                           | 예시                             |
|--------------|--------------------------------|----------------------------------|
| 기능성 props   | 기능, 상태, 동작 제어            | `value`, `onClick`, `disabled`   |
| 스타일 props   | 스타일 속성 제어                | `radius`, `fontSize`, `padding`  |
| 렌더링 props   | 렌더링 요소 커스터마이징         | `prefix`, `suffix`, `renderItem` |
| 구성 props     | 구조, 조건, 반복성 제어          | `required`, `multiple`, `mode`   |
| 이벤트 props   | 이벤트 핸들러 전달               | `onChange`, `onBlur`, `onFocus`  |
| 도메인 props   | 데이터 모델 기반 전달 (지양)      | `user: UserModel`                |

---

## 2. Props Categories (English)

| Category        | Description                                | Examples                        |
|----------------|--------------------------------------------|---------------------------------|
| Functional      | Controls behavior or state                | `value`, `onClick`, `disabled`  |
| Style           | Controls visual styles                    | `radius`, `fontSize`, `padding` |
| Render-related  | Customizes rendering elements             | `prefix`, `suffix`, `renderItem`|
| Structure       | Defines structure, conditions, repetition | `required`, `multiple`, `mode`  |
| Events          | Event handler props                       | `onChange`, `onBlur`, `onFocus` |
| Domain-specific | Domain model data (avoid in base)         | `user: UserModel`               |

---

## 3. 스타일 props 설계 원칙 / Style Props Design Convention

- 기본값은 디자인 시스템 토큰을 사용합니다.
- 필요한 경우에만 override를 허용합니다.

| 속성           | 예시       | 기본값 출처                        |
|----------------|------------|------------------------------------|
| `radius`       | `"8px"`    | `InputStyles.radius[device]`       |
| `fontSize`     | `"14px"`   | `AppTextStyles.body2.fontSize`     |
| `padding`      | `"12px"`   | `InputStyles.padding[device]`      |

---

## 4. props 사용 금지/지양 규칙 (국문)

| 항목                | 설명                                      | 잘못된 예시                        | 대안                                |
|--------------------|------------------------------------------|------------------------------- |-------------------------------------|
| 불명확한 단어         | `data`, `info`, `temp` 등은 의미 전달이 어려움  | `props.data`                  | `props.user`, `props.product`       |
| 도메인 모델 직접 전달   | Base 컴포넌트에서 전체 모델 객체 전달은 지양        | `<TextField user={user} />`   | `<Card user={user} />`              |
| 과도한 props 개수     | 6~7개 이상이면 구조 분리 또는 그룹화 필요          | `<Comp a b c d e f g />`      | `config: ConfigProps` 또는 하위 컴포넌트 |

---

## 4. Prohibited or Discouraged Prop Usage (English)

| Case                  | Description                                         | Bad Example                  | Recommendation                        |
|-----------------------|-----------------------------------------------------|------------------------------|----------------------------------------|
| Vague prop names      | Terms like `data`, `info`, `temp` are too generic   | `props.data`                 | `props.user`, `props.product`          |
| Domain model passing  | Avoid passing full models in base components        | `<TextField user={user} />`  | `<Card user={user} />`                 |
| Too many props        | Group into objects when props exceed 6–7            | `<Comp a b c d e f g />`     | `config: ConfigProps` or subcomponent  |

---

## 5. 예외적으로 허용되는 패턴 / Acceptable Exceptions

| 항목                   | 설명                                             | 예시                              |
|-----------------------|-------------------------------------------------|----------------------------------|
| 도메인 모델 전달 허용      | CustomComponent에 한해 전체 도메인 객체 전달 허용       | `<UserCard user={userModel} />`  |
| 스타일 props 오버라이드   | 디자인 시스템 기본값을 override 할 수 있음               | `radius="12px"`, `fontSize="14px"`|

---

## 6. props 설계 예시 / Example Usages

### ✅ 명확한 기능 props 예시

```tsx
<TextField
  value={name}
  onChange={handleNameChange}
  type="password"
  showSuffixIcon
/>
```

이 예시는 텍스트 필드의 상태, 동작, UI 커스터마이징을 명확한 이름의 props로 전달한 예입니다.  
This example clearly passes functional and visual behavior as well-named props.
