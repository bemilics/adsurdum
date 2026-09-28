# Arquitectura — Adsurdum

## Qué es y para quién

Adsurdum es una PWA mobile-first cuyo feed es **100 % anuncios**: un experimento satírico sobre la
industria publicitaria, para usuarios móviles que scrollean en modo oscuro. No tiene backend ni
cuentas; el único estado persistente vive en `localStorage` del dispositivo. El copy de la UI está
en inglés (tono *deadpan*); la documentación del repo está en español.

## Diagrama de módulos

La dirección de las flechas **es la dirección de las importaciones**. Nunca al revés.

```
                        main.tsx
                            │
                    ErrorBoundary  (envoltorio, defensa)
                            │
                          App.tsx  ──── estado: tab activo
                            │
      ┌───────────┬─────────┼──────────┬──────────────┐
      ▼           ▼         ▼          ▼              ▼
  views/Feed  views/Explore views/Reels views/     views/
      │           │         │       GhostPersona   Transparency
      │           │         │          │              │
      ▼           ▼         ▼          ▼              ▼
  hooks/useAds ───┴─────────┘    persona/storage  transparency/
      │                            (localStorage)    ledger
      ▼                                │
  ads/index.ts  (AdSource)             ▼
      │                          persona/randomizer
      ▼
  ads/mockSource ──▶ ads/catalog.json

  views ──▶ components/  (AdCard, ReelPlayer, PersonaTheater, TabBar)
  cualquiera ──▶ lib/     (shuffle, format, url)   ← sin dependencias internas
```

**Regla:** `views → components|hooks → ads|persona|transparency|lib`. Los módulos inferiores nunca
importan de los superiores. `lib/` no importa de nadie del proyecto: es lógica pura.

## Flujo de datos end-to-end

### 1. Anuncios
```
catalog.json → mockSource.getAds() → useAds(format)
                                          │  filtra por format
                                          │  shuffle(Fisher-Yates / crypto)
                                          │  getAds() rechazado → error legible
                                          ▼
                                   { ads, error, reload }
                                          │
                              Feed / Explore / Reels
                                          ▼
                              AdCard | ReelPlayer
                                          │
                       safeExternalUrl(destinationUrl) ──▶ <a href> o <button>
```

El contrato completo está en `src/ads/types.ts`. **`AdSource` es el único punto de swap** para
reemplazar el mock por una red real sin tocar ninguna vista.

### 2. Ghost Persona (solo dispositivo)
```
formulario ──▶ savePersona() ──▶ localStorage['adsurdum:persona']
                                        │
            loadPersona() ◀─────────────┘   valida forma y tipos, nunca lanza
                                        │
                              usePersona() ──▶ evento `storage` (sync entre pestañas)
                                        │
                              AdCard ──▶ PersonaTheater (~1 de cada 7 ads)
```

No hay ninguna ruta de salida hacia la red: el proyecto **no contiene `fetch`, `XMLHttpRequest` ni
`sendBeacon`**. Esa es la garantía que la UI promete.

### 3. Transparencia
```
transparency/ledger.ts (ENTRIES + REPO_URL + ARCHIVE_URL)
        │
        ├── ledgerTotals(entries) ──▶ totales agregados
        ▼
views/Transparency ──▶ <a> a Internet Archive y al repo de comprobantes
```

## Superficie de red y de seguridad

| Origen | Qué se pide | Por qué | Controlado por |
|---|---|---|---|
| `self` | JS, CSS, HTML, icons, SW | la app | CSP `script-src`/`default-src` |
| `picsum.photos` | imágenes de los ads | placeholders del MVP | CSP `img-src` + cache Workbox (30 días, 200 entradas) |
| `commondatastorage.googleapis.com` | mp4 de los Reels | placeholders del MVP | CSP `media-src` |

`connect-src 'self'` impide que cualquier código embebido exfiltrado hacia otro dominio. La CSP está
en `<meta>` en `index.html` y **sobrevive al build** (verificado en `dist/index.html`).

> `frame-ancestors` **no puede** declararse en un `<meta>`: el anti-clickjacking tiene que venir
> como header en el deploy.

## Puntos de fallo conocidos

1. **`adSource.getAds()` puede rechazar.** Hoy es imposible (mock local), pero el camino existe:
   `useAds` lo convierte en `error` y cada vista lo renderiza. Antes de este cambio el `.then()` no
   tenía `.catch()` y el Feed mostraba *"You've seen everything"* como si fuera éxito.
2. **`localStorage` corrupto o editado a mano.** `loadPersona()` devuelve `null` en vez de lanzar.
   Antes, un campo no-string llegaba a `.trim()` y tumaba la app entera.
3. **Crash durante el render.** `ErrorBoundary` en `main.tsx` lo captura. Sin él, React desmonta el
   árbol completo y el usuario ve blanco en las 5 pestañas.
4. **`REPO_URL` es un placeholder** (`github.com/your-org/...`): el enlace "repo" de la página de
   transparencia resuelve a 404 hasta crear ese repo.
5. **Los 50 CTAs apuntan a `example.com`.** Placeholder de catálogo, no bug — pero bloquea deploy.
6. **Feed sin tope de scroll.** `visible` crece en `PAGE` (10) sin límite y los items dan la vuelta
   sobre la lista, así que el DOM crece de forma ilimitada mientras se scrollea. Pendiente
   (virtualización o ventana deslizante).
7. **Dependencia de terceros para los assets.** Si `picsum.photos` o el bucket de Google caen, los
   ads quedan sin imagen (las que ya están en cache siguen disponibles).

## Convenciones

- **Código en inglés**, comentarios solo donde aportan *por qué*, no *qué*.
- **Docs en español**, porque es el idioma en que ya venía documentado el proyecto.
- **Lógica pura en `src/lib/` y `src/transparency/`**, testeable sin mocks.
- **Un solo journal de estado:** `BITACORA.md`. Este `docs/` documenta estructura y decisiones; el
  estado vivo y el backlog viven allá.
