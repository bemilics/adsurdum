export interface Persona {
  gender: string
  age: string
  occupation: string
  location: string
  interests: string
}

export const emptyPersona: Persona = {
  gender: '',
  age: '',
  occupation: '',
  location: '',
  interests: '',
}

const KEY = 'adsurdum:persona'

export function loadPersona(): Persona | null {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as Persona
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
