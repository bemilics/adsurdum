import { useEffect, useState } from 'react'
import type { Persona } from '../persona/storage'
import { loadPersona } from '../persona/storage'

/**
 * Persona shared by Feed and Explore, kept in sync across tabs through the
 * `storage` event. Writes go through `persona/storage` directly — see GhostPersona.
 */
export function usePersona() {
  const [persona, setPersona] = useState<Persona | null>(() => loadPersona())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'adsurdum:persona') setPersona(loadPersona())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  return { persona }
}
