import { FragmentType, gql, useFragment } from '@/__generated__'
import Link from 'next/link'
import { PropsWithChildren } from 'react'

const SpeakerLinkFragment = gql(`
    fragment SpeakerLink on Speaker {
      slug
    }
`)

export function SpeakerLink(
  props: PropsWithChildren<{
    speaker: FragmentType<typeof SpeakerLinkFragment>

    queryParams?: string

    // Link props
    title?: string
    className?: string
  }>
) {
  const speaker = useFragment(SpeakerLinkFragment, props.speaker)

  let href = `/politici/${speaker.slug}`

  if (props.queryParams) {
    href += props.queryParams
  }

  return (
    <Link title={props.title} className={props.className} href={href}>
      {props.children}
    </Link>
  )
}
