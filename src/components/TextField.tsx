// src/components/TextField.tsx

/**
 * TextField는 InputElement(element)를 기반으로 상태, 유효성 메시지, 비밀번호 보기 토글 등을 포함한
 * 재사용 가능한 컴포넌트 레벨 입력 UI입니다.
 *
 * TextField is a reusable component-level input UI built on top of the InputElement (element),
 * supporting logic like state handling, validation message, and password visibility toggle.
 *
 * [컴포넌트 목적 / Purpose]
 * - 입력 필드의 UI 및 동작을 캡슐화하여 일관된 입력 인터페이스를 제공합니다.
 * - 디자인 시스템에 따라 구성되며, 다양한 상위 UI (components, blocks, pages)에서 재사용 가능합니다.
 * - 데이터와 직접 연결되는 도메인 모델은 받지 않으며, 명시적인 props 기반 구조로 동작합니다.
 *
 * [Props 설계 기준 / Props Design Convention]
 * 기능 및 의미 중심 props는 명확하게 개별 전달  
 *   - 예: value, onChange, type 등
 *
 * 스타일 관련 props는 디자인 시스템의 기본값을 따르되, 필요한 경우 override 가능  
 *   - 예: radius, fontSize, height, padding 등
 *
 * 데이터 모델 단위 props(user, product 등)는 사용하지 않음  
 *   - 해당 방식은 CustomComponent(ex: Card)에서만 적용
 *   - 예: <Card user={userModel} /> ← 커스텀 컴포넌트에서만 유효
 *
 *
 * --- English version below ---
 *
 * TextField is a reusable component-level input UI built on top of InputElement (element),
 * encapsulating UI behavior like state, validation message, and password toggle.
 *
 * [Purpose]
 * - Provides a consistent and reusable input interface following the design system
 * - Can be used in higher-level UIs such as components, blocks, and pages
 * - Not connected to any domain data models – works purely via explicit props
 *
 * [Props Design Convention]
 * Functional or semantic props are passed individually  
 *   - e.g., value, onChange, type
 *
 * Style-related props follow design system defaults and can be optionally overridden  
 *   - e.g., radius, fontSize, height, padding
 *
 * No object-based data model props (e.g., user, product)  
 *   - Those are only used in CustomComponents like Card
 *   - Example: <Card user={userModel} /> ← Valid for custom UI components only
 */



import React, { useState } from 'react';
import styled from 'styled-components';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppColors } from '@/styles/colors';
import { useDevice } from '@/contexts/DeviceContext';
import type { DeviceType } from '@/types/device';
import InputElement from '@/elements/InputElement';
import { InputStyles } from '@/constants/componentConstants';

const Container = styled.div<{ $device: DeviceType }>`
  display: flex;
  flex-direction: column;
  max-width: ${({ $device }) => InputStyles.containerMaxWidth[$device]};
  width: 100%;
  padding: ${({ $device }) => InputStyles.containerPadding[$device]};
`;

const InputWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const SuffixIconWrapper = styled.div<{
  $isPasswordVisible?: boolean;
  $device: DeviceType;
}>`
  position: absolute;
  right: ${({ $device }) => InputStyles.suffixIconRight[$device]};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${({ $isPasswordVisible }) =>
    $isPasswordVisible ? AppColors.iconPrimary : AppColors.iconDisabled};
`;

interface TextFieldProps {
  //  데이터 및 기능 관련 props (직접 전달)
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
  showSuffixIcon?: boolean;
  type?: 'text' | 'password';

  // 🎨스타일 관련 props (디자인 가이드 기반, 커스터마이징 가능)
  radius?: string;
  fontSize?: string;
  height?: string;
  padding?: string;
  paddingRight?: string;
}

export const TextField = ({
  value,
  onChange,
  placeholder,
  errorMessage,
  showSuffixIcon,
  type = 'text',
  radius,
  fontSize,
  height,
  padding,
  paddingRight,
}: TextFieldProps) => {
  const device = useDevice();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleToggleVisibility = () => setIsPasswordVisible((prev) => !prev);

  return (
    <Container $device={device}>
      <InputWrapper>
        <InputElement
          type={type === 'password' && !isPasswordVisible ? 'password' : 'text'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          radius={radius}
          fontSize={fontSize}
          height={height}
          padding={padding}
          paddingRight={paddingRight}
          $hasSuffix={!!(showSuffixIcon && type === 'password')}
          $device={device}
        />
        {showSuffixIcon && type === 'password' && (
          <SuffixIconWrapper
            onClick={handleToggleVisibility}
            $isPasswordVisible={isPasswordVisible}
            $device={device}
          >
            {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
          </SuffixIconWrapper>
        )}
      </InputWrapper>
      {errorMessage && (
        <span style={{ color: AppColors.error }}>{errorMessage}</span>
      )}
    </Container>
  );
};
