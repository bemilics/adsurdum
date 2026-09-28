import { useCallback, useMemo, useRef, useState } from 'react'
import type { Ad } from '../ads/types'
import { AdCard } from '../components/AdCard'
import { useAds } from '../hooks/useAds'
import { useInfiniteScroll } from '../hooks/useInfiniteScroll'
import { usePersona } from '../hooks/usePersona'

const PAGE = 10

export function Feed() {
  const { persona } = usePersona()
  const { ads, error, reload } = useAds('card')
  const [visible, setVisible] = useState(PAGE)
  const [refreshing, setRefreshing] = useState(false)
  const scrollRef = useRef<HTMLDivElement | null>(null)
  const pullState = useRef({ startY: 0, pulling: false, distance: 0 })
  const [pullDistance, setPullDistance] = useState(0)

  const items = useMemo(() => {
    if (ads.length === 0) return []
    const out: Ad[] = []
    for (let i = 0; i < visible; i++) {
      out.push(ads[i % ads.length])
    }
    return out
  }, [ads, visible])

  const loadMore = useCallback(() => {
    setVisible((v) => v + PAGE)
  }, [])

  const sentinelRef = useInfiniteScroll(loadMore)

  const refresh = useCallback(() => {
    setRefreshing(true)
    reload()
    setVisible(PAGE)
    scrollRef.current?.scrollTo({ top: 0 })
    setTimeout(() => setRefreshing(false), 400)
  }, [reload])

  const onTouchStart = (e: React.TouchEvent) => {
    if (scrollRef.current && scrollRef.current.scrollTop === 0) {
      pullState.current.startY = e.touches[0].clientY
      pullState.current.pulling = true
    }
  }
  const onTouchMove = (e: React.TouchEvent) => {
    if (!pullState.current.pulling) return
    const d = e.touches[0].clientY - pullState.current.startY
    if (d > 0) {
      pullState.current.distance = Math.min(d, 140)
      setPullDistance(pullState.current.distance)
    }
  }
  const onTouchEnd = () => {
    if (pullState.current.pulling && pullState.current.distance > 80) {
      refresh()
    }
    pullState.current.pulling = false
    pullState.current.distance = 0
    setPullDistance(0)
  }

  if (error) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-semibold">The ads refused to load.</p>
        <p className="mt-1 text-sm text-fog">{error}</p>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center px-6 text-center">
        <p className="text-lg font-semibold">You've seen everything.</p>
        <p className="mt-1 text-sm text-fog">There was never anything.</p>
      </div>
    )
  }

  return (
    <div
      ref={scrollRef}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      className="h-full overflow-y-auto"
    >
      <div
        className="flex items-center justify-center overflow-hidden text-xs uppercase tracking-wider text-fog transition-[height]"
        style={{ height: refreshing ? 48 : pullDistance > 0 ? pullDistance / 2 : 0 }}
      >
        {refreshing ? 'Shuffling…' : pullDistance > 80 ? 'Release to shuffle' : 'Pull to shuffle'}
      </div>

      <div className="mx-auto max-w-lg">
        <header className="safe-top sticky top-0 z-30 border-b border-line bg-void/95 px-4 py-3 backdrop-blur">
          <h1 className="text-xl font-bold tracking-tight">
            Adsurdum <span className="text-acid">·</span>
          </h1>
          <p className="text-xs text-fog">Scroll into the absurd.</p>
        </header>
        {items.map((ad, i) => (
          <AdCard key={`${ad.id}-${i}`} ad={ad} persona={persona} />
        ))}
        <div ref={sentinelRef} className="h-1" />
        <footer className="px-4 py-8 text-center text-xs text-fog/60">
          <p>More ads are coming.</p>
          <p className="mt-1">They are the same ads. There are no more ads.</p>
        </footer>
      </div>
    </div>
  )
}
