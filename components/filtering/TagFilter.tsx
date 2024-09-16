import { ReactNode } from 'react'
import { FormCheckbox } from './controls/FormCheckbox'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const TAG_FILTER_INPUT_NAME = 'tema[]'

export const TagFilterFragment = gql(`
  fragment TagFilter on TagAggregate {
    tag {
      filterKey
      name
    }
    isSelected
    count
  }
`)

type Props = {
  tag: FragmentType<typeof TagFilterFragment>
  renderLabel(props: { count: number }): ReactNode
}

export function TagFilter(props: Props) {
  const { tag, isSelected, count } = useFragment(TagFilterFragment, props.tag)

  const LabelRenderer = props.renderLabel

  return (
    <FormCheckbox
      inputName={TAG_FILTER_INPUT_NAME}
      value={tag.filterKey}
      name={tag.name}
      isSelected={isSelected}
      label={<LabelRenderer count={count} />}
    />
  )
}
