import { flag } from '@vercel/flags/next'

export const getBetaAdminStatementReorderingEnabled = flag<boolean>({
  key: 'beta.admin.statement-reordering-enabled',
  decide() {
    return process.env.STATEMENT_REORDERING === 'true'
  },
})

export const getBetaAdminStatementBulkPublishingEnabled = flag<boolean>({
  key: 'beta.admin.statement-bulk-publishing-enabled',
  decide() {
    return process.env.STATEMENT_BULK_PUBLISHING === 'true'
  },
})

export const getBetaAdminSourceStatsEnabled = flag<boolean>({
  key: 'beta.admin.source-stats-enabled',
  decide() {
    return process.env.SOURCE_STATS === 'true'
  },
})

export const getBetaAdminEducationEnabled = flag<boolean>({
  key: 'beta.admin.education-enabled',
  decide() {
    return process.env.EDUCATION === 'true'
  },
})

export const getArticlesPageEnabled = flag<boolean>({
  key: 'beta.articles-page-enabled',
  decide() {
    return process.env.ENABLE_ARTICLES_PAGES === 'true'
  },
})
