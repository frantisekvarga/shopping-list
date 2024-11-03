import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './languages/en.json';
import sk from './languages/sk.json';
import cs from './languages/cs.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      sk: { translation: sk },
      cs: { translation: cs }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, 
    }
  });

export default i18n;
