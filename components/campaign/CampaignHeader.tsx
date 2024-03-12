import Link from 'next/link'
import style from '@/assets/styles/campaign/styles.module.css'
import DemagogLogo from '@/assets/images/campaign/demagog-logo-sub.svg'

export function CampaignHeader() {
  return (
    <header>
      <Link href="https://demagog.cz">
        <DemagogLogo className={style.logoDemagog} alt="Demagog.cz" />
      </Link>
    </header>
  )
}
