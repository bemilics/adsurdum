import { useCallback, useEffect, useMemo, useState } from 'react'
import { adSource } from '../ads'
import type { Ad, AdFormat } from '../ads/types'
import { shuffle } from '../lib/shuffle'

export interface AdsView {
  /** Ads of the requested format, shuffled. Empty while loading or after a failure. */
  ads: Ad[]
  /** Non-null when the source rejected; the view must show it, not an empty-state joke. */
  error: string | null
  /** Re-reads the source, which yields a fresh permutation. Used by pull-to-refresh. */
  reload: () => void
}

/**
 * Single loading path for every view (Feed, Explore, Reels).
 *
 * Fetches once per format, filters, shuffles, and converts a rejection into an
 * `error` string instead of letting an unhandled promise swallow it. One place
 * to change when `adSource` is swapped for a real network.
 */
export function useAds(format: AdFormat): AdsView {
  const [source, setSource] = useState<Ad[]>([])
  const [error, setError] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)

  useEffect(() => {
    let cancelled = false
    adSource
      .getAds()
      .then((all) => {
        if (cancelled) return
        setSource(all.filter((a) => a.format === format))
        setError(null)
      })
      .catch(() => {
        if (cancelled) return
        setSource([])
        setError('The ads did not load. Which is almost the point.')
      })
    return () => {
      cancelled = true
    }
  }, [format, reloadKey])

  const ads = useMemo(() => shuffle(source), [source])

  const reload = useCallback(() => setReloadKey((key) => key + 1), [])

  return { ads, error, reload }
}
