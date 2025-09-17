export interface Language {
  code: string;
  name: string;
  nativeName: string;
}

export interface Translation {
  id: string;
  sourceText: string;
  translatedText: string;
  sourceLanguage: Language;
  targetLanguage: Language;
  timestamp: number;
}

export interface TranslationHistory {
  translations: Translation[];
}

export interface VoiceRecognitionResult {
  transcript: string;
  isFinal: boolean;
}
