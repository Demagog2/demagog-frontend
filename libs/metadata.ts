import { Metadata } from 'next'

export function getMetadataTitle(...subtitles: string[]) {
  return [...subtitles, 'Demagog.cz'].join(' — ')
}

export function getRobotsMetadata(): Partial<Metadata> {
  if (process.env.DISSALLOW_ALL_RULE === 'true') {
    return {
      robots: {
        index: false,
        follow: false,
      },
    }
  }
  return {}
}
