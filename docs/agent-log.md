# Agent Log — Serintsur Project

This is the shared communication scratchpad between agents. Each agent appends updates here after completing a task or when they need something from another agent.

Format:
```
## [DATE] [AGENT] — [STATUS]
Brief description of what was done or what's needed.
```

---

## 2026-04-16 COORDINATOR — Project Initialized

Documentation package created:
- `CLAUDE.md` — shared context (read this first)
- `docs/brand.md` — colors, typography, visual rules
- `docs/architecture.md` — site structure, components, API specs
- `docs/ai-integrations.md` — chatbot, estimator, edge function specs
- `docs/sanity-schema.md` — CMS content types and GROQ queries
- `docs/agents/designer.md` — Designer role definition
- `docs/agents/backend.md` — Backend role definition
- `docs/agents/content.md` — Content role definition

**All agents**: Read `CLAUDE.md` and your role definition before starting.

**Recommended start order**:
1. Backend Agent: scaffold the project (astro init, packages, config)
2. Content Agent: begin UI strings (ES/EN/DE) — both other agents need these
3. Designer Agent: begin design tokens + BaseLayout once scaffolding exists

**Known dependencies**:
- Designer needs scaffolding from Backend before creating components
- Designer needs UI strings from Content for button labels, nav items
- Backend needs Designer's component interfaces before wiring data
- Content needs schema from Backend to know exact field shapes

---

## 2026-04-16 BACKEND — Scaffolding complete

Astro 5 project is live. `npm install` + `astro check` + `astro build` all pass.

**Created**:
- `package.json` — Astro 5, React 19, Tailwind 4 (via `@tailwindcss/vite`), Vercel adapter v8, Sanity client, Anthropic SDK, Resend, Zod
- `astro.config.mjs` — i18n (es default, en, de; `prefixDefaultLocale: true`, `redirectToDefaultLocale: true`), Vercel adapter with image service, sitemap integration with i18n locales, Tailwind Vite plugin
- `tsconfig.json` — extends `astro/tsconfigs/strict`, JSX for React 19, `~/*` and `@/*` path aliases to `src/*`
- `.gitignore`, `.env.example` — env var contract documented (ANTHROPIC_API_KEY, SANITY_*, RESEND_API_KEY, CONTACT_EMAIL_*, PUBLIC_SITE_URL, PUBLIC_WHATSAPP_NUMBER)
- `src/env.d.ts` — typed `ImportMetaEnv`
- `src/pages/index.astro` — root redirect to `/es/` (required for `redirectToDefaultLocale`)
- `src/pages/es/index.astro` — bare placeholder, **Designer replaces this**
- `src/styles/global.css` — single line `@import "tailwindcss";`. Designer owns all tokens/styles from here on.

**Notes for other agents**:
- **Designer**: Scaffolding is ready. Create `BaseLayout.astro` under `src/layouts/` and import `../styles/global.css` from it so Tailwind loads. Extend `global.css` with brand tokens (custom properties + Tailwind `@theme` block). Replace `src/pages/es/index.astro` placeholder.
- **Content**: Schema work not started yet — that's next in the backend queue (Sanity schemas → `src/lib/sanity.ts` → `src/lib/i18n.ts`). UI string keys are TBD; I'll define them when I build `i18n.ts`.
- **Env vars**: Anyone running dev locally needs to `cp .env.example .env` and fill in keys.
- **Build output**: `static` with Vercel adapter. API routes will opt into SSR via `export const prerender = false;` per file when I build them.

**Next on my queue**: Sanity schema definitions + Studio config, then `src/lib/sanity.ts`.

---

## 2026-04-16 BACKEND — Sanity schema + Studio + client wrapper done

Sanity v4 integrated end-to-end. `astro check` clean, `astro build` produces a Vercel output with Studio mounted at `/studio`.

**Created**:
- `sanity.config.ts` (repo root) — Studio config; singleton enforcement for `siteSettings` via `document.actions` + `schema.templates` + `newDocumentOptions` filters (prevents duplicates / deletion)
- `sanity/schemas/index.ts` — barrel export
- `sanity/schemas/objects/` — `localeString`, `localeText`, `localeBlockContent` (block + image with alt/caption), `seo`
- `sanity/schemas/documents/` — `service`, `project`, `clientLogo`, `testimonial`, `siteSettings` (singleton), `page`. All slug fields source from `title.es`. All images have `alt` fields. Sensible orderings + previews everywhere.
- `sanity/structure.ts` — custom desk: Site Settings (singleton at top) · divider · Servicios, Proyectos, Páginas · divider · Logos de clientes, Testimonios
- `src/lib/sanity.ts` — typed `sanity` + `sanityPreview` clients, `urlForImage` builder, `pickLocale` helper, TypeScript interfaces for every document (`Service`, `Project`, `ClientLogo`, `Testimonial`, `SiteSettings`, `Page`) plus shared types (`LocaleString`, `LocaleText`, `LocaleBlockContent`, `SanityImage`, `SeoFields`, `Province`, `ProjectStatus`), and query helpers: `getSiteSettings`, `getActiveServices`, `getServiceBySlug`, `getFeaturedProjects`, `getProjects(filters)`, `getProjectBySlug`, `getAllProjectSlugs`, `getAllServiceSlugs`, `getActiveClientLogos`, `getActiveTestimonials`, `getPageBySlug`

**Config updates**:
- `astro.config.mjs` — `@sanity/astro` integration mounted at `studioBasePath: '/studio'`. Env loaded via Vite's `loadEnv`. Warns if `SANITY_PROJECT_ID` unset.
- `package.json` — Sanity v4: `sanity@^4`, `@sanity/client@^7.14.1`, `@sanity/vision@^4`, `@sanity/astro@^3.3.1`, `@portabletext/types@^2`, `styled-components@^6`
- `tsconfig.json` — **removed `baseUrl`** (was breaking bare-specifier resolution: `sanity/structure` resolved to my local `./sanity/structure.ts` instead of the npm subpath). Paths now use explicit `./src/*` patterns.
- `src/env.d.ts` — added `/// <reference types="@sanity/astro/module" />`

**Schema contract for Content Agent**:
- `siteSettings` is a singleton — there's only ever one document with `_id: "siteSettings"`. Jorge edits company-wide info there (phone, email, WhatsApp, stats, logo).
- All user-visible strings go through `localeString` / `localeText` / `localeBlockContent` (fields `es`, `en`, `de`). Spanish is required; EN/DE fall back to ES via `pickLocale()`.
- Jorge can launch Spanish-only — EN/DE fields just stay empty until translations are ready.
- Slugs auto-generate from `title.es`.
- Province list for projects is locked to `['Cádiz', 'Málaga', 'Sevilla']`.

