import createHttpError from 'http-errors';

const GEMINI_API_KEY =
  process.env.GEMINI_API_KEY ||
  process.env.GOOGLE_API_KEY ||
  process.env.OPEN_AI_KEY;
const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

type GeminiPart = { text?: string };
type GeminiContent = { parts?: GeminiPart[] };
type GeminiCandidate = { content?: GeminiContent };
type GeminiResponse = {
  candidates?: GeminiCandidate[];
  promptFeedback?: {
    blockReason?: string;
  };
  error?: {
    code?: number;
    message?: string;
    status?: string;
  };
};

const buildGeminiRequestBody = (prompt: string) => ({
  contents: [
    {
      role: 'user',
      parts: [{ text: prompt }]
    }
  ]
});

const extractGeminiText = (payload: GeminiResponse): string => {
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

export const generateByOpenAI = async (prompt: string): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw createHttpError(500, 'Gemini API key is not configured');
  }

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    DEFAULT_MODEL
  )}:generateContent?key=${GEMINI_API_KEY}`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiRequestBody(prompt))
  });

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    const message =
      data?.error?.message ||
      data?.promptFeedback?.blockReason ||
      response.statusText ||
      'Unknown Gemini error';
    const err = createHttpError(response.status, message);
    (err as any).code =
      data?.error?.status || data?.error?.code || response.status;
    throw err;
  }

  const text = extractGeminiText(data);
  if (!text) {
    throw createHttpError(502, 'Gemini returned an empty response');
  }

  return text;
};
