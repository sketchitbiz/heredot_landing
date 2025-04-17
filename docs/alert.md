
#  Alert 가이드 / Alert System Guidelines

이 문서는 Alert 시스템의 구현 방식, 구성 단계, 컴포넌트 구조 및 공통 규칙을 설명합니다.  
This guide outlines how to implement alert systems with clear structure, usage patterns, and customization principles.

---

## 1.  기본 구조 구성 단계 / Step-by-Step Structure

###  1단계: Element 레벨 정의 (AlertElement)

- Alert는 **타이틀, 본문, 버튼 리스트**를 갖는 기본 뼈대(`element`)를 정의합니다.  
  Alert defines the base structure (`element`) with a title, content, and a list of actions.
- 상태나 로직 없이 스타일과 구조만 정의된 순수 시각적 요소입니다.  
  It is a purely styled visual component with no state or logic.

> `AlertElement.tsx` — Contains visual structure only (title, content, actions). No logic or behavior.

###  2단계: 상태별 컴포넌트 구현 / Build State-specific Alert Components

- 아래 상태에 따라 **컴포넌트 레벨로 분리**하여 구현합니다.  
  Implement different alert components per status.

| 상태 / State     | 컴포넌트 예시 / Component Example | 설명 / Description |
|------------------|----------------------------------|---------------------|
| 정보 / Info       | `InfoAlert`                      | 일반 안내, 로딩 메시지 등 / General guidance, loading info |
| 경고 / Warning    | `WarningAlert`                   | 삭제 예정, 주의 메시지 / Deletion notice, warning |
| 에러 / Error      | `ErrorAlert`                     | 서버 오류, 실패 응답 등 / API failure, server error |
| 성공 / Success    | `SuccessAlert`                   | 저장 완료, 성공 메시지 / Upload complete, saved |
| 행동 / Confirm    | `ConfirmDialog`                  | 삭제 여부 등 사용자 결정 요구 / Confirmation needed from user |

> These components inherit `AlertElement` and define state-specific logic or behavior.

###  3단계: 프로젝트 특화 얼럿은 `customComponents/`에 / Custom Alerts

- 특이한 UI/플로우가 필요한 얼럿은 `Custom` prefix를 붙여 별도로 구성합니다.  
  If the alert requires special flows or UI, prefix with `Custom` and place in `customComponents/`.

> ex) `CustomUploadAlert`, `CustomOnboardingDialog`

---

## 2.  공통 속성 / Shared Props & Layout Rules

- 모든 얼럿은 아래 레이아웃 가이드를 기반으로 구성되어야 합니다:  
  All alerts must follow these layout rules:

| 속성 / Prop         | 설명 / Description |
|---------------------|---------------------|
| `padding`           | 공통 padding 기준 / Based on layout constants |
| `borderRadius`      | 공통 둥글기 기준 / Consistent radius per design system |
| `maxWidth`          | 데스크탑/모바일 반응형 고려 / Responsive per device |
| `responsive`        | 기기 유형별 여백 및 글자 크기 차이 / Margin, font-size by device |

> Layout constants like spacing, radius, and sizing are shared across all alerts.

---

## 3.  닫힘 정책 / Alert Dismiss Policy

Alert의 닫힘(터치, ESC, 외부 클릭 등)에 대해 아래 기준을 따릅니다.  
Follow these rules for how alerts should be dismissed.

| 케이스 / Case                        | 외부 터치로 닫힘 / Dismiss on Outside Click | 설명 / Description |
|-------------------------------------|---------------------------------------------|---------------------|
| 단순 안내 (Info)                     | ✅허용 / Allowed                            | For information display |
| 사용자 작업/폼 입력 포함                 |  비허용 / Not Allowed                      | Prevent data loss |

> Alerts with editable data or form inputs must not close on outside click.

---

## 4. 🧩 구성 위치 예시 / File Structure Example

```
src/
├── elements/
│   └── AlertElement.tsx         # 기본 스타일 정의 / Base UI element
├── components/
│   ├── InfoAlert.tsx
│   ├── WarningAlert.tsx
│   ├── ErrorAlert.tsx
│   └── ConfirmDialog.tsx
├── customComponents/
│   └── CustomUploadAlert.tsx    # 프로젝트 특화 얼럿 / Project-specific alerts
```

---

##  요약 / Summary

- `AlertElement` = 시각적 기반 / Visual skeleton only  
- 상태별 Alert 컴포넌트는 이를 확장 / Components extend element per status  
- 프로젝트 특화 얼럿은 `customComponents/`에 별도 분리 / Custom alerts go into `customComponents/`  
- 외부 닫힘 정책은 UX에 따라 구분 / Close behavior must reflect UX context  
- 레이아웃 속성은 전역 정의 기반으로 통일 / Use layout constants for consistency

---
