import { AdminSpeakerForm } from '@/components/speaker/AdminSpeakerForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Přidání nové osoby', 'Administrace'),
}

export default async function NewSpeaker() {
  return <p>Přidat novou osobu</p>
}
