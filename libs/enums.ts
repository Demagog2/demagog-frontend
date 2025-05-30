import { ArticleTypeEnum } from '@/__generated__/graphql'

export function toArticleTypeEnum(
  articleType: string
): ArticleTypeEnum | undefined {
  switch (articleType) {
    case 'default':
      return ArticleTypeEnum.Default
    case 'facebook_factcheck':
      return ArticleTypeEnum.FacebookFactcheck
    case 'government_promises_evaluation':
      return ArticleTypeEnum.GovernmentPromisesEvaluation
    case 'single_statement':
      return ArticleTypeEnum.SingleStatement
    case 'static':
      return ArticleTypeEnum.Static
    case 'education':
      return ArticleTypeEnum.Education
    default:
      return undefined
  }
}
