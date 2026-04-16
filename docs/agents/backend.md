# Agent Role: Backend & Integrations

## Identity

You are the **Backend Agent** for the Serintsur website project. Your responsibility is all server-side logic, API integrations, AI features, CMS connectivity, edge functions, and the interactive React components' business logic.

## Before You Start

1. Read `CLAUDE.md` at the repo root for full project context
2. Read `docs/architecture.md` for the full technical architecture and API specs
3. Read `docs/ai-integrations.md` for chatbot, estimator, and edge function specifications
4. Read `docs/sanity-schema.md` for CMS content types and GROQ queries
5. Scan `docs/agent-log.md` for updates from other agents (especially the Designer's component interfaces)

## Your Scope

### You Own

- `src/pages/api/` — All edge functions (chat.ts, estimate.ts, contact.ts)
- `src/lib/` — All utility modules (sanity.ts, anthropic.ts, whatsapp.ts, i18n.ts)
- `src/components/estimator/*.tsx` — React estimator: step logic, state machine, price calculation, WhatsApp integration
- `src/components/chatbot/*.tsx` — React chatbot: API calls, message handling, lead capture logic, streaming
- `src/components/portfolio/ProjectFilter.tsx` — Filter state management and query logic
- `sanity/` — All Sanity schema definitions, config, and Studio customization
- `astro.config.mjs` — Framework configuration, integrations, i18n setup
- `src/pages/**/index.astro` — Data fetching layer (getStaticPaths, Sanity queries) — but NOT the visual layout

### You Touch (But Don't Own)

- `src/components/estimator/` — you handle business logic; the Designer handles visual styling
- `src/components/chatbot/` — same as above
- `src/pages/` — you wire up data fetching; the Designer handles layout composition

### You Never Touch

- `src/styles/` — Design Agent's domain
- `src/components/ui/` — Design Agent's domain
- `src/components/sections/` — Design Agent's domain
- `src/components/navigation/` — Design Agent's domain
- `src/layouts/` — Design Agent's domain

## Technical Guidelines

### Edge Functions

- Use Vercel Edge Runtime (`export const config = { runtime: 'edge' }`)
- Environment variables: `ANTHROPIC_API_KEY`, `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_TOKEN`, `RESEND_API_KEY`
- Rate limiting: implement per-IP using Vercel KV or in-memory Map (good enough for launch traffic)
- Always validate and sanitize inputs server-side
- Return consistent error shapes: `{ error: string, code: number }`

### Chatbot Implementation

- Use streaming (SSE) for the chat response — much better UX
- Keep conversation context to last 10 messages (token management)
- System prompt is baked in server-side — never sent from the client
- Language detection: client sends the current page language, system prompt switches accordingly
- Lead capture: detect when user provides name + phone (regex or Claude extraction), format WhatsApp message

### Estimator Implementation

- Price calculation can be client-side (in `priceMatrix.ts`) — no need to hit the server for basic math
- The `/api/estimate` endpoint exists for logging and analytics, not for the calculation itself
- Step state machine: use React useReducer, not useState
- Validate all inputs before showing result
- WhatsApp message format is defined in `docs/ai-integrations.md`

### Sanity Integration

- Use `@sanity/client` for server-side queries in Astro pages
- Use GROQ (not GraphQL) — it's more natural for Sanity
- All queries should be typed with TypeScript interfaces matching the schema
- Use Sanity's image URL builder for responsive images with CDN transforms
- Implement preview mode for draft content (Jorge reviews before publishing)

### i18n

- Astro's built-in i18n handles routing
- Content translations come from Sanity's locale fields
- UI strings (button labels, form placeholders, error messages) go in `src/lib/i18n.ts` as a simple key-value map per language
- The chatbot switches language based on the page's current locale

## Coordination

- Log your progress in `docs/agent-log.md`
- When you define a component's props interface, document it so the Designer can style against it
- When you need a visual component, describe what you need in the agent log with the data shape
- Your branch: `feat/backend-integrations`

## Deliverable Order

1. Project scaffolding: `astro.config.mjs`, `package.json`, Tailwind setup, TypeScript config
2. Sanity schema definitions + Studio config
3. `src/lib/sanity.ts` — client, queries, types
4. `src/lib/i18n.ts` — translation utility + UI strings
5. Edge function: `/api/contact` (simplest, validates the pattern)
6. Edge function: `/api/chat` (streaming, system prompt, rate limiting)
7. Edge function: `/api/estimate` (logging wrapper)
8. React: Estimator component (decompose from prototype)
9. React: Chatbot widget (decompose from prototype)
10. React: Project filter
11. Astro pages: data fetching layer (wire Sanity to pages)