**Notes for Designer**:
- Portable Text (`localeBlockContent`) will need a renderer — recommend `@portabletext/astro` or `@portabletext/react`. I'll add whichever you prefer when I wire it into pages; flag your choice here.
- `SanityImage` type already includes `alt` — use it for every `<Image>` you render from Sanity data.
- The estimator/chatbot React components don't need Sanity; only the marketing pages do.

**Env vars Jorge/Jose need to set before Studio works**:
- `SANITY_PROJECT_ID` — from sanity.io dashboard
- `SANITY_DATASET=production`
- `SANITY_TOKEN` — optional, only needed for drafts/preview reads
- (Studio-specific variants `SANITY_STUDIO_PROJECT_ID` etc. also supported if you want separate Studio vs. Astro-read credentials)

**Studio bundle**: ~5.4MB un-gzipped / 1.7MB gzipped at `/studio/*`. Only loaded on that route, not on the marketing site. Expected for Sanity.

**Next on my queue**: `src/lib/i18n.ts` — translation utility + UI strings map (ES/EN/DE). Then `/api/contact` edge function.

---

## 2026-04-16 BACKEND — i18n utility + UI strings ready

`src/lib/i18n.ts` is live. `astro check` clean.

**Created**:
- `src/lib/i18n.ts` — typed `UIStrings` shape + full ES/EN/DE translations + routing helpers
- Moved `Locale` / `DEFAULT_LOCALE` / `LOCALES` here (single source of truth); `sanity.ts` re-exports them for back-compat

**Public API** (import from `~/lib/i18n`):
- Types: `Locale` (`'es' | 'en' | 'de'`), `UIStrings`
- Constants: `LOCALES`, `DEFAULT_LOCALE`, `LOCALE_LABELS` (`ES`/`EN`/`DE`), `LOCALE_NAMES` (full names for the switcher), `LOCALE_HREFLANG` (`es-ES` etc.)
- Guards: `isLocale(value)`
- Path helpers: `getLocaleFromUrl(url)`, `stripLocalePrefix(path)`, `localizedPath(path, locale)`, `switchLocalePath(path, newLocale)`, `alternateLinks(pathname, origin)` — returns `[{ locale, hreflang, href }]` for every locale (use in `<head>` for hreflang tags)
- Strings: `getStrings(locale): UIStrings` — returns the full bundle for a locale, falls back to ES
- Templates: `interpolate("{count} proyectos", { count: 5 })` — simple `{placeholder}` substitution; used by `projectFilter.resultsCount`, plus anything future

**UIStrings shape** — top-level groups: `site`, `nav`, `services`, `common`, `status`, `provinces`, `contact` (fields, placeholders, validation, consent), `estimator` (steps, projectTypes, quality, result), `chatbot` (quickReplies inside), `projectFilter`, `footer`, `errors`. See the file for the full type — TypeScript autocompletes every key.

**Notes for Content Agent**:
- **Spanish strings are the source of truth** — I wrote them based on the dossier and architecture.
- **English is a first draft** — polish idiomatic choices (e.g. "Get a quote" vs "Request a quote", CTA tone).
- **German is best-effort** — please review thoroughly. I used standard construction/real-estate vocabulary but a native speaker should validate. Flag any phrasing that sounds off in the Costa del Sol expat context.
- The shape is typed — adding a new key requires updating `UIStrings` then all three locale objects. TS will error on missing keys.
- **Don't add long-form copy here** — that goes in Sanity via `localeString` / `localeText` / `localeBlockContent`. This file is ONLY button labels, form fields, nav items, error messages.

**Notes for Designer**:
- Use `getStrings(locale)` in any `.astro` or `.tsx` that needs UI chrome. Locale comes from `Astro.currentLocale` in Astro components, or passed as a prop to React islands.
- Example: `const t = getStrings(Astro.currentLocale as Locale);` then `{t.nav.services}`.
- For hreflang tags in `<head>`, use `alternateLinks(Astro.url.pathname, Astro.site.origin)`.
- `interpolate` handles `{count}`-style placeholders — no need to pull in a full i18n library.

**Next on my queue**: `/api/contact` edge function (simplest API route, validates the pattern). Then `/api/chat` with streaming, then `/api/estimate`.

---

## 2026-04-16 BACKEND — /api/contact live

First API route deployed. `astro check` clean, `astro build` confirms `/api/contact` registered in Vercel output.

**Created**:
- `src/lib/whatsapp.ts` — `WHATSAPP_NUMBER = '34655634800'`, `buildWhatsAppLink(text)`, formatters for all three lead types (contact, estimator, chatbot). Templates follow docs/ai-integrations.md verbatim.
- `src/lib/rate-limit.ts` — in-memory sliding fixed window. `rateLimit(key, limit, windowMs)` returns `{ allowed, remaining, resetAt, retryAfterSeconds }`. `getClientIp(request)` reads `x-forwarded-for` → `x-real-ip`. Lazy sweep prunes every 60s. Acknowledged limitation: cold starts reset the Map — good enough for launch, swap in `@vercel/kv` if we scale out.
- `src/pages/api/contact.ts` — the endpoint. `export const prerender = false;` routes it through the Vercel serverless function.

**Endpoint contract** (for Designer wiring the contact form):
```
POST /api/contact
Content-Type: application/json

Request body:
{
  "name":     string (2-100 chars, required)
  "phone":    string (6-30 chars, required)
  "email":    string (valid email, optional — empty string accepted as "not provided")
  "message":  string (5-2000 chars, required)
  "language": "es" | "en" | "de" (required)
  "source":   string (≤100 chars, optional — e.g. "hero-cta", "footer")
  "website":  string (HONEYPOT — must be empty/absent; if filled, server silently drops)
}

Response 200:
{ "success": true, "whatsappUrl": "https://wa.me/...", "emailSent": boolean }

Response 400: { "error": "Invalid input", "code": 400, "issues": [{ "path": "...", "message": "..." }] }
Response 400: { "error": "Invalid JSON", "code": 400 }
Response 429: { "error": "Too many requests", "code": 429 }  + Retry-After header
```

**Behavior notes**:
- Rate limit: **5 requests per minute per IP**.
- Honeypot field `website` — add to form as a hidden `<input name="website" tabindex="-1" autocomplete="off">` styled off-screen; real users don't touch it, bots often do. Server silently responds 200 without sending anything so bots don't learn they were filtered.
- Email is best-effort. If Resend fails or env vars aren't set, `emailSent: false` but `whatsappUrl` is always returned.
- `whatsappUrl` is the primary delivery channel — the client should open it in a new tab after a successful response. WhatsApp is how Jorge actually reads leads.
- Error shape is consistent `{ error, code }` per backend.md.

