export interface ArticleSpeakerItem {
  __typename: 'ArticleSpeakerItem'
  id: string
  avatar: string
}

export interface ArticleSourceSpeakerItem {
  __typename: 'ArticleSourceSpeakerItem'
  id: string
  fullName: string
  role?: string | null
  speaker: ArticleSpeakerItem
}

export interface ArticleItem {
  __typename: 'ArticleItem'
  id: string
  articleType: string
  title: string
  slug: string
  perex: string
  illustration: string
  publishedAt: Date
  published: boolean
  source?: null
  speakers?: ArticleSourceSpeakerItem[]
}
