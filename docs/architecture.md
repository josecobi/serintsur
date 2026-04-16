# Architecture — Serintsur Website

## Site Map & Routing

```
serintsur.com/
│
├── /                          → redirects to /es/ (Spanish default)
│
├── /es/                       → Home (Spanish)
├── /en/                       → Home (English)
├── /de/                       → Home (German)
│
├── /{lang}/servicios/                      → Services overview
│   ├── /{lang}/servicios/reformas          → Full renovations
│   ├── /{lang}/servicios/rehabilitacion    → Facade rehabilitation
│   ├── /{lang}/servicios/construccion      → New construction (villas, houses)
│   └── /{lang}/servicios/mantenimiento     → Building maintenance
│
├── /{lang}/proyectos/                      → Portfolio grid (filterable)
│   └── /{lang}/proyectos/[slug]/           → Individual project detail
│
├── /{lang}/sobre-nosotros/                 → About (values, team, history)
├── /{lang}/presupuesto/                    → Estimator tool (full page)
├── /{lang}/contacto/                       → Contact form + map + WhatsApp CTA
│
├── /api/chat                  → Edge function: chatbot proxy (no lang prefix)
├── /api/estimate              → Edge function: estimator logic
├── /api/contact               → Edge function: form → WhatsApp + email
│
└── /studio/                   → Sanity Studio (CMS admin, only Jorge/Jose)
```

### i18n Routing Strategy

Astro's built-in i18n with `prefixDefaultLocale: true`. Every page lives under its language prefix. The root `/` does a 302 redirect to `/es/` (or detects browser language if we want to get fancy later — but start with Spanish default).

```ts
// astro.config.mjs
export default defineConfig({
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
});
```

## Page Composition

### Home Page (`/{lang}/index.astro`)

| Section | Component | Content Source | Interactive? |
|---------|-----------|---------------|-------------|
| Hero | `HeroSection.astro` | Sanity (headline, subhead, CTA text) | No (CSS animations only) |
| Services Overview | `ServicesGrid.astro` | Sanity (4 service cards) | No |
| Featured Projects | `ProjectsShowcase.astro` | Sanity (3-4 featured projects) | Hover effects |
| Trust Bar | `ClientLogos.astro` | Sanity (logo images) | Marquee scroll |
| Stats | `StatsSection.astro` | Sanity (numbers: projects, years, employees) | Counter animation on scroll |
| CTA Banner | `CtaBanner.astro` | Sanity (text + button) | No |
| Testimonials | `TestimonialsCarousel.astro` | Sanity (Phase 2 — placeholder for now) | Carousel (React island) |

### Services Page (`/{lang}/servicios/index.astro`)

Overview page with cards linking to individual service pages. Each service page (`/{lang}/servicios/[service].astro`) is a dynamic route pulling content from Sanity.

### Projects Page (`/{lang}/proyectos/index.astro`)

Filterable grid of project cards. Filters: service type, location (Cádiz, Málaga, Sevilla), year. Each card links to a detail page with photo gallery, description, specs.

**This page is a React island** — the filter state management needs client-side JS. Use `client:load` for the filter bar, but render the initial grid server-side.

### Estimator Page (`/{lang}/presupuesto/index.astro`)

Full-page embed of the React estimator component. This is the decomposed version of the existing `serintsur-estimador.html` prototype.

## Component Architecture

### Static Components (Astro `.astro`)

Used for everything that doesn't need client-side interactivity:

```
src/components/
├── ui/
│   ├── Button.astro            → Primary, secondary, outline, ghost variants
│   ├── Card.astro              → Base card with image, title, description slots
│   ├── Badge.astro             → Status badges, category tags
│   ├── SectionHeading.astro    → H2 + subtitle + optional accent line
│   └── Container.astro         → Max-width wrapper with responsive padding
├── sections/
│   ├── HeroSection.astro
│   ├── ServicesGrid.astro
│   ├── ProjectsShowcase.astro
│   ├── ClientLogos.astro
│   ├── StatsSection.astro
│   ├── CtaBanner.astro
│   ├── ValuesGrid.astro
│   └── ContactInfo.astro
├── navigation/
│   ├── Header.astro            → Nav bar with language switcher
│   ├── Footer.astro            → Contact info, nav links, legal
│   ├── MobileMenu.astro        → Slide-out mobile nav (uses <dialog>)
│   └── LanguageSwitcher.astro  → ES/EN/DE toggle
└── seo/
    ├── MetaTags.astro          → Open Graph, Twitter Cards, structured data
    └── JsonLd.astro            → Local Business schema markup
```

