export function pluralize(
  count: number,
  one: string,
  twoToFour: string,
  other: string
) {
  if (count === 1) {
    return one
  }
  if (count > 1 && count < 5) {
    return twoToFour
  }
  return other
}
