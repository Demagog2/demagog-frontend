import type { Statement } from '../Statement'
import type { IStatementFilter } from './StatementFilter'
import { AssessmentStatus } from '@/libs/constants/assessment'
import { STATUS_FILTER_LABELS } from '@/libs/sources/model/status/assessment-status'

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
