import { describe, expect, it } from 'vitest'
import { safeExternalUrl } from './url'

describe('safeExternalUrl', () => {
  it('accepts plain http(s) URLs', () => {
    expect(safeExternalUrl('https://example.com/pet-rock')).toBe('https://example.com/pet-rock')
    expect(safeExternalUrl('http://example.com/')).toBe('http://example.com/')
  })

  it('rejects script-bearing protocols', () => {
    expect(safeExternalUrl('javascript:alert(document.cookie)')).toBeNull()
    expect(safeExternalUrl('data:text/html,<script>1</script>')).toBeNull()
    expect(safeExternalUrl('vbscript:msgbox(1)')).toBeNull()
    expect(safeExternalUrl('file:///etc/passwd')).toBeNull()
  })

  it('rejects missing, empty or relative values', () => {
    expect(safeExternalUrl(undefined)).toBeNull()
    expect(safeExternalUrl('')).toBeNull()
    expect(safeExternalUrl('/relative/path')).toBeNull()
    expect(safeExternalUrl('not a url')).toBeNull()
  })

  it('returns the normalized href, so the displayed link equals the rendered one', () => {
    expect(safeExternalUrl('HTTPS://EXAMPLE.COM/A B')).toBe('https://example.com/A%20B')
  })
})
