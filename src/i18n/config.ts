import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { I18nManager } from 'react-native';

// Import translations
import enTranslations from './locales/en';
import esTranslations from './locales/es';
import ptTranslations from './locales/pt';

// Define available languages
export const LANGUAGES = {
  en: {
    name: 'English',
    translation: enTranslations,
  },
  es: {
    name: 'Español',
    translation: esTranslations,
  },
  pt: {
    name: 'Português',
    translation: ptTranslations,
  },
};

// Get device language (fallback to 'en' if not supported)
const getDeviceLanguage = () => {
  const locale = Localization.locale.split('-')[0];
  return Object.keys(LANGUAGES).includes(locale) ? locale : 'en';
};

// Initialize i18next
i18n
  .use(initReactI18next)
  .init({
    resources: LANGUAGES,
    lng: getDeviceLanguage(),
    fallbackLng: 'en',
    compatibilityJSON: 'v3',
    interpolation: {
      escapeValue: false,
    },
  });

// Load saved language from AsyncStorage
AsyncStorage.getItem('userLanguage').then((language) => {
  if (language && Object.keys(LANGUAGES).includes(language)) {
    i18n.changeLanguage(language);
    if (language === 'ar' || language === 'he') {
      I18nManager.forceRTL(true);
    } else {
      I18nManager.forceRTL(false);
    }
  }
});

export default i18n;