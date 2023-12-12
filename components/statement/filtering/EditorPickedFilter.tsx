import { pluralize } from '@/libs/pluralize'
import gql from 'graphql-tag'

export type EditorPickedAggregation = {
  count: number
}

export const EditorPickedFilterFragment = gql`
  fragment EditorPickedFilter on EditorPickedAggregate {
    count
  }
`

type Props = EditorPickedAggregation & {
  isSelected: boolean
}

export function EditorPickedFilter(props: Props) {
  return (
    <div className="mt-5">
      <div className="check-btn py-2 <% if statement_elastic_filterable_list_presenter.filter_options[:editor_picked][:count] == 0 %>disabled<% end %>">
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
