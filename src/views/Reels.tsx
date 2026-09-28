import { useEffect, useRef, useState } from 'react'
import { ReelPlayer } from '../components/ReelPlayer'
import { useAds } from '../hooks/useAds'

export function Reels() {
  const { ads: reels, error } = useAds('reel')
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef<HTMLDivElement | null>(null)

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

  const skip = () => {
    const el = containerRef.current
    if (!el) return
    const next = Math.min(activeIndex + 1, reels.length - 1)
    const target = el.querySelector(`[data-index="${next}"]`)
    target?.scrollIntoView({ behavior: 'smooth' })
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center px-6 text-center">
        <p className="text-sm text-fog">{error}</p>
      </div>
    )
  }

  if (reels.length === 0) {
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
      {reels.map((ad, i) => (
        <div key={ad.id} data-index={i} className="h-full w-full snap-start">
          <ReelPlayer ad={ad} active={i === activeIndex} onSkip={skip} />
        </div>
      ))}
    </div>
  )
}
