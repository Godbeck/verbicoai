import { SUPPORTED_LANGUAGES } from "@/lib/translation-service";
import { Language } from "@/types";

interface LanguageSelectorProps {
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  label: string;
  disabled?: boolean;
  includeAuto?: boolean;
}

export default function LanguageSelector({
  selectedLanguage,
  onLanguageChange,
  label,
  disabled = false,
  includeAuto = false,
}: LanguageSelectorProps) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium text-gray-700 mb-1">{label}</label>
      <select
        value={selectedLanguage}
        onChange={(e) => onLanguageChange(e.target.value)}
        disabled={disabled}
        className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
      >
        {includeAuto && <option value="auto">Auto-detect</option>}
        {SUPPORTED_LANGUAGES.map((language) => (
          <option key={language.code} value={language.code}>
            {language.name} ({language.nativeName})
          </option>
        ))}
      </select>
    </div>
  );
}
