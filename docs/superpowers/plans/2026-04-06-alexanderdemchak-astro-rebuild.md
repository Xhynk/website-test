# alexanderdemchak.com Astro + Sanity Rebuild — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Clone alexanderdemchak.com into a static Astro site backed by Sanity CMS, deployed on Cloudflare Pages, with full SEO and structured data.

**Architecture:** Astro v5 in static output mode queries Sanity at build time via GROQ. Sanity Studio is embedded at `/studio` via `@sanity/astro` + `@astrojs/react`. All pages are pre-rendered with zero client JS (except the studio route). Cloudflare Pages serves the static output; a Sanity webhook triggers rebuilds on content publish.

**Tech Stack:** Astro 5, Sanity v3, `@sanity/astro`, `@astrojs/react`, `@astrojs/sitemap`, `@sanity/image-url`, Google Fonts (Montserrat, Lato, Inter), Cloudflare Pages.

**Spec:** `docs/superpowers/specs/2026-04-06-alexanderdemchak-astro-rebuild-design.md`

---

## File Structure

```
c:/Users/Phodo/Projects/xhynk.com/
  package.json
  astro.config.mjs
  tsconfig.json
  .env                          — SANITY_PROJECT_ID, SANITY_DATASET, etc.
  .gitignore
  public/
    robots.txt
    favicon.svg                 — AD logo as favicon
    images/
      logo.png                  — AD brand logo
      hero-1.webp ... hero-9.webp — hero portrait grid images
      service-1.webp ... service-3.webp — service card images
      portfolio-1.webp ... portfolio-6.webp — recent work images
  src/
    env.d.ts                    — Astro env types + sanity:client module
    styles/
      global.css                — design tokens, reset, typography, layout utilities
    lib/
      sanity.ts                 — GROQ queries + typed fetch helpers
      imageUrl.ts               — Sanity image URL builder helper
    components/
      SeoHead.astro             — meta/OG/Twitter tags
      JsonLd.astro              — JSON-LD script injection
      Header.astro              — logo + nav (desktop + mobile)
      Footer.astro              — logo + copyright
      Hero.astro                — hero section with image grid
      StrategySection.astro     — "Better Strategy" section
      ServiceCards.astro        — 3 numbered service cards
      PricingSection.astro      — 3 pricing tier cards
      FaqSection.astro          — <details>/<summary> accordion
      CtaSection.astro          — final CTA banner
      PortfolioGrid.astro       — masonry image grid
    layouts/
      BaseLayout.astro          — wraps every page (html, head, header, footer)
    pages/
      index.astro               — home page
      recent-work.astro         — portfolio page
      contact.astro             — contact page (static, no Sanity)
  sanity/
    sanity.config.ts            — Sanity project config
    sanity.cli.ts               — Sanity CLI config
    schema/
      index.ts                  — schema registry (exports all types)
      siteSettings.ts           — singleton: logo, nav, footer, socials, SEO defaults
      homePage.ts               — singleton: hero, strategy, services intro, billing heading, CTA
      serviceCard.ts            — document: title, description, image, sortOrder
      pricingTier.ts            — document: title, subtitle, price, features, highlighted, sortOrder
      faqItem.ts                — document: question, answer, sortOrder
      portfolioItem.ts          — document: image, alt, sortOrder
    structure.ts                — desk structure for singletons
```

---

## Task 1: Project Scaffolding & Tooling

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore`, `.env`, `src/env.d.ts`

- [ ] **Step 1: Initialize git repo**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git init
```

- [ ] **Step 2: Create Astro project**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

- [ ] **Step 3: Install dependencies**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npm install astro @sanity/astro @sanity/client @sanity/image-url @astrojs/react @astrojs/sitemap react react-dom sanity
npm install --save-dev @types/react @types/react-dom typescript
```

- [ ] **Step 4: Write astro.config.mjs**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://alexanderdemchak.com',
  output: 'static',
  integrations: [
    sanity({
      projectId: import.meta.env.SANITY_PROJECT_ID,
      dataset: import.meta.env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap(),
  ],
});
```

- [ ] **Step 5: Write .env file**

```bash
SANITY_PROJECT_ID=your_project_id_here
SANITY_DATASET=production
```

- [ ] **Step 6: Write .gitignore**

```
node_modules/
dist/
.astro/
.env
.DS_Store
```

- [ ] **Step 7: Update src/env.d.ts**

```typescript
/// <reference types="astro/client" />

declare module 'sanity:client' {
  export const sanityClient: import('@sanity/client').SanityClient;
}
```

- [ ] **Step 8: Verify the project builds**

Run: `cd c:/Users/Phodo/Projects/xhynk.com && npx astro build`
Expected: Build succeeds (may warn about no pages yet, that's fine).

- [ ] **Step 9: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add -A
git commit -m "feat: scaffold Astro project with Sanity, React, and Sitemap integrations"
```

---

## Task 2: Global CSS & Design Tokens

**Files:**
- Create: `src/styles/global.css`

- [ ] **Step 1: Write global.css**

```css
/* src/styles/global.css */

/* ── Reset ── */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

a {
  color: inherit;
  text-decoration: none;
}

ul, ol {
  list-style: none;
}

/* ── Design Tokens ── */
:root {
  --color-bg-primary: #0e1726;
  --color-bg-dark: #000119;
  --color-accent: #fd8040;
  --color-accent-hover: #e5703a;
  --color-cta-border: #37ca37;
  --color-text: #ffffff;
  --color-text-muted: #aaacae;
  --color-card-bg: rgba(255, 255, 255, 0.03);
  --color-card-border: rgba(255, 255, 255, 0.1);

  --font-heading: 'Montserrat', sans-serif;
  --font-body: 'Lato', sans-serif;
  --font-ui: 'Inter', sans-serif;

  --max-width: 1170px;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 4rem;
  --spacing-xl: 6rem;

  --radius-sm: 6px;
  --radius-md: 12px;
  --radius-lg: 20px;
  --radius-full: 9999px;
}

/* ── Base Typography ── */
html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  font-family: var(--font-body);
  color: var(--color-text);
  background-color: var(--color-bg-primary);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: 1.2;
  font-weight: 700;
}

h1 { font-size: clamp(2rem, 5vw, 3.5rem); }
h2 { font-size: clamp(1.5rem, 3.5vw, 2.5rem); }
h3 { font-size: clamp(1.1rem, 2.5vw, 1.5rem); }
h4 { font-size: 1.1rem; }

p {
  color: var(--color-text-muted);
  line-height: 1.7;
}

/* ── Layout Utilities ── */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

.section {
  padding: var(--spacing-xl) 0;
}

