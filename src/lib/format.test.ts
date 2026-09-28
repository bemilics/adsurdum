import { describe, expect, it } from 'vitest'
import { formatUsd } from './format'

describe('formatUsd', () => {
  it('formats cents as USD', () => {
    expect(formatUsd(0)).toBe('$0.00')
    expect(formatUsd(99)).toBe('$0.99')
    expect(formatUsd(123456)).toBe('$1,234.56')
  })
})
