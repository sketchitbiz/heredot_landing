// src/contexts/LangContext.tsx
'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Lang = 'ko' | 'en';

interface LangContextValue {
  lang: Lang;
  setLang: (lang: Lang) => void;
}

const LangContext = createContext<LangContextValue>({
  lang: 'ko',
  setLang: () => {},
});

export const useLang = () => useContext(LangContext);

export const LangProvider = ({ children }: { children: React.ReactNode }) => {
  const [lang, setLangState] = useState<Lang>('ko');

  const setLang = (newLang: Lang) => {
    localStorage.setItem('appLang', newLang);
    setLangState(newLang);
  };

  useEffect(() => {
    const stored = localStorage.getItem('appLang') as Lang | null;
    if (stored) {
      setLangState(stored);
    } else {
      const browserLang = navigator.language.startsWith('ko') ? 'ko' : 'en';
      setLangState(browserLang);
    }
  }, []);

  return (
    <LangContext.Provider value={{ lang, setLang }}>
      {children}
    </LangContext.Provider>
  );
};
