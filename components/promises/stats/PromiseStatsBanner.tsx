import classNames from 'classnames'
import { PromiseRatings } from '../PromiseRatingConf'
import { FragmentType, gql, useFragment } from '@/__generated__'
import { pluralize } from '@/libs/pluralize'

const PromiseStatsBannerFragment = gql(`
    fragment PromiseStatsBanner on GovernmentPromisesEvaluationArticle {
        promiseCount
        stats {
            key
            count
            percentage
        }
    }
`)

enum PromiseRatingKey {
  Fulfilled = 'fulfilled',
  InProgress = 'in_progress',
  PartiallyFulfilled = 'partially_fulfilled',
  NotYetEvaluated = 'not_yet_evaluated',
  Broken = 'broken',
  Stalled = 'stalled',
}

function getPromiseRatingKey(s: string): PromiseRatingKey {
  switch (s) {
    case 'fulfilled':
      return PromiseRatingKey.Fulfilled
    case 'in_progress':
      return PromiseRatingKey.InProgress
    case 'partially_fulfilled':
      return PromiseRatingKey.PartiallyFulfilled
    case 'not_yet_evaluated':
      return PromiseRatingKey.NotYetEvaluated
    case 'broken':
      return PromiseRatingKey.Broken
    case 'stalled':
      return PromiseRatingKey.Stalled
    default:
      throw new Error('Unknown promise rating key')
  }
}

function PromiseRating({
  ratingKey,
  count,
}: {
  ratingKey: string
  count: number
}) {
  const {
    backgroundColor,
    textColor,
    label,
    icon: Icon,
    isVisible,
  } = PromiseRatings[getPromiseRatingKey(ratingKey)]

  if (!isVisible(count)) {
    return null
  }

  return (
    <>
      <span
        className={classNames(
          'w-30px h-30px d-flex align-items-center justify-content-center rounded-circle me-2',
          {
            [backgroundColor]: true,
          }
        )}
      >
        <Icon />
      </span>
      <span
        className={classNames('fs-4 fw-600 text-uppercase', {
          [textColor]: true,
        })}
      >
        {`${count} ${pluralize(
          count,
          label.singular,
          label.plural,
          label.other
        )}`}
      </span>
    </>
  )
}

export function PromiseStatsBanner(props: {
  data: FragmentType<typeof PromiseStatsBannerFragment>
}) {
  const data = useFragment(PromiseStatsBannerFragment, props.data)

  return (
    <>
      <h2 className="fs-1 fw-600 mt-5">
        {data.promiseCount} sledovaných slibů
      </h2>

      <div>
        <div className="d-flex flex-wrap my-10">
          {data.stats?.map(({ key, count }) => (
            <div
              key={key}
              className="d-flex flex-wrap align-items-center me-5 me-lg-10 py-2"
            >
              <PromiseRating ratingKey={key} count={count} />
            </div>
          ))}
        </div>

        <div className="d-none d-md-flex rounded-pill overflow-hidden h-30px">
          {data.stats?.map(({ key, percentage }) => (
            <div key={key} style={{ width: `${percentage}%` }}>
              <span
                className={classNames('d-block h-100 mb-4', {
                  [PromiseRatings[getPromiseRatingKey(key)].backgroundColor]:
                    true,
                })}
              />
            </div>
          ))}
        </div>

        <div className="d-none d-md-flex mt-5">
          {data.stats
            ?.filter(({ key }) => key !== PromiseRatingKey.NotYetEvaluated)
            .map(({ key, percentage }) => (
              <div key={key} style={{ width: `${percentage}%` }}>
                <span
                  className={classNames('fs-4 fw-600', {
                    [`${percentage}%`]: true,
                  })}
                >
                  <span
                    className={classNames('d-block h-25px mb-4', {
                      [PromiseRatings[getPromiseRatingKey(key)].textColor]:
                        true,
                    })}
                  >
                    {percentage}%
                  </span>
                </span>
              </div>
            ))}
        </div>
      </div>
    </>
  )
}
