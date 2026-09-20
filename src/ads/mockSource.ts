import catalog from './catalog.json'
import type { Ad, AdSource } from './types'

const ads = catalog as Ad[]

export const mockSource: AdSource = {
  async getAds() {
    return ads
  },
  async getAdById(id: string) {
    return ads.find((a) => a.id === id) ?? null
  },
}
