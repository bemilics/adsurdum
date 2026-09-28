import { useState } from 'react'
import type { Ad } from '../ads/types'
import { AdCard } from '../components/AdCard'
import { useAds } from '../hooks/useAds'
import { usePersona } from '../hooks/usePersona'

export function Explore() {
  const { persona } = usePersona()
  const { ads, error } = useAds('card')
  const [selected, setSelected] = useState<Ad | null>(null)

  return (
    <div className="h-full overflow-y-auto">
      <header className="safe-top sticky top-0 z-30 border-b border-line bg-void/95 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">Explore</h1>
        <p className="text-xs text-fog">An uncurated grid of things nobody asked for.</p>
      </header>

      {error && <p className="px-4 py-6 text-sm text-fog">{error}</p>}

      <div className="columns-2 gap-1 p-1 sm:columns-3">
        {ads.map((ad) => (
          <button
            key={ad.id}
            type="button"
            onClick={() => setSelected(ad)}
            className="group relative mb-1 block w-full overflow-hidden bg-ink text-left"
          >
            <img
              src={ad.imageUrl}
              alt={ad.headline}
              loading="lazy"
              className="block w-full object-cover transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/90 to-transparent p-2">
              <p className="truncate text-xs font-semibold">{ad.brand}</p>
              <p className="truncate text-[10px] text-fog">{ad.headline}</p>
            </div>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className="fixed inset-0 z-50 overflow-y-auto bg-void"
          role="dialog"
          aria-modal="true"
        >
          <div className="mx-auto max-w-lg pb-16">
            <div className="safe-top sticky top-0 z-10 flex items-center justify-between border-b border-line bg-void/95 px-4 py-3 backdrop-blur">
              <span className="text-sm font-semibold">Sponsored, forever</span>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-full border border-line px-3 py-1 text-xs uppercase tracking-wider text-fog"
              >
                Close
              </button>
            </div>
            <AdCard ad={selected} persona={persona} />
          </div>
        </div>
      )}
    </div>
  )
}
