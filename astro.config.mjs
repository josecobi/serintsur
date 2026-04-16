// @ts-check
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import sanity from '@sanity/astro';
import tailwindcss from '@tailwindcss/vite';

const env = loadEnv(process.env.NODE_ENV ?? '', process.cwd(), '');

const SANITY_PROJECT_ID = env.SANITY_PROJECT_ID || 'placeholder';
const SANITY_DATASET = env.SANITY_DATASET || 'production';
const SANITY_API_VERSION = env.SANITY_API_VERSION || '2025-01-01';

if (SANITY_PROJECT_ID === 'placeholder') {
  console.warn(
    '[astro.config] SANITY_PROJECT_ID not set — Studio will load but cannot connect. Copy .env.example to .env and fill in credentials.',
  );
}

export default defineConfig({
  site: 'https://serintsur.com',
  output: 'static',
  adapter: vercel({
    imageService: true,
  }),
  integrations: [
    react(),
    sanity({
      projectId: SANITY_PROJECT_ID,
      dataset: SANITY_DATASET,
      apiVersion: SANITY_API_VERSION,
      useCdn: false,
      studioBasePath: '/studio',
    }),
    sitemap({
      i18n: {
        defaultLocale: 'es',
        locales: {
          es: 'es-ES',
          en: 'en-US',
          de: 'de-DE',
        },
      },
    }),
  ],
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'de'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
