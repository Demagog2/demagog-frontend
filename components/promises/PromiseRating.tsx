import { gql, useFragment } from '@/__generated__'
import { PromiseRatingKey } from '@/__generated__/graphql'
import classNames from 'classnames'
import { PromiseRatings } from './PromiseRatingConf'

export const PromiseRatingFragment = gql(`
    fragment PromiseRatingDetail on PromiseRating {
        key
    }
`)

function PromiseRatingIcon(props: { promiseRatingKey: PromiseRatingKey }) {
  const Icon = PromiseRatings[props.promiseRatingKey].icon

  return <Icon />
}

export function PromiseRating(props: { promiseRating: any }) {
  const promiseRating = useFragment(PromiseRatingFragment, props.promiseRating)

  return (
    <div className="d-flex align-items-center">
      <span
        className={classNames(
          'w-30px h-30px min-w-30px d-flex align-items-center justify-content-center rounded-circle me-1',
          PromiseRatings[promiseRating.key].backgroundColor
        )}
      >
        <PromiseRatingIcon promiseRatingKey={promiseRating.key} />
      </span>
      <span className="fs-8 text-uppercase fw-600 text-<%= @promises_list_rating_classes[statement.assessment.promise_rating.key] %>">
        {PromiseRatings[promiseRating.key].label.singular}
      </span>
    </div>
  )
}
