import Link from 'next/link'
import style from '@/assets/styles/campaign/styles.module.css'

export function CampaignHeader() {
  return (
    <header>
      <Link href="https://demagog.cz">
        <img
          src="/images/demagog-logo-sub.svg"
          className={style.logoDemagog}
          alt="Demagog.cz"
        />
      </Link>
    </header>
  )
}
