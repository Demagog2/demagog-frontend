import style from '@/assets/styles/campaign/styles.module.css'

export function CampaignHeader() {
  return (
    <header>
      <a href="https://demagog.cz">
        <img
          src="/images/demagog-logo-sub.svg"
          className={style.logoDemagog}
          alt="Demagog.cz"
        />
      </a>
    </header>
  )
}
