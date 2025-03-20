import { LinkButton } from '@/components/admin/forms/LinkButton'
import { AdminPage } from '@/components/admin/layout/AdminPage'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { notFound } from 'next/navigation'

export const metadata: Metadata = {
  title: getMetadataTitle('Dostupnost', 'Administrace'),
}

export default function Availability() {
  const link = process.env.AVAILABILITY_DOC_LINK

  if (!link) {
    notFound()
  }

  return (
    <AdminPage>
      <LinkButton href={link} target="_blank" rel="noreferrer">
        Otevřít spreadsheet v novém okně
      </LinkButton>

      <iframe className="mt-8 border-0" height="620" width="100%" src={link} />
    </AdminPage>
  )
}
