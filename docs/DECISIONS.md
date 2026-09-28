# Decisiones — Adsurdum

Registro de decisiones de diseño con la alternativa descartada. El **estado vivo y el backlog** no
viven aquí: están en [`BITACORA.md`](../BITACORA.md), que es el único journal del proyecto.

> Las filas marcadas **[bitácora]** ya estaban registradas allí y se reproducen con su alternativa
> explícita. Las demás se tomaron en la auditoría de 2026-09-27.

| Fecha | Decisión | Alternativa descartada | Rationale |
|---|---|---|---|
| 2026-09-20 | **[bitácora]** Navegación por estado, sin router | `react-router` | 5 tabs fijas, sin deep-linking requerido; un router agrega ruido y no resuelve nada todavía |
| 2026-09-20 | **[bitácora]** `localStorage` + JSON, sin librería de estado | Zustand / Redux / Context global | Suficiente para 5 vistas con un único dato persistente; menos superficie que mantener |
| 2026-09-20 | **[bitácora]** Interfaz `AdSource` como punto de swap | `fetch` directo desde cada vista | Permite reemplazar el mock por una red real sin tocar ninguna vista; hoy es la única frontera entre el contenido y el código |
| 2026-09-20 | **[bitácora]** Fisher-Yates sobre `crypto.getRandomValues` | `Math.random` | Shuffle real, no pseudoaleatorio de baja calidad, y sin persistir el orden |
| 2026-09-20 | **[bitácora]** Placeholders externos (`picsum.photos` + mp4 de Google) | Generar imágenes y videos propios | Cero trabajo de generación para el MVP. Acepta la dependencia de terceros y el costo de IP/Referer expuesto, anotado como límite |
| 2026-09-20 | **[bitácora]** `vite-plugin-pwa` con Workbox | Service worker escrito a mano | Estándar y con offline shell automático; un SW casero es deuda de mantenimiento |
| 2026-09-20 | **[bitácora]** Dark mode por defecto, accent `#a3e635` | Light mode o respetar `prefers-color-scheme` | Estética Instagram-dark e identidad propia; el modo claro se puede añadir después sin tocar contratos |
| 2026-09-20 | **[bitácora]** Catálogo mock local en vez de AdSense directo | AdSense como primera integración | AdSense exige sitio live + aprobación y su política "Valuable Inventory" prohíbe inventarios con más anuncios que contenido — Adsurdum es 100 % anuncios. Además rompería el claim "no third-party scripts" |
| 2026-09-27 | **Allowlist `http:`/`https:`** en todo `destinationUrl` vía `lib/url.ts` | Confiar en el catálogo tal cual | `destinationUrl` cae verbatim en un `<a href>`, y `AdSource` está pensado para enchufar una red remota: un `javascript:` sería XSS al clic en este origin. Costo: ~20 líneas |
| 2026-09-27 | **Validar la forma al leer `localStorage`** y devolver `null` si no calza | Hacer `cast` directo con `as Persona` | El valor es editable a mano y puede llegar por el evento `storage` de otra pestaña; un campo no-string llegaba a `.trim()` y mataba el render de la app entera |
| 2026-09-27 | **`ErrorBoundary` en el entrypoint** | Confiar en que nada falla al renderizar | Sin él, React desmonta el árbol completo y el usuario queda en blanco en las 5 pestañas. Loguea solo a consola local para no romper el claim de "no tracking" |
| 2026-09-27 | **Un único hook `useAds`** para Feed, Explore y Reels | Un `useEffect` copiado en cada vista | Las 3 vistas repetían el mismo efecto con flag `cancelled` y sin `.catch`, así que un fallo se disfrazaba de feed vacío. Centraliza fetch, filtro, shuffle y error en un solo lugar |
| 2026-09-27 | **`vitest.config.ts` propio**, separado de `vite.config.ts` | Reusar `vite.config.ts` | La suite cubre lógica pura y no debe cargar los plugins de React, Tailwind ni PWA: más rápido y sin efectos secundarios del SW durante los tests |
| 2026-09-27 | **`getAdById` eliminado de `AdSource`** | Dejarlo "por si acaso" | Nadie lo llamaba (Explore pasa el objeto directo). Sin router no hay lookup por id; se vuelve a agregar cuando exista una ruta que lo necesite |
| 2026-09-27 | **Datos y aritmética de transparencia en `src/transparency/ledger.ts`** | Dejar `ENTRIES` y los `reduce` dentro del componente | Separa la decisión de la ejecución: los totales quedan testeables sin render y la vista solo presenta |

## Decisiones pendientes (no tomadas)

Quedan abiertas en `BITACORA.md` y **no se decidieron** en esta auditoría:

- Monetización (afiliados vs. aparcar hasta escala).
- Privacy Policy, About y disclosure de afiliado.
- Licencia del repo.
- Re-cataloguear los 50 ads y reemplazar `REPO_URL`.
- Tope de scroll en el Feed, accesibilidad del modal de Explore, self-hosting de assets.
