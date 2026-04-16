# Brand Guidelines — Serintsur Multiservicios

## Color Palette

The palette is derived from the Serintsur logo (navy blue, orange, white) and extended for digital use.

### Primary Colors

```css
--color-navy: #1e3a5f;          /* Primary — headers, nav, trust elements */
--color-navy-dark: #152d4a;     /* Hover states, footer */
--color-navy-light: #2a4f7a;    /* Secondary buttons, borders */

--color-orange: #e87722;        /* Accent — CTAs, highlights, energy */
--color-orange-dark: #d4691e;   /* Hover on orange elements */
--color-orange-light: #f5923e;  /* Badge backgrounds, soft accents */
```

### Neutral Colors

```css
--color-white: #ffffff;         /* Backgrounds, cards */
--color-offwhite: #faf8f5;      /* Section alternation, subtle backgrounds */
--color-gray-100: #f0eee9;      /* Input backgrounds, dividers */
--color-gray-300: #d1cdc6;      /* Borders, disabled states */
--color-gray-500: #8a8580;      /* Placeholder text, captions */
--color-gray-700: #4a4540;      /* Body text */
--color-gray-900: #1f1c18;      /* Headings, high-emphasis text */
```

### Semantic Colors

```css
--color-success: #2d8659;       /* Completed projects, form success */
--color-success-light: #e6f4ed; /* Success backgrounds */
--color-error: #c4392f;         /* Form errors, alerts */
--color-error-light: #fce8e6;   /* Error backgrounds */
--color-info: #2a6cb6;          /* Info badges, links */
```

### Usage Rules

- Navy is the dominant brand color. It should appear in the header, footer, and major headings.
- Orange is ONLY for calls-to-action, interactive highlights, and energy moments. Never use it for large background areas.
- The yellow (#F2C429) from the dossier is RETIRED for digital — it clashes with orange and reads poorly on screens. Use orange instead.
- Body text uses gray-700, never pure black.
- Alternate between white and offwhite backgrounds to create visual rhythm between page sections.

## Typography

### Font Stack

```css
--font-display: 'Clash Display', 'Archivo', sans-serif;
--font-body: 'DM Sans', 'Satoshi', sans-serif;
--font-mono: 'JetBrains Mono', monospace; /* Only for technical elements like CIF, phone numbers */
```

Load from Google Fonts or self-host. Clash Display is from Fontshare (free for commercial use). Fallback to Archivo (Google Fonts) if Clash Display loading is an issue.

### Type Scale

```
Display:    clamp(2.5rem, 5vw, 4rem)    — Hero headlines only
H1:         clamp(2rem, 3.5vw, 3rem)    — Page titles
H2:         clamp(1.5rem, 2.5vw, 2.25rem) — Section headings
H3:         1.25rem / 1.5rem            — Card titles, subsections
Body:       1rem (16px)                 — Paragraphs, descriptions
Small:      0.875rem (14px)             — Captions, metadata
XS:         0.75rem (12px)              — Badges, labels
```

### Weight Usage

- **Display/H1**: 700 or 800 (Clash Display)
- **H2/H3**: 600 (DM Sans Semibold)
- **Body**: 400 (DM Sans Regular)
- **Emphasis**: 500 (DM Sans Medium) — never use bold for inline emphasis, use medium weight
- **Buttons/Labels**: 500 or 600

## Visual Language

### Photography Style

- Warm, natural light — Andalucían sunshine
- Show finished work in context (buildings in their neighborhood, villas with landscaping)
- Before/after comparisons where available
- Workers in action shots: helmets, vests, professional but human
- Avoid stock photography. Use Serintsur's own project photos from the dossier and Jorge's library.

### Iconography

- Line-style icons, 1.5-2px stroke weight
- Navy color on light backgrounds, white on dark
- Consistent set — Lucide or Phosphor Icons recommended (both open source)
- Never use emoji as icons in the main UI (acceptable in chatbot responses)

### Spacing System

Based on 4px grid:
```
4px   — micro spacing (icon-to-text gaps)
8px   — tight spacing (within compact components)
16px  — default spacing (between related elements)
24px  — comfortable spacing (between card content blocks)
32px  — section padding (mobile)
48px  — section padding (tablet)
64px  — section padding (desktop)
96px  — major section breaks
```

### Border Radius

```
--radius-sm: 6px;    /* Badges, tags, small buttons */
--radius-md: 10px;   /* Cards, inputs, standard buttons */
--radius-lg: 16px;   /* Large cards, modals, image containers */
--radius-xl: 24px;   /* Feature cards, hero elements */
--radius-full: 9999px; /* Pills, avatars, floating buttons */
```

### Shadows

```css
--shadow-sm: 0 1px 3px rgba(30, 58, 95, 0.06);
--shadow-md: 0 4px 16px rgba(30, 58, 95, 0.08);
--shadow-lg: 0 8px 32px rgba(30, 58, 95, 0.12);
--shadow-xl: 0 16px 48px rgba(30, 58, 95, 0.16);
```

Note: shadows use navy-tinted rgba, not pure black. This keeps shadows feeling warm and branded.

## Brand Voice

### Spanish (primary)

- Professional but approachable — a trusted foreman talking to a homeowner, not a corporate brochure
- Concrete over abstract: "Rehabilitamos fachadas en toda la provincia de Cádiz" not "Ofrecemos soluciones integrales de rehabilitación"
- Confidence without arrogance: "Más de 40 proyectos completados en 2024" not "Somos los mejores del sector"
- Use "nosotros" voice — the company as a team, not "Serintsur ofrece..."

### English

- Direct and clear — expat-friendly, not overly formal
- Avoid construction jargon unless explaining it
- Tone: "We build and maintain homes across southern Spain's coast"

### German

- Formal Sie address
- Emphasis on reliability, precision, and quality (resonates culturally)
- Tone: professional, detail-oriented

## Logo Usage

The Serintsur logo features a stylized tree icon with flowing orange/navy elements, alongside "SerIntSur" text with "MULTISERVICIOS" subtitle.

- Minimum size: 120px width on screen
- Clear space: at least 16px on all sides
- On dark backgrounds: white text version
- On light backgrounds: navy + orange version
- Never stretch, rotate, or recolor the logo
- The logo file should be sourced from Jorge (SVG preferred)

## Don'ts

- Don't use yellow (#F2C429) from the old dossier — it's been replaced by orange
- Don't use gradients on the brand colors (flat is the style)
- Don't use rounded/bubbly aesthetics — the brand is sturdy, architectural, trustworthy
- Don't use light font weights for headings
- Don't use more than 2 font families on any page
- Don't center-align body text longer than 2 lines
