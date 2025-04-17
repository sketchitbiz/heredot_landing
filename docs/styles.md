# 스타일 시스템 가이드 / Style System Guide

이 문서는 프로젝트 전반에 걸쳐 사용하는 색상, 타이포그래피, 여백, 입력 스타일, 전역 스타일 구조 등 디자인 시스템 요소를 문서화합니다.  
This document summarizes the design system tokens such as color, typography, spacing, input styles, and global style architecture used throughout the project.

---

## 1. 색상 시스템 / Color System

- 정의 위치 / Location: `src/lib/styles/colors.ts`  
- 관리 객체 / Object: `AppColors`  
- 설명 / Description: 일관된 UI 색상 사용을 위한 전역 컬러 팔레트입니다.  
  A global color palette used to maintain consistent UI coloring.

| 카테고리 / Category | 예시 키 / Example Key | 설명 / Description |
|--------------------|----------------------|--------------------|
| 기본 색상 / Core Colors | `primary`, `secondary` | 테마의 주요 색상 / Main theme colors |
| 텍스트 색상 / Text Colors | `onPrimary`, `onBackground` | 배경 위에 표시되는 텍스트 색상 / Text colors on background |
| 상태 색상 / Status Colors | `success`, `error`, `warning`, `info` | 알림 또는 상태 표현에 사용 / Used for status or alerts |
| 버튼 색상 / Button Colors | `buttonPrimary`, `buttonDisabled` | 버튼의 활성/비활성 상태 색상 / Colors for active/disabled buttons |
| 아이콘 색상 / Icon Colors | `iconPrimary`, `iconDisabled` | 아이콘 전용 색상 / Icon-specific colors |
| 태그 색상 / Tag Colors | `tagSuccess`, `tagWarning` | 태그 또는 라벨의 배경색 / Background colors for tags or labels |
| 보더 색상 / Border Colors | `borderLight`, `borderError` | 입력창, 카드 등의 테두리 색상 / Borders for inputs, cards, etc. |
| 기타 / Others | `overlay`, `divider`, `shadowDark` | 그림자, 오버레이, 구분선 등 / Shadows, overlays, dividers, etc. |

> 변수명은 고정하며, 값만 디자인 시스템 변경에 따라 수정합니다.  
> Variable names are fixed; only the values change according to the design system.

---

## 2. 타이포그래피 시스템 / Typography System

- 정의 위치 / Location: `src/lib/styles/textStyles.ts`  
- 관리 객체 / Object: `AppTextStyles`  
- 설명 / Description: 계층적인 텍스트 스타일을 정해 일관성 있는 문서 및 UI 타이포그래피를 유지합니다.  
  Defines hierarchical text styles to maintain consistent UI and documentation typography.

| 계층 / Level | 키 / Key | 크기(px) / Size | 굵기 / Weight | 사용 예시 / Example Usage |
|--------------|----------|------------------|----------------|---------------------------|
| Display | `display1 ~ display3` | 36–57 | 400 | 페이지 타이틀, 히어로 영역 / Page titles, hero sections |
| Headline | `headline1 ~ headline3` | 24–32 | 400 | 섹션 제목 / Section headings |
| Title | `title1 ~ title3` | 14–22 | 400–500 | 카드 제목, 라벨 / Card titles, labels |
| Body | `body1 ~ body3` | 12–16 | 400 | 본문 내용, 설명 텍스트 / Main content, descriptions |
| Label | `label1 ~ label3` | 11–14 | 500 | 버튼, 태그, 인풋 라벨 / Buttons, tags, input labels |

> 변수명은 고정하며, 값만 디자인 변경에 따라 수정합니다.  
> Variable names are fixed; only values change per design updates.

---

## 3. 레이아웃 시스템 / Layout Constants

- 정의 위치 / Location: `src/constants/layout.ts`  
- 포함 항목 / Includes: Breakpoints, LayoutConstants

### Breakpoints

- 디바이스별 반응형 구간 정의  
  Defines responsive breakpoints by device type.

| 디바이스 / Device | 기준 너비 / Min Width |
|------------------|------------------------|
| mobile | 0px 이상 / 0px and above |
| tablet | 768px 이상 / 768px and above |
| desktop | 1200px 이상 / 1200px and above |

### LayoutConstants

- 각 디바이스에 맞는 기본 여백 정의  
  Defines default padding per device type.

| 위치 / Position | mobile | tablet | desktop |
|------------------|--------|--------|---------|
| 수평 여백 / Horizontal padding | 20px | 32px | 64px |
| 상단 여백 / Top padding | 24px | 32px | 48px |
| 하단 여백 / Bottom padding | 24px | 32px | 48px |

---

## 4. 컴포넌트 스타일 / Component Constants

- 정의 위치 / Location: `src/constants/componentStyles.ts`  
- 설명 / Description: 버튼, 입력창 등 UI 구성 요소에 대한 공통 스타일을 정의하여 중복 없이 유지합니다.  
  Defines common styles for UI elements like buttons and inputs, reducing redundancy.

예시 포함 항목 / Example Includes:  
- `InputStyles`, `ButtonStyles`, `LabelStyles`, `CardStyles` 등  
- Includes styles like `InputStyles`, `ButtonStyles`, etc.

> 각 UI 구성 요소는 스타일 정의를 해당 컴포넌트가 아닌 `componentStyles.ts`에서 관리하고 import 하여 사용합니다.  
> UI components import styles from `componentStyles.ts` rather than defining inline.

---

## 5. 글로벌 스타일 구조 / Global Style Architecture

### GlobalWrapper

- 역할 / Role: 애플리케이션 전체를 감싸는 최상위 Provider  
  Wraps the entire app with top-level providers

