import "server-only";

import {
  GoogleGenAI,
  createUserContent,
  createPartFromUri,
} from "@google/genai";

const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

// Gemini rejects very large inline payloads; above this we upload via the File
// API instead of inlining base64 audio.
const INLINE_LIMIT_BYTES = 18 * 1024 * 1024;

function readEnv(name: string) {
  const raw = process.env[name];
  if (raw == null) return "";
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1).trim();
  }
  return value;
}

function getClient() {
  // Accept both spellings; Linux env vars are case-sensitive.
  const apiKey = readEnv("GEMINI_API_KEY") || readEnv("Gemini_API_KEY");
  if (!apiKey) {
    throw new Error(
      "Gemini is not configured. Add GEMINI_API_KEY to .env, then restart the server.",
    );
  }
  return new GoogleGenAI({ apiKey });
}

const PROMPT = [
  "You are given the audio track of a course lesson video.",
  "1. Transcribe the spoken content accurately.",
  "2. Then write a clear, student-friendly summary of the lesson in 4-8 sentences",
  "   covering the main ideas and key takeaways.",
  "Respond ONLY with minified JSON of the exact shape:",
  '{"transcript": "...", "summary": "..."}',
  "Do not wrap the JSON in markdown code fences.",
].join("\n");

export type LessonSummaryResult = {
  transcript: string;
  summary: string;
};

function parseResult(text: string): LessonSummaryResult {
  const cleaned = text
    .trim()
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  let parsed: unknown;
  try {
    parsed = JSON.parse(cleaned);
  } catch {
    throw new Error("Gemini returned a response that was not valid JSON.");
  }

  const record = parsed as Record<string, unknown>;
  const transcript =
    typeof record.transcript === "string" ? record.transcript.trim() : "";
  const summary =
    typeof record.summary === "string" ? record.summary.trim() : "";

  if (!summary) {
    throw new Error("Gemini did not return a summary.");
  }

  return { transcript, summary };
}

async function uploadAndWait(
  ai: GoogleGenAI,
  blob: Blob,
  mimeType: string,
) {
  let file = await ai.files.upload({ file: blob, config: { mimeType } });

  const started = Date.now();
  while (file.state === "PROCESSING") {
    if (Date.now() - started > 120_000) {
      throw new Error("Gemini file processing timed out.");
    }
    await new Promise((resolve) => setTimeout(resolve, 2_000));
    if (!file.name) break;
    file = await ai.files.get({ name: file.name });
  }

  if (file.state === "FAILED") {
    throw new Error("Gemini could not process the audio file.");
  }
  if (!file.uri || !file.mimeType) {
    throw new Error("Gemini did not return a usable file reference.");
  }

  return createPartFromUri(file.uri, file.mimeType);
}

/**
 * Transcribe and summarize a lesson from its audio bytes using Gemini.
 * Uses inline data for small clips and the File API for larger audio.
 */
export async function summarizeLessonAudio(
  audioBytes: ArrayBuffer,
  mimeType = "audio/mp3",
): Promise<LessonSummaryResult> {
  const ai = getClient();
  const bytes = new Uint8Array(audioBytes);

  const audioPart =
    bytes.byteLength > INLINE_LIMIT_BYTES
      ? await uploadAndWait(ai, new Blob([bytes], { type: mimeType }), mimeType)
      : {
          inlineData: {
            mimeType,
            data: Buffer.from(bytes).toString("base64"),
          },
        };

  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: createUserContent([audioPart, PROMPT]),
    config: { responseMimeType: "application/json" },
  }).catch((error: unknown) => {
    const text = error instanceof Error ? error.message : String(error);
    if (/429|RESOURCE_EXHAUSTED|quota/i.test(text)) {
      throw new Error(
        `Gemini quota exceeded for model “${GEMINI_MODEL}”. Free tier may be empty for this model — wait a few minutes, enable billing in Google AI Studio, or set GEMINI_MODEL=gemini-2.5-flash-lite in .env.`,
      );
    }
    throw error;
  });

  const text = response.text;
  if (!text) {
    throw new Error("Gemini returned an empty response.");
  }

  return parseResult(text);
}
