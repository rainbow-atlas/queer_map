import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  Locale,
  MessageKey,
  ImpressumKey,
  STORAGE_KEY,
  messages,
  impressumLine,
} from './translations';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: MessageKey) => string;
  ti: (key: ImpressumKey) => string;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function readInitialLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'en' || saved === 'de') return saved;
  } catch {
    /* ignore */
  }
  return 'de';
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(readInitialLocale);

  const setLocale = useCallback((next: Locale) => {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale === 'de' ? 'de' : 'en';
  }, [locale]);

  const t = useCallback((key: MessageKey) => messages[locale][key], [locale]);

  const ti = useCallback((key: ImpressumKey) => impressumLine(locale, key), [locale]);

  const value = useMemo(
    () => ({ locale, setLocale, t, ti }),
    [locale, setLocale, t, ti]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used within I18nProvider');
  }
  return ctx;
}
