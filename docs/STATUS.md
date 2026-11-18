# Status — started 2026-11-18

Local preview: http://localhost:3023. Local git only — no GitHub / Vercel yet (ask the user first).

## Done
Full redesign in Ukrainian: home (video hero, manifest, «Анатомія станції» scroll scene, ready stations rail, objects stack, consumption calculator that picks a real kit, process with drone video, why us, client video review, guarantees, credit band, engineering tips, FAQ, request band), 19 station pages with transparent composition tables, catalogue (5 categories, 126 products with filters, brand chips, search, sort), product pages, request cart, 11 object pages, services with price tables, credit (4 banks), about, FAQ (+FAQPage schema), contacts, 404, sitemap, robots. Checked at 1440 and 390 px; no horizontal scroll; lint + tsc clean.

## Sources used
- megasolar.com.ua: catalogue with prices (149 items), portfolio (9 objects), about, FAQ, credit table, service pages (монтаж $450–2000, шеф-монтаж від $350, проєктування від 12 000 грн), contacts, schedule.
- Instagram @megasolar_ua (≈118 captions read): «15+ років досвіду», process, «Чому нам довіряють», engineering tips, objects 200 кВт ground and 190 × TWMNH 620 Вт, client review reel.

## Questions for the client
1. **Where should leads and cart orders go?** Telegram bot (token + chat id) or another channel. Until then forms show the phones and Direct.
2. **Online payment / accounts:** the old site had a WooCommerce cart with online payment and accounts. The redesign uses a request cart (manager confirms stock and price). OK, or do they need real checkout?
3. **Prices:** copied 2026-11-18. Who updates them and how often? (Option: a simple admin or a Google Sheet feed.) Kit composition tables are in USD as on their site.
4. **Object figures that don't add up** (shown as the client titles them): «250 кВт» = 200 × 620 Вт (124 кВт panels) + 4 × 110 кВт inverters; «100 кВт DAH» = 100 × 555 Вт (55,5 кВт); «70 кВт» site says 120 panels, Instagram says 100 + 146 later. Please confirm.
5. **Object locations / owners:** none are named. Add towns if they allow.
6. **Review video:** we show reel DQ6JnikCUVk (the woman in the shop). Confirm we may use it on the site; more reviews welcome.
7. **Logo:** redrawn as SVG from their PNG. Send the vector if they have one.
8. **Messengers:** is 096 021 69 60 on Viber/Telegram? Are there real Facebook / YouTube pages (old footer links are generic)?
9. **Guarantees:** 25 years panels / 10 years LiFePO₄ / 5 years inverters are taken from kit tables — confirm as company-wide.
10. **Calculator yield:** 1 167 kWh per kW a year (their 12 kW kit: 14 MWh/year). Confirm or give their own figure.
11. **RU / EN versions:** old site has /ru and /en. The redesign is UA only.
12. **Hero video** is licensed stock (Pexels); their own drone footage of a big object would be even better.

## Launch checklist
- `npm install` (node_modules is a symlink), GitHub repo, Vercel project.
- Env: `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_SITE_URL`, then `NEXT_PUBLIC_SITE_LIVE=1`.
- 301 redirects from old WooCommerce URLs (`/product/<slug>/` → `/tovar/<id>` or `/stantsii/<id>`, `/product-category/...` → `/katalog/...`, `/portfolio/` → `/obiekty`).
- Send one test lead and one cart order from production.
