import { FragmentType, gql, useFragment } from '@/__generated__'
import { Label } from '../../forms/Label'

const AdminExpertsFieldFragment = gql(`
  fragment AdminExpertsField on Statement {
    source {
      experts {
        fullName
      }
    }
  }
`)

export function AdminExpertsField(props: {
  statement: FragmentType<typeof AdminExpertsFieldFragment>
}) {
  const statement = useFragment(AdminExpertsFieldFragment, props.statement)

  return (
    <>
      <Label htmlFor="experts">
        {statement.source.experts?.length === 1 ? 'Editor' : 'Editoři'}
      </Label>

      <div className="mt-4 text-sm text-gray-600">
        {statement.source.experts?.map((expert) => expert.fullName).join(', ')}

        {statement.source.experts?.length === 0 && <span>Nepřiřazení</span>}
      </div>
    </>
  )
}
