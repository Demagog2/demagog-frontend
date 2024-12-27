import {
  ASSESSMENT_STATUS_APPROVAL_NEEDED,
  ASSESSMENT_STATUS_APPROVED,
  ASSESSMENT_STATUS_BEING_EVALUATED,
  ASSESSMENT_STATUS_PROOFREADING_NEEDED,
  AssessmentStatus,
} from '@/libs/constants/assessment'

export const STATUS_FILTER_LABELS: Map<AssessmentStatus, string> = new Map([
  [ASSESSMENT_STATUS_BEING_EVALUATED, 'Ve zpracování'],
  [ASSESSMENT_STATUS_APPROVAL_NEEDED, 'Ke kontrole'],
  [ASSESSMENT_STATUS_PROOFREADING_NEEDED, 'Ke korektuře'],
  [ASSESSMENT_STATUS_APPROVED, 'Schválené'],
])
