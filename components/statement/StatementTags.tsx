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
  statement: FragmentType<typeof StatementTagsFragment>
}) {
  const statement = useFragment(StatementTagsFragment, props.statement)

  return (
    <div className="row">
      <div className="col col-auto">
        <PackmanIcon className="h-15px me-1 align-text-center translate-up" />
        {statement.tags.length > 0 &&
          statement.tags.map((tag, index) => (
            <div key={tag.id} className="d-inline-block">
              <span
                className={`fs-8 ${index < statement.tags.length - 1 ? 'separator' : ''}`}
              >
                {tag.name}
              </span>
            </div>
          ))}
      </div>
    </div>
  )
}
