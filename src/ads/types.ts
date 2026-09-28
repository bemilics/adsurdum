export type AdFormat = 'card' | 'reel'

export interface Ad {
  id: string
  format: AdFormat
  brand: string
  headline: string
  body: string
  imageUrl: string
  videoUrl?: string
  cta: string
  /**
   * Must be an absolute http(s) URL. Views run it through `safeExternalUrl`
   * before rendering, so a `javascript:` value becomes a non-link CTA rather
   * than an XSS on click.
   */
  destinationUrl?: string
  tags: string[]
}

export interface AdSource {
  /**
   * Returns the whole catalog in one shot.
   *
   * Rejects when the underlying source fails. Callers must never treat a
   * rejection as an empty-but-successful feed — `useAds` turns it into a
   * visible error state.
   */
  getAds(): Promise<Ad[]>
}
