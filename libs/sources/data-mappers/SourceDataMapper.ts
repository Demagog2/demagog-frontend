import type { ISource } from '../model/Source'
import { createSpeakerFromQuery } from './SpeakerDataMapper'
import { createStatementFromQuery } from './StatementDataMapper'
import { createExpertFromQuery } from './ExpertDataMapper'
import { createMediumFromQuery } from './MediumDataMapper'
import { createMediaPersonalityFromQuery } from './MediaPersonalityDataMapper'
import {
  AdminSourcesFilterSegmentFragment,
  AdminSourcesFiltersFragment,
} from '@/__generated__/graphql'

export function createSourceFromQuery(
  data: AdminSourcesFiltersFragment
): ISource {
  const sourceSpeakers = data.sourceSpeakers?.map(createSpeakerFromQuery) ?? []
  const statements =
    data.statements.map((statement) =>
      createStatementFromQuery(statement as AdminSourcesFilterSegmentFragment)
    ) ?? []
  const experts = data.experts?.map(createExpertFromQuery) ?? []
  const medium = createMediumFromQuery(data.medium)
  const mediaPersonalities =
    data.mediaPersonalities?.map(createMediaPersonalityFromQuery) ?? []

  return {
    id: data.id,
    name: data.name,
    sourceUrl: data.sourceUrl ?? null,
    releasedAt: data.releasedAt ?? null,
    experts,
    sourceSpeakers,
    statements,
    mediaPersonalities,
    medium,
  }
}
