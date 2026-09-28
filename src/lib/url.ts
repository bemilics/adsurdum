const ALLOWED_PROTOCOLS = new Set(['http:', 'https:'])

/**
 * Turns an untrusted URL coming from an AdSource into something safe to render.
 *
 * The catalog is local today, but `AdSource` is the swap point for a real ad
 * network, and its `destinationUrl` lands verbatim in an `<a href>`. A
 * `javascript:` URL would execute in this origin on click, so only plain
 * http(s) is accepted.
 *
 * Returns the normalized href (what gets rendered is what was validated) or
 * null when the value is missing, unparseable, or uses another protocol.
 */
export function safeExternalUrl(raw: string | undefined): string | null {
  if (!raw) return null

  let parsed: URL
  try {
    parsed = new URL(raw)
  } catch {
    return null
  }

  return ALLOWED_PROTOCOLS.has(parsed.protocol) ? parsed.href : null
}
