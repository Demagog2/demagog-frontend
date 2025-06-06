import { z } from 'zod'
import { ArticleTypeEnum } from '@/__generated__/graphql'
import { imageFileSchema } from '@/libs/images/schema'

const segmentSchema = z.discriminatedUnion('segmentType', [
  z.object({
    segmentType: z.literal('text'),
    textHtml: z.string().trim().min(1, 'Zadejte text segmentu'),
  }),
  z.object({
    segmentType: z.literal('source_statements'),
    sourceId: z.string(),
  }),
  z.object({
    segmentType: z.literal('promise'),
    statementId: z.string(),
  }),
  z.object({
    segmentType: z.literal('quiz_question'),
    quizQuestionId: z.string().min(1, 'Vyberte kvízovou otázku'),
  }),
])

const sharedArticleSchema = z.object({
  title: z.string().trim().min(1, 'Zadejte název článku.'),
  perex: z.string().trim().min(1, 'Zadejte perex článku.'),
  pinned: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  publishedAt: z.string().date().optional(),
  segments: z.array(segmentSchema).optional(),
  articleTags: z.array(z.string()).optional(),
  illustration: imageFileSchema.optional(),
  illustrationCaption: z.string().optional(),
  deleteIllustration: z
    .preprocess((value) => value === 'true', z.boolean())
    .optional(),
})

export const schema = z.discriminatedUnion('articleType', [
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.Default),
    })
    .merge(sharedArticleSchema),
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.Static),
    })
    .merge(sharedArticleSchema),
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.SingleStatement),
    })
    .merge(sharedArticleSchema),
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.GovernmentPromisesEvaluation),
    })
    .merge(sharedArticleSchema),
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.FacebookFactcheck),
      titleEn: z.string().trim().min(1, 'Zadejte anglický název článku.'),
      articleVeracity: z.string(),
      // articleVeracity: z.enum(ARTICLE_VERACITY_OPTIONS.map(({ value }) => value)),
    })
    .merge(sharedArticleSchema),
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.Education),
    })
    .merge(sharedArticleSchema),
])

export const singleStatementArticleSchema = sharedArticleSchema
  .omit({
    perex: true,
    pinned: true,
    segments: true,
  })
  .merge(z.object({ statementId: z.string() }))
