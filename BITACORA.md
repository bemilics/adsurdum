# BITACORA — Adsurdum

## Status
Fase: **MVP funcional completo** — app corriendo, pendiente decisión de monetización y deploy.

## Stack
- Vite 8 + React 19 + TypeScript
- Tailwind CSS v4 (CSS-first config)
- vite-plugin-pwa (Workbox) — SW generado, offline shell, autoUpdate
- Sin router (state-only), sin state lib, sin analytics, sin cookies
- Lint: oxlint · Test: vitest (`npm test`) · Build: `tsc -b && vite build` (todos pasan limpio)

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
- [x] `AdSource` interface + `mockSource` + catalog.json (**50 ads**: 45 cards + 5 reels)
- [x] App shell + TabBar (5 tabs: Feed, Explore, Reels, Persona, Truth)
- [x] Feed: infinite scroll (IntersectionObserver), pull-to-refresh con re-shuffle real
- [x] Explore: masonry CSS columns + modal de ad
- [x] Reels: scroll-snap vertical, autoplay muted, botón Skip
- [x] GhostPersona: form 5 campos, "Become Someone Else" randomizer, localStorage-only, contrast panel, PersonaTheater (~1/7 cards, etiquetado "Theater")
- [x] Transparency: ledger manual + "This app collects: nothing" + links a Internet Archive/repo
- [x] PWA: manifest, icons 192/512/maskable, SW con cache de picsum
- [x] CSP en index.html (solo self + picsum + media CDN)
- [x] Test mobile vía LAN (`vite --host`) — OK

## Completado (2026-09-27)
Auditoría con skills de calidad de código, ToS/legal y ciberseguridad. Solo se parcheó lo aprobado.
- [x] Suite **vitest: 23 tests** sobre lógica pura (`lib`, `persona/storage`, `transparency`, `ads`)
- [x] `useAds` unificado para Feed/Explore/Reels (con `.catch` → estado de error visible)
- [x] Validación de `localStorage` + `ErrorBoundary` (evita pantalla en blanca ante datos corruptos)
- [x] `safeExternalUrl` (allowlist http/https) en todos los `destinationUrl`
- [x] `AdSource` sin `getAdById` + contrato de errores documentado
- [x] `README.md` + `docs/ARCHITECTURE.md` + `docs/MODULES.md` + `docs/DECISIONS.md`
- [x] Corregido arriba: catálogo real es **45 cards + 5 reels** (decía 46 + 4)

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

## ToS/legal — hallazgos sobre la IDEA (2026-09-27)

Auditoría aplicada al **spec** (`adsurdum-prod-spec.md`), no al código. No es asesoría legal:
reporto riesgo con evidencia, la decisión final es del usuario. Los hallazgos sobre el **código
actual** son los T1–T5 del backlog; esta sección es sobre el producto que se quiere construir.

### Veredicto central

> **Adsurdum tiene una contradicción interna, no un bug.** El pilar #1 (*"no tracking, no
> third-party scripts, anonymous by design"* — spec:4) y la monetización #1 (*AdSense* — spec:13)
> **no pueden coexistir**: NPA ≠ sin cookies, AdSense setea cookies y exige CMP para EEA.
> Resolver esto desbloquea todo lo demás.

### Hallazgos por severidad

| ID | Hallazgo | Sev. | Veredicto | Estado |
|---|---|---|---|---|
| A1 | AdSense en un feed **100 % ads** viola "Valuable Inventory: No content" → rechazo/ban. Verificado: Google exige que el contenido del publisher supere a los anuncios en pantalla | crítico | **VIOLACIÓN** | **pendiente de decisión** |
| A2 | Pilar "no tracking / no third-party scripts" vs. AdSense (spec:4 vs spec:13; BITACORA:61 ya lo había detectado) | crítico | **VIOLACIÓN** | **pendiente de decisión** |
| A3 | **Comprobantes financieros en repo público**: nombre completo, nº de cuenta, IBAN, ID de transacción. El repo ya es público y git conserva el historial — borrar no sirve | alto | RIESGO_ALTO (PII) | pendiente: pipeline de redacción |
| A4 | Amazon Associates exige disclosure **literal** *"As an Amazon Associate I earn from qualifying purchases."* (y prohíbe agregar otras declaraciones sobre Amazon) + Privacy Policy pública. "Sponsored · obviously" no calza | medio | RIESGO_MEDIO | pendiente |
| A5 | Claim *"todos los ingresos se donan a Internet Archive"* sin comprobentes = publicidad engañosa si no se cumple. Usar su logo puede implicar aval | medio | RIESGO_MEDIO | pendiente |
| A6 | UI "estilo Instagram" + tab **"Reels"** (spec:8-9). Meta protege sus elementos de producto | medio | RIESGO_MEDIO | pendiente · **hipótesis**: no verifiqué registros de marca |
| A7 | Copy satírico + link de compra real (Fase 2 "absurd AND real"): la sátira no es defensa ante publicidad engañosa | medio | RIESGO_MEDIO | pendiente |
| A8 | Onboarding/Privacy Policy con la inferencia del ad network: hoy es UX, con red integrada **es requisito legal** (Ley 19.628 / GDPR) | medio | RIESGO_MEDIO | pendiente — **no post-launch** |
| A9 | Fase 2 "votación comunitaria": si el usuario pudiera **donar a través** del sitio deja de ser publisher y pasa a ser intermediario de recaudación | bajo | RIESGO_BAJO | regla fija |
| A10 | Assets de terceros: `picsum.photos` (Unsplash) y bucket de Google | bajo | RIESGO_BAJO | pendiente — autoservir a escala |

