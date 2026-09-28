# Adsurdum

> **Scroll into the absurd.**

Adsurdum es una PWA mobile-first con un **feed infinito donde el 100 % del contenido son anuncios**.
Sin algoritmo, sin perfilamiento, sin cuenta. Es una *reductio ad absurdum* de la industria
publicitaria: se juega su propio juego contra ella.

**Tesis:** descubrir productos que no sabías que existían, con los mismos mecanismos que la
publicidad usa para perseguirte — pero sin perseguir a nadie.

---

## Qué hace

Tres vistas al estilo Instagram, más dos:

| Vista | Qué hay |
|---|---|
| **Feed** | Cards verticales con scroll infinito y pull-to-refresh (re-shuffle real) |
| **Explore** | Cuadrícula tipo masonry con modal de anuncio |
| **Reels** | Video full-screen con scroll-snap, autoplay muted y botón Skip |
| **Persona** | *Ghost Persona Builder*: inventa el perfil que los anunciantes creerían que tienes |
| **Truth** | Transparency: montos, ledger y destino de la donación |

**Pilares:**

- **Anonymous by design.** Sin cuenta, sin tracking, sin personalización.
- **Absurdist discovery.** Shuffle real (`Fisher-Yates` sobre `crypto.getRandomValues`), no orden curado.
- **Radical transparency.** Los ingresos se donan a Internet Archive; el ledger vive en la app y los
  comprobantes van al repo de transparencia.

---

## Instalación y uso

Requisitos: **Node 20+** y npm.

```bash
npm install        # dependencias
npm run dev        # servidor de desarrollo
npm run build      # typecheck + build de producción (tsc -b && vite build)
npm run preview    # sirve dist/ tal como se desplegaría
npm test           # suite (vitest)
npm run lint       # oxlint
```

**PWA:** el manifest y el service worker se generan en el build (`vite-plugin-pwa`).
La instalación como app y el cache offline funcionan **solo sobre HTTPS** — en `localhost` funciona
el dev server, pero para probar la instalación real se necesita HTTPS (túnel o deploy).

---

## Qué NO hace

Esto es lo que el código garantiza hoy, y es el producto entero:

- **No recolecta nada.** Cero `fetch`, cero analytics, cero cookies, cero `document.cookie`, cero
  SDKs de terceros. `connect-src 'self'` lo impide también desde la CSP.
- **La Ghost Persona nunca sale del dispositivo.** Vive en `localStorage` bajo la clave
  `adsurdum:persona`, se valida al leerse y se borra con el botón *Delete*.
- **No hay servidor de Adsurdum.** No hay backend, no hay base de datos, no hay cuentas.
- **Los links son directos.** Sin redirects ni parámetros de tracking: lo que ves en la tarjeta es
  lo que se abre.

---

## Límites y avisos

Lee esto antes de desplegar o monetizar:

1. **Los CTA del catálogo apuntan a `example.com`.** Los 50 anuncios son inventados y su destino es
   un dominio de documentación. *The link you see is the link you touch* es cierto — pero hoy tocas
   un placeholder. **No desplegar sin re-cataloguear.**
2. **Los assets son de terceros.** Imágenes de `picsum.photos` y videos de muestra del bucket de
   Google (`commondatastorage.googleapis.com`). Esos dominios ven tu IP y tu Referer. A escala,
   auto-alojar.
3. **No hay Privacy Policy todavía.** Cualquier red de anuncios o programa de afiliados la exige
   antes de aprobar.
4. **El repo aún no declara una licencia.** El código es de dominio reservado por defecto.
5. **Monetización sin decidir.** Ver `BITACORA.md`: AdSense tiene riesgo alto de ban en un feed que
   es 100 % anuncios; los afiliados son el mejor fit temático. La decisión es de *fit*, no de plata.
6. **Esto no es asesoría legal.** El análisis de ToS, privacidad y licencias se reportó con
   evidencia; la decisión final es de quien publica.

---

## Estructura del repo

```
index.html          CSP + meta
src/
  main.tsx          entry: ErrorBoundary + App
  App.tsx           shell y navegación por estado (sin router)
  views/            las 5 pantallas
  components/       AdCard, ReelPlayer, PersonaTheater, TabBar, ErrorBoundary
  hooks/            useAds (carga), useInfiniteScroll, usePersona
  ads/              AdSource (contrato) + mockSource + catalog.json
  persona/          storage (localStorage validado) + randomizer
  transparency/     ledger y totales
  lib/              shuffle, format, url (helpers puros)
docs/               arquitectura, módulos y decisiones
BITACORA.md         journal de estado y decisiones del proyecto
```

Detalle en [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md),
[`docs/MODULES.md`](docs/MODULES.md) y [`docs/DECISIONS.md`](docs/DECISIONS.md).
El estado vivo y el backlog están en [`BITACORA.md`](BITACORA.md).

---

## Roadmap

- [ ] Decidir monetización (afiliados vs. aparcar hasta escala)
- [ ] Re-cataloguear los 50 ads a productos reales con disclosure de afiliado
- [ ] Onboarding que declare qué puede inferir un ad network (IP coarse, device básico)
- [ ] Privacy Policy y About
- [ ] Repo público de transparencia + primer comprobante
- [ ] Videos propios para Reels (hoy, placeholders)
- [ ] Comprar dominio + deploy con headers de seguridad (CSP por header, `frame-ancestors`)
- [ ] Reels con más snap, Explore con foco/Escape en el modal, tope de scroll en Feed
