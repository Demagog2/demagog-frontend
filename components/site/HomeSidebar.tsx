'use client'

import { Expander } from '../util/Expander'
import { VideoModal } from '@/components/modals/VideoModal'

export default function HomeSidebar() {
  return (
    <Expander className="bg-dark-light text-white p-5 p-lg-8 rounded mb-10">
      <div className="w-100 position-relative">
        <h2 className="display-2 fw-bold mb-4">Co je Demagog.cz?</h2>
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
              Máme transparentní <a href="/o-nas#jak-hodnotime">postupy</a>{' '}
              i&nbsp;
              <a href="/o-nas#nase-financovani">finance</a>.
            </li>
          </ul>
        </div>

        <VideoModal />

        <div className="mt-5">
          <span className="fs-5 mb-4">
            Upozorněte nás, když narazíte na nepravdivý obsah na sociálních
            sítích!
          </span>
        </div>
        <div className="mt-4">
          <a className="btn bg-secondary w-100" href="/o-nas#kontakty">
            <span className="text-dark">Upozornit</span>
          </a>
        </div>
      </div>
    </Expander>
  )
}
