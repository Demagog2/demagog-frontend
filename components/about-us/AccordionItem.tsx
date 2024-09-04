import { FragmentType, gql, useFragment } from '@/__generated__'
import Image from 'next/image'
import classNames from 'classnames'

const AccordionItemFragment = gql(`
    fragment AccordionItem on AccordionItemV2 {
        ... on AccordionItemText {
            id
            title
            content
        }
        ... on AccordionItemMembers {
            id
            title
            members {
                id
                bio
                fullName
                positionDescription
                avatar
            }
        }
    }
`)

export function AccordionItem(props: {
  data: FragmentType<typeof AccordionItemFragment>
  isExpanded: boolean
  onToggle: () => void
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL

  const { isExpanded, onToggle } = props

  const data = useFragment(AccordionItemFragment, props.data)

  const headingId = `heading-${data.id}`
  const collapseId = `collapse-${data.id}`

  return (
    <div className="accordion-item" id={data.id}>
      <h2 className="accordion-header" id={headingId}>
        <button
          className={classNames('accordion-button', { collapsed: !isExpanded })}
          type="button"
          aria-expanded={isExpanded}
          aria-controls={collapseId}
          onClick={onToggle}
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
      >
        <div className="accordion-body">
          {data.__typename === 'AccordionItemText' && (
            <div
              className="content"
              dangerouslySetInnerHTML={{ __html: data.content }}
            ></div>
          )}

          {data.__typename === 'AccordionItemMembers' && (
            <div className="row g-5">
              {data.members.map((member) => (
                <div key={member.id} className="col col-12">
                  <div className="row g-5 g-lg-10">
                    <div className="col col-2">
                      <span className="symbol symbol-square symbol-circle">
                        {member.avatar && (
                          <Image
                            className="w-100"
                            src={mediaUrl + member.avatar}
                            alt={member.fullName}
                            width={144}
                            height={144}
                          />
                        )}
                      </span>
                    </div>
                    <div className="col col-10">
                      <h4 className="fs-2">{member.fullName}</h4>
                      <p className="fs-6">
                        <b>{member.positionDescription}</b> &ndash; {member.bio}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
