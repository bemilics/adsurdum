import { describe, expect, it } from 'vitest'
import { LEDGER, ledgerTotals, type LedgerEntry } from './ledger'

describe('ledgerTotals', () => {
  it('returns zeros for an empty ledger', () => {
    expect(ledgerTotals([])).toEqual({ grossCents: 0, donatedCents: 0 })
  })

  it('sums every entry', () => {
    const entries: LedgerEntry[] = [
      { date: '2026-01-01', source: 'Ad network', grossCents: 1250, donatedCents: 1250 },
      { date: '2026-02-01', source: 'Affiliate', grossCents: 800, donatedCents: 500 },
    ]
    expect(ledgerTotals(entries)).toEqual({ grossCents: 2050, donatedCents: 1750 })
  })

  it('does not mutate the entries it receives', () => {
    const entries = [...LEDGER]
    ledgerTotals(entries)
    expect(entries).toEqual(LEDGER)
  })
})
