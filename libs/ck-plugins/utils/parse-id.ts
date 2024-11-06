export function parseStatementId(s: string | null): number | null {
  const matches = s?.match(/(\d+)/)

  if (!matches) {
    return null
  }

  if (matches.length > 0) {
    return Number(matches[1])
  }

  return null
}
