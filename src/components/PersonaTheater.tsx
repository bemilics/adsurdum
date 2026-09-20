import type { Persona } from '../persona/storage'

interface Props {
  persona: Persona
}

export function PersonaTheater({ persona }: Props) {
  const line = buildLine(persona)
  return (
    <div className="border-y border-line bg-ink px-4 py-2 text-xs text-fog">
      <span className="mr-2 inline-block rounded border border-acid/40 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-acid">
        Theater
      </span>
      {line}
      <span className="ml-2 italic opacity-60">— not real targeting, we just think it's funny</span>
    </div>
  )
}

function buildLine(p: Persona): string {
  const bits: string[] = []
  if (p.age) bits.push(`${p.age}-year-old`)
  if (p.occupation) bits.push(p.occupation)
  if (p.location) bits.push(`from ${p.location}`)
  if (bits.length === 0) return 'This ad was not personalized. Nothing is.'
  return `Because you're a ${bits.join(' ')}. Obviously.`
}