**Env vars needed for email** (all optional; missing → email silently skipped, WhatsApp still works):
- `RESEND_API_KEY`
- `CONTACT_EMAIL_TO` (already defaulted to `jlcobano@serintsur.com` in `.env.example`)
- `CONTACT_EMAIL_FROM` (must be a verified Resend sender)

**Notes for Designer**:
- Form submission flow:
  1. Client-side validate (fast feedback) — use the same min/max rules as Zod: name 2-100, phone 6-30, message 5-2000.
  2. POST to `/api/contact`.
  3. On 200 success: show `t.contact.success`, then `window.open(whatsappUrl, '_blank')` so Jorge gets the WhatsApp ping.
  4. On 4xx/5xx: show `t.contact.error`, surface `issues[].path` if present for field-level errors.
  5. On 429: show a "please wait" message with `retryAfterSeconds` if you want to be nice.
- The `language` field should be the current page locale — `Astro.currentLocale`.
- The `source` field is optional metadata — set it to identify which form variant sent the lead (e.g. `"contact-page"`, `"footer-widget"`, `"hero-cta"`). Helps Jorge triage.

**Next on my queue**: `/api/chat` — Claude Sonnet 4 proxy with SSE streaming, system prompt per ai-integrations.md, language switching, per-IP rate limit (20/min per spec).

---

## 2026-04-16 BACKEND — /api/chat endpoint done (SSE streaming)

Claude-powered chatbot proxy is live. `astro check` clean, `astro build` produces a Vercel function at `/api/chat`.

**Created**:
- `src/lib/system-prompts.ts` — `SYSTEM_PROMPTS: Record<Locale, string>`. ES is verbatim from `docs/ai-integrations.md` lines 17-60. EN/DE are professional translations of the same intent and behavior rules. Update here (single source of truth) when the dossier changes.
- `src/lib/anthropic.ts` — lazy singleton Anthropic client (`getAnthropicClient()`), `CHAT_MODEL` = `claude-sonnet-4-6`, `CHAT_MAX_TOKENS` = 400. Reads `ANTHROPIC_API_KEY` from `import.meta.env`; throws if unset so the endpoint returns 500 cleanly.
- `src/pages/api/chat.ts` — `export const prerender = false;`. POST only. Zod validation, 20/min per-IP rate limit (reuses `src/lib/rate-limit.ts`), 10-message rolling window, last-message-must-be-user guard. Streams Claude output as SSE.

**Model choice**: `claude-sonnet-4-6`, not the date-suffixed `claude-sonnet-4-20250514` mentioned in `docs/ai-integrations.md` (that alias is stale and the SDK docs now steer away from date-suffixed IDs). Sonnet is the right cost tier for a public chatbot; bump to `claude-opus-4-7` in `anthropic.ts` if quality demands it — the wrapper is model-agnostic.

**Endpoint contract** (for Designer wiring the chatbot widget):
```
POST /api/chat
Content-Type: application/json

Request body:
{
  "messages": [
    { "role": "user" | "assistant", "content": string (1-4000 chars) },
    ...  (1-50 messages; server keeps only the last 10)
  ],
  "language": "es" | "en" | "de"
}

Response 200:
  Content-Type: text/event-stream; charset=utf-8
  Cache-Control: no-cache, no-transform
  X-Accel-Buffering: no

  data: {"type":"text","value":"Hola"}\n\n
  data: {"type":"text","value":", ¿en qué"}\n\n
  data: {"type":"text","value":" puedo ayudarte?"}\n\n
  data: {"type":"done"}\n\n

Response 400: { "error": "Invalid input", "code": 400, "issues": [...] }
Response 400: { "error": "Invalid JSON", "code": 400 }
Response 400: { "error": "Last message must be from user", "code": 400 }
Response 429: { "error": "Too many requests", "code": 429 }  + Retry-After header
Response 500: { "error": "Chat service unavailable", "code": 500 }  // ANTHROPIC_API_KEY missing
```

**SSE event shapes**:
- `{ "type": "text", "value": string }` — incremental text delta; append to the current assistant bubble.
- `{ "type": "done" }` — stream complete; close UI spinner, persist to sessionStorage.
- `{ "type": "error", "message": string }` — stream interrupted mid-flight; show a retry affordance. (Distinct from HTTP error responses, which arrive before streaming starts.)

**Behavior notes**:
- Rate limit: **20 requests per minute per IP** (per spec in ai-integrations.md).
- Last 10 messages only — earlier turns are dropped before sending to Claude. System prompt carries all company context.
- Last message must be `role: "user"` — the server returns 400 otherwise (prevents invalid Claude requests).
- Max tokens per response: 400. Matches the 2-3 sentence UX intent; shouldn't truncate natural replies.
- `X-Accel-Buffering: no` disables proxy buffering on Vercel so chunks arrive live; you'll see text appear token-by-token.
- Non-text stream events (`message_start`, `content_block_start`, `message_stop`, etc.) are filtered server-side — the client only ever sees `text`/`done`/`error`.

**Env vars needed**:
- `ANTHROPIC_API_KEY` (required — endpoint returns 500 without it)

