import { Metadata } from 'next'
import { AdminImageForm } from '@/components/admin/images/AdminImageForm'
import { createImage } from '@/app/(admin)/admin/images/actions'
import { AdminPageTitle } from '@/components/admin/layout/AdminPageTitle'
import { getMetadataTitle } from '@/libs/metadata'

export const metadata: Metadata = {
  title: getMetadataTitle('Nový obrázek', 'Administrace'),
}

export default function NewImage() {
  return (
    <div>
      <AdminPageTitle
        title="Nový obrázek"
        description="Nahrajte nový obrázek nebo gif."
      />
      <div className="mt-6">
        <AdminImageForm action={createImage} />
      </div>
    </div>
  )
}
