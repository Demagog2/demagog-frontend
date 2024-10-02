import { z } from 'zod'
import { ArticleTypeEnum } from '@/__generated__/graphql'

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
])

const MAX_FILE_SIZE = 4_000_000
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
]

const sharedArticleSchema = z.object({
  title: z.string().trim().min(1, 'Zadejte nazev clanku.'),
  perex: z.string().trim().min(1, 'Zadejte perex clanku.'),
  pinned: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  published: z.preprocess((value) => value === 'on', z.boolean()).optional(),
  publishedAt: z.string().date().optional(),
  segments: z.array(segmentSchema).optional(),
  articleTags: z.array(z.string()).optional(),
  illustration: z
    .custom<File>()
    .transform((file) => (file.size === 0 ? undefined : file))
    .refine(
      (file) => {
        console.debug(file)
        console.debug(file?.size)
        return !file || file.size <= MAX_FILE_SIZE
      },
      {
        message: 'Maximalni velikost obrazku jsou 4MB.',
      }
    )
    .refine(
      (file) => !file || ACCEPTED_IMAGE_TYPES.includes(file.type),
      'Pouze soubory.jpg, .jpeg, .png, .webp jsou podporovany.'
    )
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
      titleEn: z.string().trim().min(1, 'Zadejte anglicky nazev clanku'),
      articleVeracity: z.string(),
      // articleVeracity: z.enum(ARTICLE_VERACITY_OPTIONS.map(({ value }) => value)),
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
