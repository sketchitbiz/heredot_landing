// src/components/DropdownInput.tsx

/**
 * DropdownInput은 Radix UI 기반의 셀렉트를 사용한 커스텀 드롭다운입니다.
 * value, onChange, options, errorMessage 등 상태 및 동작을 포함하며,
 * 디자인 시스템을 따라 일관된 드롭다운 UI를 제공합니다.
 */
'use client';

import React from 'react';
import { useDevice } from '@/contexts/DeviceContext';
import type { DeviceType } from '@/types/device';
import DropdownFieldElement from '@/elements/DropdownFieldElement';
import { AppColors } from '@/styles/colors';
import {
  SelectElement,
  SelectTriggerElement,
  SelectValueElement,
  SelectContentElement,
  SelectItemElement,
} from '@/elements/RadixSelectElement';

interface DropdownInputProps {
  value: string;
  onChange: (value: string) => void;
  options: { label: string; value: string }[];
  width?: string;
  errorMessage?: string;

  // ✅ Trigger 스타일
  triggerBackgroundColor?: string;
  triggerTextColor?: string;
  triggerFontSize?: string;
  triggerFontWeight?: string;
  height?: string;
  radius?: string;
  isShowIcon?: boolean;
  triggerHoverBackgroundColor?: string;
  triggerHoverTextColor?: string;

  // ✅ Content 스타일
  contentBackgroundColor?: string;
  contentTextColor?: string;
  contentFontSize?: string;

  itemHoverBackgroundColor?: string;
  itemHoverTextColor?: string;
}

const DropdownInput = ({
  value,
  onChange,
  options,
  width = '100%',
  errorMessage,
  // trigger style
  triggerBackgroundColor,
  triggerTextColor,
  triggerFontSize,
  triggerFontWeight,
  height,
  radius,
  isShowIcon = true,
  // content style
  contentBackgroundColor,
  contentTextColor,
  contentFontSize,
  triggerHoverBackgroundColor,
  triggerHoverTextColor,
  itemHoverBackgroundColor,
  itemHoverTextColor,
}: DropdownInputProps) => {
  const device: DeviceType = useDevice();

  return (
    <DropdownFieldElement
      $device={device}
      $backgroundColor={triggerBackgroundColor}
      $textColor={triggerTextColor}
    >
      <SelectElement value={value} onValueChange={onChange}>
        <SelectTriggerElement
          style={{ width }}
          $height={height}
          $radius={radius}
          $triggerFontSize={triggerFontSize}
          $triggerFontWeight={triggerFontWeight}
          $triggerTextColor={triggerTextColor}
          $triggerBackgroundColor={triggerBackgroundColor}
          $triggerHoverBackgroundColor={triggerHoverBackgroundColor}
          $triggerHoverTextColor={triggerHoverTextColor}
          $isShowIcon={isShowIcon}
        >
          <SelectValueElement />
        </SelectTriggerElement>

        <SelectContentElement
          $contentFontSize={contentFontSize}
          $contentTextColor={contentTextColor}
          $contentBackgroundColor={contentBackgroundColor}
        >
          {options.map((opt) => (
            <SelectItemElement
              key={opt.value}
              value={opt.value}
              $fontSize={contentFontSize}
              $textColor={contentTextColor}
              $itemHoverBackgroundColor= {itemHoverBackgroundColor}
              $itemHoverTextColor={itemHoverTextColor}
            >
              {opt.label}
            </SelectItemElement>
          ))}
        </SelectContentElement>
      </SelectElement>

      {errorMessage && (
        <span
          style={{
            color: AppColors.error,
            marginTop: '4px',
            fontSize: '12px',
          }}
        >
          {errorMessage}
        </span>
      )}
    </DropdownFieldElement>
  );
};

export default DropdownInput;
