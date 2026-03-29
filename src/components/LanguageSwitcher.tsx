import React, { useEffect, useRef, useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';
import type { Locale } from '../i18n/translations';

type Props = {
  /** e.g. h-8 to match legal row buttons */
  className?: string;
};

export const LanguageSwitcher: React.FC<Props> = ({ className = '' }) => {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handlePointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handlePointerDown);
    return () => document.removeEventListener('mousedown', handlePointerDown);
  }, []);

  const options: { value: Locale; label: string }[] = [
    { value: 'de', label: t('languageDe') },
    { value: 'en', label: t('languageEn') },
  ];

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full h-8 flex items-center justify-center gap-1.5 rounded-lg hover:bg-gray-50 text-gray-700 transition-colors px-2"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={t('languageMenu')}
      >
        <Globe className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium uppercase">{locale}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-gray-400 transition-transform shrink-0 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <ul
          role="listbox"
          className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 min-w-[9rem] py-1 bg-white rounded-lg shadow-lg border border-gray-200 z-[10001] text-left"
        >
          {options.map((opt) => (
            <li key={opt.value} role="option" aria-selected={locale === opt.value}>
              <button
                type="button"
                onClick={() => {
                  setLocale(opt.value);
                  setOpen(false);
                }}
                className={`
                  w-full text-left px-3 py-2 text-sm
                  ${locale === opt.value ? 'bg-pink-50 text-pink-800 font-medium' : 'text-gray-700 hover:bg-gray-50'}
                `}
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
