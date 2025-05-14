'use client';

import React from 'react';
import { useLang } from '@/contexts/LangContext';
import { aiChatDictionary } from '@/lib/i18n/aiChat';

export function LoadingText() {
  const { lang } = useLang();
  const t = aiChatDictionary[lang];

  return <div>{t.loading}</div>;
}