/* ── Buttons ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-family: var(--font-ui);
  font-weight: 700;
  font-size: 0.95rem;
  padding: 15px 40px;
  border: 2px solid var(--color-cta-border);
  background: var(--color-accent);
  color: var(--color-text);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: background 0.2s ease, transform 0.1s ease;
  text-transform: uppercase;
  letter-spacing: 0.02em;
}

.btn:hover {
  background: var(--color-accent-hover);
}

.btn:active {
  transform: scale(0.98);
}

.btn::after {
  content: '→';
  transition: transform 0.2s ease;
}

.btn:hover::after {
  transform: translateX(4px);
}

/* ── Eyebrow ── */
.eyebrow {
  font-family: var(--font-ui);
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.15em;
  color: var(--color-accent);
  margin-bottom: var(--spacing-sm);
}

/* ── Responsive ── */
@media (max-width: 768px) {
  .container {
    padding: 0 var(--spacing-sm);
  }
  .section {
    padding: var(--spacing-lg) 0;
  }
}
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/styles/global.css
git commit -m "feat: add global CSS with design tokens, reset, typography, and utilities"
```

---

## Task 3: Sanity Schema Definitions

**Files:**
- Create: `sanity/schema/siteSettings.ts`, `sanity/schema/homePage.ts`, `sanity/schema/serviceCard.ts`, `sanity/schema/pricingTier.ts`, `sanity/schema/faqItem.ts`, `sanity/schema/portfolioItem.ts`, `sanity/schema/index.ts`, `sanity/sanity.config.ts`, `sanity/sanity.cli.ts`, `sanity/structure.ts`

- [ ] **Step 1: Write siteSettings.ts**

```typescript
// sanity/schema/siteSettings.ts
import { defineType, defineField } from 'sanity';

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
    }),
    defineField({
      name: 'footerText',
      title: 'Footer Text',
      type: 'string',
      initialValue: '© 2026 Alexander Demchak - All rights reserved.',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', title: 'Platform', type: 'string' }),
            defineField({ name: 'url', title: 'URL', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'seoTitle',
      title: 'Default SEO Title',
      type: 'string',
      initialValue: 'Alexander Demchak — Fractional CTO & Web Developer',
    }),
    defineField({
      name: 'seoDescription',
      title: 'Default SEO Description',
      type: 'text',
      rows: 3,
      initialValue:
        'Over 15 years of web development experience. Fractional CTO services, development retainers, and ad-hoc development.',
    }),
    defineField({
      name: 'ogImage',
      title: 'Default OG Image',
      type: 'image',
    }),
  ],
  preview: {
    prepare() {
      return { title: 'Site Settings' };
    },
  },
});
```

- [ ] **Step 2: Write homePage.ts**

```typescript
// sanity/schema/homePage.ts
import { defineType, defineField } from 'sanity';

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    // Hero
    defineField({ name: 'heroEyebrow', title: 'Hero Eyebrow', type: 'string', initialValue: '15+ years experience' }),
    defineField({ name: 'heroHeadingLine1', title: 'Hero Heading Line 1', type: 'string', initialValue: 'Your Story,' }),
    defineField({ name: 'heroHeadingLine2', title: 'Hero Heading Line 2', type: 'string', initialValue: 'My Expertise.' }),
    defineField({
      name: 'heroBody',
      title: 'Hero Body',
      type: 'text',
      rows: 3,
      initialValue: 'Websites are more than code. They a tell your story. I can help that story come to life, and be accessible, functional, and beautiful.',
    }),
    defineField({ name: 'heroCtaLabel', title: 'Hero CTA Label', type: 'string', initialValue: 'Contact Alexander' }),
    defineField({ name: 'heroCtaHref', title: 'Hero CTA Link', type: 'string', initialValue: '/contact' }),
    defineField({
      name: 'heroImages',
      title: 'Hero Portrait Images',
      type: 'array',
      of: [{ type: 'image', options: { hotspot: true } }],
    }),
    // Strategy
    defineField({ name: 'strategyEyebrow', title: 'Strategy Eyebrow', type: 'string', initialValue: "LET'S GET YOU" }),
    defineField({ name: 'strategyHeading', title: 'Strategy Heading', type: 'string', initialValue: 'A Better Strategy for Better Results' }),
    defineField({
      name: 'strategyBody',
      title: 'Strategy Body',
      type: 'text',
      rows: 6,
      initialValue: "I combine over 15 years of development experience with a sharp eye for performance and reliability. Whether you need a mission-critical bug fixed, a WordPress build stabilized, or a long-term development partner, my goal is to deliver solutions that are clean, functional, and future-proof.\n\nI use proven workflows to make sure your website isn't just online, but it's fast, secure, and scalable.\n\nSound like what you need?",
    }),
    defineField({
      name: 'strategyImage',
      title: 'Strategy Image',
      type: 'image',
      options: { hotspot: true },
    }),
    // Services intro
    defineField({ name: 'servicesEyebrow', title: 'Services Eyebrow', type: 'string', initialValue: 'WORKING WITH ALEXANDER...' }),
    defineField({ name: 'servicesHeadingLine1', title: 'Services Heading Line 1', type: 'string', initialValue: '...Is the Best Decision You Can Make!' }),
    defineField({ name: 'servicesHeadingLine2', title: 'Services Heading Line 2', type: 'string', initialValue: 'What Options Are There?' }),
    // Billing
    defineField({ name: 'billingHeading', title: 'Billing Section Heading', type: 'string', initialValue: "Billing Isn't Fun, But It's Necessary" }),
    // CTA
    defineField({ name: 'ctaHeading', title: 'CTA Heading', type: 'string', initialValue: "Let's Bring Your Story To Life" }),
    defineField({ name: 'ctaButtonLabel', title: 'CTA Button Label', type: 'string', initialValue: 'Contact Alexander Today' }),
    defineField({ name: 'ctaButtonHref', title: 'CTA Button Link', type: 'string', initialValue: '/contact' }),
    // FAQ intro
    defineField({ name: 'faqHeading', title: 'FAQ Heading', type: 'string', initialValue: 'Frequently Asked Questions' }),
    defineField({ name: 'faqSubheading', title: 'FAQ Subheading', type: 'string', initialValue: 'Everything you need to know about the service and billing.' }),
    // Interstitial
    defineField({ name: 'interstitialHeading', title: 'Interstitial Heading', type: 'string', initialValue: "Let's Work Together Soon!" }),
  ],
  preview: {
    prepare() {
      return { title: 'Home Page' };
    },
  },
});
```

- [ ] **Step 3: Write serviceCard.ts**

```typescript
// sanity/schema/serviceCard.ts
import { defineType, defineField } from 'sanity';

