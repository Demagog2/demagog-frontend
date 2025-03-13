import { Metadata } from 'next'
import AdminMediumForm from '@/components/admin/media/AdminMediumForm'
import { createMedium } from '../actions'

export const metadata: Metadata = {
  title: 'Nový pořad',
}

export default function NewMedia() {
  return <AdminMediumForm action={createMedium} title="Přidat nový pořad" />
}
