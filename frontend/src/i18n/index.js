import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ja from "./locales/ja.json";

export const LANGUAGE_STORAGE_KEY = "japan-travel-planner-language";
export const SUPPORTED_LANGUAGES = ["en", "ja"];

function getInitialLanguage() {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (SUPPORTED_LANGUAGES.includes(savedLanguage)) return savedLanguage;

    return window.navigator.language?.toLowerCase().startsWith("ja") ? "ja" : "en";
}

i18n.use(initReactI18next).init({
    resources: {
        en: { translation: en },
        ja: { translation: ja },
    },
    lng: getInitialLanguage(),
    fallbackLng: "en",
    supportedLngs: SUPPORTED_LANGUAGES,
    interpolation: { escapeValue: false },
    react: { useSuspense: false },
});

function applyLanguage(language) {
    const resolvedLanguage = language?.startsWith("ja") ? "ja" : "en";
    document.documentElement.lang = resolvedLanguage;
    document.title = i18n.t("app.name", { lng: resolvedLanguage });
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, resolvedLanguage);
}

applyLanguage(i18n.resolvedLanguage);
i18n.on("languageChanged", applyLanguage);

export default i18n;
