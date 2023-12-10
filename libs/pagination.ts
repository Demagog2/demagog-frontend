const DEFAULT_PAGE = 1

export function parsePage(page?: string | string[]): number {
  return parseInt(String(page ?? DEFAULT_PAGE), 10) ?? DEFAULT_PAGE
}
