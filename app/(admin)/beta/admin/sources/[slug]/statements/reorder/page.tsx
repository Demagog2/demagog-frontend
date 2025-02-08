import { getBetaAdminStatementReorderingEnabled } from '@/libs/flags'
import { notFound } from 'next/navigation'

export default async function AdminSourceStatementsReorder() {
  const isBetaAdminStatementReorderingEnabled =
    await getBetaAdminStatementReorderingEnabled()

  if (!isBetaAdminStatementReorderingEnabled) {
    notFound()
  }

  return <div>Admin source statements reorder</div>
}
