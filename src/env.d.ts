/// <reference path="../.astro/types.d.ts" />
/// <reference types="@sanity/astro/module" />

interface ImportMetaEnv {
  readonly ANTHROPIC_API_KEY: string;
  readonly SANITY_PROJECT_ID: string;
  readonly SANITY_DATASET: string;
  readonly SANITY_API_VERSION: string;
  readonly SANITY_TOKEN: string;
  readonly RESEND_API_KEY: string;
  readonly CONTACT_EMAIL_TO: string;
  readonly CONTACT_EMAIL_FROM: string;
  readonly PUBLIC_SITE_URL: string;
  readonly PUBLIC_WHATSAPP_NUMBER: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
