import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, sourceLanguage } = await request.json();

    // Use Google Gemini API for translation
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    // For Gemini API, we need to construct a clear prompt for translation
    const prompt = `You are a professional translator. Translate the following text from ${
      sourceLanguage === "auto" ? "the detected language" : sourceLanguage
    } to ${targetLanguage}. Return ONLY the translated text without any explanations, prefixes, or additional content.\n\nText to translate: "${text}"`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
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
    let translatedText = data.candidates[0]?.content?.parts?.[0]?.text;

    // Clean up the response - remove quotes and trim whitespace
    if (translatedText) {
      translatedText = translatedText.replace(/^["']|["']$/g, "").trim();
    }

    return NextResponse.json({ translatedText: translatedText || text });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Failed to translate text" },
      { status: 500 }
    );
  }
}
