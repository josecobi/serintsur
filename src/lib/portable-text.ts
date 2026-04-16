/**
 * Sanity Portable Text → HTML rendering helpers.
 *
 * Pages resolve a locale-specific block array via `pickLocale(field, locale)`,
 * then pass it here. The output is used with Astro's `set:html` — the Designer
 * styles the resulting markup via `.prose-*` class hooks on a parent element.
 *
 * Only the defaults from `@portabletext/to-html` are used. When Designer needs
 * custom mark/block renderers (e.g. Sanity images with the CDN URL builder),
 * extend `components` below.
 */

import { toHTML, type PortableTextComponents } from '@portabletext/to-html';
import type { PortableTextBlock } from '@portabletext/types';

const components: PortableTextComponents = {
  // Default renderers handle block / list / mark styles.
  // Custom types (e.g. inline Sanity images) would go here.
};

export function renderPortableText(
  blocks: PortableTextBlock[] | undefined,
): string {
  if (!blocks || blocks.length === 0) return '';
  return toHTML(blocks, { components });
}
