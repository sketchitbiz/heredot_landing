// src/elements/InputElement.tsx

/**
 * InputElement는 디자인 시스템에서 가장 기본 단위인 "element" 레벨의 입력 필드입니다.
 * 재사용 가능한 atomic 컴포넌트로써, 스타일만 정의하고 상태 로직은 포함하지 않습니다.
 *
 * InputElement is a low-level input element in the design system ("element" layer).
 * It's a purely styled, reusable atomic component without any logic or state handling.
 *
 * [Element 기준 설명]
 * - 순수 시각적 구성 요소 (ex. InputElement, ButtonElement, IconElement 등)
 * - 상태나 로직 없이 단순히 스타일과 구조만 담당
 * - 재사용을 위해 컴포넌트 간에 공유 가능
 * - 디자인 시스템과 연결되어 다른 상위 UI에서 재사용 가능
 * - Element naming 규칙은 "기능 or 역할 + Element"로 구성
 * - InputElement를 포함한 모든 elements는 이 기준을 따릅니다.
 * 
 * [Element Level Explanation]
 * - Purely visual components (e.g., InputElement, ButtonElement, IconElement)
 * - No state or logic, only responsible for style and structure
 * - Can be shared among components for reusability
 * - All elements, including InputElement, follow this standard.
 * - Part of the design system for reuse in higher-level UIs
 * - Element naming convention is "function or role + Element"
 */

import { InputStyles } from '@/constants/componentConstants';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import type { DeviceType } from '@/types/device';
import styled from 'styled-components';

interface InputElementProps {
  radius?: string;            // 테두리 둥글기 오버라이드 | Optional override for border radius
  padding?: string;           // 기본 패딩 오버라이드 | Optional override for padding
  height?: string;            // 입력 높이 오버라이드 | Optional override for input height
  fontSize?: string;          // 폰트 크기 오버라이드 | Optional override for font size
  paddingRight?: string;      // 우측 패딩 오버라이드 | Optional override for right padding
  $hasSuffix?: boolean;       // 서픽스 아이콘 여부 | Indicates if input has a suffix icon
  $device: DeviceType;        // 디바이스 타입 | Device type (mobile/tablet/desktop)
}

const InputElement = styled.input<InputElementProps>`
  padding: ${({ padding, $device }) => 
    padding || InputStyles.padding[$device]}; // 기본 내부 여백 | Inner padding

  border: 1px solid ${AppColors.borderLight}; // 기본 테두리 | Border

  border-radius: ${({ radius, $device }) => 
    radius || InputStyles.radius[$device]}; // 테두리 둥글기 | Border radius

  font-size: ${({ fontSize }) => 
    fontSize || AppTextStyles.body1.fontSize}; // 폰트 크기 | Font size

  width: 100%; // 전체 너비 | Full width

  height: ${({ height, $device }) => 
    height || InputStyles.height[$device]}; // 입력 높이 | Input height

  box-sizing: border-box;

  padding-right: ${({ paddingRight, $hasSuffix, $device }) =>
    paddingRight || 
    ($hasSuffix 
      ? InputStyles.paddingRightWithSuffix[$device] // 서픽스 있을 때 오른쪽 여백 | Padding when suffix exists
      : InputStyles.padding[$device])};

  &:focus {
    border-color: ${AppColors.onSurface}; // 포커스 시 테두리 강조 | Focus border color
    outline: none;
  }

  &::placeholder {
    color: ${AppColors.iconDisabled}; // 플레이스홀더 색상 | Placeholder color
  }
`;

export default InputElement;
