import { gql } from '@/__generated__'
import { serverQuery } from '@/libs/apollo-client-server'
import { AdminSpeakerForm } from '@/components/speaker/AdminSpeakerForm'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { createSpeaker } from '../actions'

export const metadata: Metadata = {
  title: getMetadataTitle('Nová osoba', 'Administrace'),
}

export default async function NewSpeaker() {
  return <AdminSpeakerForm title="Nová osoba" action={createSpeaker} />
}
