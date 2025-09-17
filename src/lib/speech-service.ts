export class SpeechRecognitionService {
  private recognition: any;
  private isSupported: boolean;

  constructor() {
    this.isSupported =
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window);

    if (this.isSupported) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = "en-US";
    }
  }

  startRecognition(
    onResult: (result: { text: string; isFinal: boolean }) => void,
    onError: (error: string) => void
  ): void {
    if (!this.isSupported) {
      onError("Speech recognition is not supported in this browser");
      return;
    }

    this.recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (interimTranscript) {
        onResult({ text: interimTranscript, isFinal: false });
      }

      if (finalTranscript) {
        onResult({ text: finalTranscript, isFinal: true });
      }
    };

    this.recognition.onerror = (event: any) => {
      onError(event.error);
    };

    this.recognition.start();
  }

  stopRecognition(): void {
    if (this.isSupported && this.recognition) {
      this.recognition.stop();
    }
  }

  setLanguage(language: string): void {
    if (this.isSupported && this.recognition) {
      this.recognition.lang = language;
    }
  }
}

export class TextToSpeechService {
  private synth: SpeechSynthesis | null;
  private isSupported: boolean;
  // Fixed SSR compatibility

  constructor() {
    this.isSupported =
      typeof window !== "undefined" && "speechSynthesis" in window;
    this.synth = this.isSupported ? window.speechSynthesis : null;
  }

  speak(text: string, language: string): void {
    if (!this.isSupported || !this.synth) {
      console.warn("Text-to-speech is not supported in this browser");
      return;
    }

    // Stop any ongoing speech
    this.synth.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language;
    utterance.rate = 0.8;
    utterance.pitch = 1;

    this.synth.speak(utterance);
  }

  stop(): void {
    if (this.isSupported && this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechRecognitionService = new SpeechRecognitionService();
export const textToSpeechService = new TextToSpeechService();
