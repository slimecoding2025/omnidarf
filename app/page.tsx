"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Wand2,
  Copy,
  Check,
  Download,
  Loader2,
  AlertCircle,
  Twitter,
  Linkedin,
  Instagram,
  Clapperboard,
  Layers,
  ImageIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import type {
  ContentKit,
  OutputTabKey,
  TemplateShortcut,
  TransformResponse,
} from "@/types";

/* ------------------------------------------------------------------ */
/*  Static Config                                                      */
/* ------------------------------------------------------------------ */

const TEMPLATES: TemplateShortcut[] = [
  {
    id: "blog",
    label: "Blog post → kit",
    description: "Paste an article and get every format at once",
    samplePrompt:
      "Remote work increases productivity for focused tasks but hurts spontaneous collaboration. Teams that mix 3 in-office days with async-first documentation see the best of both worlds.",
  },
  {
    id: "product",
    label: "Product launch",
    description: "Turn a feature list into launch-day content",
    samplePrompt:
      "We're launching OmniDraft AI: paste any text and instantly get social posts, a video script, flashcard takeaways, and image prompts. Built for solo creators and small marketing teams who don't have time to repurpose content by hand.",
  },
  {
    id: "news",
    label: "News summary",
    description: "Condense a news topic into a shareable kit",
    samplePrompt:
      "Summarize the shift toward on-device AI models: smaller models running locally on phones are reducing latency and cost, but still lag behind cloud models on complex reasoning tasks.",
  },
  {
    id: "topic",
    label: "Just a topic",
    description: "Start from a single idea, no source text needed",
    samplePrompt: "The habit of journaling for mental clarity",
  },
];

const TABS: { key: OutputTabKey; label: string; icon: React.ElementType }[] = [
  { key: "social", label: "Social Kit", icon: Twitter },
  { key: "video", label: "Video Script", icon: Clapperboard },
  { key: "flashcards", label: "Takeaways", icon: Layers },
  { key: "visuals", label: "Visual Prompts", icon: ImageIcon },
];

const PROGRESS_STEPS = [
  "Reading your source",
  "Drafting social formats",
  "Storyboarding the script",
  "Distilling key takeaways",
  "Writing visual prompts",
];

/* ------------------------------------------------------------------ */
/*  Small Reusable Bits                                                */
/* ------------------------------------------------------------------ */

function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // clipboard may be unavailable (e.g. insecure context) — fail silently in UI
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-medium text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : label}
    </button>
  );
}

function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="text-sm text-muted-foreground">{eyebrow}</p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{title}</h2>
      </div>
      {action}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Output Tab: Social Media Kit                                       */
/* ------------------------------------------------------------------ */

