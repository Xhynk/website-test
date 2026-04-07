# alexanderdemchak.com — Astro + Sanity + Cloudflare Pages Rebuild

**Date:** 2026-04-06
**Status:** Approved
**Goal:** Clone alexanderdemchak.com (currently on GoHighLevel) into a static Astro site backed by Sanity CMS, deployed on Cloudflare Pages. Maximize SEO, structured data, and performance.

---

## Architecture

- **Framework:** Astro v5 (SSG mode, `output: 'static'`)
- **CMS:** Sanity v3 (schema-as-code, Sanity Studio embedded at `/studio`)
- **Hosting:** Cloudflare Pages
- **Build trigger:** Sanity webhook → Cloudflare Pages deploy hook (rebuild on content change)
- **Zero client-side JavaScript** except Sanity Studio route

---

## Pages

| Route | Content Source | Description |
|-------|---------------|-------------|
| `/` | Sanity | Hero, strategy section, services (3 cards), pricing (3 tiers), FAQ accordion, final CTA |
| `/recent-work` | Sanity | Portfolio gallery (6 images, 2-column masonry grid) |
| `/contact` | Static | Contact info with mailto link, social links (no form) |
| `/studio` | Sanity Studio | Embedded CMS admin panel |

---

## Content Models (Sanity Schemas)

### SiteSettings (singleton)
- `logo` — image
- `navLinks` — array of { label: string, href: string }
- `footerText` — string (e.g. "© 2026 Alexander Demchak - All rights reserved.")
- `socialLinks` — array of { platform: string, url: string, icon: string }
- `seoDefaults` — { title: string, description: string, ogImage: image }

### HomePage (singleton)
- `heroEyebrow` — string ("15+ years experience")
- `heroHeadingLine1` — string ("Your Story,")
- `heroHeadingLine2` — string ("My Expertise.")
- `heroBody` — text (the subtitle paragraph)
- `heroCta` — { label: string, href: string }
- `heroImages` — array of images (the circular portrait grid)
- `strategyEyebrow` — string ("LET'S GET YOU")
- `strategyHeading` — string ("A Better Strategy for Better Results")
- `strategyBody` — array of block text (rich text paragraphs)
- `strategyImage` — image
- `servicesEyebrow` — string ("WORKING WITH ALEXANDER...")
- `servicesHeadingLine1` — string ("...Is the Best Decision You Can Make!")
- `servicesHeadingLine2` — string ("What Options Are There?")
- `billingHeading` — string ("Billing Isn't Fun, But It's Necessary")
- `ctaHeading` — string ("Let's Bring Your Story To Life")
- `ctaButtonLabel` — string ("Contact Alexander Today")
- `ctaButtonHref` — string

### ServiceCard (document)
- `title` — string (e.g. "Fractional CTO")
- `description` — text
- `image` — image
- `sortOrder` — number

### PricingTier (document)
- `title` — string (e.g. "Development & Analysis Retainer")
- `subtitle` — text (description paragraph)
- `price` — string (e.g. "From $1000/mo")
- `features` — array of strings
- `ctaLabel` — string
- `ctaHref` — string
- `highlighted` — boolean (for the featured/center tier)
- `sortOrder` — number

### FaqItem (document)
- `question` — string
- `answer` — text (or block content for rich text answers)
- `sortOrder` — number

### PortfolioItem (document)
- `image` — image (with hotspot/crop)
- `alt` — string
- `sortOrder` — number

### ContactPage (singleton)
- `heading` — string ("Contact")
- `infoHeading` — string ("I'm always ready to help you.")
- `email` — string
- `socialLinks` — array of { platform: string, url: string }

---

## SEO & Structured Data

### Meta Tags (every page)
- `<title>` — page-specific, pulled from Sanity or hardcoded
- `<meta name="description">` — page-specific
- `<link rel="canonical">` — absolute URL
- Open Graph: `og:title`, `og:description`, `og:image`, `og:url`, `og:type`
- Twitter Card: `twitter:card=summary_large_image`, `twitter:title`, `twitter:description`, `twitter:image`

