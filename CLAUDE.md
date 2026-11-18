# MEGASOLAR — redesign of megasolar.com.ua

Client site for **MEGASOLAR** (Полтава, вул. Автобазівська 2/9, к. 16) — turnkey solar stations and an equipment shop: panels, inverters, batteries, mounts, electrical (Instagram @megasolar_ua). Deep forest black + the logo's palette: sun yellow (#fdd853), leaf lime, panel teal. Style references: `~/Desktop/aluabri` and `~/Desktop/superio`; skeleton copied from `~/Desktop/lineenergy` (same agency family, but its navy design, EnergyDay scene and calculator were replaced).

**Talk to the user in Russian.** Site copy is **Ukrainian only** (`lang="uk"`, ’ apostrophes, «» quotes). Read `docs/STATUS.md` first (open client questions, launch checklist).

## Commands
```bash
npm run dev                                   # port 3023
npm run build && npm start                    # production on :3023
kill $(lsof -ti tcp:3023 -sTCP:LISTEN)        # restart (the LISTEN filter keeps Chrome alive)
npm run lint && npx tsc --noEmit              # must stay clean
open -a "Google Chrome" http://localhost:3023
```
`node_modules` is a symlink to `../aluabri/node_modules` (same package.json deps). Run a real `npm install` before deploying elsewhere.

## Stack
Next.js 15 App Router · React 19 · TypeScript strict · plain CSS (`src/app/globals.css`, tokens in `:root`) · next/font (Unbounded display, Onest body, JetBrains Mono labels, Montserrat 800 wordmark) · no animation libraries (`src/lib/motion.ts`, `src/components/Effects.tsx`). Motion respects `prefers-reduced-motion`. Catalogue cards use the CSS-only `.card-in` entrance (no JS needed to see them).

## Layout
```
src/app/   / · /stantsii[/id] (19 ready stations) · /katalog · /katalog/[cat] · /tovar/[id] (126 products) · /obiekty[/slug] (11)
           /posluhy · /kredyt · /pro-nas · /faq · /kontakty · /koshyk (request cart) · api/lead · sitemap · robots
src/components/  Header (cart badge), Footer, Intro (sun rises in the mark), Logo (SVG mark + wordmark; pass a unique `id`), LeadForm/LeadModal,
                 CartToast (+AddToCart), CartView, BuyBox, CatalogBrowser, KitsBrowser, Savings (consumption → real kit), Blocks (product descriptions),
                 Shared (PageHero, ObjectCard, ProductCard, KitCard, KitVisual, Marquee, ContactBand, MoreObjects), Gallery, Effects, CursorLabel, MobileBar
src/components/home  Hero (video), Manifest, Anatomy (signature: station explodes into 5 isometric layers on scroll, each → catalogue),
                     Kits (rail), ObjectsStack, Sections (Process, Why, Review video, Guarantees, CreditBand, Tips dialog, Faq)
src/lib/   site.ts · catalog.ts (+catalog.json list, catalog-details.json descriptions — server only) · cart.ts (localStorage store) · objects.ts · copy.ts · media.json
```
Every fact comes from megasolar.com.ua or @megasolar_ua captions. Don't invent numbers; add open points to `docs/STATUS.md`.

## Data & media
- `scripts/build_catalog.py` rebuilds `src/lib/catalog*.json` from `research/catalog.json` + `research/descriptions.json` (scraped 2026-11-18 in the Playwright browser; the client host rate-limits scripts with 429, the browser gets through).
- Product photos `public/images/products/<id>.webp` were fetched in the browser and re-encoded on canvas (800 px). Kit renders of the client were cartoonish — kits use our own `KitVisual` instead.
- `scripts/build_media.py . [stills|video|sizes|all]` (python: `~/Desktop/aluabri/research/.venv/bin/python -I`): hero = Pexels 32966305 (licensed, free); montage band = client reel DKzQKZxpJlk; review = reel DQ6JnikCUVk; object stills = portfolio photos + reel frames. `research/raw` was deleted after the build (low disk) — re-fetch via Playwright if needed (see `scripts/fetch_raw.py` for the list).

## Leads
`/api/lead` → Telegram bot when `TELEGRAM_BOT_TOKEN` + `TELEGRAM_CHAT_ID` are set; otherwise 503 and the form shows phones + Direct. Cart orders arrive with source `cart` and the item list. No online payment, nothing stored. Indexing off until `NEXT_PUBLIC_SITE_LIVE=1`.