### Líneas rojas del proyecto (derivadas del spec)

**Prohibido siempre:**
- Clic en anuncios propios, o pedirlo → *invalid traffic* = ban + posible deuda
- Tráfico bot / clickfarm / tráfico comprado
- **Enviar la Ghost Persona a un servidor** (rompe el pilar entero)
- **Recibir pagos o donaciones de usuarios en el sitio** — solo dona el sitio, su propio ingreso
- Signup automatizado o compartir credenciales de publisher
- AdSense en el feed sin resolver *Valuable Inventory*
- Links de afiliado con shortener o redirect
- Logo/marca de Internet Archive o Meta que implique aval

**Permitido en esta versión:** mostrar anuncios servidos · leer inventario · clic de usuario hacia
comercios · cuentas de publisher hechas a mano · tráfico orgánico · link directo visible.

### Orden de desbloqueo
1. **Resolver A1/A2** — elegir qué promete el producto (todo lo demás depende de esto)
2. **A8** — Privacy Policy + onboarding (prerrequisito legal de cualquier red, no tarea post-launch)
3. **A3** — pipeline de redacción de comprobantes antes de publicar el repo de transparencia
4. **A4** — disclosure literal de afiliado
5. **A5/A6/A7** — claim de donación, marca y copy antes de hacer repo público y monetizar

## Backlog
- [ ] **Decidir monetización** (afiliados ahora vs. aparcar hasta escala) — **primero resolver A1/A2**: AdSense vs. el pilar "no tracking" es una contradicción del producto, no de implementación
- [ ] Comprar dominio + deploy (Cloudflare Pages / Netlify, HTTPS)
- [ ] Test PWA install real (requiere HTTPS: cloudflared/ngrok tunnel o deploy)
- [ ] Si afiliados: re-cataloguear 50 ads a productos reales con links + disclosure
- [ ] Onboarding que declara qué puede inferir un ad network (del spec original) — **A8: con una red real integrada es requisito legal (Ley 19.628 / GDPR), no una tarea post-launch**
- [ ] Páginas estáticas: About, Privacy Policy (requeridas por cualquier red/afiliado)
- [ ] Repo público de transparencia + primer comprobante, **con redacción de PII financiera antes de commitear** (A3: nombre, cuenta, IBAN, ID de transacción)
- [ ] Reels con videos propios (placeholders actuales son mp4 de muestra de Google)
- [ ] Copy final en Transparency según monetización elegida
- [ ] **Antes de repo público y monetizar (A5–A7)**: claim de donación a Internet Archive con comprobantes y sin implied endorsement · revisar marcas/nombre (tab "Reels", UI tipo Instagram) · disclaimer de sátira junto a links de compra reales (Fase 2)
- [ ] **Cerrar hallazgos ToS/legales (T1–T5)**: CTAs a `example.com`, disclosure de afiliado, matizar el claim "collects: nothing", Privacy Policy, LICENSE, `robots.txt`
- [ ] Hardening de seguridad pendiente: CSP por header con `frame-ancestors` (el `<meta>` no lo admite), tope de scroll en Feed, Escape/foco en el modal de Explore

## Notas
- Copy en inglés, tono deadpan. Tagline: "Scroll into the absurd."
- Ads con `destinationUrl` renderizan link directo, sin redirects/trackers
- Persona vive solo en localStorage, nunca se transmite
- Ingresos futuros → Internet Archive (100%), comprobantes en repo público
- Usuario maneja todo lo de Git; bitácora se actualiza solo a pedido explícito