export const serviceCard = defineType({
  name: 'serviceCard',
  title: 'Service Card',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'description', title: 'Description', type: 'text', rows: 4 }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', order: 'sortOrder' },
    prepare({ title, order }) {
      return { title: `${order}. ${title}` };
    },
  },
});
```

- [ ] **Step 4: Write pricingTier.ts**

```typescript
// sanity/schema/pricingTier.ts
import { defineType, defineField } from 'sanity';

export const pricingTier = defineType({
  name: 'pricingTier',
  title: 'Pricing Tier',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text', rows: 3 }),
    defineField({ name: 'price', title: 'Price', type: 'string' }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({ name: 'ctaLabel', title: 'CTA Label', type: 'string', initialValue: 'Contact Alexander' }),
    defineField({ name: 'ctaHref', title: 'CTA Link', type: 'string', initialValue: '/contact' }),
    defineField({ name: 'highlighted', title: 'Highlighted (Featured)', type: 'boolean', initialValue: false }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'title', price: 'price' },
    prepare({ title, price }) {
      return { title, subtitle: price };
    },
  },
});
```

- [ ] **Step 5: Write faqItem.ts**

```typescript
// sanity/schema/faqItem.ts
import { defineType, defineField } from 'sanity';

export const faqItem = defineType({
  name: 'faqItem',
  title: 'FAQ Item',
  type: 'document',
  fields: [
    defineField({ name: 'question', title: 'Question', type: 'string' }),
    defineField({ name: 'answer', title: 'Answer', type: 'text', rows: 5 }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { title: 'question', order: 'sortOrder' },
    prepare({ title, order }) {
      return { title: `${order}. ${title}` };
    },
  },
});
```

- [ ] **Step 6: Write portfolioItem.ts**

```typescript
// sanity/schema/portfolioItem.ts
import { defineType, defineField } from 'sanity';

export const portfolioItem = defineType({
  name: 'portfolioItem',
  title: 'Portfolio Item',
  type: 'document',
  fields: [
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
    defineField({ name: 'sortOrder', title: 'Sort Order', type: 'number' }),
  ],
  orderings: [{ title: 'Sort Order', name: 'sortOrder', by: [{ field: 'sortOrder', direction: 'asc' }] }],
  preview: {
    select: { alt: 'alt', media: 'image' },
    prepare({ alt, media }) {
      return { title: alt || 'Untitled', media };
    },
  },
});
```

- [ ] **Step 7: Write schema/index.ts**

```typescript
// sanity/schema/index.ts
import { siteSettings } from './siteSettings';
import { homePage } from './homePage';
import { serviceCard } from './serviceCard';
import { pricingTier } from './pricingTier';
import { faqItem } from './faqItem';
import { portfolioItem } from './portfolioItem';

export const schemaTypes = [
  siteSettings,
  homePage,
  serviceCard,
  pricingTier,
  faqItem,
  portfolioItem,
];
```

- [ ] **Step 8: Write structure.ts (singleton desk structure)**

```typescript
// sanity/structure.ts
import type { StructureResolver } from 'sanity/structure';

const singletonTypes = new Set(['siteSettings', 'homePage']);

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site Settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('Home Page')
        .id('homePage')
        .child(S.document().schemaType('homePage').documentId('homePage')),
      S.divider(),
      ...S.documentTypeListItems().filter(
        (listItem) => !singletonTypes.has(listItem.getId()!)
      ),
    ]);
```

- [ ] **Step 9: Write sanity.config.ts**

```typescript
// sanity/sanity.config.ts
import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './schema';
import { structure } from './structure';

export default defineConfig({
  name: 'alexanderdemchak',
  title: 'Alexander Demchak',
  projectId: import.meta.env.SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID || '',
  dataset: import.meta.env.SANITY_DATASET || process.env.SANITY_DATASET || 'production',
  plugins: [structureTool({ structure })],
  schema: {
    types: schemaTypes,
  },
});
```

- [ ] **Step 10: Write sanity.cli.ts**

```typescript
// sanity/sanity.cli.ts
import { defineCliConfig } from 'sanity/cli';

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || '',
    dataset: process.env.SANITY_DATASET || 'production',
  },
});
```

- [ ] **Step 11: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add sanity/
git commit -m "feat: add Sanity v3 schemas for all content types with singleton desk structure"
```

---

## Task 4: Sanity Client & Image URL Helpers

**Files:**
- Create: `src/lib/sanity.ts`, `src/lib/imageUrl.ts`

- [ ] **Step 1: Write sanity.ts**

```typescript
// src/lib/sanity.ts
import { sanityClient } from 'sanity:client';

export async function fetchSiteSettings() {
  return sanityClient.fetch(`*[_type == "siteSettings"][0]{
    logo,
    footerText,
    socialLinks,
    seoTitle,
    seoDescription,
    ogImage
  }`);
}

export async function fetchHomePage() {
  return sanityClient.fetch(`*[_type == "homePage"][0]{
    heroEyebrow,
    heroHeadingLine1,
    heroHeadingLine2,
    heroBody,
    heroCtaLabel,
    heroCtaHref,
    heroImages,
    strategyEyebrow,
    strategyHeading,
    strategyBody,
    strategyImage,
    servicesEyebrow,
    servicesHeadingLine1,
    servicesHeadingLine2,
    billingHeading,
    ctaHeading,
    ctaButtonLabel,
    ctaButtonHref,
    faqHeading,
    faqSubheading,
    interstitialHeading
  }`);
}

export async function fetchServiceCards() {
  return sanityClient.fetch(`*[_type == "serviceCard"] | order(sortOrder asc){
    title,
    description,
    image,
    sortOrder
  }`);
}

export async function fetchPricingTiers() {
  return sanityClient.fetch(`*[_type == "pricingTier"] | order(sortOrder asc){
    title,
    subtitle,
    price,
    features,
    ctaLabel,
    ctaHref,
    highlighted,
    sortOrder
  }`);
}

export async function fetchFaqItems() {
  return sanityClient.fetch(`*[_type == "faqItem"] | order(sortOrder asc){
    question,
    answer,
    sortOrder
  }`);
}

export async function fetchPortfolioItems() {
  return sanityClient.fetch(`*[_type == "portfolioItem"] | order(sortOrder asc){
    image,
    alt,
    sortOrder
  }`);
}
```

- [ ] **Step 2: Write imageUrl.ts**

```typescript
// src/lib/imageUrl.ts
import imageUrlBuilder from '@sanity/image-url';
import { sanityClient } from 'sanity:client';

const builder = imageUrlBuilder(sanityClient);

export function urlFor(source: any) {
  return builder.image(source);
}
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/lib/
git commit -m "feat: add Sanity GROQ query helpers and image URL builder"
```

---

## Task 5: BaseLayout, SeoHead, JsonLd, Header, Footer

**Files:**
- Create: `src/components/SeoHead.astro`, `src/components/JsonLd.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/layouts/BaseLayout.astro`, `public/robots.txt`

