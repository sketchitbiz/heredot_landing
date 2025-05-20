import styled from 'styled-components';
import { InputStyles } from '@/constants/componentConstants';
import { AppColors } from '@/styles/colors';
import { AppTextStyles } from '@/styles/textStyles';
import type { DeviceType } from '@/types/device';
import React, { useRef, useEffect } from 'react';

export interface BaseInputElementProps {
  radius?: string;
  padding?: string;
  height?: string;
  fontSize?: string;
  paddingRight?: string;
  $hasSuffix?: boolean;
  $device: DeviceType;
  background?: string;
  autoComplete?: string;
}

// Textarea 전용 props
interface TextareaElementProps extends BaseInputElementProps {
  rows?: number;
  maxRows?: number;
  resize?: 'none' | 'vertical' | 'horizontal' | 'both';
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

/** 단일 라인 input 필드 */
export const StyledInput = styled.input<BaseInputElementProps>`
  background: ${({ background }) => background || AppColors.surface};
  color: ${AppColors.onSurface};
  padding: ${({ padding, $device }) => padding || InputStyles.padding[$device]};
  padding-right: ${({ paddingRight, $hasSuffix, $device }) =>
    paddingRight ||
    ($hasSuffix ? InputStyles.paddingRightWithSuffix[$device] : InputStyles.padding[$device])};

  border: 1px solid ${AppColors.borderLight};
  border-radius: ${({ radius, $device }) => radius || InputStyles.radius[$device]};
  font-size: ${({ fontSize }) => fontSize || AppTextStyles.body1.fontSize};
  width: 100%;
  height: ${({ height, $device }) => height || InputStyles.height[$device]};
  box-sizing: border-box;

  &:focus {
    border-color: ${AppColors.onSurface};
    outline: none;
  }

  &::placeholder {
    color: ${AppColors.iconDisabled};
  }
`;

/** 멀티라인 textarea 필드 (자동 높이 조절) */
const RawTextarea = styled.textarea<BaseInputElementProps>`
  background: ${({ background }) => background || AppColors.surface};
  color: ${AppColors.onSurface};

  padding: ${({ padding, $device }) => padding || InputStyles.padding[$device]};
  padding-right: ${({ paddingRight, $hasSuffix, $device }) =>
    paddingRight ||
    ($hasSuffix ? InputStyles.paddingRightWithSuffix[$device] : InputStyles.padding[$device])};

  border: 1px solid ${AppColors.borderLight};
  border-radius: ${({ radius, $device }) => radius || InputStyles.radius[$device]};
  font-size: ${({ fontSize }) => fontSize || AppTextStyles.body1.fontSize};
  width: 100%;
  min-height: ${({ height }) => height || '80px'};
  resize: none;
  overflow: hidden;
  line-height: 1.5;
  box-sizing: border-box;

  white-space: pre-wrap;
  word-break: break-word;

  &:focus {
    border-color: ${AppColors.onSurface};
    outline: none;
  }

  &::placeholder {
    color: ${AppColors.iconDisabled};
  }
`;

/** 자동 높이 조절 기능 포함된 Textarea 컴포넌트 */
export const StyledTextarea: React.FC<TextareaElementProps> = ({
  value,
  onChange,
  ...rest
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [value]);

  return (
    <RawTextarea
      ref={textareaRef}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
