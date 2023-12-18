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
