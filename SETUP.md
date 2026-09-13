# OmniDraft AI — Setup

## 1. Install Node.js

Install the current LTS release of Node.js from https://nodejs.org/, then close
and reopen PowerShell. Confirm that both commands work:

```powershell
node --version
npm --version
```

This repository already contains the Next.js project scaffold, so do not run
`create-next-app` from inside this directory. That command would create an
unwanted nested `omnidraft-ai` folder.

## 2. Install dependencies

```powershell
npm install framer-motion lucide-react
```

The UI primitives used by the page are already included in
`components/ui`, so shadcn initialization is optional.

## 3. Environment variables

```bash
npx shadcn@latest init
npx shadcn@latest add button textarea card badge tabs
```

This generates `@/components/ui/{button,textarea,card,badge,tabs}.tsx` and the
`cn()` helper the pages in this kit rely on.

Create `.env.local` in your project root:

```bash
OPENROUTER_API_KEY=sk-or-v1-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Get a free key at https://openrouter.ai/keys. The API route defaults to the
`"openrouter/auto"` model, which routes to an available model automatically —
swap in any specific free model slug (e.g. a `:free` suffixed model on
OpenRouter) by passing `model` in the request body from the client if you want
to pin one.

## 4. Run it

```powershell
npm run dev
```

Visit `http://localhost:3000`, paste in text (or click a template shortcut),
and click **Generate content kit**.

## Notes

- The API route (`app/api/transform/route.ts`) does all the heavy lifting:
  it prompts the model for strict JSON, then runs it through an extraction +
  repair pipeline (`extractJsonCandidate` → `repairJson`) before validating
  the shape with `validateContentKit`. If parsing still fails, it returns
  `{ success: false, error, raw }` so the frontend can show a clear error
  instead of crashing.
- The frontend (`app/page.tsx`) never trusts the API blindly — it checks
  `json.success` before touching `json.data`, and shows a dismissible error
  card on failure so a bad generation never breaks the UI.
- `buildMarkdown()` powers both **Copy all** and **Export .md**, so the two
  actions always stay in sync with what's on screen.
- Some free OpenRouter models are more prone to truncating long JSON. If you
  see frequent parse failures, either lower `max_tokens` expectations by
  trimming input length, or pin a specific reliable free model instead of
  `"openrouter/auto"`.
