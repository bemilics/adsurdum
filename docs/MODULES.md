# Módulos — Adsurdum

Contrato, límites y tests de cada módulo. La dirección de las dependencias está en
[`ARCHITECTURE.md`](ARCHITECTURE.md).

```bash
npm test        # toda la suite
npx vitest run src/lib        # solo helpers puros
npx vitest run src/persona    # solo storage
```

---

## `src/ads/` — fuente de anuncios

- **Responsabilidad:** única puerta de entrada al contenido. `types.ts` define el contrato,
  `mockSource.ts` lo cumple con el catálogo local, `index.ts` expone **el objeto que hay que
  reemplazar** para cambiar de fuente.
- **Contrato:** `AdSource.getAds(): Promise<Ad[]>` — devuelve el catálogo completo, sin filtrar ni
  barajar (eso lo hace `useAds`).
- **Errores:** `getAds()` puede rechazar. El llamador **no** debe tratarlo como lista vacía con
  éxito; `useAds` lo traduce a `error` visible.
- **Límites:** no conoce formatos de render, no pagina, no cachea, no hace fetch. `Ad.destinationUrl`
  debe ser http(s) absoluto — se valida en el render con `lib/url`, no aquí.
- **Tests:** `src/ads/mockSource.test.ts` — ids únicos, ambos formatos, campos requeridos, y que
  **ningún `destinationUrl` sea inseguro para un `<a href>`**.

## `src/hooks/useAds.ts` — carga para las 3 vistas

- **Responsabilidad:** un solo camino de carga: pedir → filtrar por formato → barajar → exponer
  error.
- **Contrato:** `useAds(format) → { ads, error, reload }`. `ads` llega **ya barajado**; `error` es
  `null` o un string listo para mostrar; `reload()` vuelve a leer la fuente y produce una
  permutación nueva (pull-to-refresh).
- **Errores:** cualquier rechazo de `getAds()` → `error` no nulo y `ads` vacío. El llamador debe
  pintar `error` en vez del estado vacío.
- **Límites:** no pagina ni virtualiza; no gestiona `visible` (eso es de Feed); hace *un* fetch por
  `format`, no por montaje. El estado de carga todavía no está expuesto: `ads === []` cubre tanto
  "cargando" como "vacío".
- **Tests:** ninguno — requiere render de React (`@testing-library/react` **no está instalado**; se
  necesita confirmación para agregarlo).

## `src/hooks/usePersona.ts` — persona compartida

- **Responsabilidad:** exponer la persona a Feed y Explore y mantenerla sincronizada entre
  pestañas.
- **Contrato:** `usePersona() → { persona }`. `persona` es `Persona | null`.
- **Errores:** ninguno propio; `loadPersona()` ya nunca lanza.
- **Límites:** **solo lectura**. Escribir va por `persona/storage` directamente (lo hace
  `GhostPersona`) — si se le añaden `save`/`clear` hay que decidir quién es el dueño del estado.
  Solo reacciona al evento `storage`, que el navegador dispara en *otra* pestaña; los cambios
  hechos en la propia pestaña se propagan desde el componente que escribe.
- **Tests:** ninguno (requiere render).

## `src/hooks/useInfiniteScroll.ts`

- **Responsabilidad:** devolver un ref de sentinel que dispara `onLoadMore` cuando se acerca al
  viewport (`rootMargin: 600px`).
- **Contrato:** `useInfiniteScroll(cb) → RefObject<HTMLDivElement>`. El callback se actualiza vía
  `callbackRef`, así que no reinicia el observer.
