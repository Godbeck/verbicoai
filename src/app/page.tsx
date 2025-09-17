"use client";

import { useState, useEffect } from "react";
import TranslationInterface from "@/components/TranslationInterface";
import TranslationHistory from "@/components/TranslationHistory";
import {
  Translation,
  TranslationHistory as TranslationHistoryType,
} from "@/types";

export default function Home() {
  const [translations, setTranslations] = useState<Translation[]>([]);

  // Load translations from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("translationHistory");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTranslations(parsed.translations || []);
      } catch (error) {
        console.error("Failed to parse translation history:", error);
      }
    }
  }, []);

  // Save translations to localStorage whenever they change
  useEffect(() => {
    const history: TranslationHistoryType = { translations };
    localStorage.setItem("translationHistory", JSON.stringify(history));
  }, [translations]);

  const handleAddToHistory = (translation: Translation) => {
    setTranslations((prev) => [translation, ...prev.slice(0, 9)]); // Keep only last 10
  };

  const handleSelectTranslation = (translation: Translation) => {
    // This would populate the interface with the selected translation
    // You might want to lift state up or use context for this
    console.log("Selected translation:", translation);
  };

  const handleClearHistory = () => {
    setTranslations([]);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Verbico AI</h1>
          <p className="text-gray-600">
            Translate text and speech between multiple languages in real-time
          </p>
        </div>

        <TranslationInterface onAddToHistory={handleAddToHistory} />

        <TranslationHistory
          translations={translations}
          onSelectTranslation={handleSelectTranslation}
          onClearHistory={handleClearHistory}
        />
      </div>
    </main>
  );
}
