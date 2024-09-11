'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { AccordionItem } from './AccordionItem'
import { useState } from 'react'

const AccordionSectionFragment = gql(`
  fragment AccordionSectionContent on AccordionSection {
    id
    slug
    title
    accordionItemsV2 {
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

  const [state, setState] = useState(0)

  return (
    <div className="accordion pb-10" id={accordionSection.slug}>
      <h2 className="pb-5">
        {props.index + 1}. {accordionSection.title}
      </h2>

      {accordionSection.accordionItemsV2.edges?.map((edge, index) => {
        if (!edge?.node) {
          return null
        }

        return (
          <AccordionItem
            key={edge.cursor}
            data={edge.node}
            isExpanded={index === state}
            onToggle={() => setState(index)}
          />
        )
      })}
    </div>
  )
}
