import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminCommentActivity } from './AdminCommentActivity'
import { AdminEvaluationStatusChangeActivity } from './AdminEvaluationStatusChangeActivity'

const AdminActivityFragment = gql(`
  fragment AdminActivity on ActivityUnion {
    ... on CommentActivity {
      ...AdminCommentActivity
    }
    ... on EvaluationStatusChangeActivity {
      ...AdminEvaluationStatusChangeActivity
    }
  }
`)

export function AdminActivity(props: {
  activity: FragmentType<typeof AdminActivityFragment>
}) {
  const activity = useFragment(AdminActivityFragment, props.activity)
  switch (activity.__typename) {
    case 'CommentActivity': {
      return <AdminCommentActivity activity={activity} />
    }
    case 'EvaluationStatusChangeActivity': {
      return <AdminEvaluationStatusChangeActivity activity={activity} />
    }
    default: {
      return null
    }
  }
}
