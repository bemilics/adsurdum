import { useState } from 'react'
import { randomPersona } from '../persona/randomizer'
import { emptyPersona, loadPersona, savePersona, clearPersona, type Persona } from '../persona/storage'

const FIELDS: Array<{ key: keyof Persona; label: string; placeholder: string }> = [
  { key: 'gender', label: 'Gender', placeholder: 'Whatever you want' },
  { key: 'age', label: 'Age', placeholder: 'Any number. Or word. Or concept.' },
  { key: 'occupation', label: 'Occupation', placeholder: 'Paid, unpaid, imaginary' },
  { key: 'location', label: 'Location', placeholder: 'Real, fictional, liminal' },
  { key: 'interests', label: 'Interests', placeholder: 'Comma-separated regrets' },
]

export function GhostPersona() {
  const [form, setForm] = useState<Persona>(() => loadPersona() ?? emptyPersona)
  const [saved, setSaved] = useState<Persona | null>(() => loadPersona())

  const update = (k: keyof Persona, v: string) => {
    setForm((f) => ({ ...f, [k]: v }))
  }

  const handleSave = () => {
    savePersona(form)
    setSaved(form)
  }

  const handleRandomize = () => {
    const p = randomPersona()
    setForm(p)
    savePersona(p)
    setSaved(p)
  }

  const handleClear = () => {
    clearPersona()
    setForm(emptyPersona)
    setSaved(null)
  }

  const hasPersona = saved && Object.values(saved).some((v) => v.trim().length > 0)

  return (
    <div className="h-full overflow-y-auto">
      <header className="safe-top sticky top-0 z-30 border-b border-line bg-void/95 px-4 py-3 backdrop-blur">
        <h1 className="text-xl font-bold tracking-tight">Ghost Persona</h1>
        <p className="text-xs text-fog">Build the you that advertisers would love.</p>
      </header>

      <div className="mx-auto max-w-lg px-4 py-6">
        <p className="text-sm leading-snug text-fog">
          This is the profile advertisers think you have. Fill it with anything — truth, lies,
          fan fiction. It stays on this device. We use it for: <span className="text-paper">nothing</span>.
        </p>

        <div className="mt-6 space-y-4">
          {FIELDS.map((f) => (
            <label key={f.key} className="block">
              <span className="mb-1 block text-xs uppercase tracking-wider text-fog">
                {f.label}
              </span>
              <input
                type="text"
                value={form[f.key]}
                onChange={(e) => update(f.key, e.target.value)}
                placeholder={f.placeholder}
                className="w-full rounded border border-line bg-ink px-3 py-2 text-sm text-paper placeholder:text-fog/50 focus:border-acid focus:outline-none"
              />
            </label>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="rounded-full bg-acid px-5 py-2.5 text-sm font-semibold text-void"
          >
            Save persona
          </button>
          <button
            type="button"
            onClick={handleRandomize}
            className="rounded-full border border-acid px-5 py-2.5 text-sm font-semibold text-acid"
          >
            Become Someone Else
          </button>
          {hasPersona && (
            <button
              type="button"
              onClick={handleClear}
              className="rounded-full border border-line px-5 py-2.5 text-sm text-fog"
            >
              Delete
            </button>
          )}
        </div>

        {hasPersona && (
          <section className="mt-8 rounded border border-line bg-ink p-4">
            <h2 className="text-xs uppercase tracking-wider text-fog">Contrast panel</h2>
            <p className="mt-2 text-sm">
              This is the profile advertisers think you have:
            </p>
            <dl className="mt-3 space-y-1 text-sm">
              {FIELDS.map((f) =>
                saved[f.key] ? (
                  <div key={f.key} className="flex gap-2">
                    <dt className="w-24 shrink-0 text-fog">{f.label}</dt>
                    <dd className="text-paper">{saved[f.key]}</dd>
                  </div>
                ) : null,
              )}
            </dl>
            <p className="mt-4 border-t border-line pt-3 text-sm text-fog">
              We use it for: <span className="font-semibold text-acid">nothing</span>.
            </p>
            <p className="mt-1 text-xs text-fog/70">
              It lives in your browser's localStorage. It has never met a server.
            </p>
          </section>
        )}
      </div>
    </div>
  )
}
