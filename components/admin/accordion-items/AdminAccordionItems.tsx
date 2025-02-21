'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { nicerLinksNoTruncate } from '@/libs/comments/text'

const AdminAccordionItemsFragment = gql(`
  fragment AdminAccordionItems on AccordionSection {
    accordionItemsV2 {
      edges {
        node {
          ... on AccordionItemText {
            id
            title
            content
          }
        }
          cursor
      }
    }
  }
`)

export default function AdminAccordionItems(props: {
  accordionItem: FragmentType<typeof AdminAccordionItemsFragment>
}) {
  const accordionItem = useFragment(
    AdminAccordionItemsFragment,
    props.accordionItem
  )

  return (
    <>
      {accordionItem.accordionItemsV2.edges?.map((edge) => {
        if (!edge?.node) {
          return null
        }

        const { node, cursor } = edge

        if (node.__typename === 'AccordionItemText') {
          return (
            <div
              key={cursor}
              className="border border-gray-300 bg-white shadow-sm rounded-2xl overflow-hidden text-sm"
            >
              <div className="p-4 sm:px-6">
                <div className="flex flex-col gap-8">
                  <div className="space-y-6 text-gray-600">
                    <div>
                      <p className="font-semibold">Nazev:</p>
                      <p>{node.title}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Popis:</p>
                      <div
                        className="content-text-node"
                        dangerouslySetInnerHTML={{
                          __html: nicerLinksNoTruncate(node.content),
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        }
      })}
    </>
  )
}
