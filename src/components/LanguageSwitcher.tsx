"use client";

import { useLanguage } from "@/contexts/LanguageContext";

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  return (
    <button
      onClick={() => setLocale(locale === "fr" ? "en" : "fr")}
      className="fixed top-4 right-4 z-50 bg-white/90 backdrop-blur-sm border border-white/40 rounded-lg px-3 py-2 text-sm font-medium text-gray-700 hover:bg-white/95 transition-all duration-200 shadow-lg"
      title={locale === "fr" ? "Switch to English" : "Passer en Français"}
    >
      {locale === "fr" ? "🇺🇸 EN" : "🇫🇷 FR"}
    </button>
  );
}