- [ ] **Step 1: Write SeoHead.astro**

```astro
---
// src/components/SeoHead.astro
interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
}

const { title, description, ogImage, canonicalUrl } = Astro.props;
const canonical = canonicalUrl || Astro.url.href;
const og = ogImage || '/images/logo.png';
---

<title>{title}</title>
<meta name="description" content={description} />
<link rel="canonical" href={canonical} />

<!-- Open Graph -->
<meta property="og:type" content="website" />
<meta property="og:url" content={canonical} />
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:image" content={og} />

<!-- Twitter -->
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content={title} />
<meta name="twitter:description" content={description} />
<meta name="twitter:image" content={og} />
```

- [ ] **Step 2: Write JsonLd.astro**

```astro
---
// src/components/JsonLd.astro
interface Props {
  data: Record<string, any> | Record<string, any>[];
}

const { data } = Astro.props;
const jsonLdArray = Array.isArray(data) ? data : [data];
---

{jsonLdArray.map((item) => (
  <script type="application/ld+json" set:html={JSON.stringify(item)} />
))}
```

- [ ] **Step 3: Write Header.astro**

```astro
---
// src/components/Header.astro
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Recent Works', href: '/recent-work' },
  { label: 'Contact', href: '/contact' },
];
const currentPath = Astro.url.pathname;
---

<header class="site-header">
  <div class="container header-inner">
    <a href="/" class="logo-link" aria-label="Alexander Demchak - Home">
      <img src="/images/logo.png" alt="Alexander Demchak logo" width="50" height="50" />
    </a>
    <nav aria-label="Main navigation">
      <ul class="nav-list">
        {navLinks.map(({ label, href }) => (
          <li>
            <a
              href={href}
              class:list={['nav-link', { active: currentPath === href || (href !== '/' && currentPath.startsWith(href)) }]}
            >
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  </div>
</header>

<style>
  .site-header {
    position: sticky;
    top: 0;
    z-index: 100;
    background: var(--color-bg-primary);
    border-bottom: 1px solid var(--color-card-border);
  }
  .header-inner {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: var(--spacing-sm);
    padding-bottom: var(--spacing-sm);
  }
  .logo-link img {
    height: 40px;
    width: auto;
  }
  .nav-list {
    display: flex;
    gap: var(--spacing-md);
  }
  .nav-link {
    font-family: var(--font-ui);
    font-size: 0.9rem;
    font-weight: 500;
    color: var(--color-text-muted);
    transition: color 0.2s;
  }
  .nav-link:hover,
  .nav-link.active {
    color: var(--color-text);
  }
  @media (max-width: 768px) {
    .nav-list {
      gap: var(--spacing-sm);
    }
    .nav-link {
      font-size: 0.8rem;
    }
  }
</style>
```

- [ ] **Step 4: Write Footer.astro**

```astro
---
// src/components/Footer.astro
---

<footer class="site-footer">
  <div class="container footer-inner">
    <img src="/images/logo.png" alt="Alexander Demchak logo" width="40" height="40" class="footer-logo" />
    <p>&copy; 2026 Alexander Demchak - All rights reserved.</p>
  </div>
</footer>

<style>
  .site-footer {
    padding: var(--spacing-lg) 0 var(--spacing-md);
    text-align: center;
    border-top: 1px solid var(--color-card-border);
  }
  .footer-logo {
    margin: 0 auto var(--spacing-sm);
    height: 40px;
    width: auto;
  }
  .site-footer p {
    font-family: var(--font-ui);
    font-size: 0.85rem;
    color: var(--color-text-muted);
  }
</style>
```

- [ ] **Step 5: Write BaseLayout.astro**

```astro
---
// src/layouts/BaseLayout.astro
import SeoHead from '../components/SeoHead.astro';
import JsonLd from '../components/JsonLd.astro';
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  canonicalUrl?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
}

const { title, description, ogImage, canonicalUrl, jsonLd } = Astro.props;
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=Lato:wght@300;400;700&family=Montserrat:wght@600;700;800&display=swap"
      rel="stylesheet"
    />

    <!-- Preconnect Sanity CDN -->
    <link rel="preconnect" href="https://cdn.sanity.io" />

    <SeoHead title={title} description={description} ogImage={ogImage} canonicalUrl={canonicalUrl} />
    {jsonLd && <JsonLd data={jsonLd} />}
  </head>
  <body>
    <Header />
    <main>
      <slot />
    </main>
    <Footer />
  </body>
</html>
```

- [ ] **Step 6: Write robots.txt**

```
# public/robots.txt
User-agent: *
Allow: /

Sitemap: https://alexanderdemchak.com/sitemap-index.xml
```

- [ ] **Step 7: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/layouts/ src/components/SeoHead.astro src/components/JsonLd.astro src/components/Header.astro src/components/Footer.astro public/robots.txt
git commit -m "feat: add BaseLayout with SEO head, JSON-LD, header, footer, and robots.txt"
```

---

## Task 6: Home Page — Hero Section

**Files:**
- Create: `src/components/Hero.astro`, `src/pages/index.astro` (initial version)

- [ ] **Step 1: Write Hero.astro**

```astro
---
// src/components/Hero.astro
import { urlFor } from '../lib/imageUrl';

interface Props {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
  images: any[];
}

const { eyebrow, headingLine1, headingLine2, body, ctaLabel, ctaHref, images } = Astro.props;
---

<section class="hero section">
  <div class="container hero-grid">
    <div class="hero-content">
      <p class="eyebrow">{eyebrow}</p>
      <h1>
        <span class="hero-line1">{headingLine1}</span>
        <span class="hero-line2">{headingLine2}</span>
      </h1>
      <p class="hero-body">{body}</p>
      <a href={ctaHref} class="btn">{ctaLabel}</a>
    </div>
    {images && images.length > 0 && (
      <div class="hero-images">
        {images.map((img: any, i: number) => (
          <div class="hero-portrait">
            <img
              src={urlFor(img).width(150).height(150).format('webp').url()}
              alt={`Portrait ${i + 1}`}
              width="150"
              height="150"
              loading={i < 3 ? 'eager' : 'lazy'}
            />
          </div>
        ))}
      </div>
    )}
  </div>
</section>

