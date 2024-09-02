import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'

const AccordionItemFragment = gql(`
    fragment AccordionItem on AccordionItem {
      id
      title
      content
    }
`)

export function AccordionItem(props: {
  data: FragmentType<typeof AccordionItemFragment>
  isExpanded: boolean
  parentId: string
}) {
  const { isExpanded, parentId } = props

  const data = useFragment(AccordionItemFragment, props.data)

  const headingId = `heading-${data.id}`
  const collapseId = `collapse-${data.id}`

  return (
    <div className="accordion-item" id={data.id}>
      <h2 className="accordion-header" id={headingId}>
        <button
          className={classNames('accordion-button', { collapsed: !isExpanded })}
          type="button"
          data-bs-toggle="collapse"
          data-bs-target={`#${collapseId}`}
          aria-expanded={isExpanded}
          aria-controls={collapseId}
        >
          {data.title}
        </button>
      </h2>
      <div
        id={collapseId}
        className={classNames('accordion-collapse collapse', {
          show: isExpanded,
        })}
        aria-labelledby={headingId}
        data-bs-parent={`#${parentId}`}
      >
        <div className="accordion-body">
          <div
            className="content"
            dangerouslySetInnerHTML={{ __html: data.content }}
          ></div>
        </div>
      </div>
    </div>
  )
}