- **Errores:** ninguno. Si el observer no existe (SSR/entorno viejo), simplemente no dispara.
- **Límites:** no sabe nada de paginación ni de límites; **no frena los llamados**, así que un
  consumidor sin tope crece sin fin (ver fallo conocido #6 de Feed).
- **Tests:** ninguno (requiere DOM/observer).

## `src/persona/storage.ts` — persistencia de la persona

- **Responsabilidad:** leer/escribir/borrar la persona en `localStorage` sin romper nunca.
- **Contrato:** `loadPersona(): Persona | null` · `savePersona(p)` · `clearPersona()` ·
  `emptyPersona`. La clave es `adsurdum:persona`.
- **Errores:** `loadPersona()` devuelve `null` ante JSON malformado, payload que no sea objeto, o
  un campo conocido que no sea string. **Nunca lanza.**
- **Límites:** no migra versiones, no cifra, no expira (la retención la define el usuario con el
  botón *Delete*). Ignora campos desconocidos y rellena los ausentes con `''`. **Nunca sale del
  dispositivo.**
- **Tests:** `src/persona/storage.test.ts` — 8 casos, incluye la regresión del campo no-string.

## `src/persona/randomizer.ts`

- **Responsabilidad:** generar una persona absurda al azar.
- **Contrato:** `randomPersona(): Persona`.
- **Errores:** ninguno.
- **Límites:** usa `Math.random`, no `crypto` — **no es criptográfico ni reproducible**, y no debe
  serlo: es contenido, no seguridad. Las listas son fijas y en memoria.
- **Tests:** ninguno (cada llamada devuelve algo distinto; probarlo exigiría inyectar el RNG).

## `src/lib/` — lógica pura

| Módulo | Contrato | Límites | Tests |
|---|---|---|---|
| `shuffle.ts` | `shuffle<T>(arr) → T[]` (nueva copia) | Sesgo de módulo en `rand[0] % (i+1)` — despreciable con n≈50, no usar para muestreo estadístico | `shuffle.test.ts` (4) |
| `url.ts` | `safeExternalUrl(raw) → string \| null` | Solo `http:`/`https:`. Devuelve el href **normalizado**, para que lo mostrado coincida con lo enlazado | `url.test.ts` (4) |
| `format.ts` | `formatUsd(cents) → string` | Fijo a `en-US`/USD por decisión de producto | `format.test.ts` (1) |

`safeExternalUrl` **no** resuelve relative URLs, no sigue redirecciones y no audita el destino:
solo garantiza que el esquema no puede ejecutar código en este origin.

## `src/transparency/ledger.ts`

- **Responsabilidad:** datos y aritmética de la página de transparencia, fuera de la vista.
- **Contrato:** `LEDGER: readonly LedgerEntry[]` · `ledgerTotals(entries) → { grossCents, donatedCents }`
  · `REPO_URL` · `ARCHIVE_URL`.
- **Errores:** ninguno. `ledgerTotals` no muta la entrada.
- **Límites:** `REPO_URL` **es un placeholder que resuelve a 404** hasta que exista el repo de
  transparencia (está en el backlog de `BITACORA.md`). Los montos van en centavos enteros.
- **Tests:** `src/transparency/ledger.test.ts` (3).

## `src/components/`

| Componente | Responsabilidad | Límites |
|---|---|---|
| `AdCard.tsx` | Tarjeta de ad + CTA. Decide el teatro con un hash determinista del id (~1 de cada 7) | No valida el contenido del ad; delega el enlace a `safeExternalUrl` |
| `ReelPlayer.tsx` | Video de un reel: autoplay muted cuando está activo, pausa si no, botón Skip | El `catch` del autoplay es deliberado: si el navegador bloquea, espera el tap |
| `PersonaTheater.tsx` | Frase satírica armada desde la persona | No persiste nada; `buildLine` corta a `'This ad was not personalized'` si todos los campos están vacíos |
| `TabBar.tsx` | 5 tabs, controlado por `App` | Sin deep-linking: no empuja historial ni lee la URL |
| `ErrorBoundary.tsx` | Captura errores de render y ofrece *Reload* | **No** captura errores de handlers de eventos ni promesas async. Solo loguea a consola local: no hay telemetría |

## `src/views/`

| Vista | Responsabilidad | Límites |
|---|---|---|
| `Feed.tsx` | Pull-to-refresh, ventana de `PAGE = 10` items, sentinel infinito | `visible` **no tiene tope**: el DOM crece sin límite con el scroll (pendiente). Los items dan la vuelta sobre la lista, así que se repiten |
| `Explore.tsx` | Cuadrícula + modal | El modal declara `role="dialog"` pero **no** tiene Escape, trap de foco ni retorno de foco (pendiente) |
| `Reels.tsx` | Scroll-snap, activo vía IntersectionObserver, Skip | En el último reel *Skip* no hace nada (tope intencional) |
| `GhostPersona.tsx` | Formulario 5 campos, randomizer, Delete, panel de contraste | Escribe vía `persona/storage`; no comparte estado con `usePersona` salvo por el evento `storage` |
| `Transparency.tsx` | Ledger, totales y claim de privacidad | Solo presenta `transparency/ledger`. **Ver aviso de privacidad en `README.md`**: la UI no declara que picsum y el bucket de Google ven IP/Referer |

## `src/App.tsx` / `src/main.tsx`

- **Responsabilidad:** shell y navegación por `useState` (sin router), montaje con `StrictMode` y
  `ErrorBoundary` en el exterior.
- **Límites:** cambiar de tab **desmonta** la vista, así que se pierde el scroll y el estado
  efímero de cada una. Es intencional mientras no haya deep-linking; si algún día hay que
  conservarlo, hay que levantar el estado a `App` o meter un router.

## Deuda de testing

La suite cubre **toda la lógica pura** (23 tests). Lo que falta necesita render de React y
`@testing-library/react`, que **no está instalado** — agregarlo requiere confirmación:

- `useAds`: caminos de `error`, `reload`, y el filtrado por formato.
- `usePersona`: reacción al evento `storage`.
- `AdCard`: rama de teatro y fallback a `<button>` cuando no hay href.
- `Explore`: Escape y foco del modal (una vez resuelto el hallazgo de accesibilidad).