### JSON-LD Structured Data
- **Every page:** `WebSite` schema with `name`, `url`
- **Homepage:** `Person` schema (Alexander Demchak, job title, social profiles via `sameAs`)
- **Homepage:** `ProfessionalService` schema (services offered, price ranges)
- **Homepage FAQ section:** `FAQPage` schema (eligible for Google rich results)
- **Contact page:** `ContactPoint` schema

### Technical SEO
- `sitemap.xml` via `@astrojs/sitemap`
- `robots.txt` allowing all crawlers
- Preconnect hints for Sanity CDN (`cdn.sanity.io`)
- All images with explicit `width`, `height`, `alt`, `loading="lazy"` (except hero)
- Semantic HTML throughout (`<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, `<article>`)

---

## Visual Design

### Color Tokens (CSS Custom Properties)
```css
--color-bg-primary: #0e1726;
--color-bg-dark: #000119;
--color-accent: #fd8040;
--color-text: #ffffff;
--color-text-muted: #aaacae;
--color-cta-border: #37ca37;
```

### Typography
- **Headings:** Montserrat (bold/semibold)
- **Body:** Lato (regular/light)
- **UI/Buttons:** Inter (bold)
- Loaded via Google Fonts with `font-display: swap`

### Layout
- Max content width: 1170px, centered
- Mobile-first responsive breakpoints: 480px, 768px, 1024px
- Hero: full-width dark bg, left-aligned text, right-side circular image grid
- Services: numbered list with alternating image positions
- Pricing: 3-column card grid, center card elevated/highlighted with accent border
- FAQ: native `<details>`/`<summary>` accordion, styled to match current design
- Recent Work: 2-column masonry image grid
- Contact: 2-column layout (mailto/socials on right)

### Images
- Hero portraits: circular crops with orange border accent
- Service images: rectangular with subtle rounded corners
- Portfolio images: full-bleed within grid cells
- All served via Sanity CDN with automatic format/size optimization

---

## Component Structure

```
src/
  layouts/
    BaseLayout.astro          — html head, meta, JSON-LD, header, footer
  components/
    Header.astro              — logo + nav (desktop + mobile hamburger)
    Footer.astro              — logo + copyright
    Hero.astro                — hero section with image grid
    StrategySection.astro     — "Better Strategy" section
    ServiceCards.astro         — 3 numbered service cards
    PricingSection.astro       — 3 pricing tier cards
    FaqSection.astro           — accordion with <details>
    CtaSection.astro           — final CTA banner
    SeoHead.astro             — reusable meta/OG/Twitter tags
    JsonLd.astro              — reusable JSON-LD script injection
    PortfolioGrid.astro       — masonry image grid
  pages/
    index.astro               — home page
    recent-work.astro         — portfolio page
    contact.astro             — contact page
    studio/
      [...catchAll].astro     — Sanity Studio
  lib/
    sanity.ts                 — Sanity client config + query helpers
  styles/
    global.css                — design tokens, reset, typography, utilities
  sanity/
    schema/                   — all Sanity schema definitions
    sanity.config.ts          — Sanity project config
```

---

## Sanity Studio Integration

Sanity Studio v3 is embedded as an Astro route at `/studio` using `sanity-astro` integration. In production, the studio is a client-rendered SPA served from the same domain — no separate deployment needed. Access is controlled by Sanity's built-in authentication (Google/GitHub login).

## Deployment

1. `astro build` outputs static files to `dist/`
2. Cloudflare Pages builds from git push (build command: `npm run build`)
3. Sanity webhook triggers Cloudflare Pages deploy hook on content publish
4. Sanity Studio accessible at `/studio` for content editing
5. Environment variables needed: `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_API_TOKEN` (read-only, for build-time queries)

---

## Contact Page

- No form — display email as `mailto:me@alexanderdemchak.com` link
- Social links: Facebook (`facebook.com/xhynk`), Instagram (`instagram.com/xhynk`), X (`x.com/xhynk`)
- Form handling can be added later (Cloudflare Workers, GoHighLevel API, etc.)

---

## Out of Scope

- Form submission handling
- Analytics integration
- Blog/content pages beyond the 3 defined routes
- Authentication/protected routes
- E-commerce functionality