- 적용 사항 / Includes:
  - 디바이스 타입 감지 / Device detection (`DeviceContext`)
  - 전역 로딩 상태 / Global loading state (`PageLoaderContext`)
  - 글로벌 CSS / Global CSS (`GlobalStyle`)

사용 목적 / Purpose:  
- 반응형 UI 구현 / Responsive rendering using device info  
- 페이지 로딩 상태 관리 / Manage page-level loading  
- CSS 초기화 및 폰트 적용 / Base styles and font setup

---

### RootLayout

- 위치 / Location: `src/app/layout.tsx`  
- 역할 / Role: 앱의 최상단 HTML 구조 및 글로벌 폰트, 스타일 적용  
  Defines root HTML layout and applies global styles/fonts

사용 목적 / Purpose:  
- HTML/Body 구조 정의 / Define basic HTML structure  
- Google Fonts 포함 / Include fonts  
- GlobalWrapper 포함 / Apply global context and style providers

---

## 6. 디바이스 컨텍스트 / Device Context

- 위치 / Location: `src/contexts/DeviceContext.tsx`  
- 설명 / Description: 브라우저의 현재 화면 너비에 따라 `mobile`, `tablet`, `desktop` 중 하나를 판별하여 Context로 제공합니다.  
  Provides current device type (`mobile`, `tablet`, or `desktop`) based on screen width.

사용 목적 / Purpose:  
- 반응형 UI 렌더링 조건 처리 / Conditional rendering by device  
- `useDevice()` 훅으로 타입 접근 / Access device type using `useDevice()`

예시 / Examples:  
- 모바일일 때만 특정 요소 숨김 / Hide elements only on mobile  
- 태블릿 이상에서만 상세 내용 표시 / Show details only on tablet+

---

## 7. 레이아웃 유틸리티 / Layout Utilities

### ScreenWrapper

- **설명 / Description**:  
  현재 디바이스 타입에 따라 상하좌우 기본 여백(padding)을 자동 적용하는 레이아웃 래퍼입니다.  
  Automatically applies base padding depending on device type.

- **사용 목적 / Purpose**:  
  - 반복되는 여백 코드 제거 / Eliminate repeated padding logic  
  - 반응형 페이지에서 일관된 공간 확보 / Ensure consistent spacing across responsive layouts

- **속성 / Props**:  
  - 기본 여백은 디자인 시스템 기준 사용  
  - 필요 시 padding 값을 prop으로 오버라이드 가능  
    (Customizable via props if needed)

---

### ModalWrapper (가이드 전용 / Planned Wrapper)

- **설명 / Description**:  
  모달이나 다이얼로그 등 중앙 고정 UI를 위한 패딩/크기 제한용 Wrapper 구성입니다.  
  A utility wrapper for modal or dialog components, applying consistent internal spacing and size constraints.

- **사용 가이드 / Usage Guide**:
  - 디자인 시스템에 정의된 padding, border-radius, max-width 등을 기준으로 정의해야 합니다.  
    Should follow design system tokens such as padding, border-radius, and max-width.
  - 작은 화면에서는 full-screen 또는 자동 height/width 전환이 필요할 수 있습니다.  
    Should support auto size or full-screen layout in small devices.

- **권장 방식 / Recommendation**:  
  ModalWrapper는 내부 콘텐츠의 크기 및 간격을 개별적으로 처리하지 않도록 래핑하는 방식을 사용합니다.  
  The wrapper handles layout responsibilities so that modal content does not need to.

```tsx
// (예시) 모달 내 구조 예시
<ModalWrapper>
  <Title>설정</Title>
  <Content>...</Content>
  <Actions>...</Actions>
</ModalWrapper>


---

### ResponsiveView

- 설명 / Description: 현재 디바이스 타입에 따라 `mobileView`, `tabletView`, `desktopView` 중 하나를 조건부 렌더링합니다.  
  Conditionally renders one of `mobileView`, `tabletView`, or `desktopView` based on device type.

사용 목적 / Purpose:  
- 반응형 구조 단순화 / Simplify responsive structures  
- 디바이스별 UI가 크게 다를 경우 사용 / Use when UI differs significantly by device

예시 / Examples:  
- 모바일에서는 리스트, 데스크탑에서는 테이블 / List on mobile, table on desktop  
- 콘텐츠 인터랙션이 디바이스에 따라 다를 때 / Different UI flows per device

---

## 마무리 / Summary

| 항목 / Item | 목적 / Purpose |
|-------------|----------------|
| 색상 시스템 / Color System | UI 일관성을 위한 전역 컬러 기준 / Global color standards for consistent UI |
| 타이포그래피 / Typography | 텍스트 계층 정리 및 디자인 가이드 연동 / Text hierarchy and design alignment |
| 레이아웃 상수 / Layout Constants | 반응형 기반 여백 및 브레이크포인트 정의 / Spacing and breakpoints for responsiveness |
| 컴포넌트 스타일 / Component Styles | 반복되는 UI 스타일 중앙 집중화 / Centralized common component styles |
| 글로벌 구조 / Global Architecture | 스타일과 컨텍스트를 전체 앱에 적용 / Apply styles/context app-wide |
| 디바이스 감지 / Device Detection | 현재 뷰포트에 따라 UI 변경 가능 / Adapt UI based on viewport |
| 레이아웃 유틸 / Layout Utilities | 반응형 padding 및 조건부 렌더링 구현 / Responsive padding and conditional UI rendering |

> 이 스타일 시스템은 **일관된 UI/UX 제공**, **디자인 변경 대응**, **코드 중복 제거**를 목표로 구성되어 있습니다.  
> This style system aims to deliver **consistent UI/UX**, **design adaptability**, and **code reuse efficiency**.
