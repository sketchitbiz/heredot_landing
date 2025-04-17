
#  아이콘 가이드 / Icon Usage Guidelines

아이콘은 프로젝트 내에서 일관된 시각적 언어를 제공하며, 기본적으로 Material Icons를 사용하고,
커스텀 아이콘은 assets 기반으로 관리됩니다.

---

##  기본 원칙 / General Rules

- 기본 아이콘은 [Material Symbols](https://fonts.google.com/icons) 기반으로 사용합니다.
- 커스텀 아이콘은 `/public/assets/icons/` 혹은 `/assets/` 폴더에 SVG 또는 PNG로 저장하여 사용합니다.
- 반드시 **Icon 명세(이름)**를 명확히 하고, **일관된 사이징 및 색상**을 유지해야 합니다.

---

##  아이콘 분류 / Icon Types

| 분류 | 설명 (KR) | Description (EN) |
|------|-----------|------------------|
| Material Icons | 구글 Material Icons에서 제공되는 기본 아이콘 | Default icon set from Google Material Icons |
| Custom Icons | 직접 제작하거나 외부에서 받은 아이콘 | Custom-made or externally sourced icons |

---

##  커스텀 아이콘 관리 / Custom Icon Management

- 모든 커스텀 아이콘은 `/assets/icons/custom/` 경로에 SVG 또는 PNG로 관리합니다.
- 복잡한 SVG가 브라우저에서 깨지는 경우, **PNG 포맷으로 대체 가능**하지만 색상 통일이 어렵습니다.
- 이 경우 커스텀 컴포넌트(`CustomIcon.tsx`)를 만들어서 `props.name`으로 아이콘 선택 + alt text 또는 title 포함하여 접근성을 확보합니다.

```tsx
// Example CustomIcon.tsx
<CustomIcon name="alert_warning" size={24} color="red" />
```

---

##  SVG가 아닐 경우 주의 / Non-SVG Caution

- PNG 등 비벡터 형식은 색상 덮기(color overlay), 크기 반응성(responsiveness)에서 문제가 발생할 수 있습니다.
- 가능하면 SVG를 우선 사용하고, 렌더링 이슈가 발생할 경우에만 PNG로 대체합니다.

---

##  공통 CustomIcon 컴포넌트 가이드 / Shared Component Convention

- `CustomIcon`은 모든 커스텀 아이콘의 진입점이며, `name`, `size`, `color` 등의 props를 받습니다.
- 내부적으로는 `/assets/icons/custom/${name}.svg`를 불러오는 방식으로 구성합니다.
- 이 방식을 통해 assets만 교체해도 전체 UI에서 반영되도록 구성합니다.

---

##  요약 / Summary

-  기본 아이콘은 Material 기반
-  커스텀 아이콘은 `CustomIcon.tsx` 컴포넌트와 `/assets/icons/` 폴더로 관리
-  색상 일관성 유지를 위해 가급적 SVG 사용
-  SVG 불가능 시 PNG를 허용하되 제한적 사용

Icon usage should balance design flexibility with maintainability, following project-wide standards.
