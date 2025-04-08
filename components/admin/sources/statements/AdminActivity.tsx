import { FragmentType, gql, useFragment } from '@/__generated__'
import { AdminCommentActivity } from './AdminCommentActivity'
import { AdminEvaluationStatusChangeActivity } from './AdminEvaluationStatusChangeActivity'
import { AdminEvaluatorChangeActivity } from './AdminEvaluatorChangeActivity'
import { AdminShortExplanationChangeActivity } from './AdminShortExplanationChangeActivity'
import { AdminExplanationHtmlChangeActivity } from './AdminExplanationHtmlChangeActivity'
import { AdminVeracityChangeActivity } from './AdminVeracityChangeActivity'
import { AdminSourceSpeakerChangeActivity } from './AdminSourceSpeakerChangeActivity'

const AdminActivityFragment = gql(`
  fragment AdminActivity on ActivityUnion {
    ... on CommentActivity {
      ...AdminCommentActivity
    }
    ... on EvaluationStatusChangeActivity {
      ...AdminEvaluationStatusChangeActivity
    }
    ... on EvaluatorChangeActivity {
      ...AdminEvaluatorChangeActivity
    }
    ... on ShortExplanationChangeActivity {
      ...AdminShortExplanationChangeActivity
    }
    ... on ExplanationHtmlChangeActivity {
      ...AdminExplanationHtmlChangeActivity
    }
    ... on VeracityChangeActivity {
      ...AdminVeracityChangeActivity
    }
    ... on SourceSpeakerChangeActivity {
      ...AdminSourceSpeakerChangeActivity
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
    case 'EvaluatorChangeActivity': {
      return <AdminEvaluatorChangeActivity activity={activity} />
    }
    case 'ShortExplanationChangeActivity': {
      return <AdminShortExplanationChangeActivity activity={activity} />
    }
    case 'ExplanationHtmlChangeActivity': {
      return <AdminExplanationHtmlChangeActivity activity={activity} />
    }
    case 'VeracityChangeActivity': {
      return <AdminVeracityChangeActivity activity={activity} />
    }
    case 'SourceSpeakerChangeActivity': {
      return <AdminSourceSpeakerChangeActivity activity={activity} />
    }
    default: {
      return null
    }
  }
}
