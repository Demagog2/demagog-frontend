import { SourceSpeaker } from '../model/SourceSpeaker'

export function createSpeakerFromQuery(sourceSpeaker: {
  id: string
  firstName: string
  lastName: string
}) {
  return new SourceSpeaker(
    sourceSpeaker.id,
    sourceSpeaker.firstName,
    sourceSpeaker.lastName
  )
}
