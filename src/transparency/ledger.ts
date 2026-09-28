export interface LedgerEntry {
  date: string
  source: string
  grossCents: number
  donatedCents: number
  receiptUrl?: string
}

export interface LedgerTotals {
  grossCents: number
  donatedCents: number
}

/**
 * Placeholder until the public transparency repo exists — tracked in the
 * BITACORA backlog ("Repo público de transparencia + primer comprobante").
 * It 404s as-is, so replace it before deploying.
 */
export const REPO_URL = 'https://github.com/your-org/adsurdum-transparency'

export const ARCHIVE_URL = 'https://archive.org/donate'

export const LEDGER: readonly LedgerEntry[] = [
  { date: '2026-09-01', source: 'Manual seed', grossCents: 0, donatedCents: 0 },
]

/** Pure sum over the ledger; keeps the arithmetic out of the view. */
export function ledgerTotals(entries: readonly LedgerEntry[]): LedgerTotals {
  return entries.reduce(
    (totals, entry) => ({
      grossCents: totals.grossCents + entry.grossCents,
      donatedCents: totals.donatedCents + entry.donatedCents,
    }),
    { grossCents: 0, donatedCents: 0 },
  )
}
