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

  return Array.isArray(param) ? false : param === 'true'
}

export function parseParamId(id: string) {
  if (id.indexOf('-') !== 1) {
    const parts = id.split('-')

    return parseInt(parts[parts.length - 1], 10)
  }

  return parseInt(id, 10)
}
