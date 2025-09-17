import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text } = await request.json();

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Use Google Gemini API for language detection
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

    if (!apiKey) {
      // Fallback language detection using character patterns
      let detectedLanguage = "en"; // default

      if (/[\u0600-\u06FF]/.test(text)) detectedLanguage = "ar"; // Arabic
      else if (/[\u4E00-\u9FFF]/.test(text)) detectedLanguage = "zh"; // Chinese
      else if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text))
        detectedLanguage = "ja"; // Japanese
      else if (/[\uAC00-\uD7AF]/.test(text)) detectedLanguage = "ko"; // Korean
      else if (/[\u0400-\u04FF]/.test(text)) detectedLanguage = "ru"; // Russian
      else if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/.test(text.toLowerCase())) {
        // Romance languages - simplified detection
        if (/[ñ¿¡]/.test(text)) detectedLanguage = "es"; // Spanish
        else if (/[àâçéèêëîïôùûüÿ]/.test(text.toLowerCase()))
          detectedLanguage = "fr"; // French
        else if (/[äöüß]/.test(text.toLowerCase()))
          detectedLanguage = "de"; // German
        else if (/[àèéìíîòóù]/.test(text.toLowerCase()))
          detectedLanguage = "it"; // Italian
        else if (/[ãçõ]/.test(text.toLowerCase())) detectedLanguage = "pt"; // Portuguese
      }

      return NextResponse.json({ language: detectedLanguage });
    }

    // Use Gemini API for more accurate language detection
    const prompt = `Detect the language of this text and respond with only the ISO 639-1 language code (2 letters): "${text}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.statusText}`);
    }

    const data = await response.json();
    const detectedLanguage = data.candidates[0].content.parts[0].text
      .trim()
      .toLowerCase();

    // Validate the response is a valid language code
    const validLanguageCodes = [
      "en",
      "es",
      "fr",
      "de",
      "it",
      "pt",
      "ru",
      "ja",
      "ko",
      "zh",
      "ar",
      "hi",
      "nl",
      "sv",
      "pl",
    ];
    const language = validLanguageCodes.includes(detectedLanguage)
      ? detectedLanguage
      : "en";

    return NextResponse.json({ language });
  } catch (error) {
    console.error("Language detection API error:", error);
    return NextResponse.json(
      { error: "Failed to detect language" },
      { status: 500 }
    );
  }
}
