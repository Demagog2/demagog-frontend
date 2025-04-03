import { Metadata } from 'next'

const DOMAIN = process.env.NEXT_PUBLIC_DOMAIN ?? 'https://demagog.cz'

export function getMetadataTitle(...subtitles: string[]) {
  return [...subtitles, 'Demagog.cz'].join(' — ')
}

export function getRobotsMetadata(): Partial<Metadata> {
  if (process.env.ROBOTS_ALLOW_NOTHING === 'true') {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }
  return {}
}

export function getCanonicalMetadata(relativeUrl: string): Partial<Metadata> {
  return {
    alternates: {
      canonical: `${DOMAIN}${relativeUrl}`,
    },
  }
}

export const getCanonicalRelativeUrl = (
  relativeUrl: string,
  hasPreviousPage: boolean,
  after: string,
  before: string
) => {
  if (!hasPreviousPage) {
    return relativeUrl
  }

  if (after) {
    return `${relativeUrl}?after=${after}`
  }

  if (before) {
    return `${relativeUrl}?before=${before}`
  }

  return relativeUrl
}
