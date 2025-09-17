import { Language } from "@/types";
import { error } from "console";

// Supported languages for translation
export const SUPPORTED_LANGUAGES: Language[] = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "it", name: "Italian", nativeName: "Italiano" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "ko", name: "Korean", nativeName: "한국어" },
  { code: "zh", name: "Chinese", nativeName: "中文" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  { code: "sv", name: "Swedish", nativeName: "Svenska" },
  { code: "pl", name: "Polish", nativeName: "Polski" },
];

export const getLanguageName = (code: string): string => {
  const language = SUPPORTED_LANGUAGES.find((lang) => lang.code === code);
  return language ? language.name : "Unknown Language";
};

export const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage: string = "auto"
): Promise<string> => {
  try {
    const response = await fetch("/api/translate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        targetLanguage,
        sourceLanguage,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || "Translation API request failed");
    }
    const data = await response.json();
    return data.translatedText;
  } catch (error) {
    console.log("Translation error:", error);
    throw new Error("Failed to translate text. Please try again.");
  }
};

export const detectLanguage = async (text: string): Promise<string> => {
  try {
    // Send a request to our API for language detection
    const response = await fetch("/api/detect-language", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error("Language detection failed");
    }

    const data = await response.json();
    return data.language;
  } catch (error) {
    console.error("Language detection error:", error);

    // Fallback to simple character-based detection if API fails
    if (/[\u0600-\u06FF]/.test(text)) return "ar"; // Arabic
    if (/[\u4E00-\u9FFF]/.test(text)) return "zh"; // Chinese
    if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja"; // Japanese
    if (/[\uAC00-\uD7AF]/.test(text)) return "ko"; // Korean
    if (/[\u0400-\u04FF]/.test(text)) return "ru"; // Russian

    // Default to English if detection fails
    return "en";
  }
};
