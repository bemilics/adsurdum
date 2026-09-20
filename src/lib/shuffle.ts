export function shuffle<T>(arr: readonly T[]): T[] {
  const out = [...arr]
  const rand = new Uint32Array(1)
  for (let i = out.length - 1; i > 0; i--) {
    crypto.getRandomValues(rand)
    const j = rand[0] % (i + 1)
    ;[out[i], out[j]] = [out[j], out[i]]
  }
  return out
}
