'use client'
import Link from 'next/link'
import PlayIcon from '@/assets/icons/play.svg'
import { useShareableState } from '@/libs/useShareableState'
import { useBetween } from 'use-between'

export default function HomeSidebar() {
  const { setVideoModal } = useBetween(useShareableState)
  return (
    <div className="bg-dark-light text-white p-5 p-lg-8 rounded-l mb-10">
      <div className="w-100 position-relative">
        <h2 className="display-5 fw-bold mb-4">Co je Demagog.cz?</h2>
        <div className="fs-6 mb-10 dark-content">
          <p className="mb-2">
            Demagog.cz kontroluje pravdivost tvrzení českých politiků
            a&nbsp;populárního obsahu na sociálních sítích.
          </p>
          <ul>
            <li>
              Hledáme důvěryhodné zdroje, které si každý může zkontrolovat.
            </li>
            <li>
              Máme transparentní{' '}
              <Link href="/stranka/jak-hodnotime-metodika">postupy</Link>{' '}
              i&nbsp;
              <Link href="/stranka/jak-je-projekt-demagogcz-financovan">
                finance
              </Link>
              .
            </li>
          </ul>
        </div>
        <div
          className="w-100 position-relative"
          onClick={() => setVideoModal(true)}
        >
          <img
            className="w-100"
            src="/images/homepage-intro-video-thumbnail.png"
            alt="thumb"
          />
          <div className="overlay d-flex align-items-center justify-content-center link">
            <span>
              <PlayIcon />
            </span>
          </div>
        </div>
        <div className="mt-5">
          <span className="fs-5 mb-4">
            Upozorněte nás, když narazíte na nepravdivý obsah na sociálních
            sítích!
          </span>
        </div>
        <div className="mt-4">
          <Link className="btn bg-secondary w-100" href="/">
            <span className="text-dark">Upozornit</span>
          </Link>
        </div>
      </div>
    </div>
  )
}
