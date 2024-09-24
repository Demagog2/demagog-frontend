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
])

const sharedArticleSchema = z.object({
  title: z.string().trim().min(1, 'Zadejte nazev clanku'),
  perex: z.string().trim().min(1, 'Zadejte perex clanku'),
  published: z.boolean().optional(),
  segments: z.array(segmentSchema).min(0),
  articleTags: z.array(z.string()).optional(),
})

export const schema = z.discriminatedUnion('articleType', [
  z
    .object({
      articleType: z.literal(ArticleTypeEnum.Default),
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