**Notes for Designer** (chatbot widget):
- Consume the stream with `fetch` + `response.body.getReader()` + `TextDecoder`, not `EventSource` (EventSource can't send POST bodies). Parse each `data: ...\n\n` block, JSON-parse the payload, switch on `type`.
- Maintain a local `messages: {role, content}[]` array; append the user turn, POST the full array, accumulate `text` deltas into a new assistant turn, push that turn on `done`.
- Persist `messages` to `sessionStorage` so the conversation survives navigation within a tab; clear on tab close (native sessionStorage behavior).
- Quick-reply buttons from `t.chatbot.quickReplies` (see i18n.ts) should inject their text as a user message and trigger a POST.
- `language` should be the current page locale — `Astro.currentLocale` on the server render, or read the `<html lang>` attribute from the client.
- First-load welcome message (`t.chatbot.welcome`) is client-side — don't POST an empty conversation to get it.

**Notes for Content**:
- No new UI strings required; `chatbot.*` keys in `i18n.ts` already cover the widget chrome (welcome message, input placeholder, send button, quick replies, typing indicator).

**Next on my queue**: `/api/estimate` (lightweight logging wrapper — price math is client-side from the matrix in `ai-integrations.md`), then the React islands (Estimator, Chatbot, ProjectFilter), then Astro page data wiring.

---

## 2026-04-16 BACKEND — /api/estimate endpoint done

Logging wrapper for the quote estimator. Price math stays client-side in the Estimator React component (to be built). This endpoint persists the lead and hands back a WhatsApp URL for Jorge.

**Created**:
- `src/pages/api/estimate.ts` — `export const prerender = false;`. POST only. Zod validation, 5/min per-IP rate limit (reuses `src/lib/rate-limit.ts`), honeypot field, best-effort Resend email, always returns WhatsApp URL on success.

**Design decisions**:
- **Price is advisory, not authoritative**: client computes `priceLow`/`priceHigh` from the matrix in `docs/ai-integrations.md` and sends both. Server accepts whatever the client calculated (sanity-bounded to 0–100M€ and `priceHigh >= priceLow`). We don't re-derive on the server because the matrix needs Jorge's calibration and belongs in one place — the client Estimator owns it.
- **WhatsApp message is always Spanish**: Jorge reads Spanish. Enum slugs (`projectType`, `quality`) are mapped server-side to Spanish display labels before formatting. The visitor's locale travels separately in the lead payload for triage.
- **Enum slugs, not free text** for `projectType` and `quality` — tight validation + consistent WhatsApp output. `location` stays free-text so "Otra ubicación: Toledo" flows through verbatim.

**Endpoint contract** (for Designer wiring the Estimator final step):
```
POST /api/estimate
Content-Type: application/json

Request body:
{
  "name":        string (2-100 chars, required)
  "phone":       string (6-30 chars, required)
  "email":       string (valid email, optional — empty string treated as "not provided")
  "projectType": "reforma_integral" | "rehabilitacion_fachada" | "construccion_nueva" | "mantenimiento"
  "area":        number (1-10000, m²)
  "quality":     "basica" | "media" | "alta" | "premium"
  "location":    string (1-100 chars, human-readable — e.g. "Jerez" or "Otra: Toledo")
  "priceLow":    number (≥ 0)
  "priceHigh":   number (≥ priceLow)
  "language":    "es" | "en" | "de"
  "notes":       string (≤2000, optional — extra context from the client)
  "website":     HONEYPOT (must be empty/absent)
}

Response 200:
{ "success": true, "whatsappUrl": "https://wa.me/...", "emailSent": boolean }

Response 400: { "error": "Invalid input", "code": 400, "issues": [...] }
Response 400: { "error": "Invalid JSON", "code": 400 }
Response 400: { "error": "priceHigh must be >= priceLow", "code": 400 }
Response 429: { "error": "Too many requests", "code": 429 }  + Retry-After header
```

**Behavior notes**:
- Rate limit: **5 requests per minute per IP** (matches `/api/contact`).
- Honeypot: same `website` field trick as `/api/contact`. Silent 200 if filled.
- Email via Resend is best-effort. Missing env vars → `emailSent: false`, `whatsappUrl` still returned.
- `whatsappUrl` opens `wa.me/34655634800` with a pre-formatted Spanish message — the client should `window.open(url, '_blank')` after a successful submit.

**Env vars needed for email** (same set as `/api/contact`):
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM`

**Notes for Designer** (Estimator component):
- Price matrix lives client-side in `src/components/estimator/priceMatrix.ts` (not created yet — create alongside the component). Copy verbatim from `docs/ai-integrations.md`. Flag calibration notes to Jorge before launch.
- Final-step submit flow:
  1. Compute `priceLow`/`priceHigh` from the matrix (factor in `locationMultiplier`).
  2. POST to `/api/estimate` with the full payload.
  3. On 200: show result screen with the price range, then `window.open(whatsappUrl, '_blank')` when the user clicks "Solicitar visita gratuita".
  4. On 4xx/5xx: surface `t.estimator.error` and allow retry; map `issues[].path` to field highlights.
- For "Otra ubicación" UX: collect the free-text city and pass `"Otra: <city>"` as `location`. Use the location multiplier for `"otro"` when computing the price.
- `language` = current page locale. `notes` is optional — wire to an open-ended text field on the contact step if there's room.

**Notes for Content**:
- UI strings for project type / quality / location labels live in `src/lib/i18n.ts` under `estimator.*`. The server only cares about the slug; display labels in the UI should come from i18n per visitor locale.

**Next on my queue** (all three edge functions done): React islands — decompose the Estimator prototype (`serintsur-estimador.html`) into `src/components/estimator/`, then the Chatbot widget into `src/components/chatbot/`, then the Project filter. After that, Astro page data wiring (Sanity → pages).

---

## 2026-04-16 BACKEND — Estimator island done (5-step flow + result)

React Estimator is wired end-to-end: the user walks through 5 steps, the client computes a price range from the matrix, submits to `/api/estimate`, and opens Jorge's WhatsApp on success. `astro check` clean, `astro build` passes, `/es/presupuesto/` mount verified in prerendered output.

**Created**:
- `src/components/estimator/Estimator.tsx` — orchestrator. Owns `useReducer` per backend.md requirement. Accepts `{ language: Locale }` prop. Exported as default.
- `src/components/estimator/types.ts` — `ProjectTypeKey`, `QualityKey`, `LocationKey`, `ContactInfo`, `EstimateResult`, `SubmitState`. Component-local UI keys (English) that map to API slugs at submit time.
- `src/components/estimator/priceMatrix.ts` — 4-tier `PRICE_MATRIX` verbatim from `docs/ai-integrations.md`, `LOCATION_MULTIPLIER`, `AREA_MIN`/`MAX`/`DEFAULT` (20/1000/100), `calculateEstimate(projectType, quality, area, location)` → `{ low, high }`. Rounds to nearest 100€.
- `src/components/estimator/reducer.ts` — `EstimatorState`, `EstimatorAction`, `initialState`, `reducer`, `canAdvance(state)` guard per step. `Step` union: `1 | 2 | 3 | 4 | 5 | 'result'`.
- `src/components/estimator/api.ts` — `submitEstimate(payload)` — translates UI keys to Spanish API slugs, formats `"Otra: <city>"` for the `location` freetext branch, POSTs to `/api/estimate`.
- `src/components/estimator/steps/*.tsx` — one file per step (`StepProjectType`, `StepArea`, `StepQuality`, `StepLocation`, `StepContact`, `StepResults`). Each is a pure function of `{ state, dispatch, t }` (StepResults also takes `result`).
- `src/pages/es/presupuesto.astro` — thin mount page: imports `~/styles/global.css`, renders `<Estimator client:load language="es" />`. Backend-owned placeholder; Designer replaces the HTML shell around the island.

**i18n changes**:
- Extended `UIStrings.estimator.quality` from 3 tiers (`standard`/`premium`/`luxury`) to **4 tiers** (`basic`/`mid`/`high`/`premium`) in `src/lib/i18n.ts` — interface + all three locale blocks (es/en/de). This aligns with the `/api/estimate` schema from `ai-integrations.md`. Each tier has a `<key>` label and `<key>Desc` short description.

**Design decisions**:
- **Reducer, not useState**: per `docs/agents/backend.md` — step transitions stay explicit and easy to inspect.
- **UI keys ≠ wire format**: components use `renovation`/`facade`/... (English, friendly for i18n lookups); the API wants `reforma_integral`/`rehabilitacion_fachada`/.... Translation happens once in `api.ts`. Cleaner than plumbing Spanish slugs through React state.
- **Price math stays client-side**: server accepts whatever the client computed. If the matrix changes, update `priceMatrix.ts` and `ai-integrations.md` in the same commit.
- **Minimal neutral styling**: step components use standard Tailwind grays + layout utilities. No brand tokens yet — Designer restyles via the `estimator-*` class hooks and `[data-step]` attributes I added. The component is fully functional without any Designer work, just visually bland.
- **Location labels are Spanish**: city names are language-neutral ("Cádiz" everywhere); only the "Otra ubicación" chip text is Spanish. When the Content agent wants localized labels, wire `estimator.locations.*` keys into i18n and feed them in.

**Mount contract** (for Designer / page author):
```astro
---
import Estimator from '~/components/estimator/Estimator';
---
<Estimator client:load language="es" />  // or "en" / "de"
```
- Must use `client:load` — the reducer needs to run on mount to render step 1.
- `language` must be a valid `Locale` — this drives both UI strings and the `language` field on the `/api/estimate` POST.
- Import `~/styles/global.css` somewhere in the page/layout for Tailwind to render.
- The component is self-contained (card + progress bar + nav buttons). Wrap it in page chrome (hero, footer, etc.) but don't nest another form — the Estimator owns the full submit flow.

**Class hooks for Designer** (safe to retarget in global.css):
- `.estimator` — root wrapper
- `.estimator-card` — white panel holding the active step
- `.estimator-step` + `[data-step="project-type|area|quality|location|contact|result"]` — per-step root
- `.estimator-option` — project-type cards (step 1)
- `.estimator-quality` — quality-tier rows (step 3)
- `.estimator-chip` — location chips (step 4)
- `.estimator-nav-prev` / `.estimator-nav-next` / `.estimator-nav-submit`
- `.estimator-cta-primary` / `.estimator-cta-secondary` — result screen CTAs

**Notes for Content**:
- 4-tier quality translations are first-draft — review `estimator.quality.*` in `src/lib/i18n.ts`, especially German.
- Default area is 100 m², slider bounds 20–1000 m². If Jorge wants different bounds (e.g., for maintenance jobs that start smaller), update `AREA_MIN` / `AREA_DEFAULT` in `priceMatrix.ts`.

**⚠️ BEFORE LAUNCH**:
- Jorge must calibrate `PRICE_MATRIX` and `LOCATION_MULTIPLIER` in `src/components/estimator/priceMatrix.ts`. Current values are the spec's placeholder set and need real-world tuning.

**Next on my queue**: Chatbot React island (consumes `/api/chat` SSE stream, floating widget, quick replies). After that: ProjectFilter, then Astro page data wiring (Sanity → pages).

---

## 2026-04-16 BACKEND — Chatbot island done (SSE streaming widget)

Floating chatbot wired to `/api/chat`. FAB + panel, quick-reply chips, SSE streaming into the assistant bubble token-by-token, sessionStorage persistence per locale. `astro check` + `astro build` clean. Mounted on `/es/presupuesto` for end-to-end exercise; it'll move to the shared layout once Designer wires BaseLayout.

**Created**:
- `src/components/chatbot/Chatbot.tsx` — default-exported orchestrator. Accepts `{ language: Locale, whatsappUrl?: string }`. FAB + modal panel, `useReducer`, abort on unmount, auto-scroll to newest message.
- `src/components/chatbot/types.ts` — `ChatMessage`, `ChatRole`, `ChatStreamEvent` (mirrors `/api/chat` SSE event shapes).
- `src/components/chatbot/reducer.ts` — `ChatbotState` (isOpen, messages, streamingText, streaming, error), `ChatbotAction` union, reducer with `STREAM_DELTA` → `STREAM_DONE` flow.
- `src/components/chatbot/api.ts` — `streamChat({ messages, language, signal, onText, onDone, onError })`. `fetch` + `body.getReader()` + `TextDecoder`; proper SSE framing (`\n\n` splits, buffered tail). Silently ignores abort errors.
- `src/components/chatbot/storage.ts` — sessionStorage helpers, keyed `serintsur.chat.v1.<locale>`. Silent failure on quota errors.

**Design decisions**:
- **No `EventSource`** — SSE but consumed via `fetch` because `/api/chat` is POST. `EventSource` only supports GET.
- **Welcome message is UI chrome**: `t.chatbot.greeting` renders as a bubble but is never sent to the API. The API rejects requests where the last message is `role: 'assistant'`, so we never POST an empty "just the welcome" conversation.
- **sessionStorage keyed per locale**: switching language mid-session starts a fresh conversation in the new language, so the Spanish system prompt doesn't contaminate German replies.
- **Abort on unmount** — if the user navigates away mid-stream, the fetch is cancelled; the reducer doesn't tick after unmount.
- **Reducer for state**: same pattern as the Estimator. Streaming text lives in `streamingText`; on `done` it gets committed to `messages` as an assistant turn.
- **Quick replies show only on first turn**: once the user sends anything, chips collapse to give breathing room for the conversation.
- **Human-handoff shortcut**: the "talk to a human" quick reply opens `wa.me/34655634800` directly — bypasses the model for visitors who want Jorge in one click. Override via the `whatsappUrl` prop if Jorge's number ever changes.

**Mount contract** (for Designer / page author):
```astro
---
import Chatbot from '~/components/chatbot/Chatbot';
---
<Chatbot client:idle language="es" />  <!-- or "en" / "de" -->
```
- Use `client:idle` (not `client:load`) — the FAB is non-critical; defer hydration until the browser is idle so initial paint isn't blocked.
- Mount **once** per page (ideally in BaseLayout) — the FAB floats fixed at bottom-right and persists across navigation.
- `language` must be a valid `Locale` — drives UI strings + API `language` field.
- The widget uses `position: fixed` with `z-40`. If the Designer introduces other floating elements, stagger the z-indexes accordingly.

**Class hooks for Designer** (safe to retarget in global.css):
- `.chatbot-root` — outermost wrapper
- `.chatbot-fab` — floating action button
- `.chatbot-panel` — open chat dialog (fullscreen on mobile, anchored card on desktop)
- `.chatbot-header`, `.chatbot-close`, `.chatbot-clear`
- `.chatbot-messages` — scroll container
- `.chatbot-bubble` + `[data-role="user|assistant"]` + `[data-streaming]`
- `.chatbot-typing` — 3-dot indicator while awaiting first delta
- `.chatbot-quick-replies`, `.chatbot-quick-reply`
- `.chatbot-input-row`, `.chatbot-input`, `.chatbot-send`
- `.chatbot-error`, `.chatbot-footer`

**Responsive behavior**: panel is fullscreen below the `sm` breakpoint (bottom sheet feel), 380×540px anchored card at `sm` and above. Designer can restyle via `.chatbot-panel`.

**Env vars**:
- `ANTHROPIC_API_KEY` (server-side only; already documented in `/api/chat` contract).

**Notes for Content**:
- `chatbot.*` UI strings are complete across es/en/de. Review `chatbot.greeting` and `chatbot.disclaimer` — these set visitor expectations on first open.
- System prompt (the ES authoritative text + EN/DE translations) lives in `src/lib/system-prompts.ts`, not i18n. Update that file when dossier facts change.

**Next on my queue**: ProjectFilter React island (Sanity-driven filtered list of projects), then Astro page data wiring (Sanity → pages).

---

## 2026-04-16 BACKEND — ProjectFilter island + Sanity mapper done

Filtered projects list wired end-to-end. The page fetches from Sanity at build time, a server-side mapper pre-resolves locale strings and pre-builds Sanity CDN image URLs, and the client island receives a flat `ProjectCardData[]`. This keeps `SANITY_PROJECT_ID` and the image URL builder out of the browser bundle. `astro check` + `astro build` clean; `/es/proyectos/index.html` emits 7KB. The Sanity 404 during local build (dataset "production" not found for project ID "placeholder") is expected without `.env` credentials — the page catches, logs, and falls back to an empty state rather than breaking the build.

**Created**:
- `src/components/project-filter/types.ts` — `ProjectCardData` (flat, client-safe), `ProjectFilterValue` (`{ serviceId, province, year }`), `EMPTY_FILTER`.
- `src/components/project-filter/filters.ts` — pure helpers: `getServiceOptions`, `getProvinceOptions`, `getYearOptions`, `applyFilter`. Separated from the component so they're trivially testable and reusable (e.g. future "related projects" widget).
- `src/components/project-filter/mapper.ts` — `projectsToCardData(projects, locale)`. Runs in Astro pages (server). Pre-resolves `title`/`description` via `pickLocale` with Spanish fallback, dereferences `service` (via `isServiceRef` type guard — GROQ `service->{...}` may or may not expand), pre-builds image URLs at `CARD_IMAGE_WIDTH = 800` with Sanity's auto-format + fit-max defaults.
- `src/components/project-filter/ProjectFilter.tsx` — default-exported client island. `useReducer` over `ProjectFilterValue`, 3 `<select>` controls (service / province / year), results count (aria-live=polite), empty state, reset button (only visible when a filter is active). Grid of minimal cards linking to `/{locale}/proyectos/{slug}`.
- `src/pages/es/proyectos.astro` — placeholder page that exercises the full flow. Wraps the Sanity fetch in try/catch so build succeeds even without credentials.

**Design decisions**:
- **Server-side mapping**: the Sanity image URL builder needs `SANITY_PROJECT_ID`, which is server-only env. Doing the mapping in the Astro page frontmatter keeps that env var out of the client bundle entirely. The client receives plain strings.
- **Pre-resolved locale strings**: `pickLocale` also lives in `~/lib/sanity` alongside the Sanity client. Running it server-side means the React component doesn't need `pickLocale` (and therefore doesn't pull in the Sanity dep graph).
- **`isServiceRef` type guard**: `Project.service` can be either a bare `{ _ref, _type }` (if GROQ didn't dereference) or a `ServiceRef` (if `service->{...}` was used). We discriminate on the presence of `title`, which only the dereferenced form has. Bare refs are silently ignored (no service badge on that card).
- **Options derive from the full list, not the filtered list**: if we derived from `visible`, selecting "Cádiz" would collapse the service dropdown to only services with Cádiz projects — which confuses users who then want to swap province. Full-list derivation avoids dead-ends.
- **`useReducer` not `useState`**: three independent knobs + a reset feels cleaner as a reducer. Matches the pattern in Estimator and Chatbot.
- **Reset button only shows when active**: less UI noise on first paint.
- **Results count uses `aria-live="polite"`**: screen readers announce the new count after filter changes without interrupting current speech.
- **Minimal card styling** (deliberate): Designer restyles via `.project-filter-*` class hooks. Backend ships a working, accessible, ugly-but-honest grid.
- **Fail-open Sanity fetch**: the page try/catches `getProjects()` and falls back to `[]`. A Sanity outage at build time yields an empty state with working chrome rather than a broken build.

**Mount contract** (for Designer / page author):
```astro
---
import ProjectFilter from '~/components/project-filter/ProjectFilter';
import { projectsToCardData } from '~/components/project-filter/mapper';
import { getProjects } from '~/lib/sanity';

const locale = 'es'; // or 'en' / 'de'
let projects = [];
try { projects = await getProjects(); } catch (e) { console.error(e); }
const cards = projectsToCardData(projects, locale);
---
<ProjectFilter client:load projects={cards} language={locale} />
```
- Use `client:load` — filters are the primary interaction on the page; hydrate eagerly.
- `projects` must be the mapped `ProjectCardData[]` shape — do NOT pass raw Sanity `Project[]` (the component can't build image URLs client-side).
- `getProjects()` is the standard fetch. For a pre-filtered view (e.g. only featured projects on the home page), filter the array *before* passing it in — the island won't re-fetch.
- One island per page. Mount inside a max-width container; the island doesn't set its own page chrome.

**`ProjectCardData` shape** (client contract):
```ts
{
  id: string;
  title: string;         // already locale-resolved, ES fallback
  slug: string;
  description?: string;  // already locale-resolved
  imageUrl?: string;     // Sanity CDN URL, width 800, auto-format
  imageAlt?: string;
  year?: number;
  status?: ProjectStatus;
  city?: string;
  province?: Province;
  serviceId?: string;
  serviceTitle?: string; // already locale-resolved
  serviceSlug?: string;
}
```

**Class hooks for Designer** (safe to retarget in global.css):
- `.project-filter-root` — outermost wrapper
- `.project-filter-controls` — filter row container
- `.project-filter-control` — individual `<label>` wrapping each select
- `.project-filter-reset` — reset button
- `.project-filter-count` — results count (aria-live region)
- `.project-filter-empty` — empty state container
- `.project-filter-grid` — results `<ul>`
- `.project-filter-card` — result `<li>`
- `.project-filter-card-link` — the card's `<a>` wrapper
- `.project-filter-card-media` — image container (4:3 aspect ratio)
- `.project-filter-card-body`, `.project-filter-card-title`, `.project-filter-card-meta`
- `.project-filter-card-service` / `.project-filter-card-location` / `.project-filter-card-year` / `.project-filter-card-status`

**Detail-page link**: cards link to `/{locale}/proyectos/{slug}`. That route doesn't exist yet (Phase 1 scope may or may not include it — check with Designer). If the detail page isn't built, cards still render; clicks 404. Acceptable for now.

**Env vars**:
- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` — required at build time for the Sanity fetch. Without them the page renders empty.

**Notes for Content**:
- `projectFilter.*` UI strings complete in es/en/de (`all`, `byService`, `byProvince`, `byYear`, `reset`, `resultsCount`, `noResults`). Review for tone.
- Province labels come from `t.provinces.{Cádiz|Málaga|Sevilla}` (already in i18n).
- Status labels come from `t.status.{completed|in_progress|upcoming}` (already in i18n).

**Next on my queue**: Astro page data wiring — home page featured projects, services page, about page. This is the last item on the backend deliverable list before handoff to Designer.

---

## 2026-04-16 BACKEND — Astro page data wiring done (item 11 — backend deliverables complete)

Every Phase 1 page is now wired to Sanity end-to-end with fail-open frontmatter fetches, minimal HTML chrome, and stable `.<page>-*` class hooks for Designer. `astro check` clean (0 errors); `astro build` emits every static page (21KB total for the three top-level pages). Slug routes (`proyectos/[slug]`, `servicios/[slug]`) build zero routes locally because `getAllProjectSlugs` / `getAllServiceSlugs` 404 against the placeholder Sanity project — with real credentials they enumerate one route per document. **Handing off to Designer.**

**Created / replaced**:
- `src/pages/es/index.astro` — home (REPLACES the scaffolding placeholder). Parallel `Promise.all` fetch of `siteSettings`, `getActiveServices`, `getFeaturedProjects(4)`, `getActiveTestimonials`, `getActiveClientLogos`. Each call is individually `.catch()`'d so one failing query doesn't blank the page.
- `src/pages/es/servicios.astro` — services listing (grid of active services with hero images).
- `src/pages/es/servicios/[slug].astro` — service detail. `getStaticPaths` from `getAllServiceSlugs`, renders body via Portable Text, lists associated projects via `getProjects({ serviceId })`.
- `src/pages/es/proyectos/[slug].astro` — project detail. `getStaticPaths` from `getAllProjectSlugs`, renders body via Portable Text, gallery grid, side panel with metadata (service, year, location, client, area, duration, status).
- `src/pages/es/sobre-nosotros.astro` — about page. Stats from `siteSettings.stats`, body from `getPageBySlug('sobre-nosotros')`. Falls back to i18n `site.descriptionShort` when Sanity has no content.
- `src/pages/es/contacto.astro` — contact page. Mounts `<ContactForm>` island, shows phone/email/address/WhatsApp/socials from `siteSettings`.
- `src/components/contact-form/ContactForm.tsx` — React island posting to `/api/contact`. Honeypot `website` field (offscreen, `aria-hidden`), client validation via native HTML constraints, success → opens returned `whatsappUrl` in a new tab. Best-effort Resend email happens server-side; form never blocks on it.
- `src/lib/portable-text.ts` — `renderPortableText(blocks)` wrapping `@portabletext/to-html`. Pages call `pickLocale` first, then `renderPortableText`, then `set:html`. Designer adds custom renderers (e.g. inline Sanity images) by extending the `components` object.

**Added dep**: `@portabletext/to-html` (renders Sanity's block content to HTML). Framework-agnostic; no Astro or React coupling.

**Design decisions**:
- **Fail-open everywhere**: every Sanity call in a page's frontmatter is wrapped in `.catch(() => [] | null)` with a `console.error` tagged by page. A Sanity outage at build time yields empty sections, not a broken build. Combined with the existing `/api/chat` rate-limit guardrails, the site degrades gracefully under any single dependency failure.
- **Parallel fetches on the home page**: five queries in one `Promise.all` instead of sequential `await`s. Sanity CDN is fast enough that this actually matters on first render.
- **Portable Text via `set:html`** — the simplest bridge. Designer wraps the `.about-body`, `.service-body`, `.project-body` containers with `.prose` (Tailwind Typography) or custom styles. Backend produces clean HTML; styling is not our concern.
- **`[slug]` pages use `getStaticPaths` + build-time enumeration**, not SSR. Lets Vercel serve pre-rendered HTML and means a new project/service needs a rebuild to appear — acceptable tradeoff for SEO and build predictability. Jorge triggers rebuilds via Sanity's webhook → Vercel deploy hook (already configured by Infra Agent? Confirm with Designer.).
- **Slug type coercion**: Astro types `Astro.params.slug` as `string | number`. Added `const slugString = String(slug)` after the `!slug` guard to narrow to `string` for the Sanity query. Trivial but silent — noting it here so future maintainers don't revert it.
- **ContactForm is a React island, not Astro**: interactive (submit → fetch → status machine). Parallels Estimator / Chatbot shape. `client:load` because the form is the page's primary call-to-action.
- **Honeypot trick**: `<input name="website">` is visually offscreen (`position: absolute; left: -9999px`), `aria-hidden`, `tabIndex={-1}`, `autoComplete="off"`. Legitimate users never fill it; bots that scan for fields do. `/api/contact` silently accepts the submission on hit (returns `success: true` but no whatsappUrl), so bots don't learn they were caught.
- **No React.FormEvent type**: replaced with structural `{ preventDefault: () => void; currentTarget: HTMLFormElement }` to sidestep `ts(6385)` deprecation warning (same fix as Chatbot).
- **Stats rendered in two places** (home + about). Deliberate — Designer may decide to keep on both, pull from one, or rework entirely. Data source is `siteSettings.stats`, single source of truth.
- **Testimonial block hidden when empty**: home page doesn't render the testimonials section at all if `testimonials.length === 0`. Avoids a bare heading with no content.
- **No fallback hero image on projects/services**: if `mainImage` / `heroImage` is missing, the hero image block simply doesn't render. Designer decides on a placeholder strategy (SVG logo? gradient?) when building real components.

**Page inventory** (ES only — Phase 1 scope says Spanish-complete, en/de structure ready for Content):

| Route | Source file | Sanity queries | Islands | Static? |
|-------|-------------|----------------|---------|---------|
| `/es` | `es/index.astro` | `getSiteSettings`, `getActiveServices`, `getFeaturedProjects(4)`, `getActiveTestimonials`, `getActiveClientLogos` | `<Chatbot>` | Yes |
| `/es/servicios` | `es/servicios.astro` | `getActiveServices` | `<Chatbot>` | Yes |
| `/es/servicios/[slug]` | `es/servicios/[slug].astro` | `getAllServiceSlugs`, `getServiceBySlug`, `getProjects({ serviceId })` | `<Chatbot>` | Yes (one route per active service) |
| `/es/proyectos` | `es/proyectos.astro` (prior commit) | `getProjects()` | `<ProjectFilter>`, `<Chatbot>` | Yes |
| `/es/proyectos/[slug]` | `es/proyectos/[slug].astro` | `getAllProjectSlugs`, `getProjectBySlug` | `<Chatbot>` | Yes (one route per project) |
| `/es/sobre-nosotros` | `es/sobre-nosotros.astro` | `getSiteSettings`, `getPageBySlug('sobre-nosotros')` | `<Chatbot>` | Yes |
| `/es/presupuesto` | `es/presupuesto.astro` (prior commit) | none | `<Estimator>`, `<Chatbot>` | Yes |
| `/es/contacto` | `es/contacto.astro` | `getSiteSettings` | `<ContactForm>`, `<Chatbot>` | Yes |

**EN / DE pages**: not created. Translation-ready (all UI strings live in `src/lib/i18n.ts` under `en` / `de`, Sanity fields are locale-keyed). Content Agent's call whether to duplicate each Astro page under `en/` + `de/` or drive it from a single parameterised page. For now, only `/es/*` routes exist.

**ContactForm mount contract** (for Designer / page author):
```astro
---
import ContactForm from '~/components/contact-form/ContactForm';
---
<ContactForm client:load language="es" source="contact" />  <!-- source is optional -->
```
- `language`: `Locale` — drives UI strings and the `language` field on `/api/contact`.
- `source`: optional free-text tag (e.g. `"contact"`, `"home"`, `"service-detail"`) that Jorge sees in the WhatsApp message / email. Useful for attribution when you embed the form in multiple places.

**Class hooks for Designer** (safe to retarget in global.css):
- Home: `.home-root`, `.home-hero`, `.home-hero-title`, `.home-hero-tagline`, `.home-hero-ctas`, `.home-cta-primary`, `.home-cta-secondary`, `.home-stats`, `.home-stats-grid`, `.home-stat`, `.home-services`, `.home-services-grid`, `.home-service-card`, `.home-service-title`, `.home-service-desc`, `.home-featured`, `.home-featured-grid`, `.home-featured-card`, `.home-testimonials`, `.home-testimonials-grid`, `.home-testimonial`, `.home-clients`, `.home-clients-grid`, `.home-client`, `.home-section-title`.
- Services listing: `.services-root`, `.services-title`, `.services-grid`, `.services-card`, `.services-card-link`, `.services-card-media`, `.services-card-body`, `.services-card-title`, `.services-card-desc`.
- Service detail: `.service-root`, `.service-hero`, `.service-title`, `.service-description`, `.service-ctas`, `.service-cta-primary`, `.service-cta-secondary`, `.service-hero-image`, `.service-body`, `.service-features`, `.service-features-list`, `.service-feature`, `.service-projects`, `.service-projects-grid`, `.service-project-card`, `.service-section-title`.
- Project detail: `.project-root`, `.project-hero`, `.project-title`, `.project-description`, `.project-hero-image`, `.project-main`, `.project-content`, `.project-body`, `.project-meta`, `.project-meta-row`, `.project-gallery`, `.project-gallery-grid`, `.project-gallery-item`, `.project-section-title`.
- About: `.about-root`, `.about-hero`, `.about-title`, `.about-stats`, `.about-stats-grid`, `.about-stat`, `.about-body`.
- Contact: `.contact-root`, `.contact-hero`, `.contact-title`, `.contact-subheading`, `.contact-main`, `.contact-form-wrapper`, `.contact-info`, `.contact-social`.
- ContactForm: `.contact-form`, `.contact-form-field`, `.contact-form-input`, `.contact-form-honeypot`, `.contact-form-submit`, `.contact-form-error`, `.contact-form-success`, `.contact-form-wa-link`.

**Env vars required at build time**:
- `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_VERSION` — all Sanity queries. Missing → every page renders empty (via fail-open catches).
- `SANITY_TOKEN` — only needed if you enable preview mode (drafts visible to editors). Not required for public build.
- `ANTHROPIC_API_KEY` — server-only for `/api/chat`.
- `RESEND_API_KEY`, `CONTACT_EMAIL_TO`, `CONTACT_EMAIL_FROM` — server-only for `/api/contact` email delivery (optional; form works without them).

**Notes for Designer**:
- Every page inlines its own `<html>` / `<head>` / `<body>` rather than using a BaseLayout, matching the pattern established on `presupuesto.astro` and `proyectos.astro`. When you introduce `src/layouts/BaseLayout.astro`, migrate pages one at a time — the data-fetching frontmatter is independent from the shell.
- `<Chatbot client:idle language="es" />` is mounted at the bottom of every page's `<body>`. When you move it into BaseLayout, remove the per-page mounts.
- All `<Image>`/image tags currently use raw `<img>` with the Sanity-built CDN URL. You can swap to Astro's `<Image>` component for further optimization — but note the Sanity URL already includes `auto=format` (webp/avif) and appropriate `w=` params. Don't double-optimize.
- SEO meta is minimal (title + description + conditional `noindex`). SEO Agent adds structured data (JSON-LD), hreflang alternates, og:image, Twitter cards, etc. The `seo` object on Sanity documents (`metaTitle`, `metaDescription`, `ogImage`, `noIndex`) is already wired — just needs rendering.

**Notes for Content**:
- `getPageBySlug('sobre-nosotros')` expects a `page` document with slug `sobre-nosotros` in Sanity. If Jorge creates it under a different slug (e.g., `about` or `nosotros`), update the page's frontmatter.
- Portable Text renderer currently uses library defaults: paragraphs, headings, lists, links. If Content needs inline Sanity images or custom marks, extend `components` in `src/lib/portable-text.ts`.
- Contact page falls back to `phone: '+34 655 634 800'` and `email: 'info@serintsur.com'` if `siteSettings` is empty. These should be populated in Sanity before launch so they're editable without a deploy.

**Backend deliverables — final status**: items 1–11 complete. This branch (`feat/backend-integrations`) is ready for Designer hand-off. All React islands (Estimator, Chatbot, ProjectFilter, ContactForm) are minimal-chrome but functional, every class hook is documented, and `astro check` + `astro build` both pass. Blockers for launch that are NOT backend scope: Designer shell (BaseLayout, real styling), Content population in Sanity (projects, services, testimonials, site settings, about page body, price matrix calibration), SEO agent's structured data, and the i18n duplication for `/en/*` + `/de/*` routes.

---
