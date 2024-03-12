import style from '@/assets/styles/campaign/styles.module.css'
import classNames from 'classnames'

export function ButtonBack(props: { isHidden?: boolean; onClick?: () => void }) {
  return (
    <button
      className={classNames(style.arrowBtn, style.arrowBackBtn, {
        [style.arrowHidden]: props.isHidden,
      })}
      onClick={props.onClick}
      data-dir="prev"
      title="Zpět"
    ></button>
  )
}
