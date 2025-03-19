import { Metadata } from 'next'
import { AdminImageForm } from '@/components/admin/images/AdminImageForm'
import { createImage } from '@/app/(admin)/beta/admin/images/actions'
import { getMetadataTitle } from '@/libs/metadata'
import { AdminPage } from '@/components/admin/layout/AdminPage'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový obrázek', 'Administrace'),
}

export default function NewImage() {
  return (
    <AdminPage>
      <AdminImageForm
        action={createImage}
        title="Nový obrázek"
        description="Nahrajte nový obrázek nebo gif."
      />
    </AdminPage>
  )
}
