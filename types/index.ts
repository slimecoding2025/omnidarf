// types/index.ts

/** ---------- Social Media Kit ---------- */
export interface SocialMediaKit {
  twitterThread: string[]; // array of individual tweet strings (thread order)
  linkedInPost: string;
  instagramCaption: string;
  hashtags: string[];
}

/** ---------- Video / Reels Script ---------- */
export interface VideoScriptBeat {
  timestamp: string; // e.g. "0:00 - 0:05"
  visual: string; // on-screen direction / b-roll / scene note
  narration: string; // voiceover / on-camera line
}

export interface VideoScript {
  hook: string; // first 3 seconds, attention grabber
  body: VideoScriptBeat[]; // timed beats
  callToAction: string;
  estimatedDurationSeconds: number;
}

/** ---------- Key Takeaways / Flashcards ---------- */
export interface Flashcard {
  id: string;
  title: string;
  content: string;
}

/** ---------- Visual / Image Generation Prompts ---------- */
export interface VisualPrompt {
  id: string;
  prompt: string; // ready-to-paste Midjourney/DALL-E prompt
  style: string; // e.g. "Cinematic photography", "Flat vector illustration"
}

/** ---------- Aggregate Content Kit ---------- */
export interface ContentKit {
  title: string; // short generated title summarizing the source content
  socialMedia: SocialMediaKit;
  videoScript: VideoScript;
  flashcards: Flashcard[];
  visualPrompts: VisualPrompt[];
}

/** ---------- API Request / Response Contracts ---------- */
export type InputType = "text" | "url" | "topic";

export interface TransformRequest {
  input: string;
  inputType?: InputType;
  model?: string; // optional OpenRouter model override
}

export interface TransformResponse {
  success: boolean;
  data?: ContentKit;
  error?: string;
  raw?: string; // raw model output, only included on parse failure, for debugging
}

/** ---------- UI Helper Types ---------- */
export type OutputTabKey = "social" | "video" | "flashcards" | "visuals";

export interface TemplateShortcut {
  id: string;
  label: string;
  description: string;
  samplePrompt: string;
}
