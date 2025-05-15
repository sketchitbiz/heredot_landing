'use client';
import React, { useState } from 'react';
import styled from 'styled-components';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { AppColors } from '@/styles/colors';
import { useDevice } from '@/contexts/DeviceContext';
import type { DeviceType } from '@/types/device';
import InputElement from '@/elements/InputElement';
import { InputStyles, LabelStyles } from '@/constants/componentConstants';

const Label = styled.label<{ $labelPosition: 'vertical' | 'horizontal' }>`
  margin-left: 8px;
  flex: ${({ $labelPosition }) => ($labelPosition === 'horizontal' ? '1' : 'none')};
`;

const Container = styled.div<{ $device: DeviceType; $labelPosition: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: ${({ $labelPosition }) => ($labelPosition === 'vertical' ? 'column' : 'row')};
  width: 100%;
  padding: ${({ $device }) => InputStyles.containerPadding[$device]};
  align-items: ${({ $labelPosition }) => ($labelPosition === 'horizontal' ? 'center' : 'flex-start')};
`;

const InputWrapper = styled.div<{ $labelPosition: 'vertical' | 'horizontal' }>`
  display: flex;
  flex-direction: column;
  flex: ${({ $labelPosition }) => ($labelPosition === 'horizontal' ? '5' : '1')};
  width: ${({ $labelPosition }) => ($labelPosition === 'horizontal' ? 'auto' : '100%')};
`;

const InputFieldWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  width: 100%;
`;

const ErrorText = styled.span`
  color: ${AppColors.error};
  font-size: 12px;
  margin-top: 4px;
  margin-left: 4px;
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
  // 데이터 및 기능 관련 props
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  errorMessage?: string;
  showSuffixIcon?: boolean;
  isPasswordField?: boolean; // ✅ 추가

  // 🎨 스타일 관련 props
  radius?: string;
  fontSize?: string;
  height?: string;
  padding?: string;
  paddingRight?: string;
  label?: string;
  labelColor?: string;
  $labelPosition?: 'vertical' | 'horizontal';

  autoComplete?: string;
}

export const TextField = ({
  value,
  onChange,
  placeholder,
  errorMessage,
  showSuffixIcon,
  isPasswordField = false, // ✅ 기본값 false
  radius,
  fontSize,
  height,
  padding,
  paddingRight,
  label,
  labelColor,
  $labelPosition = 'vertical',
  autoComplete,
}: TextFieldProps) => {
  const device = useDevice();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const handleToggleVisibility = () => setIsPasswordVisible((prev) => !prev);

  const resolvedInputType = isPasswordField && !isPasswordVisible ? 'password' : 'text';

  return (
    <Container $device={device} $labelPosition={$labelPosition}>
      {label && (
        <Label
          $labelPosition={$labelPosition}
          style={{
            fontSize: LabelStyles.fontSize[device],
            color: labelColor || LabelStyles.color,
          }}
        >
          {label}
        </Label>
      )}

      <InputWrapper $labelPosition={$labelPosition}>
        <InputFieldWrapper>
          <InputElement
            type={resolvedInputType}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            radius={radius}
            fontSize={fontSize}
            height={height}
            padding={padding}
            paddingRight={paddingRight}
            $hasSuffix={!!(showSuffixIcon && isPasswordField)}
            $device={device}
            autoComplete={autoComplete}
          />
          {showSuffixIcon && isPasswordField && (
            <SuffixIconWrapper
              onClick={handleToggleVisibility}
              $isPasswordVisible={isPasswordVisible}
              $device={device}
            >
              {isPasswordVisible ? <VisibilityOff /> : <Visibility />}
            </SuffixIconWrapper>
          )}
        </InputFieldWrapper>

        {errorMessage && <ErrorText>{errorMessage}</ErrorText>}
      </InputWrapper>
    </Container>
  );
};