<style>
  .hero {
    padding: var(--spacing-xl) 0;
    min-height: 70vh;
    display: flex;
    align-items: center;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    align-items: center;
  }
  .hero h1 {
    margin-bottom: var(--spacing-md);
  }
  .hero-line1,
  .hero-line2 {
    display: block;
  }
  .hero-body {
    font-size: 1.1rem;
    margin-bottom: var(--spacing-md);
    max-width: 500px;
  }
  .hero-images {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-sm);
    justify-items: center;
  }
  .hero-portrait {
    width: 120px;
    height: 120px;
    border-radius: var(--radius-full);
    overflow: hidden;
    border: 3px solid var(--color-accent);
  }
  .hero-portrait img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  @media (max-width: 768px) {
    .hero-grid {
      grid-template-columns: 1fr;
      text-align: center;
    }
    .hero-body {
      max-width: none;
    }
    .hero-images {
      order: -1;
      grid-template-columns: repeat(3, 1fr);
    }
    .hero-portrait {
      width: 90px;
      height: 90px;
    }
  }
</style>
```

- [ ] **Step 2: Write initial index.astro (hero only for now — other sections added in later tasks)**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import { fetchHomePage, fetchSiteSettings } from '../lib/sanity';

const settings = await fetchSiteSettings();
const home = await fetchHomePage();

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alexander Demchak',
    url: 'https://alexanderdemchak.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alexander Demchak',
    jobTitle: 'Fractional CTO & Web Developer',
    url: 'https://alexanderdemchak.com',
    sameAs: [
      'https://facebook.com/xhynk',
      'https://instagram.com/xhynk',
      'https://x.com/xhynk',
    ],
  },
];
---

<BaseLayout
  title={settings?.seoTitle || 'Alexander Demchak — Fractional CTO & Web Developer'}
  description={settings?.seoDescription || 'Over 15 years of web development experience.'}
  jsonLd={jsonLd}
>
  <Hero
    eyebrow={home?.heroEyebrow || '15+ years experience'}
    headingLine1={home?.heroHeadingLine1 || 'Your Story,'}
    headingLine2={home?.heroHeadingLine2 || 'My Expertise.'}
    body={home?.heroBody || ''}
    ctaLabel={home?.heroCtaLabel || 'Contact Alexander'}
    ctaHref={home?.heroCtaHref || '/contact'}
    images={home?.heroImages || []}
  />
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/components/Hero.astro src/pages/index.astro
git commit -m "feat: add Hero component and initial home page with Person/WebSite schema"
```

---

## Task 7: Home Page — Strategy, Services, Pricing Sections

**Files:**
- Create: `src/components/StrategySection.astro`, `src/components/ServiceCards.astro`, `src/components/PricingSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write StrategySection.astro**

```astro
---
// src/components/StrategySection.astro
import { urlFor } from '../lib/imageUrl';

interface Props {
  eyebrow: string;
  heading: string;
  body: string;
  image: any;
}

const { eyebrow, heading, body, image } = Astro.props;
const paragraphs = body.split('\n').filter((p: string) => p.trim());
---

<section class="strategy section">
  <div class="container strategy-grid">
    <div class="strategy-content">
      <p class="eyebrow">{eyebrow}</p>
      <h2>{heading}</h2>
      {paragraphs.map((p: string) => <p class="strategy-text">{p}</p>)}
    </div>
    {image && (
      <div class="strategy-image">
        <img
          src={urlFor(image).width(600).height(450).format('webp').url()}
          alt="Alexander Demchak working"
          width="600"
          height="450"
          loading="lazy"
        />
      </div>
    )}
  </div>
</section>

<style>
  .strategy-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-lg);
    align-items: center;
  }
  .strategy h2 {
    margin-bottom: var(--spacing-md);
  }
  .strategy-text {
    margin-bottom: var(--spacing-sm);
  }
  .strategy-image img {
    border-radius: var(--radius-md);
    width: 100%;
  }
  @media (max-width: 768px) {
    .strategy-grid {
      grid-template-columns: 1fr;
    }
    .strategy-image {
      order: -1;
    }
  }
</style>
```

- [ ] **Step 2: Write ServiceCards.astro**

```astro
---
// src/components/ServiceCards.astro
import { urlFor } from '../lib/imageUrl';

interface ServiceCard {
  title: string;
  description: string;
  image: any;
  sortOrder: number;
}

interface Props {
  eyebrow: string;
  headingLine1: string;
  headingLine2: string;
  cards: ServiceCard[];
}

const { eyebrow, headingLine1, headingLine2, cards } = Astro.props;
---

<section class="services section">
  <div class="container">
    <div class="services-header">
      <p class="eyebrow">{eyebrow}</p>
      <h2>{headingLine1}<br />{headingLine2}</h2>
    </div>
    <div class="services-list">
      {cards.map((card, i) => (
        <div class:list={['service-card', { reverse: i % 2 !== 0 }]}>
          <div class="service-number">
            <span>{i + 1}</span>
          </div>
          <div class="service-text">
            <h3><strong>{card.title}</strong></h3>
            <p>{card.description}</p>
          </div>
          {card.image && (
            <div class="service-image">
              <img
                src={urlFor(card.image).width(500).height(350).format('webp').url()}
                alt={card.title}
                width="500"
                height="350"
                loading="lazy"
              />
            </div>
          )}
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .services-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }
  .service-card {
    display: grid;
    grid-template-columns: auto 1fr 1fr;
    gap: var(--spacing-md);
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }
  .service-card.reverse {
    direction: rtl;
  }
  .service-card.reverse > * {
    direction: ltr;
  }
  .service-number span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 50px;
    height: 50px;
    border-radius: var(--radius-full);
    border: 2px solid var(--color-accent);
    font-family: var(--font-heading);
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--color-accent);
  }
  .service-text h3 {
    color: var(--color-accent);
    margin-bottom: var(--spacing-xs);
  }
  .service-image img {
    border-radius: var(--radius-md);
    width: 100%;
  }
  @media (max-width: 768px) {
    .service-card {
      grid-template-columns: auto 1fr;
    }
    .service-image {
      grid-column: 1 / -1;
    }
    .service-card.reverse {
      direction: ltr;
    }
  }
</style>
```

- [ ] **Step 3: Write PricingSection.astro**

```astro
---
// src/components/PricingSection.astro
interface PricingTier {
  title: string;
  subtitle: string;
  price: string;
  features: string[];
  ctaLabel: string;
  ctaHref: string;
  highlighted: boolean;
}

interface Props {
  heading: string;
  tiers: PricingTier[];
}

const { heading, tiers } = Astro.props;

const professionalServiceSchema = {
  '@context': 'https://schema.org',
  '@type': 'ProfessionalService',
  name: 'Alexander Demchak',
  url: 'https://alexanderdemchak.com',
  priceRange: '$125/hr - $6,750/mo',
  hasOfferCatalog: {
    '@type': 'OfferCatalog',
    name: 'Development Services',
    itemListElement: tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.title,
      description: tier.subtitle,
      price: tier.price,
    })),
  },
};
---

