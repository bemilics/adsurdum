import { describe, expect, it } from 'vitest'
import { mockSource } from './mockSource'
import { safeExternalUrl } from '../lib/url'

describe('mockSource', () => {
  it('returns a catalog with unique ids and both formats', async () => {
    const ads = await mockSource.getAds()
    expect(ads.length).toBeGreaterThan(0)
    expect(new Set(ads.map((a) => a.id)).size).toBe(ads.length)
    expect(new Set(ads.map((a) => a.format)).size).toBe(2)
  })

  it('ships every ad with the fields the views render', async () => {
    const ads = await mockSource.getAds()
    for (const ad of ads) {
      expect(ad.brand, ad.id).toBeTruthy()
      expect(ad.headline, ad.id).toBeTruthy()
      expect(ad.imageUrl, ad.id).toMatch(/^https:\/\//)
      expect(ad.cta, ad.id).toBeTruthy()
    }
  })

  it('keeps every declared destination link safe to render as an anchor', async () => {
    const ads = await mockSource.getAds()
    const unsafe = ads.filter(
      (ad) => ad.destinationUrl !== undefined && safeExternalUrl(ad.destinationUrl) === null,
    )
    expect(unsafe.map((a) => `${a.id} -> ${a.destinationUrl}`)).toEqual([])
  })
})
