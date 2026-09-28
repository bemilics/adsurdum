import { afterEach, describe, expect, it, vi } from 'vitest'
import { clearPersona, emptyPersona, loadPersona, savePersona } from './storage'

const KEY = 'adsurdum:persona'

function stubLocalStorage(initial: Record<string, string> = {}): void {
  const store = new Map<string, string>(Object.entries(initial))
  vi.stubGlobal('localStorage', {
    getItem: (k: string) => store.get(k) ?? null,
    setItem: (k: string, v: string) => {
      store.set(k, v)
    },
    removeItem: (k: string) => {
      store.delete(k)
    },
  })
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('loadPersona', () => {
  it('returns null when nothing is stored', () => {
    stubLocalStorage()
    expect(loadPersona()).toBeNull()
  })

  it('round-trips a saved persona', () => {
    stubLocalStorage()
    savePersona({ ...emptyPersona, age: '27', occupation: 'Soup sommelier' })
    expect(loadPersona()).toEqual({
      ...emptyPersona,
      age: '27',
      occupation: 'Soup sommelier',
    })
  })

  it('returns null instead of throwing on malformed JSON', () => {
    stubLocalStorage({ [KEY]: '{not json' })
    expect(loadPersona()).toBeNull()
  })

  it('returns null for payloads that are not objects', () => {
    for (const payload of ['42', '"text"', 'true', 'null', '["a","b"]']) {
      stubLocalStorage({ [KEY]: payload })
      expect(loadPersona(), payload).toBeNull()
    }
  })

  // Regression guard: a non-string field used to reach `.trim()` in GhostPersona
  // and took the whole tree down, since there is no error boundary around it.
  it('discards the payload when a field is not a string', () => {
    stubLocalStorage({ [KEY]: JSON.stringify({ ...emptyPersona, age: 123 }) })
    expect(loadPersona()).toBeNull()
  })

  it('fills absent fields and ignores unknown ones', () => {
    stubLocalStorage({ [KEY]: JSON.stringify({ age: '42', theme: 'dark' }) })
    expect(loadPersona()).toEqual({ ...emptyPersona, age: '42' })
  })

  it('survives a broken localStorage implementation', () => {
    vi.stubGlobal('localStorage', {
      getItem: () => {
        throw new Error('storage disabled')
      },
    })
    expect(loadPersona()).toBeNull()
  })
})

describe('clearPersona', () => {
  it('removes the stored persona', () => {
    stubLocalStorage({ [KEY]: JSON.stringify({ ...emptyPersona, age: '27' }) })
    clearPersona()
    expect(loadPersona()).toBeNull()
  })
})
