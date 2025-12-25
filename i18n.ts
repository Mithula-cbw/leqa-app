// Leqa © 2025 Mithula Chanthuka
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './src/locales/en.json';
import si from './src/locales/si.json';

i18n
  .use(initReactI18next)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    resources: {
      en: { translation: en },
      si: { translation: si }
    },
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;
