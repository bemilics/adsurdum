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
  destinationUrl?: string
  tags: string[]
}

export interface AdSource {
  getAds(): Promise<Ad[]>
  getAdById(id: string): Promise<Ad | null>
}
