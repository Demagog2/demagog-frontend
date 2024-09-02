import { FragmentType, gql, useFragment } from '@/__generated__'
import { AccordionItem } from './AccordionItem'

const AccordionSectionFragment = gql(`
  fragment AccordionSectionContent on AccordionSection {
    id
    slug
    title
    accordionItems {
      edges {
        cursor
        node {
          ...AccordionItem
        }
      }
    }
  }
`)

export function AccordionSection(props: {
  index: number
  accordionSection: FragmentType<typeof AccordionSectionFragment>
}) {
  const accordionSection = useFragment(
    AccordionSectionFragment,
    props.accordionSection
  )

  return (
    <div className="accordion pb-10" id={accordionSection.slug}>
      <h2 className="pb-5">
        {props.index + 1}. {accordionSection.title}
      </h2>

      {accordionSection.accordionItems.edges?.map((edge, index) => {
        if (!edge?.node) {
          return null
        }

        return (
          <AccordionItem
            key={edge.cursor}
            data={edge.node}
            isExpanded={index === 0}
            parentId={accordionSection.slug}
          />
        )
      })}
    </div>
  )
}
