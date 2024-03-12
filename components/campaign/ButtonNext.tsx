import style from '@/assets/styles/campaign/styles.module.css'
import classNames from 'classnames'

export function ButtonNext(props: { isHidden?: boolean; onClick?: () => void }) {
  return (
    <button
      className={classNames(style.arrowBtn, style.arrowFwdBtn, {
        [style.arrowHidden]: props.isHidden,
      })}
      onClick={props.onClick}
      data-dir="next"
      title="Dál"
    ></button>
  )
}
