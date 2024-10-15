import type { Statement } from '../Statement'
import type { IStatementFilter } from './StatementFilter'
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

export class EvaluationStatusStatementFilter implements IStatementFilter {
  constructor(private readonly evaluationStatus: AssessmentStatus) {}

  public getKey() {
    return this.evaluationStatus
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length

    return `${STATUS_FILTER_LABELS.get(this.evaluationStatus)} (${count})`
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) =>
      statement.hasEvaluationStatus(this.evaluationStatus)
    )
  }

  public getGroupLabel() {
    return 'Filtrovat dle stavu'
  }
}
