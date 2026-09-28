import { useEffect, useRef } from 'react'
import type { Ad } from '../ads/types'
import { safeExternalUrl } from '../lib/url'

interface Props {
  ad: Ad
  active: boolean
  onSkip: () => void
}

export function ReelPlayer({ ad, active, onSkip }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const href = safeExternalUrl(ad.destinationUrl)

  useEffect(() => {
    const v = videoRef.current
    if (!v) return
    if (active) {
      v.play().catch(() => {
        /* autoplay blocked: user will tap */
      })
    } else {
      v.pause()
    }
  }, [active])

  return (
    <div className="relative h-full w-full snap-start bg-ink">
      {ad.videoUrl ? (
        <video
          ref={videoRef}
          src={ad.videoUrl}
          poster={ad.imageUrl}
          muted
          loop
          playsInline
          className="h-full w-full object-cover"
        />
      ) : (
        <img src={ad.imageUrl} alt={ad.headline} className="h-full w-full object-cover" />
      )}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-void/95 via-void/40 to-transparent p-4 pb-24">
        <div className="text-xs uppercase tracking-wider text-fog">Sponsored</div>
        <div className="mt-1 text-lg font-bold">{ad.brand}</div>
        <div className="mt-0.5 text-sm text-paper/90">{ad.headline}</div>
        <p className="mt-2 line-clamp-2 text-sm text-fog">{ad.body}</p>
        <div className="mt-3 flex items-center gap-2">
          {href ? (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-acid px-4 py-2 text-sm font-semibold text-void"
            >
              {ad.cta}
            </a>
          ) : (
            <button
              type="button"
              className="rounded-full border border-paper/30 px-4 py-2 text-sm font-semibold"
            >
              {ad.cta}
            </button>
          )}
          <button
            type="button"
            onClick={onSkip}
            className="rounded-full border border-paper/30 px-4 py-2 text-sm text-paper/80"
          >
            Skip
          </button>
        </div>
      </div>
    </div>
  )
}
