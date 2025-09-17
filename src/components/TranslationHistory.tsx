// src/components/TranslationHistory.tsx
import { Translation } from "@/types";
import { Copy, Volume } from "lucide-react";
import { textToSpeechService } from "@/lib/speech-service";
import { getLanguageName } from "@/lib/translation-service";

interface TranslationHistoryProps {
  translations: Translation[];
  onSelectTranslation: (translation: Translation) => void;
  onClearHistory: () => void;
}

export default function TranslationHistory({
  translations,
  onSelectTranslation,
  onClearHistory,
}: TranslationHistoryProps) {
  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleSpeak = (text: string, language: string) => {
    textToSpeechService.speak(text, language);
  };

  if (translations.length === 0) {
    return null;
  }

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Recent Translations
        </h2>
        <button
          onClick={onClearHistory}
          className="text-sm text-red-500 hover:text-red-700"
        >
          Clear History
        </button>
      </div>
      <div className="space-y-4">
        {translations.map((translation) => (
          <div
            key={translation.id}
            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onSelectTranslation(translation)}
          >
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <p className="text-gray-700 mb-2">{translation.sourceText}</p>
                <p className="text-blue-600 font-medium">
                  {translation.translatedText}
                </p>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy(translation.translatedText);
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Copy translation"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSpeak(
                      translation.translatedText,
                      translation.targetLanguage
                    );
                  }}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  aria-label="Speak translation"
                >
                  <Volume size={16} />
                </button>
              </div>
            </div>
            <div className="text-xs text-gray-500">
              {getLanguageName(translation.sourceLanguage)} →{" "}
              {getLanguageName(translation.targetLanguage)}
              {" • "}
              {new Date(translation.timestamp).toLocaleTimeString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