<section class="pricing section">
  <div class="container">
    <h2 class="pricing-heading">{heading}</h2>
    <div class="pricing-grid">
      {tiers.map((tier) => (
        <div class:list={['pricing-card', { highlighted: tier.highlighted }]}>
          <h3>{tier.highlighted ? <strong>{tier.title}</strong> : tier.title}</h3>
          <p class="pricing-subtitle">{tier.subtitle}</p>
          <p class="pricing-price">{tier.price}</p>
          <h4>What's included</h4>
          <ul class="pricing-features">
            {tier.features.map((feature) => (
              <li>{feature}</li>
            ))}
          </ul>
          <a href={tier.ctaHref} class="btn">{tier.ctaLabel}</a>
        </div>
      ))}
    </div>
  </div>
  <script type="application/ld+json" set:html={JSON.stringify(professionalServiceSchema)} />
</section>

<style>
  .pricing-heading {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }
  .pricing-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: var(--spacing-md);
    align-items: start;
  }
  .pricing-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-md);
  }
  .pricing-card.highlighted {
    border-color: var(--color-accent);
    border-width: 2px;
    transform: scale(1.05);
    position: relative;
    z-index: 1;
  }
  .pricing-subtitle {
    font-size: 0.9rem;
    margin: var(--spacing-sm) 0;
  }
  .pricing-price {
    font-family: var(--font-heading);
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--color-text);
    margin: var(--spacing-sm) 0 var(--spacing-md);
  }
  .pricing-card h4 {
    font-size: 0.95rem;
    margin-bottom: var(--spacing-sm);
  }
  .pricing-features {
    margin-bottom: var(--spacing-md);
  }
  .pricing-features li {
    padding: var(--spacing-xs) 0;
    color: var(--color-text-muted);
    font-size: 0.9rem;
    padding-left: 1.5em;
    position: relative;
  }
  .pricing-features li::before {
    content: '✓';
    position: absolute;
    left: 0;
    color: var(--color-cta-border);
  }
  .pricing-card .btn {
    width: 100%;
    justify-content: center;
    font-size: 0.85rem;
    padding: 12px 20px;
  }
  @media (max-width: 768px) {
    .pricing-grid {
      grid-template-columns: 1fr;
      max-width: 450px;
      margin: 0 auto;
    }
    .pricing-card.highlighted {
      transform: none;
    }
  }
</style>
```

- [ ] **Step 4: Update index.astro to include strategy, services, and pricing sections**

Replace the entire content of `src/pages/index.astro`:

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import Hero from '../components/Hero.astro';
import StrategySection from '../components/StrategySection.astro';
import ServiceCards from '../components/ServiceCards.astro';
import PricingSection from '../components/PricingSection.astro';
import { fetchHomePage, fetchSiteSettings, fetchServiceCards, fetchPricingTiers } from '../lib/sanity';

const settings = await fetchSiteSettings();
const home = await fetchHomePage();
const serviceCards = await fetchServiceCards();
const pricingTiers = await fetchPricingTiers();

const jsonLd = [
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Alexander Demchak',
    url: 'https://alexanderdemchak.com',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Alexander Demchak',
    jobTitle: 'Fractional CTO & Web Developer',
    url: 'https://alexanderdemchak.com',
    sameAs: [
      'https://facebook.com/xhynk',
      'https://instagram.com/xhynk',
      'https://x.com/xhynk',
    ],
  },
];
---

<BaseLayout
  title={settings?.seoTitle || 'Alexander Demchak — Fractional CTO & Web Developer'}
  description={settings?.seoDescription || 'Over 15 years of web development experience.'}
  jsonLd={jsonLd}
>
  <Hero
    eyebrow={home?.heroEyebrow || '15+ years experience'}
    headingLine1={home?.heroHeadingLine1 || 'Your Story,'}
    headingLine2={home?.heroHeadingLine2 || 'My Expertise.'}
    body={home?.heroBody || ''}
    ctaLabel={home?.heroCtaLabel || 'Contact Alexander'}
    ctaHref={home?.heroCtaHref || '/contact'}
    images={home?.heroImages || []}
  />

  <StrategySection
    eyebrow={home?.strategyEyebrow || "LET'S GET YOU"}
    heading={home?.strategyHeading || 'A Better Strategy for Better Results'}
    body={home?.strategyBody || ''}
    image={home?.strategyImage}
  />

  <ServiceCards
    eyebrow={home?.servicesEyebrow || 'WORKING WITH ALEXANDER...'}
    headingLine1={home?.servicesHeadingLine1 || '...Is the Best Decision You Can Make!'}
    headingLine2={home?.servicesHeadingLine2 || 'What Options Are There?'}
    cards={serviceCards || []}
  />

  <PricingSection
    heading={home?.billingHeading || "Billing Isn't Fun, But It's Necessary"}
    tiers={pricingTiers || []}
  />
</BaseLayout>
```

- [ ] **Step 5: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/components/StrategySection.astro src/components/ServiceCards.astro src/components/PricingSection.astro src/pages/index.astro
git commit -m "feat: add Strategy, ServiceCards, and PricingSection components to home page"
```

---

## Task 8: Home Page — FAQ, Interstitial, CTA Sections

**Files:**
- Create: `src/components/FaqSection.astro`, `src/components/CtaSection.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Write FaqSection.astro**

```astro
---
// src/components/FaqSection.astro
interface FaqItem {
  question: string;
  answer: string;
}

interface Props {
  heading: string;
  subheading: string;
  items: FaqItem[];
}

const { heading, subheading, items } = Astro.props;

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: items.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: item.answer,
    },
  })),
};
---

<section class="faq section">
  <div class="container">
    <div class="faq-header">
      <h2>{heading}</h2>
      <p class="faq-sub">{subheading}</p>
    </div>
    <div class="faq-list">
      {items.map((item) => (
        <details class="faq-item">
          <summary>
            <h4>{item.question}</h4>
            <span class="faq-icon" aria-hidden="true"></span>
          </summary>
          <p class="faq-answer">{item.answer}</p>
        </details>
      ))}
    </div>
  </div>
  <script type="application/ld+json" set:html={JSON.stringify(faqSchema)} />
</section>

<style>
  .faq-header {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }
  .faq-sub {
    font-size: 1rem;
    margin-top: var(--spacing-xs);
  }
  .faq-list {
    max-width: 750px;
    margin: 0 auto;
  }
  .faq-item {
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-sm);
    overflow: hidden;
  }
  .faq-item summary {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: var(--spacing-sm) var(--spacing-md);
    cursor: pointer;
    list-style: none;
  }
  .faq-item summary::-webkit-details-marker {
    display: none;
  }
  .faq-item summary h4 {
    font-weight: 500;
    font-size: 1rem;
  }
  .faq-icon::after {
    content: '▸';
    font-size: 1.2rem;
    transition: transform 0.2s ease;
    display: inline-block;
  }
  .faq-item[open] .faq-icon::after {
    transform: rotate(90deg);
  }
  .faq-answer {
    padding: 0 var(--spacing-md) var(--spacing-md);
    font-size: 0.95rem;
    line-height: 1.7;
  }
</style>
```

