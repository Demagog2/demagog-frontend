import { pluralize } from '@/libs/pluralize'
import gql from 'graphql-tag'
import classNames from 'classnames'

export type EditorPickedAggregation = {
  count: number
  isSelected: boolean
}

export const EditorPickedFilterFragment = gql`
  fragment EditorPickedFilter on EditorPickedAggregate {
    count
    isSelected
  }
`

type Props = EditorPickedAggregation

export function EditorPickedFilter(props: Props) {
  return (
    <div className="mt-5">
      <div
        className={classNames('check-btn', 'py-2', {
          disabled: props.count === 0,
        })}
      >
        <input
          type="checkbox"
          name="editorPicked"
          defaultChecked={props.isSelected}
          disabled={props.count === 0}
        />
        <span className="checkmark"></span>
        <span className="small fw-600 me-2">Pouze ve výběru Demagog.cz</span>
        <span className="smallest min-w-40px">
          {props.count} {pluralize(props.count, 'výrok', 'výroky', 'výroků')}
        </span>
      </div>
    </div>
  )
}
