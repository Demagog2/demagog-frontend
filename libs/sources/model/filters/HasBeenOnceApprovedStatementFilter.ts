import type { Statement } from '../Statement'
import type { IStatementFilter } from './StatementFilter'

export class HasBeenOnceApprovedStatementFilter implements IStatementFilter {
  public getKey() {
    return 'onceApproved'
  }

  public getLabel(statements: Statement[]): string {
    const count = this.apply(statements).length

    return `Již jednou schválené (${count})`
  }

  public apply(statements: Statement[]): Statement[] {
    return statements.filter((statement) => statement.hasBeenOnceApproved())
  }

  public getGroupLabel() {
    return 'Filtrovat dle stavu'
  }
}
