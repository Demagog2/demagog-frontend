import classNames from 'classnames'
import truncate from '@/libs/truncate'

export function ArticleResponsivePerex(props: {
  isEmbedded?: boolean
  perex?: string | null
}) {
  const perexSmall = truncate(props.perex ?? '', 190)
  const perexLarge = truncate(props.perex ?? '', 290)
  const perexXLarge = truncate(props.perex ?? '', 450)

  return (
    <div
      className={classNames({
        'lh-1': props.isEmbedded,
        'lh-sm': !props.isEmbedded,
      })}
    >
      <span
        className={classNames({
          'fs-12px fs-md-14px lh-md-base small-screen': props.isEmbedded,
          'fs-6': !props.isEmbedded,
        })}
      >
        {perexSmall}
      </span>
      {props.isEmbedded && (
        <span className="fs-12px fs-md-14px lh-md-base large-screen">
          {perexLarge}
        </span>
      )}
      {props.isEmbedded && (
        <span className="fs-12px fs-md-14px lh-md-base xlarge-screen">
          {perexXLarge}
        </span>
      )}
    </div>
  )
}
