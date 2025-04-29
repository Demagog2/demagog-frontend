import { FragmentType, gql, useFragment } from '@/__generated__'
import { SocialShareButtons } from '../sharing/SocialShareButtons'

const StatementSocialShareButtonsFragment = gql(`
    fragment StatementSocialShareButtons on Statement {
      id
      content
    }
  `)

export function StatementSocialShareButtons(props: {
  statement: FragmentType<typeof StatementSocialShareButtonsFragment>
  showDetailUrl?: boolean
}) {
  const { showDetailUrl = false } = props
  const statement = useFragment(
    StatementSocialShareButtonsFragment,
    props.statement
  )

  return (
    <SocialShareButtons
      sharingUrl={`https://demagog.cz/vyrok/${statement.id}`}
      sharingTitle={statement.content ?? 'Ověřování výroků'}
      detailUrl={showDetailUrl ? `/vyrok/${statement.id}` : undefined}
    />
  )
}
