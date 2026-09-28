import { describe, expect, it } from 'vitest'
import { shuffle } from './shuffle'

describe('shuffle', () => {
  it('returns every element exactly once', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8]
    const out = shuffle(input)
    expect(out).toHaveLength(input.length)
    expect([...out].sort((a, b) => a - b)).toEqual(input)
  })

  it('does not mutate the input', () => {
    const input = [3, 1, 2] as const
    shuffle(input)
    expect([...input]).toEqual([3, 1, 2])
  })

  it('handles arrays that cannot be shuffled', () => {
    expect(shuffle([])).toEqual([])
    expect(shuffle(['only'])).toEqual(['only'])
  })

  it('does not return the identity order every time', () => {
    const input = Array.from({ length: 8 }, (_, i) => i)
    const results = Array.from({ length: 20 }, () => shuffle(input).join(','))
    expect(new Set(results).size).toBeGreaterThan(1)
  })
})
