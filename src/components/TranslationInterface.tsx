"use client";

import { useState, useEffect } from "react";
import { Copy, Volume, RotateCcw, Languages } from "lucide-react";
import { translateText, detectLanguage } from "@/lib/translation-service";
import { textToSpeechService } from "@/lib/speech-service";
import LanguageSelector from "./LanguageSelector";
import VoiceRecorder from "./VoiceRecorder";
import LoadingSpinner from "./ui/LoadingSpinner";
import { Translation } from "@/types";

interface TranslationInterfaceProps {
  onAddToHistory: (translation: Translation) => void;
}

export default function TranslationInterface({
  onAddToHistory,
}: TranslationInterfaceProps) {
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [sourceLanguage, setSourceLanguage] = useState("auto");
  const [targetLanguage, setTargetLanguage] = useState("es");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");

  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setError("Please enter text to translate");
      return;
    }

    setIsTranslating(true);
    setError("");

    try {
      // Auto-detect source language if set to auto
      let detectedSourceLanguage = sourceLanguage;
      if (sourceLanguage === "auto") {
        detectedSourceLanguage = await detectLanguage(sourceText);
      }

      const result = await translateText(
        sourceText,
        targetLanguage,
        detectedSourceLanguage
      );
      setTranslatedText(result);

      // Add to history
      const newTranslation: Translation = {
        id: Date.now().toString(),
        sourceText: sourceText,
        translatedText: result,
        sourceLanguage: detectedSourceLanguage,
        targetLanguage: targetLanguage,
        timestamp: Date.now(),
      };
      onAddToHistory(newTranslation);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to translate");
    } finally {
      setIsTranslating(false);
    }
  };

  // Clear translated text when source text changes
  useEffect(() => {
    setTranslatedText("");
    setError("");
  }, [sourceText, sourceLanguage, targetLanguage]);

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

  const handleVoiceTranscript = (transcript: string) => {
    setSourceText(transcript);
  };

  const swapLanguages = () => {
    if (sourceLanguage !== "auto") {
      setSourceLanguage(targetLanguage);
    }
    setTargetLanguage(sourceLanguage === "auto" ? "en" : sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <LanguageSelector
              selectedLanguage={sourceLanguage}
              onLanguageChange={setSourceLanguage}
              label="From"
              includeAuto={true}
            />
            <button
              onClick={swapLanguages}
              className="p-2 text-gray-500 hover:text-gray-700 mt-6"
              aria-label="Swap languages"
            >
              <RotateCcw size={20} />
            </button>
          </div>

          <div className="relative">
            <textarea
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Enter text or use voice input..."
              className="w-full h-40 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              disabled={isTranslating}
            />
            <div className="absolute bottom-2 right-2">
              <VoiceRecorder
                onTranscript={handleVoiceTranscript}
                language={sourceLanguage === "auto" ? "en-US" : sourceLanguage}
                disabled={isTranslating}
              />
            </div>
          </div>
        </div>

        {/* Target Language Section */}
        <div className="space-y-4">
          <LanguageSelector
            selectedLanguage={targetLanguage}
            onLanguageChange={setTargetLanguage}
            label="To"
          />

          <div className="relative">
            <div className="w-full h-40 p-3 border border-gray-300 rounded-md bg-gray-50">
              {isTranslating ? (
                <div className="flex justify-center items-center h-full">
                  <LoadingSpinner />
                </div>
              ) : (
                <div className="h-full overflow-y-auto">
                  {translatedText || (
                    <p className="text-gray-400">
                      Translation will appear here...
                    </p>
                  )}
                </div>
              )}
            </div>

            {translatedText && !isTranslating && (
              <div className="absolute bottom-2 right-2 flex space-x-2">
                <button
                  onClick={() => handleCopy(translatedText)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Copy translation"
                >
                  <Copy size={16} />
                </button>
                <button
                  onClick={() => handleSpeak(translatedText, targetLanguage)}
                  className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
                  aria-label="Speak translation"
                >
                  <Volume size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mt-6 flex justify-center">
        <button
          onClick={handleTranslate}
          disabled={isTranslating || !sourceText.trim()}
          className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Languages size={20} className="mr-2" />
          Translate
        </button>
      </div>
    </div>
  );
}
