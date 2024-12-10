import { FragmentType, gql, useFragment } from '@/__generated__'

const AccordionSectionFragment = gql(`
    fragment AccordionMenuItem on AccordionSection {
        id
        slug
        title
    }
`)

function AccordionMenuItem(props: {
  index: number
  accordionSection: FragmentType<typeof AccordionSectionFragment>
}) {
  const accordionSection = useFragment(
    AccordionSectionFragment,
    props.accordionSection
  )

  return (
    <div>
      <a
        href={`#${accordionSection.slug}`}
        className="min-h-30px d-inline-flex fs-5 fw-bold text-dark align-items-center text-none state-line mb-2"
      >
        <span>
          {props.index + 1}. {accordionSection.title}
        </span>
      </a>
    </div>
  )
}

const AboutUsMenuFragment = gql(`
    fragment AboutUsMenu on Query {
        accordionSections {
            edges {
                cursor
                node {
                    ...AccordionMenuItem
                }
            }
        }
    }
`)

export function AboutUsMenu(props: {
  data: FragmentType<typeof AboutUsMenuFragment>
}) {
  const data = useFragment(AboutUsMenuFragment, props.data)

  return (
    <nav className="side-nav w-100" data-target="components--sticky.sticky">
      <h1 className="display-1 fw-bold mb-5 p-0">O nás</h1>
      <ul className="list">
        {data.accordionSections.edges?.map((edge, index) => {
          if (!edge?.node) {
            return null
          }

          return (
            <AccordionMenuItem
              key={edge.cursor}
              accordionSection={edge.node}
              index={index}
            />
          )
        })}
      </ul>
    </nav>
  )
}
