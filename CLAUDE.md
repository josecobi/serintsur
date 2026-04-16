# Serintsur Website & AI Integrations

## What is this project?

A modern website and suite of AI-powered tools for **Serintsur Multiservicios S.L.**, a construction and renovation company (~30 employees) based in Jerez de la Frontera, Cádiz, operating across Cádiz, Málaga, and Sevilla provinces.

The company's owner is **Jorge López Cobano** (gerencia). His brother **Jose** is the web developer building this. Jose runs Cobitek (his own dev practice).

## Business Context

Serintsur's core business is **construction, rehabilitation, and building maintenance** — primarily facade rehabs, full renovations, villa construction, and residential developments. They also do **property management** (cleaning, pool maintenance, landscaping) but this is Phase 2 scope.

Key clients include municipal governments (Ayuntamiento de Jerez), military bases (Base Naval de Rota, Base de Morón), hospitality (Hotel Jerez), wineries (González Byass, Bodega Díez Mérito), developers (Metrovacesa, Coprasa), and institutions (Cáritas, UPACE, Fundación Andrés Rivera).

The company was founded in 2018 and has grown from ~5 to ~40 projects/year by 2025.

## Project Goals

1. Replace the outdated website (PowerPoint-in-iframe) with a modern, fast, SEO-optimized site
2. Integrate AI tools that save Jorge time and generate qualified leads
3. Support three languages: Spanish (primary), English, German (for Costa del Sol expat market)
4. Enable Jorge to edit content himself via CMS without developer intervention
5. Build a foundation for future tools (daily job reporting PWA, automated quote generation)

## Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| Framework | **Astro 5.x** | Static-first, great SEO, React islands for interactivity |
| UI Islands | **React 19** | Estimator widget, chatbot widget, interactive components |
| Styling | **Tailwind CSS 4** | Utility-first, consistent with design tokens |
| CMS | **Sanity v3** | Hosted, localization built-in, clean editor UI for Jorge |
| Hosting | **Vercel** | Auto-deploy from Git, edge functions for API proxy |
| AI Engine | **Anthropic Claude API** (claude-sonnet-4-20250514) | Chatbot, estimator intelligence, content generation |
| API Proxy | **Vercel Edge Functions** | Secure API key handling, rate limiting |
| Analytics | **Plausible** or **Umami** | Privacy-first, no cookie banners needed |
| Forms | **Native + Edge Function** | Contact form → WhatsApp + email to Jorge |

## Project Structure

```
serintsur/
├── CLAUDE.md                          ← YOU ARE HERE
├── docs/
│   ├── architecture.md                ← Site structure, routing, components
│   ├── brand.md                       ← Colors, typography, voice, visual rules
│   ├── ai-integrations.md            ← Estimator, chatbot, edge function specs
│   ├── sanity-schema.md              ← CMS content types and fields
│   ├── i18n.md                        ← Internationalization strategy
│   ├── seo.md                         ← SEO strategy, structured data, local SEO
│   └── agents/
│       ├── designer.md                ← Role definition for design agent
│       ├── backend.md                 ← Role definition for backend/integrations agent
│       └── content.md                 ← Role definition for content/CMS agent
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro           ← HTML shell, meta tags, fonts, analytics
│   ├── components/
│   │   ├── ui/                        ← Shared UI primitives (Button, Card, etc.)
│   │   ├── sections/                  ← Page sections (Hero, Services, Portfolio, etc.)
│   │   ├── estimator/                 ← React: multi-step quote estimator
│   │   ├── chatbot/                   ← React: floating AI chatbot widget
│   │   └── navigation/               ← Header, Footer, MobileMenu
│   ├── pages/
│   │   ├── es/                        ← Spanish pages (default)
│   │   ├── en/                        ← English pages
│   │   ├── de/                        ← German pages
│   │   └── api/
│   │       ├── chat.ts                ← Edge function: chatbot proxy
│   │       ├── estimate.ts            ← Edge function: estimator logic
│   │       └── contact.ts             ← Edge function: form handler
│   ├── lib/
│   │   ├── sanity.ts                  ← Sanity client + queries
│   │   ├── anthropic.ts              ← Claude API wrapper
│   │   ├── whatsapp.ts               ← WhatsApp deep link generator
│   │   └── i18n.ts                    ← Translation utilities
│   ├── content/                       ← Static content / fallbacks
│   └── styles/
│       └── global.css                 ← Tailwind config, CSS custom properties
├── sanity/
│   ├── schemas/                       ← Sanity schema definitions
│   └── sanity.config.ts
├── public/
│   ├── fonts/                         ← Self-hosted fonts
│   └── images/
└── package.json
```

## Key Conventions

- **Language**: All code comments in English. All user-facing content in Spanish (with EN/DE translations managed via Sanity + i18n).
- **Components**: Astro components for static content, React (`.tsx`) only where interactivity is required. Never use React where Astro suffices.
- **Styling**: Tailwind utility classes. Custom properties in `global.css` for brand tokens. No CSS-in-JS.
- **CMS Content**: All editable text comes from Sanity. Hardcoded text is only acceptable for UI chrome (button labels, form placeholders) — and even those should use the i18n system.
- **API Security**: Never expose the Anthropic API key client-side. All AI calls go through `/api/*` edge functions.
- **WhatsApp Integration**: Use `wa.me/34655634800` deep links. Jorge's number is 655634800.
- **Images**: Use Astro's `<Image>` component for optimization. Sanity images use their CDN with transforms.
- **Accessibility**: WCAG 2.1 AA minimum. Semantic HTML. Focus management in interactive widgets.

## What's Already Built (Prototypes)

Two standalone HTML prototypes exist from earlier work:

1. **Quote Estimator** (`serintsur-estimador.html`) — 5-step guided form: project type → surface area → quality level → location → contact info → price range + WhatsApp CTA. Uses Serintsur's price matrix (needs calibration with Jorge). Yellow/black palette.

2. **Chatbot Widget** — floating chat bubble, powered by Claude API with the company dossier baked into the system prompt. Captures leads (name, phone, project type) and routes to Jorge via WhatsApp. Quick-reply buttons for common questions.

These prototypes need to be decomposed into React components and integrated into the Astro site. The business logic is proven; the UI needs to match the new design system.

## Launch Scope (Phase 1)

**Build and ship:**
- Home page (hero, services overview, recent projects, trust badges, CTA)
- Services page (construction focus: reformas integrales, rehabilitación de fachadas, construcción de villas, mantenimiento de edificios)
- Projects/portfolio page (filterable by type and location, content from Sanity)
- About page (values, team, growth trajectory from dossier)
- Contact page (form + map + direct WhatsApp CTA)
- Estimator page (dedicated page for the quote tool)
- Chatbot widget (floating on all pages)
- i18n: Spanish complete, English and German content structure ready (can launch with Spanish-only if translations aren't ready)

**Defer to Phase 2:**
- Property management services section
- Blog / SEO content articles
- Client testimonials / review engine
- Project showcase auto-generator
- Daily job reporting PWA

## Contact & Resources

- **Jorge López Cobano** (owner): 655634800 / jlcobano@serintsur.com
- **Company address**: Avda. Alcalde Cantos Ropero, 104, Nave 6, Jerez de la Frontera, Cádiz
- **CIF**: B11945391
- **Dossier PDF**: `docs/DOSSIER_SERINTSUR_MULTISERVICIOS_SL.pdf`
