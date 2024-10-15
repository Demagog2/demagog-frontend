import { Medium } from '../model/Medium'

export function createMediumFromQuery(
  medium: { id: string; name: string } | null
) {
  if (!medium) {
    return null
  }

  return new Medium(medium.id, medium.name)
}
