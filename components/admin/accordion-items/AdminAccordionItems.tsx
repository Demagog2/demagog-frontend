'use client'

import { FragmentType, gql, useFragment } from '@/__generated__'
import { nicerLinksNoTruncate } from '@/libs/comments/text'
import { PencilIcon } from '@heroicons/react/24/outline'
import AdminAccordionItemDeleteDialog from './AdminAccordionItemDelete'

const AdminAccordionItemsFragment = gql(`
  fragment AdminAccordionItems on AccordionSection {
    id
    accordionItemsV2 {
      edges {
        node {
          ... on AccordionItemText {
            id
            title
            content
            ...AdminAccordionItemDeleteDialog
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

  const accordionSectionId = accordionItem.id

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
                <div className="flex justify-between space-x-3 items-center">
                  <div className="flex flex-col gap-6 text-gray-600">
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

                  <div className="flex self-start space-x-3">
                    <a
                      href={`/beta/admin/accordion-sections/${accordionSectionId}/items/${node.id}/edit`}
                      title="Upravit"
                    >
                      <PencilIcon
                        className="h-6 w-6 text-gray-400 hover:text-indigo-600 cursor-pointer"
                        title="Upravit"
                      />
                    </a>
                    <AdminAccordionItemDeleteDialog
                      accordionItem={node}
                      accordionSection={accordionSectionId}
                    />
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
