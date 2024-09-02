export function getNumericalArrayParams(
  queryParams?: string | string[]
): number[] {
  if (!queryParams) {
    return []
  }

  return (Array.isArray(queryParams) ? queryParams : [queryParams]).map(
    (param) => parseInt(param, 10)
  )
}

export function getStringParam(queryParams?: string | string[]): string {
  if (!queryParams) {
    return ''
  }

  return Array.isArray(queryParams) ? queryParams[0] : queryParams
}

export function getStringArrayParams(
  queryParams?: string | string[]
): string[] {
  if (!queryParams) {
    return []
  }

  return Array.isArray(queryParams) ? queryParams : [queryParams]
}

export function getBooleanParam(param?: string | string[]): boolean {
  if (!param) {
    return false
  }

  return Array.isArray(param) ? false : Boolean(param)
}
