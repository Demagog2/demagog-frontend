import { FragmentType, gql, useFragment } from '@/__generated__'
import classNames from 'classnames'
import { AccordionSection } from './AccordionSection'

const AboutUsContentFragment = gql(`
    fragment AboutUsContent on Query {
        accordionSections {
            edges {
                cursor
                node {
                    ...AccordionSectionContent
                }
            }
        }
    }
`)

export function AboutUsContent(props: {
  data: FragmentType<typeof AboutUsContentFragment>
}) {
  const data = useFragment(AboutUsContentFragment, props.data)

  return (
    <>
      {data.accordionSections.edges?.map((edge, index) => {
        if (!edge?.node) {
          return null
        }

        return (
          <AccordionSection
            key={edge.cursor}
            accordionSection={edge.node}
            index={index}
          />
        )
      })}
    </>
  )
}
