import { useCallback, useEffect, useState } from 'react'
import type { Persona } from '../persona/storage'
import { clearPersona, loadPersona, savePersona } from '../persona/storage'

export function usePersona() {
  const [persona, setPersona] = useState<Persona | null>(() => loadPersona())

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === 'adsurdum:persona') setPersona(loadPersona())
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const save = useCallback((p: Persona) => {
    savePersona(p)
    setPersona(p)
  }, [])

  const clear = useCallback(() => {
    clearPersona()
    setPersona(null)
  }, [])

  return { persona, save, clear }
}
