'use client'

import FacebookIcon from '@/assets/icons/facebook.svg'
import XIcon from '@/assets/icons/x.svg'
import { FragmentType, gql, useFragment } from '@/__generated__'
import Link2Icon from '@/assets/icons/link2.svg'
import classNames from 'classnames'
import ShareIcon from '@/assets/icons/share.svg'

const SocialShareButtonsFragment = gql(`
  fragment SocialShareButtons on Statement {
    id
  }
`)

export default function SocialShareButtons(props: {
  statement: FragmentType<typeof SocialShareButtonsFragment>
  excludeStatementDetailLink?: boolean
}) {
  const { excludeStatementDetailLink = false } = props
  const statement = useFragment(SocialShareButtonsFragment, props.statement)

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Demagog.cz - Ověřování výroků',
          url: `https://demagog.cz/vyrok/${statement.id}`,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      alert('Sdílení není ve vašem prohlížeči podporováno.')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-baseline gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${'https://demagog.cz/vyrok/' + statement.id}`}
        target="_blank"
        className="share-icon facebook"
        title="Sdílet na Facebooku"
      >
        <FacebookIcon />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${'https://demagog.cz/vyrok/' + statement.id}`}
        target="_blank"
        className="share-icon x"
        title="Sdílet na síti X"
      >
        <XIcon />
      </a>
      <a
        className={classNames(`d-none d-lg-block share-icon link-icon`, {
          'd-lg-none': excludeStatementDetailLink,
        })}
        href={'/vyrok/' + statement.id}
      >
        <Link2Icon />
      </a>

      <a
        className="d-block d-lg-none share-icon link-icon cursor-pointer"
        onClick={handleShare}
        title="Sdílet"
      >
        <ShareIcon />
      </a>
    </div>
  )
}
