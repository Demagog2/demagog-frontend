import { FragmentType, gql, useFragment } from '@/__generated__'

const YouTubeVideoFragment = gql(`
  fragment YouTubeVideo on Source {
    videoType
  }
`)

export function YouTubeVideo(props: {
  source?: FragmentType<typeof YouTubeVideoFragment>
}) {
  const source = useFragment(YouTubeVideoFragment, props.source)

  if (source?.videoType !== 'youtube') {
    return null
  }

  return <div>Youtube player</div>
}