function SocialKitView({ kit }: { kit: ContentKit }) {
  const { socialMedia } = kit;
  const hashtagLine = socialMedia.hashtags.map((h) => `#${h}`).join(" ");

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <Card className="border-border/60">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Twitter className="h-4 w-4 text-sky-500" /> X / Twitter thread
            </div>
            <CopyButton text={socialMedia.twitterThread.join("\n\n")} />
          </div>
          <ol className="space-y-3">
            {socialMedia.twitterThread.map((tweet, i) => (
              <li
                key={i}
                className="rounded-lg border border-border/60 bg-muted/30 p-3 text-sm leading-relaxed"
              >
                <span className="mr-1.5 text-xs text-muted-foreground">{i + 1}/</span>
                {tweet}
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn post
            </div>
            <CopyButton text={socialMedia.linkedInPost} />
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {socialMedia.linkedInPost}
          </p>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardContent className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Instagram className="h-4 w-4 text-pink-500" /> Instagram caption
            </div>
            <CopyButton text={`${socialMedia.instagramCaption}\n\n${hashtagLine}`} />
          </div>
          <p className="whitespace-pre-line text-sm leading-relaxed text-foreground/90">
            {socialMedia.instagramCaption}
          </p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {socialMedia.hashtags.map((tag) => (
              <Badge key={tag} variant="secondary" className="rounded-full font-normal">
                #{tag}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Output Tab: Video / Reels Script                                   */
/* ------------------------------------------------------------------ */

function VideoScriptView({ kit }: { kit: ContentKit }) {
  const { videoScript } = kit;

  const fullScript = [
    `HOOK: ${videoScript.hook}`,
    ...videoScript.body.map(
      (b) => `[${b.timestamp}]\nVisual: ${b.visual}\nNarration: ${b.narration}`
    ),
    `CTA: ${videoScript.callToAction}`,
  ].join("\n\n");

  return (
    <Card className="border-border/60">
      <CardContent className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <div className="text-sm text-muted-foreground">
              Estimated runtime · {videoScript.estimatedDurationSeconds}s
            </div>
          </div>
          <CopyButton text={fullScript} label="Copy full script" />
        </div>

        <div className="mb-6 rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-amber-600">Hook</p>
          <p className="mt-1 text-base font-medium leading-snug">{videoScript.hook}</p>
        </div>

        <div className="relative space-y-0 border-l border-border/70 pl-6">
          {videoScript.body.map((beat, i) => (
            <div key={i} className="relative pb-7 last:pb-0">
              <span className="absolute -left-[29px] top-1 h-3 w-3 rounded-full border-2 border-background bg-foreground/70" />
              <p className="text-xs font-medium text-muted-foreground">{beat.timestamp}</p>
              <p className="mt-1 text-sm">
                <span className="font-medium text-foreground/80">Visual — </span>
                {beat.visual}
              </p>
              <p className="mt-1 text-sm">
                <span className="font-medium text-foreground/80">Narration — </span>
                {beat.narration}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-2 rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-emerald-600">
            Call to action
          </p>
          <p className="mt-1 text-base font-medium leading-snug">{videoScript.callToAction}</p>
        </div>
      </CardContent>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/*  Output Tab: Flashcards                                             */
/* ------------------------------------------------------------------ */

function FlashcardsView({ kit }: { kit: ContentKit }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {kit.flashcards.map((card) => (
        <Card key={card.id} className="border-border/60">
          <CardContent className="flex h-full flex-col justify-between gap-4 p-5">
            <div>
              <h3 className="text-sm font-semibold leading-snug">{card.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {card.content}
              </p>
            </div>
            <div className="flex justify-end">
              <CopyButton text={`${card.title}\n${card.content}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Output Tab: Visual Prompts                                         */
/* ------------------------------------------------------------------ */

function VisualPromptsView({ kit }: { kit: ContentKit }) {
  return (
    <div className="space-y-4">
      {kit.visualPrompts.map((vp) => (
        <Card key={vp.id} className="border-border/60">
          <CardContent className="p-5">
            <div className="mb-2 flex items-center justify-between gap-3">
              <Badge variant="outline" className="rounded-full font-normal">
                {vp.style}
              </Badge>
              <CopyButton text={vp.prompt} />
            </div>
            <p className="font-mono text-sm leading-relaxed text-foreground/90">{vp.prompt}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Markdown Export                                                     */
/* ------------------------------------------------------------------ */

function buildMarkdown(kit: ContentKit): string {
  const hashtagLine = kit.socialMedia.hashtags.map((h) => `#${h}`).join(" ");

  return `# ${kit.title}

## Social Media Kit

### X / Twitter Thread
${kit.socialMedia.twitterThread.map((t, i) => `${i + 1}. ${t}`).join("\n")}

### LinkedIn Post
${kit.socialMedia.linkedInPost}

### Instagram Caption
${kit.socialMedia.instagramCaption}

${hashtagLine}

## Video / Reels Script

**Hook:** ${kit.videoScript.hook}

${kit.videoScript.body
  .map((b) => `- **${b.timestamp}**\n  - Visual: ${b.visual}\n  - Narration: ${b.narration}`)
  .join("\n")}

**Call to action:** ${kit.videoScript.callToAction}
_Estimated duration: ${kit.videoScript.estimatedDurationSeconds}s_

## Key Takeaways

${kit.flashcards.map((c) => `- **${c.title}** — ${c.content}`).join("\n")}

## Visual Prompts

${kit.visualPrompts.map((v) => `- (${v.style}) ${v.prompt}`).join("\n")}
`;
}

function downloadMarkdown(kit: ContentKit) {
  const md = buildMarkdown(kit);
  const blob = new Blob([md], { type: "text/markdown;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${kit.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 60)}.md`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/* ------------------------------------------------------------------ */
/*  Main Page                                                           */
/* ------------------------------------------------------------------ */

export default function OmniDraftPage() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [kit, setKit] = useState<ContentKit | null>(null);
  const [activeTab, setActiveTab] = useState<OutputTabKey>("social");

  const charCount = input.length;
  const canSubmit = input.trim().length >= 3 && !loading;

  const allContentText = useMemo(() => (kit ? buildMarkdown(kit) : ""), [kit]);

  async function handleGenerate() {
    if (!canSubmit) return;
    setLoading(true);
    setError(null);
    setKit(null);
    setProgressStep(0);

    // Lightweight simulated progress while the real request is in flight —
    // gives the user a sense of motion during a potentially slow model call.
    const progressInterval = setInterval(() => {
      setProgressStep((prev) => (prev < PROGRESS_STEPS.length - 1 ? prev + 1 : prev));
    }, 1400);

    try {
      const res = await fetch("/api/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input, inputType: "text" }),
      });

      const json: TransformResponse = await res.json();

      if (!json.success || !json.data) {
        setError(json.error || "Something went wrong generating your content kit.");
        return;
      }

      setKit(json.data);
      setActiveTab("social");
    } catch (err) {
      setError((err as Error).message || "Network error. Please try again.");
    } finally {
      clearInterval(progressInterval);
      setLoading(false);
      setProgressStep(0);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <header className="mb-10 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground text-background">
              <Wand2 className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">OmniDraft AI</span>
          </div>
          <a
            href="https://openrouter.ai"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            Powered by mouhamed salim bousmina
          </a>
        </header>

        {/* Input Console */}
        <section className="mb-12">
          <SectionHeading
            eyebrow="Step one"
            title="Paste your source, or a single idea"
          />

          <div className="rounded-2xl border border-border bg-card p-4 shadow-sm">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste an article, raw notes, a link, or just describe a topic — e.g. 'why async communication beats meetings for remote teams'"
              className="min-h-[160px] resize-none border-none bg-transparent p-2 text-base shadow-none focus-visible:ring-0"
            />
            <div className="mt-2 flex items-center justify-between border-t border-border/60 pt-3">
              <span className="text-xs text-muted-foreground">{charCount} characters</span>
              <Button
                onClick={handleGenerate}
                disabled={!canSubmit}
                className="gap-2 rounded-full px-5"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    Generate content kit
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Template shortcuts */}
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => setInput(tpl.samplePrompt)}
                disabled={loading}
                className="group rounded-xl border border-border/60 bg-card p-3.5 text-left transition-colors hover:border-foreground/30 disabled:opacity-50"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{tpl.label}</span>
                  <ArrowRight className="h-3.5 w-3.5 -translate-x-1 text-muted-foreground opacity-0 transition-all group-hover:translate-x-0 group-hover:opacity-100" />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">{tpl.description}</p>
              </button>
            ))}
          </div>

          {/* Progress indicator */}
          <AnimatePresence>
            {loading && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-5 overflow-hidden"
              >
                <div className="rounded-xl border border-border/60 bg-card p-4">
                  <div className="mb-2 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <motion.div
                      className="h-full rounded-full bg-foreground"
                      initial={{ width: "5%" }}
                      animate={{
                        width: `${((progressStep + 1) / PROGRESS_STEPS.length) * 100}%`,
                      }}
                      transition={{ duration: 0.6, ease: "easeInOut" }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {PROGRESS_STEPS[progressStep]}…
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error state */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="mt-5 flex items-start gap-2.5 rounded-xl border border-destructive/30 bg-destructive/5 p-4"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-destructive" />
                <div>
                  <p className="text-sm font-medium text-destructive">Generation failed</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">{error}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {/* Output Hub */}
        <AnimatePresence>
          {kit && (
            <motion.section
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <SectionHeading
                eyebrow="Step two"
                title={kit.title}
                action={
                  <div className="flex gap-2">
                    <CopyButton text={allContentText} label="Copy all" />
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5 rounded-full"
                      onClick={() => downloadMarkdown(kit)}
                    >
                      <Download className="h-3.5 w-3.5" />
                      Export .md
                    </Button>
                  </div>
                }
              />

              <Tabs
                value={activeTab}
                onValueChange={(v) => setActiveTab(v as OutputTabKey)}
              >
                <TabsList className="mb-6 w-full justify-start gap-1 bg-transparent p-0">
                  {TABS.map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <TabsTrigger
                        key={tab.key}
                        value={tab.key}
                        className="gap-1.5 rounded-full border border-border/60 data-[state=active]:border-foreground data-[state=active]:bg-foreground data-[state=active]:text-background"
                      >
                        <Icon className="h-3.5 w-3.5" />
                        {tab.label}
                      </TabsTrigger>
                    );
                  })}
                </TabsList>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                  >
                    <TabsContent value="social" forceMount={activeTab === "social" ? true : undefined}>
                      {activeTab === "social" && <SocialKitView kit={kit} />}
                    </TabsContent>
                    <TabsContent value="video" forceMount={activeTab === "video" ? true : undefined}>
                      {activeTab === "video" && <VideoScriptView kit={kit} />}
                    </TabsContent>
                    <TabsContent
                      value="flashcards"
                      forceMount={activeTab === "flashcards" ? true : undefined}
                    >
                      {activeTab === "flashcards" && <FlashcardsView kit={kit} />}
                    </TabsContent>
                    <TabsContent value="visuals" forceMount={activeTab === "visuals" ? true : undefined}>
                      {activeTab === "visuals" && <VisualPromptsView kit={kit} />}
                    </TabsContent>
                  </motion.div>
                </AnimatePresence>
              </Tabs>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
