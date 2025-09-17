"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";
import { speechRecognitionService } from "@/lib/speech-service";

interface VoiceRecorderProps {
  onTranscript: (transcript: string) => void;
  language: string;
  disabled?: boolean;
}

export default function VoiceRecorder({
  onTranscript,
  language,
  disabled = false,
}: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);

  const startRecording = () => {
    setIsRecording(true);
    speechRecognitionService.setLanguage(language);

    speechRecognitionService.startRecognition(
      (result) => {
        if (result.isFinal) {
          onTranscript(result.text);
          setIsRecording(false);
        }
      },
      (error) => {
        console.error("Speech recognition error:", error);
        setIsRecording(false);
      }
    );
  };

  const stopRecording = () => {
    setIsRecording(false);
    speechRecognitionService.stopRecognition();
  };

  return (
    <button
      onClick={isRecording ? stopRecording : startRecording}
      disabled={disabled}
      className={`p-3 rounded-full transition-colors ${
        isRecording
          ? "bg-red-500 hover:bg-red-600 text-white"
          : "bg-blue-500 hover:bg-blue-600 text-white"
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      aria-label={isRecording ? "Stop recording" : "Start recording"}
    >
      {isRecording ? <Square size={20} /> : <Mic size={20} />}
    </button>
  );
}
