export interface ArticleSpeakerItem {
    __typename: "ArticleSpeakerItem";
    id: string;
    avatar: string;
}

export interface ArticleSourceSpeakerItem {
    __typename: "ArticleSourceSpeakerItem";
    id: string;
    firstName: string;
    lastName: string;
    role?: string | null;
    speaker: ArticleSpeakerItem
}

export interface ArticleItem {
    __typename: "ArticleItem";
    id: string;
    articleType: string;
    title: string;
    slug: string;
    perex: string;
    illustration: string;
    publishedAt: Date;
    published: boolean;
    source?: null;
    speakers?: ArticleSourceSpeakerItem[];
}

export interface ArticleMediaPersonalities {
    __typename: "ArticleMediaPersonalities";
    id: string;
    name: string;
}

export interface ArticleMedium {
    __typename: "ArticleMedium";
    id: string;
    name: string;
}



export interface ArticleDetailSource {
    __typename: "ArticleDetailSource";
    id: string;
    sourceUrl: string;
    releasedAt: Date;
    mediaPersonalities: ArticleMediaPersonalities[];
    medium: ArticleMedium;
}

export interface ArticleDetail {
    __typename: "ArticleDetail";
    id: string;
    articleType: any;
    title: string;
    slug: string;
    perex: string;
    illustration: string;
    segments: any[];
    source?: ArticleDetailSource;
    articleTags: any[];
    publishedAt: Date;
}

