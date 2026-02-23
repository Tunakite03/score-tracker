import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Language, type TranslationKey } from './translations';

interface LanguageContextType {
   language: Language;
   setLanguage: (lang: Language) => void;
   t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'score-tracker-language';

export function LanguageProvider({ children }: { children: ReactNode }) {
   const [language, setLanguageState] = useState<Language>(() => {
      const stored = localStorage.getItem(STORAGE_KEY);
      return (stored as Language) || 'vi';
   });

   useEffect(() => {
      localStorage.setItem(STORAGE_KEY, language);
   }, [language]);

   const t = (key: TranslationKey): string => {
      return translations[language][key] || key;
   };

   const setLanguage = (lang: Language) => {
      setLanguageState(lang);
   };

   return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
   const context = useContext(LanguageContext);
   if (context === undefined) {
      throw new Error('useLanguage must be used within a LanguageProvider');
   }
   return context;
}
