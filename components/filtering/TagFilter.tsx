import { ReactNode } from 'react'
import { FormCheckbox } from './controls/FormCheckbox'
import { FragmentType, gql, useFragment } from '@/__generated__'

export const TagFilterFragment = gql(`
  fragment TagFilter on TagAggregate {
    tag {
      id
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
      inputName="tags"
      value={tag.id}
      name={tag.name}
      isSelected={isSelected}
      label={<LabelRenderer count={count} />}
    />
  )
}
