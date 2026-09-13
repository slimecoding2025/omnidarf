// app/api/transform/route.ts

import { NextRequest, NextResponse } from "next/server";
import { jsonrepair } from "jsonrepair";
import type { ContentKit, TransformRequest, TransformResponse } from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const DEFAULT_MODEL = "inclusionai/ling-3.0-flash-fin:free";

// Site metadata OpenRouter uses for free-tier attribution / rankings.
// Update these to match your deployed domain and app name.
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://omnidarf.vercel.app/";
const SITE_NAME = "OmniDraft AI";

/* ------------------------------------------------------------------ */
/*  System Prompt                                                      */
/* ------------------------------------------------------------------ */

const SYSTEM_PROMPT = `You are OmniDraft AI, an expert content strategist, scriptwriter, and prompt engineer.

Your job: transform the user's raw text, article, or topic into a complete multi-format content kit.

CRITICAL OUTPUT RULES:
- Respond with ONLY raw, valid JSON. No markdown code fences, no backticks, no "json" language tag, no commentary before or after.
- Do NOT wrap the JSON in \`\`\`json or \`\`\`.
- Do NOT include trailing commas.
- Do NOT truncate the JSON. Every object and array must be fully closed.
- All string values must be properly escaped for JSON.

The JSON object MUST match this exact TypeScript shape:

{
  "title": string,                          // short (max 8 words) title summarizing the source content
  "socialMedia": {
    "twitterThread": string[],               // 4-7 short tweets, thread order, each under 260 chars, no numbering prefix needed
    "linkedInPost": string,                  // a longer-form professional post, 3-6 short paragraphs, plain text with line breaks (\\n)
    "instagramCaption": string,               // punchy caption with line breaks (\\n), emojis allowed, ends before hashtags
    "hashtags": string[]                      // 8-15 relevant hashtags WITHOUT the "#" symbol
  },
  "videoScript": {
    "hook": string,                           // first 3 seconds, scroll-stopping opening line
    "body": [
      {
        "timestamp": string,                  // e.g. "0:03 - 0:10"
        "visual": string,                     // on-screen direction / b-roll / scene description
        "narration": string                   // voiceover or on-camera script line for this beat
      }
      // 4-8 beats total covering the full script
    ],
    "callToAction": string,                   // final line telling viewer what to do next
    "estimatedDurationSeconds": number         // total estimated runtime, typically 30-90
  },
  "flashcards": [
    {
      "id": string,                           // short unique id like "fc-1"
      "title": string,                        // short heading, max 6 words
      "content": string                       // 1-3 sentence bite-sized takeaway
    }
    // 5-8 flashcards total
  ],
  "visualPrompts": [
    {
      "id": string,                           // short unique id like "vp-1"
      "prompt": string,                       // full ready-to-paste Midjourney/DALL-E prompt with style, lighting, composition detail
      "style": string                         // short label like "Cinematic photography" or "Flat vector illustration"
    }
    // 4-6 distinct visual prompts covering different angles/formats
  ]
}

Return ONLY this JSON object and nothing else.`;

/* ------------------------------------------------------------------ */
/*  JSON Extraction + Repair Utilities                                 */
/* ------------------------------------------------------------------ */

/**
 * Strips markdown code fences and isolates the outermost { ... } block.
 */
function extractJsonCandidate(raw: string): string {
  let text = raw.trim();

  // Remove ```json ... ``` or ``` ... ``` fences anywhere in the string
  text = text.replace(/```json/gi, "```").replace(/```/g, "").trim();

  // Some models prepend chatty preamble like "Here is the JSON:" — cut to first brace
  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    text = text.substring(firstBrace, lastBrace + 1);
  }

  return text.trim();
}

/**
 * Attempts common repairs for near-valid JSON:
 * - trailing commas before } or ]
 * - unbalanced / truncated braces & brackets (closes them out)
 * - smart quotes swapped for straight quotes
 */
function repairJson(text: string): string {
  let repaired = text;

  // Normalize smart quotes that some models emit
  repaired = repaired
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2018\u2019]/g, "'");

  // Remove trailing commas before closing brackets/braces
  repaired = repaired.replace(/,(\s*[}\]])/g, "$1");

  // Count brace/bracket balance and append closers if the output was truncated
  const openBraces = (repaired.match(/{/g) || []).length;
  const closeBraces = (repaired.match(/}/g) || []).length;
  const openBrackets = (repaired.match(/\[/g) || []).length;
  const closeBrackets = (repaired.match(/\]/g) || []).length;

  // If the string ends mid-value (e.g. truncated inside a quoted string),
  // try closing an unterminated string first by checking for an odd number
  // of unescaped double quotes.
  const quoteMatches = repaired.match(/(?<!\\)"/g) || [];
  if (quoteMatches.length % 2 !== 0) {
    repaired += '"';
  }

  if (openBrackets > closeBrackets) {
    repaired += "]".repeat(openBrackets - closeBrackets);
  }
  if (openBraces > closeBraces) {
    repaired += "}".repeat(openBraces - closeBraces);
  }

  return repaired;
}

/**
 * Safely parses raw LLM text into a JS object, attempting extraction
 * and repair passes before giving up.
 */
