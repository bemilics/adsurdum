import { useEffect, useMemo, useRef, useState } from 'react'
import { adSource } from '../ads'
import type { Ad } from '../ads/types'
import { ReelPlayer } from '../components/ReelPlayer'
import { shuffle } from '../lib/shuffle'

export function Reels() {
  const [reels, setReels] = useState<Ad[]>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    let cancelled = false
    adSource.getAds().then((all) => {
      if (cancelled) return
      setReels(shuffle(all.filter((a) => a.format === 'reel')))
    })
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index)
            if (!Number.isNaN(idx)) setActiveIndex(idx)
          }
        }
      },
      { root: el, threshold: 0.6 },
    )
    const kids = el.querySelectorAll('[data-index]')
    kids.forEach((k) => io.observe(k))
    return () => io.disconnect()
  }, [reels])

  const list = useMemo(() => reels, [reels])

  const skip = () => {
    const el = containerRef.current
    if (!el) return
    const next = Math.min(activeIndex + 1, list.length - 1)
    const target = el.querySelector(`[data-index="${next}"]`)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  if (list.length === 0) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm text-fog">No reels. An ad-free moment. Savor it.</p>
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className="h-full snap-y snap-mandatory overflow-y-auto"
    >
      {list.map((ad, i) => (
        <div key={ad.id} data-index={i} className="h-full w-full snap-start">
          <ReelPlayer ad={ad} active={i === activeIndex} onSkip={skip} />
        </div>
      ))}
    </div>
  )
}
