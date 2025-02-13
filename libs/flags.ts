import { flag } from '@vercel/flags/next'

export const getBetaAdminStatementReorderingEnabled = flag<boolean>({
  key: 'beta.admin.statement-reordering-enabled',
  decide() {
    return process.env.STATEMENT_REORDERING === 'true'
  },
})
