import {
  type Content,
  type GenerateContentResponse,
  GoogleGenAI
} from '@google/genai';
import createHttpError from 'http-errors';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let geminiClient: GoogleGenAI | null = null;

const getGeminiClient = () => {
  if (!GEMINI_API_KEY) {
    throw createHttpError(500, 'Gemini API key is not configured');
  }

  if (!geminiClient) {
    geminiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  }

  return geminiClient;
};

const buildGeminiContents = (prompt: string): Content[] => [
  {
    role: 'user',
    parts: [{ text: prompt }]
  }
];

const extractGeminiText = (payload: GenerateContentResponse): string => {
  const collectRawText = () => {
    const getterText = payload.text?.trim();
    if (getterText) return getterText;

    if (!payload.candidates?.length) return '';

    return payload.candidates
      .map(candidate =>
        candidate.content?.parts
          ?.map(part => part.text?.trim())
          .filter(Boolean)
          .join('\n')
      )
      .filter(Boolean)
      .join('\n')
      .trim();
  };

  const rawText = collectRawText();
  if (!rawText) return '';

  const codeBlockMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidateJson = (codeBlockMatch?.[1] ?? rawText).trim();
  if (!candidateJson) return '';

  try {
    const parsed = JSON.parse(candidateJson);
    return JSON.stringify(parsed);
  } catch {
    try {
      const cleaned = rawText
        .replace(/```(?:json)?/gi, '')
        .replace(/```/g, '')
        .trim();
      if (!cleaned) return '';
      const parsed = JSON.parse(cleaned);
      return JSON.stringify(parsed);
    } catch {
      return candidateJson;
    }
  }
};

const buildGeminiError = (error: unknown) => {
  const fallbackMessage = 'Gemini request failed';

  if (error instanceof Error) {
    const statusCandidate = (error as any)?.status;
    const numericStatus =
      typeof statusCandidate === 'number'
        ? statusCandidate
        : typeof statusCandidate === 'string' &&
            !Number.isNaN(Number(statusCandidate))
          ? Number(statusCandidate)
          : 502;

    const httpError = createHttpError(
      Number.isFinite(numericStatus) ? numericStatus : 502,
      error.message || fallbackMessage
    );
    const code = (error as any)?.code ?? statusCandidate;
    if (code) {
      (httpError as any).code = code;
    }
    return httpError;
  }

  return createHttpError(502, fallbackMessage);
};

export const generateByOpenAI = async (prompt: string): Promise<string> => {
  const trimmedPrompt = prompt?.trim();

  if (!trimmedPrompt) {
    throw createHttpError(400, 'Prompt cannot be empty');
  }

  try {
    const response = await getGeminiClient().models.generateContent({
      model: DEFAULT_MODEL,
      contents: buildGeminiContents(trimmedPrompt)
    });

    if (response.promptFeedback?.blockReason) {
      const err = createHttpError(403, response.promptFeedback.blockReason);
      (err as any).code = response.promptFeedback.blockReason;
      throw err;
    }

    const text = extractGeminiText(response);

    if (!text) {
      throw createHttpError(502, 'Gemini returned an empty response');
    }

    return text;
  } catch (error) {
    throw buildGeminiError(error);
  }
};