### Interactive Components (React `.tsx`)

Only used where client-side state is unavoidable:

```
src/components/
├── estimator/
│   ├── Estimator.tsx           → Root component, step state machine
│   ├── StepProjectType.tsx     → Step 1: service category selection
│   ├── StepArea.tsx            → Step 2: surface area slider
│   ├── StepQuality.tsx         → Step 3: finish quality level
│   ├── StepLocation.tsx        → Step 4: province/city selector
│   ├── StepContact.tsx         → Step 5: name, phone, email, notes
│   ├── EstimateResult.tsx      → Price range display + WhatsApp CTA
│   ├── ProgressBar.tsx         → Visual step indicator
│   └── priceMatrix.ts          → Price calculation logic (importable)
├── chatbot/
│   ├── ChatWidget.tsx          → Floating bubble + chat panel
│   ├── ChatMessage.tsx         → Individual message (bot/user)
│   ├── ChatInput.tsx           → Text input + send button
│   ├── QuickReplies.tsx        → Suggested response buttons
│   ├── LeadCaptureForm.tsx     → Inline name/phone form within chat
│   └── chatConfig.ts           → System prompt, initial messages, quick replies
├── portfolio/
│   ├── ProjectFilter.tsx       → Filter bar (type, location, year)
│   └── ProjectGrid.tsx         → Animated grid with filter transitions
└── shared/
    └── WhatsAppButton.tsx      → Reusable "Chat on WhatsApp" CTA
```

## Edge Functions (API Routes)

### `/api/chat` — Chatbot Proxy

```
POST /api/chat
Body: { messages: Message[], language: 'es' | 'en' | 'de' }
Response: { reply: string, quickReplies?: string[] }
```

- Proxies to Anthropic Claude API (claude-sonnet-4-20250514)
- System prompt includes the full Serintsur dossier content as context
- Rate limited: 20 requests/minute per IP
- Streaming response for UX (SSE)

### `/api/estimate` — Estimator Logic

```
POST /api/estimate
Body: { projectType, area, quality, location }
Response: { low: number, high: number, breakdown: object }
```

- Pure calculation — no AI needed
- Uses the price matrix defined in `priceMatrix.ts`
- Could be client-side only, but server-side allows logging and analytics

### `/api/contact` — Contact Form Handler

```
POST /api/contact
Body: { name, phone, email?, message, language, source }
Response: { success: boolean }
```

- Sends formatted message via WhatsApp deep link (returns the URL for client to open)
- Also sends email notification to jlcobano@serintsur.com (via Resend or similar)
- Saves lead to Sanity (optional — for CRM-like tracking)

## Performance Targets

- **Lighthouse Performance**: > 95
- **First Contentful Paint**: < 1.2s
- **Largest Contentful Paint**: < 2.0s
- **Total Bundle Size**: < 150kb JS (excluding React islands which lazy-load)
- **Core Web Vitals**: All green

## SEO Strategy

- Every page has unique `<title>`, `<meta description>`, Open Graph tags
- Local Business JSON-LD on every page
- Service pages have FAQ schema markup
- Project pages have structured data (location, type, images)
- XML sitemap auto-generated by Astro
- `robots.txt` allows all crawlers
- Canonical URLs handle i18n (hreflang tags for ES/EN/DE)
- Google Business Profile link from footer

## Deployment

```
main branch → Vercel production (serintsur.com)
dev branch → Vercel preview (dev.serintsur.com)
feature/* branches → Vercel preview (auto-generated URLs)
```

Sanity Studio deploys separately to `studio.serintsur.com` or as an embedded route at `/studio/`.
