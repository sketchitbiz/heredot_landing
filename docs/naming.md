# 네이밍 규칙 / Naming Convention

이 문서는 프로젝트 내 변수, 함수, 컴포넌트, 파일 등의 네이밍 규칙을 정의합니다.  
한글 설명과 영어 설명을 함께 제공하여 협업과 유지보수 효율을 높입니다.

This document defines naming conventions for variables, functions, components, and files used throughout the project.  

---

## 1. 기본 원칙 / General Principles

- 의미가 명확한 이름을 사용합니다.  
  Use meaningful and self-explanatory names.

- 네이밍 스타일은 목적에 따라 아래 형식을 따릅니다.  
  Use the appropriate case format for each context:
  - `camelCase`
  - `PascalCase`
  - `kebab-case`
  - `UPPER_SNAKE_CASE`

- 가능한 한 약어는 피하고 역할 중심으로 명명합니다.  
  Avoid unnecessary abbreviations; prefer role-based naming.

---

## 2. 변수명 / Variable Names

| 구분 (Type)         | 스타일 (Style)      | 예시 (Example)             | 설명 (Description) |
|---------------------|---------------------|-----------------------------|--------------------|
| 일반 변수 (Variable) | `camelCase`         | `isLoading`, `userName`     | 일반적인 상태, 값, 플래그 / Status, value, boolean flags |
| 상수 (Constant)      | `UPPER_SNAKE_CASE`  | `MAX_RETRY_COUNT`           | 변하지 않는 전역 상수 / Global constant |
| 배열 (Array)         | `camelCase`         | `userList`, `items`         | 복수형으로 명명 / Use plural form |
| 객체 (Object)        | `camelCase`         | `userInfo`, `configData`    | 데이터 그룹 객체 / Data object group |

---

## 3. 함수명 / Function Names

| 구분 (Type)           | 스타일 (Style)    | 예시 (Example)               | 설명 (Description) |
|------------------------|------------------|-------------------------------|---------------------|
| 일반 함수 (Function)    | `camelCase`       | `handleSubmit`, `fetchData`   | 동사 + 목적 구조 / Action + target structure |
| 이벤트 핸들러 (Handler) | `handleXxx`       | `handleClick`, `handleChange` | 이벤트 대응 함수 / Event handler |
| 커스텀 훅 (Hook)        | `useXxx`          | `useDevice`, `useModal`       | React 훅 네이밍 규칙 / Custom React hooks |
| 유틸 함수 (Utility)     | `verbNoun`        | `formatDate`, `parseJson`     | 데이터 가공 함수 / Utility or transform function |

---

## 4. 컴포넌트명 / Component Names

| 구분 (Type)                     | 스타일 (Style)         | 예시 (Example)           | 설명 (Description) |
|--------------------------------|------------------------|---------------------------|---------------------|
| UI 컴포넌트 (UI Component)      | `PascalCase`           | `TextField`, `SelectBox`  | 재사용 가능한 기본 UI 컴포넌트 / Reusable UI components |
| 도메인 컴포넌트 (Domain Component) | `PascalCase`         | `UserCard`, `ProductItem` | 모델 데이터 기반 컴포넌트 / Data model-based components |
| 엘리먼트 컴포넌트 (Element)     | `PascalCase + Element` | `InputElement`            | 순수 시각적 요소 / Atomic styled element |

---

## 5. 파일 및 폴더명 / File and Folder Names

| 항목 (Item)                  | 스타일 (Style)     | 예시 (Example)                | 설명 (Description) |
|------------------------------|--------------------|-------------------------------|---------------------|
| 폴더 이름 (Folder name)       | `kebab-case`       | `components`, `api-services`  | 일반 폴더 이름 / Folder directory naming |
| 컴포넌트 파일 (Component file) | `PascalCase.tsx`   | `TextField.tsx`               | 컴포넌트 단위 파일 / One file per component |
| 훅 파일 (Hook file)           | `useXxx.ts`        | `useDevice.ts`                | 커스텀 훅 / Custom React hook file |
| 상수/스타일 파일 (Constant/Style file) | `camelCase.ts` | `layoutConstants.ts`         | 전역 상수 및 스타일 / Global design tokens |

---

## 6. 네이밍 예외 / Naming Exceptions

- JSX props는 명확한 의미의 단어를 사용합니다.  
  JSX props should use meaningful, self-descriptive names.  
  예: `isOpen`, `onClose`, `title`, `variant`, `size`, `errorMessage`

- 외부 API의 `snake_case` 응답은 내부에서 `camelCase`로 변환하여 사용합니다.  
  Convert snake_case API data to camelCase within the app.

- 한글 변수명/파일명은 사용하지 않습니다.  
  Do not use Korean characters in code for compatibility and readability.

---

## 7. 네이밍 팁 / Naming Tips

### Boolean 변수 / Boolean Variables

Boolean 값은 다음과 같은 접두어를 사용합니다.  
Use prefixes like `is`, `has`, `can`, `should` for boolean values.

| 변수명 (Variable)    | 설명 (Description)                                |
|----------------------|----------------------------------------------------|
| `isVisible`          | 표시 여부 / Whether the element is visible        |
| `hasPermission`      | 권한 보유 여부 / Whether the user has permission  |
| `canSubmit`          | 제출 가능 여부 / Whether the form can be submitted |
| `shouldRenderModal`  | 모달 표시 여부 / Whether the modal should render  |

---

### 이벤트 함수 / Event Handlers

이벤트 관련 함수는 `on` 또는 `handle` 접두어를 사용합니다.  
Prefix event handler functions with `on` or `handle`.

| 함수명 (Function)     | 설명 (Description)                                       |
|------------------------|----------------------------------------------------------|
| `onClick`              | 클릭 시 실행되는 이벤트 핸들러 / Event prop for click   |
| `onChange`             | 값 변경 이벤트 핸들러 / Event prop for change           |
| `handleSubmit`         | 제출 처리 로직 / Internal logic for submitting form     |
| `handleToggle`         | 토글 처리 함수 / Internal handler for toggling state    |

> `onXxx`: 컴포넌트 props로 전달되는 외부 이벤트 핸들러  
> `handleXxx`: 컴포넌트 내부 상태 또는 기능 처리 함수

---

### 복잡한 이름 구성 / Composing Complex Names

복잡한 이름은 **역할 우선 + 의미 중심**으로 구성합니다.  
For complex names, prioritize the role and meaning.

| 예시 (Example)            | 설명 (Description)                                    |
|----------------------------|--------------------------------------------------------|
| `useUserAuthToken`        | 사용자 인증 토큰 조회용 훅 / Hook to get user token   |
| `handleProductDelete`     | 제품 삭제 처리 함수 / Function to handle product delete |

---

## 8. 참고 자료 / References

- [React JSX Naming Guide](https://reactjs.org/docs/jsx-in-depth.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Best Practices](https://www.typescriptlang.org/)

---

이 문서는 `docs/conventions/naming.md`로 저장하고,  
`README.md`에서는 다음과 같이 링크하여 연결합니다:

```md
- [Naming Convention](./docs/conventions/naming.md)
