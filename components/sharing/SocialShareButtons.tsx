'use client'

import FacebookIcon from '@/assets/icons/facebook.svg'
import XIcon from '@/assets/icons/x.svg'
import Link2Icon from '@/assets/icons/link2.svg'
import ShareIcon from '@/assets/icons/share.svg'
import { getMetadataTitle } from '@/libs/metadata'

export function SocialShareButtons(props: {
  sharingUrl: string
  sharingTitle: string
  detailUrl?: string
}) {
  const { sharingUrl, sharingTitle, detailUrl } = props

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (navigator.share) {
      try {
        await navigator.share({
          title: getMetadataTitle(sharingTitle),
          url: sharingUrl,
          text: sharingTitle,
        })
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      console.log('Sdílení není ve vašem prohlížeči podporováno.')
    }
  }

  return (
    <div className="d-flex justify-content-center align-items-baseline gap-2">
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${sharingUrl}`}
        target="_blank"
        className="share-icon facebook"
        title="Sdílet na Facebooku"
      >
        <FacebookIcon />
      </a>
      <a
        href={`https://twitter.com/intent/tweet?url=${sharingUrl}&text=${sharingTitle}`}
        target="_blank"
        className="share-icon x"
        title="Sdílet na síti X"
      >
        <XIcon />
      </a>
      {detailUrl && (
        <a
          className="d-none d-lg-block share-icon link-icon"
          href={detailUrl}
          title="Přejít na výrok"
        >
          <Link2Icon />
        </a>
      )}

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
