# BITACORA — Adsurdum

## Status
Fase: **MVP funcional completo** — app corriendo, pendiente decisión de monetización y deploy.

## Stack
- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config)
- vite-plugin-pwa (Workbox) — SW generado, offline shell, autoUpdate
- Sin router (state-only), sin state lib, sin analytics, sin cookies
- Lint: oxlint · Build: `tsc -b && vite build` (ambos pasan limpio)

## Decisiones tomadas
| Fecha | Decisión | Razón |
|---|---|---|
| 2026-09-20 | Placeholders externos (picsum.photos + mp4 CDN) | Cero trabajo de generación para MVP |
| 2026-09-20 | vite-plugin-pwa con Workbox | Estándar, offline shell automático |
| 2026-09-20 | localStorage + JSON, sin librería de estado | Suficiente para 5 vistas |
| 2026-09-20 | State-only navigation (sin react-router) | 5 tabs, sin deep-linking requerido |
| 2026-09-20 | AdSource interface como swap point (`src/ads/index.ts`) | Reemplazar mock por red real sin tocar UI |
| 2026-09-20 | Fisher-Yates con `crypto.getRandomValues` | Shuffle real, sin persistencia de orden |
| 2026-09-20 | Dark mode default, accent `#a3e635` (acid), fondo `#0a0a0a` | Instagram-dark aesthetic, identidad propia |
| 2026-09-20 | Monetización: **PENDIENTE** | Ver sección Monetización — hallazgos |

## Completado (2026-09-20)
- [x] Scaffold Vite + TS + Tailwind v4 + PWA
- [x] `AdSource` interface + `mockSource` + catalog.json (**50 ads**: 46 cards + 4 reels)
- [x] App shell + TabBar (5 tabs: Feed, Explore, Reels, Persona, Truth)
- [x] Feed: infinite scroll (IntersectionObserver), pull-to-refresh con re-shuffle real
- [x] Explore: masonry CSS columns + modal de ad
- [x] Reels: scroll-snap vertical, autoplay muted, botón Skip
- [x] GhostPersona: form 5 campos, "Become Someone Else" randomizer, localStorage-only, contrast panel, PersonaTheater (~1/7 cards, etiquetado "Theater")
- [x] Transparency: ledger manual + "This app collects: nothing" + links a Internet Archive/repo
- [x] PWA: manifest, icons 192/512/maskable, SW con cache de picsum
- [x] CSP en index.html (solo self + picsum + media CDN)
- [x] Test mobile vía LAN (`vite --host`) — OK

## Monetización — hallazgos de investigación (2026-09-20)

### Tabla revenue estimado (mensual)
| Proveedor | RPM | 10k imp | 100k imp | Min payout |
|---|---|---|---|---|
| AdSense (NPA) | $1–3 | $10–30 | $100–300 | $100 |
| EthicalAds | ~$2.50 CPM | rechazado | $250* | $50 |
| A-Ads | $0.05–0.30 | $0.50–3 | $5–30 | ~0 (BTC) |
| Afiliados (Amazon) | CPA | $3–20 | $30–200 | $10 |
| Deals directos | — | $0 | $100–1000 | — |

### Hallazgos críticos
1. **EthicalAds descartado por política**: requiere 50k+ pageviews/mes, audiencia dev-only, y su display policy exige "único ad en la página, fuera del flujo de contenido" — incompatible con un feed de ads.
2. **AdSense puro casi inviable**: política "Valuable Inventory" de Google prohíbe ads en pantallas "sin contenido del publisher" o "con más ads que contenido". Adsurdum es 100% ads → riesgo alto de rechazo/ban. Además: rompe "no third-party scripts", exige CMP GDPR para EEA, setea cookies.
3. **A-Ads**: alineado en privacidad (sin cookies, sin datos personales, desde 2011) pero audiencia crypto/gambling (off-brand) y revenue simbólico.
4. **Afiliados (Amazon Associates) = mejor fit temático**: los ads pasan de "absurd-but-real-style" a **absurd AND real** (USB Pet Rocks existen y se compran). Cero scripts, cero cookies propias, sin mínimo de pageviews, consistente con "the link you see is the link you touch". Requiere: aprobación Amazon, 3 ventas/180 días, disclosure.
5. **Insight honesto**: a escala MVP todas las opciones generan ≈$0. La decisión actual es de fit, no de plata.

### Recomendación por fases (propuesta, no decidida)
- **Ahora**: mock + links afiliados reales en productos absurdos
- **Escala (50k+ pv)**: EthicalAds/Carbon/BuySellAds si audiencia es dev, o deals directos
- **No recomendado**: AdSense puro

## Backlog
- [ ] **Decidir monetización** (afiliados ahora vs. aparcar hasta escala)
- [ ] Comprar dominio + deploy (Cloudflare Pages / Netlify, HTTPS)
- [ ] Test PWA install real (requiere HTTPS: cloudflared/ngrok tunnel o deploy)
- [ ] Si afiliados: re-cataloguear 50 ads a productos reales con links + disclosure
- [ ] Onboarding que declara qué puede inferir un ad network (del spec original)
- [ ] Páginas estáticas: About, Privacy Policy (requeridas por cualquier red/afiliado)
- [ ] Repo público de transparencia + primer comprobante
- [ ] Reels con videos propios (placeholders actuales son mp4 de muestra de Google)
- [ ] Copy final en Transparency según monetización elegida

## Notas
- Copy en inglés, tono deadpan. Tagline: "Scroll into the absurd."
- Ads con `destinationUrl` renderizan link directo, sin redirects/trackers
- Persona vive solo en localStorage, nunca se transmite
- Ingresos futuros → Internet Archive (100%), comprobantes en repo público
- Usuario maneja todo lo de Git; bitácora se actualiza solo a pedido explícito
