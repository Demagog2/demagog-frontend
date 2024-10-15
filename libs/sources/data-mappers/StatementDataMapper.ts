import { Statement } from '../model/Statement'
import { Evaluator } from '../model/Evaluator'
import { createSpeakerFromQuery } from '@/libs/sources/data-mappers/SpeakerDataMapper'
import { AdminSourcesFilterSegmentFragment } from '@/__generated__/graphql'

export function createStatementFromQuery(
  statement: AdminSourcesFilterSegmentFragment
) {
  return new Statement(
    statement.id,
    statement.content,
    createSpeakerFromQuery(statement.sourceSpeaker),
    statement.published,
    statement.assessment.evaluationStatus,
    statement.assessment.assessmentMethodology.ratingModel,
    statement.assessment.explanationCharactersLength,
    statement.assessment.shortExplanationCharactersLength,
    statement.commentsCount,
    statement.assessment.evaluator
      ? new Evaluator(
          statement.assessment.evaluator.id,
          statement.assessment.evaluator.firstName,
          statement.assessment.evaluator.lastName
        )
      : null,
    statement.assessment.veracity?.key,
    statement.assessment.promiseRating?.key
  )
}
