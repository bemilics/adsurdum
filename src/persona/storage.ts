export interface Persona {
  gender: string
  age: string
  occupation: string
  location: string
  interests: string
}

const FIELDS = ['gender', 'age', 'occupation', 'location', 'interests'] as const

export const emptyPersona: Persona = {
  gender: '',
  age: '',
  occupation: '',
  location: '',
  interests: '',
}

const KEY = 'adsurdum:persona'

/**
 * Shape-checks what came out of localStorage before trusting it.
 *
 * The stored value is hand-editable and can also arrive through a cross-tab
 * `storage` event, so anything could end up under this key. Fields that are
 * present must be strings; anything else discards the whole payload. Callers
 * render these values directly, so a non-string would otherwise blow up mid-render.
 */
function toPersona(value: unknown): Persona | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) return null

  const record = value as Record<string, unknown>
  const persona: Persona = { ...emptyPersona }

  for (const field of FIELDS) {
    const stored = record[field]
    if (stored === undefined) continue
    if (typeof stored !== 'string') return null
    persona[field] = stored
  }

  return persona
}

/** Returns null when nothing is stored or the stored value is unusable. Never throws. */
export function loadPersona(): Persona | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return toPersona(JSON.parse(raw))
  } catch {
    return null
  }
}

export function savePersona(p: Persona): void {
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function clearPersona(): void {
  localStorage.removeItem(KEY)
}
