# Astool Fly | أسطول فلاي: project guide for coding agents (opencode)

Bilingual (Arabic RTL / English LTR) website for a travel office in Yemen: domestic and international transport (Saudi Arabia, Oman), parcels, Umrah / family-visit / East Asia visas, passport issue and renewal, plus other travel services. Brand: navy `#012382`, blue `#0B63D9`, orange `#FF6B00`, amber `#FFB020`.

## Stack
Next.js 15 (App Router) + React 19 + TypeScript (~5.9; **TypeScript 7 is not supported by Next 15**). Static export (`output: "export"`): the build produces plain HTML in `out/` that any static host serves. Plain CSS in `app/globals.css` (no Tailwind). No runtime dependencies besides Next/React.

## Commands
```bash
npm install
npm run dev          # http://localhost:3000/ar/
npm run build        # -> out/  (also writes out/index.html, the language redirect)
npx serve out        # preview the exported site
```
Set the real domain before building for production: `NEXT_PUBLIC_SITE_URL=https://yourdomain.com npm run build` (used for canonical, hreflang, sitemap, structured data, OG image). GitHub Pages project sites also need `NEXT_PUBLIC_BASE_PATH=/astool-fly`; root/custom-domain hosting leaves it empty (or `/`). `.github/workflows/deploy.yml` sets both defaults.

## Structure
- `app/[lang]/layout.tsx`: root layout, sets `<html lang dir>`; `lang` is `ar` or `en`.
- `app/[lang]/{page,transport,routes,visas,more,request,contact}`: one folder per page, each exports `generateMetadata` and renders server components.
- `app/sitemap.ts`, `app/robots.ts`: generated `sitemap.xml` / `robots.txt`.
- `scripts/postbuild.mjs`: writes `out/index.html` (redirects `<base>/` to `<base>/ar/` or `<base>/en/` by browser language).
- `components/`: `Header` (client: nav, mobile menu, language switch link), `Footer` (+ floating WhatsApp button), `AirlinesStrip` (moving airline-logo marquee shown on every page above the footer), `Blocks` (PageHero, ServiceCard, DocRow, StepsBox, CtaBand, RoutePanel), `RequestForm` (client: builds the WhatsApp message), `HeroSlideshow` (client: 12 landmark photos from Wikimedia Commons as a full-bleed hero background, 5s each, bilingual captions, reduced-motion aware; replaces the map in the home hero), `WorldMap` (client: canvas animation on inner-page banners), `Effects` (client: scroll reveal), `Icon`, `JsonLd`.
- `lib/content.ts`: types, `tr(lang)` helper, page titles/descriptions (`PAGES`), exports of the data.
- `lib/data.json`: services, airlines, cities, steps, FAQ and hero slideshow images/captions/credits (each text is `{ar, en}`). **Edit content here.**
- `lib/config.ts`: **office settings** (WhatsApp number, phone, address, hours, site URL, base path, `assetPath()` helper).
- `lib/seo.ts`: `buildMetadata`, JSON-LD builders (TravelAgency, BreadcrumbList, FAQPage).
- `lib/grid.json`: land mask for the dotted world map (`0` sea, `1` land, `2` Yemen, `3` Saudi/Oman).
- `public/`: logos (`logo-ar.webp` light version, `logo-en.webp` transparent), `favicon.png`, `og.png` (1200x630).

## Rules
1. **Every text exists in both languages.** Use `tr(lang)("عربي", "English")` or `{ar, en}` data. Never ship one language only.
2. **Each language has its own URL** (`/ar/...`, `/en/...`). Do not switch language with client-side state.
3. **SEO per page:** one `<h1>`, `generateMetadata` via `buildMetadata(lang, key)`, a `PAGES` entry with title (<= 60 chars ideally) and description (~150 chars) in both languages, JSON-LD where relevant. New pages must be added to `PAGES` (sitemap and nav read it).
4. **Use relative imports**, not the `@/` alias (the alias failed to resolve in this build setup).
5. **Do not invent facts:** no prices, processing times, legal requirements or visa countries. The office confirms these; keep the "office confirms" wording. East Asia countries are intentionally unnamed until the owner provides them.
6. Keep content in server components; only interactive pieces are `"use client"`.
7. Respect `prefers-reduced-motion`; keep contrast (orange buttons use dark ink text, not white).
8. Internal links use `pathFor(lang, "page")` (trailing slash). Request page is pre-filled by hash: `/ar/request/#international-jeddah` (`service-key` or `service-key-city-slug`).
9. Local assets from `/public` used in JSX must go through `assetPath()` from `lib/config.ts` so they work on GitHub Pages (`/astool-fly/...`). Keep `Link` targets as `pathFor(...)`; Next adds the base path automatically.

## Open items (ask the owner, do not guess)
- WhatsApp number, phone, address, opening hours -> `lib/config.ts` (until set, the form shows "copy the message" mode and the contact page shows "To be added").
- Real domain -> `NEXT_PUBLIC_SITE_URL`.
- "شحن / Shahn" in the domestic list is assumed to be the town of Shahn in Al-Mahrah; confirm (could be Ash-Shihr).
- The "Other services" page (flights, hotels, tourism, medical, study) is a proposal; confirm what the office really offers.
- East Asia: which countries are available.
- Tagline "نربط اليمن بالعالم / Connecting Yemen to the world" is a suggestion.
- Next SEO steps: dedicated landing pages per route/service (for example Aden to Jeddah, Umrah visa), Google Business Profile, Search Console + sitemap submission, real photos.
