import FacebookIcon from '@/assets/icons/facebook.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import XIcon from '@/assets/icons/x.svg'
import TiktokIcon from '@/assets/icons/tiktok.svg'
import ThreadsIcon from '@/assets/icons/threads.svg'
import BlueskyIcon from '@/assets/icons/bluesky.svg'

export default function SiteSocial() {
  return (
    <div className="bg-primary min-h-100 rounded-l p-5 p-lg-10">
      <h3 className="display-2 fw-bold mb-5 text-white">Sociální sítě</h3>
      <div className="mb-4">
        <span className="fs-4">
          Nenechte si ujít nejnovější události z&nbsp;Demagog.cz. Sdílením
          našich příspěvků přátelům podpoříte naši práci.
        </span>
      </div>
      <div className="d-flex flex-wrap">
        <a
          className="btn white me-2 mb-2"
          href="https://www.facebook.com/Demagog.CZ"
          target="_blank"
          title="Facebook - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <FacebookIcon />
          </span>
        </a>
        <a
          className="btn white me-2 mb-2"
          href="https://www.instagram.com/demagog.cz/"
          target="_blank"
          title="Instagram - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <InstagramIcon />
          </span>
        </a>
        <a
          className="btn white me-2 mb-2"
          href="https://twitter.com/DemagogCZ"
          target="_blank"
          title="X - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <XIcon />
          </span>
        </a>
        <a
          className="btn white me-2 mb-2"
          href="https://www.tiktok.com/@demagog.cz"
          target="_blank"
          title="TikTok - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <TiktokIcon />
          </span>
        </a>
        <a
          className="btn white me-2 mb-2"
          href="https://www.threads.com/@demagog.cz"
          target="_blank"
          title="Threads - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <ThreadsIcon />
          </span>
        </a>
        <a
          className="btn white me-2 mb-2"
          href="https://bsky.app/profile/did:plc:zsxci35tprtsk6fpcup65q2r"
          target="_blank"
          title="Bluesky - Demagog.cz"
        >
          <span className="w-30px h-30px">
            <BlueskyIcon />
          </span>
        </a>
      </div>
    </div>
  )
}
