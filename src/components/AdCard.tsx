import { useMemo } from 'react'
import type { Ad } from '../ads/types'
import type { Persona } from '../persona/storage'
import { safeExternalUrl } from '../lib/url'
import { PersonaTheater } from './PersonaTheater'

interface Props {
  ad: Ad
  persona: Persona | null
}

/**
 * Decides whether this ad gets a persona line. Deterministic on the ad id so
 * the same ad keeps the same answer across re-renders (~1 in 7 ads).
 */
function showsTheater(adId: string): boolean {
  let h = 0
  for (const c of adId) h = (h * 31 + c.charCodeAt(0)) | 0
  return Math.abs(h) % 7 === 0
}

export function AdCard({ ad, persona }: Props) {
  const showTheater = useMemo(
    () => Boolean(persona) && showsTheater(ad.id),
    [ad.id, persona],
  )
  const href = safeExternalUrl(ad.destinationUrl)

  return (
    <article className="border-b border-line bg-void">
      {showTheater && persona && <PersonaTheater persona={persona} />}
      <header className="flex items-center gap-3 px-4 py-3">
        <div className="h-9 w-9 shrink-0 rounded-full bg-gradient-to-br from-acid/30 to-acid/5 ring-1 ring-line" />
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold">{ad.brand}</div>
          <div className="text-xs text-fog">Sponsored · obviously</div>
        </div>
      </header>
      <div className="relative aspect-square w-full bg-ink">
        <img
          src={ad.imageUrl}
          alt={ad.headline}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-4 py-3">
        <h2 className="text-base font-semibold leading-tight">{ad.headline}</h2>
        <p className="mt-1 text-sm leading-snug text-fog">{ad.body}</p>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-acid px-4 py-2 text-sm font-semibold text-void transition-opacity hover:opacity-90"
          >
            {ad.cta}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M7 17 L17 7 M7 7 h10 v10" />
            </svg>
          </a>
        ) : (
          <button
            type="button"
            className="mt-3 inline-flex items-center rounded-full border border-line px-4 py-2 text-sm font-semibold text-paper"
          >
            {ad.cta}
          </button>
        )}
        {href && (
          <p className="mt-2 break-all text-[11px] text-fog/70">
            The link you see is the link you touch: {href}
          </p>
        )}
      </div>
    </article>
  )
}
