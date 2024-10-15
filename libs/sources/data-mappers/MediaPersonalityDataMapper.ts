import { MediaPersonality } from '../model/MediaPersonality'

export function createMediaPersonalityFromQuery(mediaPersonality: {
  id: string
  name: string
}) {
  return new MediaPersonality(mediaPersonality.id, mediaPersonality.name)
}