function safeParseContentKit(raw: string): ContentKit {
  const candidate = extractJsonCandidate(raw);

  // Attempt 1: parse as-is
  try {
    return JSON.parse(candidate) as ContentKit;
  } catch {
    // continue to repair attempt
  }

  // Attempt 2: our lightweight repair pass, then parse
  try {
    const repaired = repairJson(candidate);
    return JSON.parse(repaired) as ContentKit;
  } catch {
    // continue to the stronger repair library
  }

  // Attempt 3: `jsonrepair` handles the messier cases some free models
  // produce — unescaped control characters, stray newlines inside strings,
  // missing commas between array elements, single quotes, etc.
  try {
    const strongRepair = jsonrepair(candidate);
    return JSON.parse(strongRepair) as ContentKit;
  } catch (err) {
    throw new Error(
      `Unable to parse AI response as valid JSON after repair attempts: ${
        (err as Error).message
      }`
    );
  }
}

/**
 * Light structural validation so the frontend never crashes on a
 * technically-valid-but-wrong-shape JSON payload.
 */
function validateContentKit(data: unknown): data is ContentKit {
  if (!data || typeof data !== "object") return false;
  const d = data as Record<string, unknown>;

  const hasSocial =
    !!d.socialMedia &&
    typeof d.socialMedia === "object" &&
    Array.isArray((d.socialMedia as any).twitterThread);

  const hasVideo =
    !!d.videoScript &&
    typeof d.videoScript === "object" &&
    Array.isArray((d.videoScript as any).body);

  const hasFlashcards = Array.isArray(d.flashcards);
  const hasVisuals = Array.isArray(d.visualPrompts);

  return hasSocial && hasVideo && hasFlashcards && hasVisuals;
}

/* ------------------------------------------------------------------ */
/*  Route Handler                                                      */
/* ------------------------------------------------------------------ */

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json<TransformResponse>(
        {
          success: false,
          error:
            "Server misconfiguration: OPENROUTER_API_KEY is not set in the environment.",
        },
        { status: 500 }
      );
    }

    const body = (await req.json()) as TransformRequest;
    const { input, inputType, locale, model } = body;

    if (!input || typeof input !== "string" || input.trim().length < 3) {
      return NextResponse.json<TransformResponse>(
        { success: false, error: "Please provide valid input text, a URL, or a topic." },
        { status: 400 }
      );
    }

    const userPrompt = `Source input type: ${inputType || "text"}
Source content:
"""
${input.trim().slice(0, 12000)}
"""

Generate the full OmniDraft AI content kit as specified in the system prompt.`;
    const languageInstruction = locale && locale !== "en"
      ? `Write every generated title and content field in ${locale === "ar" ? "Arabic" : locale === "de" ? "German" : locale === "fr" ? "French" : "Italian"}. Keep the JSON keys exactly as specified.`
      : "Write the generated content in English.";
    const localizedUserPrompt = `${userPrompt}\n\n${languageInstruction}`;

    const callModel = async (temperature: number) => {
      const res = await fetch(OPENROUTER_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "HTTP-Referer": SITE_URL,
          "X-Title": SITE_NAME,
        },
        body: JSON.stringify({
          model: model || DEFAULT_MODEL,
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: localizedUserPrompt },
          ],
          temperature,
          max_tokens: 4000,
        }),
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => "");
        throw new Error(
          `OpenRouter request failed (${res.status}): ${errText || res.statusText}`
        );
      }

      const completion = await res.json();
      const rawContent: string | undefined =
        completion?.choices?.[0]?.message?.content;

      if (!rawContent) {
        throw new Error("The model returned an empty response.");
      }

      return rawContent;
    };

    let rawContent: string;
    try {
      rawContent = await callModel(0.7);
    } catch (err) {
      return NextResponse.json<TransformResponse>(
        { success: false, error: (err as Error).message },
        { status: 502 }
      );
    }

    let contentKit: ContentKit;
    try {
      contentKit = safeParseContentKit(rawContent);
    } catch (firstParseError) {
      // Malformed JSON is often a one-off model hiccup — retry once with
      // temperature 0 (more deterministic) before giving up entirely.
      try {
        rawContent = await callModel(0);
        contentKit = safeParseContentKit(rawContent);
      } catch (retryError) {
        return NextResponse.json<TransformResponse>(
          {
            success: false,
            error: `Failed to parse the AI response as JSON, even after a retry. ${
              (retryError as Error).message
            }`,
            raw: rawContent.slice(0, 4000),
          },
          { status: 502 }
        );
      }
    }

    if (!validateContentKit(contentKit)) {
      return NextResponse.json<TransformResponse>(
        {
          success: false,
          error:
            "The AI response was valid JSON but did not match the expected content kit shape.",
          raw: rawContent.slice(0, 4000),
        },
        { status: 502 }
      );
    }

    return NextResponse.json<TransformResponse>({
      success: true,
      data: contentKit,
    });
  } catch (err) {
    return NextResponse.json<TransformResponse>(
      {
        success: false,
        error: `Unexpected server error: ${(err as Error).message}`,
      },
      { status: 500 }
    );
  }
}