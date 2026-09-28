import { ARCHIVE_URL, LEDGER, REPO_URL, ledgerTotals } from '../transparency/ledger'
import { formatUsd } from '../lib/format'

export function Transparency() {
  const totals = ledgerTotals(LEDGER)

  return (
    <div className="h-full overflow-y-auto">
      <header className="safe-top sticky top-0 z-30 border-b border-line bg-void/95 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">Transparency</h1>
        <p className="text-xs text-fog">Where the money goes. All of it.</p>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="text-sm leading-snug text-fog">
          Every cent goes to the{' '}
          <a href={ARCHIVE_URL} target="_blank" rel="noopener noreferrer" className="text-acid underline">
            Internet Archive
          </a>
          . Receipts in the{' '}
          <a href={REPO_URL} target="_blank" rel="noopener noreferrer" className="text-acid underline">
            repo
          </a>
          .
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <div className="rounded border border-line bg-ink p-4">
            <div className="text-xs uppercase tracking-wider text-fog">Lifetime revenue</div>
            <div className="mt-1 text-2xl font-bold text-paper">{formatUsd(totals.grossCents)}</div>
          </div>
          <div className="rounded border border-line bg-ink p-4">
            <div className="text-xs uppercase tracking-wider text-fog">Donated</div>
            <div className="mt-1 text-2xl font-bold text-acid">{formatUsd(totals.donatedCents)}</div>
          </div>
        </div>

        <section className="mt-8">
          <h2 className="text-xs uppercase tracking-wider text-fog">Ledger</h2>
          {LEDGER.length === 0 ? (
            <p className="mt-3 text-sm text-fog">
              No entries. No revenue. Perfectly balanced.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-line rounded border border-line">
              {LEDGER.map((e, i) => (
                <li key={i} className="flex items-center justify-between bg-ink px-3 py-2 text-sm">
                  <div>
                    <div className="text-paper">{e.source}</div>
                    <div className="text-xs text-fog">{e.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-paper">{formatUsd(e.grossCents)}</div>
                    <div className="text-xs text-acid">−{formatUsd(e.donatedCents)}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="mt-8 rounded border border-line bg-ink p-4">
          <h2 className="text-xs uppercase tracking-wider text-fog">About this app</h2>
          <p className="mt-2 text-sm text-paper">
            This app collects: <span className="font-semibold text-acid">nothing</span>.
          </p>
          <p className="mt-2 text-xs leading-relaxed text-fog">
            No analytics. No cookies. No fingerprinting. No third-party scripts. No accounts. No
            servers that know your name. Just a JSON file and your scroll wheel.
          </p>
        </section>
      </div>
    </div>
  )
}