- [ ] **Step 2: Write CtaSection.astro**

```astro
---
// src/components/CtaSection.astro
interface Props {
  heading: string;
  buttonLabel: string;
  buttonHref: string;
}

const { heading, buttonLabel, buttonHref } = Astro.props;
---

<section class="cta section">
  <div class="container cta-inner">
    <h2>{heading}</h2>
    <a href={buttonHref} class="btn">{buttonLabel}</a>
  </div>
</section>

<style>
  .cta {
    background: var(--color-bg-dark);
    text-align: center;
  }
  .cta h2 {
    margin-bottom: var(--spacing-md);
    color: var(--color-accent);
  }
</style>
```

- [ ] **Step 3: Update index.astro — add FAQ, interstitial, and CTA sections**

Add these imports at the top of the frontmatter (after the existing imports):

```typescript
import FaqSection from '../components/FaqSection.astro';
import CtaSection from '../components/CtaSection.astro';
import { fetchFaqItems } from '../lib/sanity';
```

Add the fetch call alongside the existing ones:

```typescript
const faqItems = await fetchFaqItems();
```

Add after the `</PricingSection>` closing tag:

```astro
  <section class="interstitial section">
    <div class="container" style="text-align: center;">
      <h2>{home?.interstitialHeading || "Let's Work Together Soon!"}</h2>
    </div>
  </section>

  <FaqSection
    heading={home?.faqHeading || 'Frequently Asked Questions'}
    subheading={home?.faqSubheading || 'Everything you need to know about the service and billing.'}
    items={faqItems || []}
  />

  <CtaSection
    heading={home?.ctaHeading || "Let's Bring Your Story To Life"}
    buttonLabel={home?.ctaButtonLabel || 'Contact Alexander Today'}
    buttonHref={home?.ctaButtonHref || '/contact'}
  />
```

- [ ] **Step 4: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/components/FaqSection.astro src/components/CtaSection.astro src/pages/index.astro
git commit -m "feat: add FAQ section with FAQPage schema, interstitial, and CTA to home page"
```

---

## Task 9: Recent Work Page

**Files:**
- Create: `src/components/PortfolioGrid.astro`, `src/pages/recent-work.astro`

- [ ] **Step 1: Write PortfolioGrid.astro**

```astro
---
// src/components/PortfolioGrid.astro
import { urlFor } from '../lib/imageUrl';

interface PortfolioItem {
  image: any;
  alt: string;
}

interface Props {
  items: PortfolioItem[];
}

const { items } = Astro.props;
---

<div class="portfolio-grid">
  {items.map((item) => (
    <div class="portfolio-item">
      <img
        src={urlFor(item.image).width(700).format('webp').url()}
        alt={item.alt || 'Portfolio work sample'}
        width="700"
        loading="lazy"
      />
    </div>
  ))}
</div>

<style>
  .portfolio-grid {
    columns: 2;
    column-gap: var(--spacing-sm);
  }
  .portfolio-item {
    break-inside: avoid;
    margin-bottom: var(--spacing-sm);
    border-radius: var(--radius-md);
    overflow: hidden;
  }
  .portfolio-item img {
    width: 100%;
    display: block;
  }
  @media (max-width: 768px) {
    .portfolio-grid {
      columns: 1;
    }
  }
</style>
```

- [ ] **Step 2: Write recent-work.astro**

```astro
---
// src/pages/recent-work.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import PortfolioGrid from '../components/PortfolioGrid.astro';
import { fetchPortfolioItems } from '../lib/sanity';

const portfolioItems = await fetchPortfolioItems();

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: 'Recent Work — Alexander Demchak',
  url: 'https://alexanderdemchak.com/recent-work',
  description: 'Portfolio of recent web development and technical leadership projects.',
};
---

<BaseLayout
  title="Recent Work — Alexander Demchak"
  description="Portfolio of recent web development and technical leadership projects by Alexander Demchak."
  jsonLd={jsonLd}
>
  <section class="section">
    <div class="container">
      <h1 style="text-align: center; margin-bottom: var(--spacing-lg);">Recent Work</h1>
      <PortfolioGrid items={portfolioItems || []} />
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 3: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/components/PortfolioGrid.astro src/pages/recent-work.astro
git commit -m "feat: add Recent Work page with masonry portfolio grid"
```

---

## Task 10: Contact Page

**Files:**
- Create: `src/pages/contact.astro`

- [ ] **Step 1: Write contact.astro**

```astro
---
// src/pages/contact.astro
import BaseLayout from '../layouts/BaseLayout.astro';

const email = 'me@alexanderdemchak.com';

const socialLinks = [
  { platform: 'Facebook', url: 'https://facebook.com/xhynk', icon: 'fb' },
  { platform: 'Instagram', url: 'https://instagram.com/xhynk', icon: 'ig' },
  { platform: 'X', url: 'https://x.com/xhynk', icon: 'x' },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ContactPage',
  name: 'Contact Alexander Demchak',
  url: 'https://alexanderdemchak.com/contact',
  mainEntity: {
    '@type': 'Person',
    name: 'Alexander Demchak',
    email: email,
    contactPoint: {
      '@type': 'ContactPoint',
      email: email,
      contactType: 'customer service',
    },
    sameAs: socialLinks.map((s) => s.url),
  },
};
---

<BaseLayout
  title="Contact — Alexander Demchak"
  description="Get in touch with Alexander Demchak for fractional CTO services, development retainers, or ad-hoc web development."
  jsonLd={jsonLd}
