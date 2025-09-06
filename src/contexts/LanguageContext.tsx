"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { Locale, defaultLocale } from "@/lib/i18n";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  messages: Record<string, unknown>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

interface LanguageProviderProps {
  children: ReactNode;
  initialLocale?: Locale;
}

export function LanguageProvider({
  children,
  initialLocale = defaultLocale,
}: LanguageProviderProps) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const [messages, setMessages] = useState<Record<string, unknown>>({});

  useEffect(() => {
    // Load saved locale from localStorage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && ["en", "fr"].includes(savedLocale)) {
      setLocaleState(savedLocale);
    }
  }, []);

  useEffect(() => {
    // Load messages for current locale
    const loadMessages = async () => {
      try {
        const messages = await import(`@/messages/${locale}.json`);
        setMessages(messages.default);
      } catch (error) {
        console.error("Failed to load messages:", error);
        // Fallback to default locale
        if (locale !== defaultLocale) {
          const fallbackMessages = await import(
            `@/messages/${defaultLocale}.json`
          );
          setMessages(fallbackMessages.default);
        }
      }
    };

    loadMessages();
  }, [locale]);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, messages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

// Custom hook for translations
export function useTranslation() {
  const { messages } = useLanguage();

  const t = (key: string, fallback?: string): string => {
    const keys = key.split(".");
    let value: unknown = messages;

    for (const k of keys) {
      if (value && typeof value === "object" && k in value) {
        value = (value as Record<string, unknown>)[k];
      } else {
        return fallback || key;
      }
    }

    return typeof value === "string" ? value : fallback || key;
  };

  return { t };
}
