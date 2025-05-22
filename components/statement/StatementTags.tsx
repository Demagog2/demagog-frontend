import { FragmentType, gql, useFragment } from '@/__generated__'
import PackmanIcon from '@/assets/icons/packman.svg'

const StatementTagsFragment = gql(`
    fragment StatementTags on Statement {
      tags {
        id
        name
      }
    }
  `)

export function StatementTags(props: {
  tags: FragmentType<typeof StatementTagsFragment>
}) {
  const tags = useFragment(StatementTagsFragment, props.tags)

  return (
    <div className="row">
      <div className="col col-auto">
        <PackmanIcon className="h-15px me-1 align-text-center translate-up" />
        {tags.tags.length > 0 &&
          tags.tags.map((tag, index) => (
            <div key={tag.id} className="d-inline-block">
              <span
                className={`fs-8 ${index < tags.tags.length - 1 ? 'separator' : ''}`}
              >
                {tag.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