>
  <section class="contact section">
    <div class="container">
      <h1 class="contact-title">Contact</h1>
      <div class="contact-grid">
        <div class="contact-info-card">
          <h2>I'm always ready to help you.</h2>

          <div class="contact-email">
            <span class="contact-icon" aria-hidden="true">✉</span>
            <div>
              <h3>Email :</h3>
              <a href={`mailto:${email}`} class="email-link">{email}</a>
            </div>
          </div>

          <div class="contact-social">
            <h3>Follow me on:</h3>
            <div class="social-icons">
              {socialLinks.map((link) => (
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  class="social-link"
                  aria-label={`Follow on ${link.platform}`}
                >
                  {link.platform}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</BaseLayout>

<style>
  .contact-title {
    text-align: center;
    margin-bottom: var(--spacing-lg);
  }
  .contact-grid {
    max-width: 600px;
    margin: 0 auto;
  }
  .contact-info-card {
    background: var(--color-card-bg);
    border: 1px solid var(--color-card-border);
    border-radius: var(--radius-lg);
    padding: var(--spacing-lg);
  }
  .contact-info-card h2 {
    margin-bottom: var(--spacing-lg);
  }
  .contact-email {
    display: flex;
    align-items: start;
    gap: var(--spacing-sm);
    margin-bottom: var(--spacing-lg);
  }
  .contact-icon {
    font-size: 1.5rem;
    color: var(--color-text-muted);
  }
  .contact-email h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-xs);
  }
  .email-link {
    color: var(--color-accent);
    font-size: 0.95rem;
  }
  .email-link:hover {
    text-decoration: underline;
  }
  .contact-social h3 {
    font-size: 1rem;
    margin-bottom: var(--spacing-sm);
    text-align: center;
  }
  .social-icons {
    display: flex;
    justify-content: center;
    gap: var(--spacing-md);
  }
  .social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 45px;
    height: 45px;
    border-radius: var(--radius-sm);
    background: var(--color-accent);
    color: var(--color-text);
    font-family: var(--font-ui);
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    transition: background 0.2s;
  }
  .social-link:hover {
    background: var(--color-accent-hover);
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add src/pages/contact.astro
git commit -m "feat: add Contact page with mailto link, socials, and ContactPage schema"
```

---

## Task 11: Static Assets — Logo, Favicon, Placeholder Images

**Files:**
- Create: `public/favicon.svg`, `public/images/logo.png` (download from current site)

- [ ] **Step 1: Create favicon.svg**

Create a simple SVG favicon matching the "AD" monogram from the current site logo:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="12" fill="#0e1726"/>
  <text x="50" y="68" text-anchor="middle" font-family="Montserrat,sans-serif" font-weight="800" font-size="48" fill="#fd8040">AD</text>
</svg>
```

Write this to `public/favicon.svg`.

- [ ] **Step 2: Download logo from current site**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
mkdir -p public/images
curl -L -o public/images/logo.png "https://images.leadconnectorhq.com/image/f_webp/q_80/r_1200/u_https://assets.cdn.filesafe.space/8NxYEfvaoxU1AO3yX7fM/media/68b8c3c8315ac7fcf14e144a.png"
```

Note: If the curl fails due to the CDN URL, manually save the logo from the browser or create a placeholder. The logo can be replaced later via Sanity.

- [ ] **Step 3: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add public/
git commit -m "feat: add favicon, logo, and public assets"
```

---

## Task 12: Sanity Project Setup & Initial Content Seeding

This task requires interactive steps — creating a Sanity project and populating initial content.

- [ ] **Step 1: Create Sanity project**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx sanity@latest init --env .env --create-project "Alexander Demchak" --dataset production
```

This will add `SANITY_PROJECT_ID` and `SANITY_DATASET` to your `.env`. If the CLI prompts for options, select:
- Project name: `Alexander Demchak`
- Dataset: `production`
- Output path: (use the existing `sanity/` directory)

If the interactive CLI doesn't work well, create the project at [sanity.io/manage](https://sanity.io/manage) and manually set the project ID in `.env`.

- [ ] **Step 2: Update astro.config.mjs to read env correctly**

The Sanity integration needs the project ID at config time. Update `astro.config.mjs` to use `loadEnv`:

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import { loadEnv } from 'vite';
import sanity from '@sanity/astro';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

const env = loadEnv(import.meta.env.MODE, process.cwd(), '');

export default defineConfig({
  site: 'https://alexanderdemchak.com',
  output: 'static',
  integrations: [
    sanity({
      projectId: env.SANITY_PROJECT_ID,
      dataset: env.SANITY_DATASET || 'production',
      useCdn: false,
      studioBasePath: '/studio',
    }),
    react(),
    sitemap(),
  ],
});
```

- [ ] **Step 3: Verify the build works with Sanity connected**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx astro build
```

Expected: Build succeeds. Pages render with fallback content (since Sanity has no content yet). The `/studio` route should be generated.

- [ ] **Step 4: Run dev server and verify studio access**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx astro dev
```

Navigate to `http://localhost:4321/studio` — Sanity Studio should load with the schema types visible.

- [ ] **Step 5: Commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add astro.config.mjs
git commit -m "feat: configure Sanity project connection with loadEnv for build-time env access"
```

---

## Task 13: Verify Full Build & Local Testing

- [ ] **Step 1: Run astro build**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx astro build
```

Expected: Clean build with pages generated for `/`, `/recent-work`, `/contact`, and `/studio`.

- [ ] **Step 2: Preview the built site**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx astro preview
```

Open `http://localhost:4321` and verify:
- Home page renders all sections with fallback content
- Navigation links work between all 3 pages
- Contact page shows email and social links
- Recent Work page renders (empty grid until content is added)
- `/studio` loads Sanity Studio
- View page source to verify JSON-LD is present on each page
- Check `<head>` for correct meta tags, OG tags, canonical URL

- [ ] **Step 3: Verify sitemap**

Open `http://localhost:4321/sitemap-index.xml` — should list all 3 public pages.

- [ ] **Step 4: Final commit**

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git add -A
git commit -m "feat: complete alexanderdemchak.com Astro + Sanity rebuild — ready for deployment"
```

---

## Task 14: Cloudflare Pages Deployment Setup

- [ ] **Step 1: Create Cloudflare Pages project**

Go to Cloudflare Dashboard → Pages → Create a project → Connect to Git.

Or use Wrangler CLI:

```bash
cd c:/Users/Phodo/Projects/xhynk.com
npx wrangler pages project create alexanderdemchak-com
```

- [ ] **Step 2: Configure build settings**

In the Cloudflare Pages dashboard, set:
- **Build command:** `npm run build`
- **Build output directory:** `dist`
- **Environment variables:**
  - `SANITY_PROJECT_ID` = your project ID
  - `SANITY_DATASET` = `production`
  - `NODE_VERSION` = `20`

- [ ] **Step 3: Deploy**

Push to your connected git repo. Cloudflare Pages will build and deploy automatically.

```bash
cd c:/Users/Phodo/Projects/xhynk.com
git remote add origin <your-repo-url>
git push -u origin main
```

- [ ] **Step 4: Set up Sanity webhook for auto-rebuild**

In the Sanity dashboard (sanity.io/manage → your project → API → Webhooks), create a webhook:
- **Name:** Cloudflare Pages Rebuild
- **URL:** Your Cloudflare Pages deploy hook URL (found in Pages → Settings → Builds & deployments → Deploy hooks)
- **Trigger on:** Create, Update, Delete
- **Filter:** Leave empty (trigger on all content changes)

- [ ] **Step 5: Verify production site**

Open the Cloudflare Pages URL and verify all pages render correctly. Check:
- All JSON-LD structured data renders in page source
- OG meta tags are correct
- Sitemap is accessible
- `/studio` loads Sanity Studio
