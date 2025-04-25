'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import DropdownInput from '@/components/DropdownInput';
import { AppColors } from '@/styles/colors';

const LanguageSwitcher = () => {
  const { lang, setLang } = useLang();

  const languageOptions = [
    { label: '한국어', value: 'ko' },
    { label: 'English', value: 'en' },
  ];

  return (
    <DropdownInput
      value={lang}
      onChange={(value) => setLang(value as 'ko' | 'en')}
      options={languageOptions}
      triggerBackgroundColor={AppColors.background}
      triggerTextColor={AppColors.onBackground}
      contentBackgroundColor={AppColors.background}
      contentTextColor={AppColors.onBackground}
      itemHoverBackgroundColor={AppColors.primary}
      itemHoverTextColor={AppColors.onBackground}
      width="auto"
    />
  );
};

export default LanguageSwitcher;
