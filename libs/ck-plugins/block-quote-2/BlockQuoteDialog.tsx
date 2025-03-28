import { useEffect, useState, useCallback } from 'react'
import { query } from '@/libs/apollo-client'
import { gql } from '@/__generated__'
import { debounce } from 'lodash'
import { Input } from '@/components/admin/forms/Input'
import { Fieldset, Legend } from '@headlessui/react'

interface Speaker {
  id: string
  fullName: string
}

interface BlockQuoteDialogProps {
  onSave: (
    speakerId?: string,
    link?: string,
    media?: string,
    quotedAt?: string,
    speakerCustomName?: string
  ) => void
  onClose: () => void
  defaultValues?: {
    speakerId?: string
    link?: string
    media?: string
    quotedAt?: string
    speakerCustomName?: string
  }
}

export function BlockQuoteDialog({
  onSave,
  onClose,
  defaultValues,
}: BlockQuoteDialogProps) {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedSpeakerId, setSelectedSpeakerId] = useState<string>(
    defaultValues?.speakerId ?? ''
  )
  const [link, setLink] = useState(defaultValues?.link ?? '')
  const [media, setMedia] = useState(defaultValues?.media ?? '')
  const [quotedAt, setQuotedAt] = useState(defaultValues?.quotedAt ?? '')
  const [speakerCustomName, setSpeakerCustomName] = useState(
    defaultValues?.speakerCustomName ?? ''
  )

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const fetchSpeakers = useCallback(
    debounce(async (name: string = '') => {
      setLoading(true)
      try {
        const response = await query({
          query: gql(`
            query BlockQuoteSpeakerView($name: String) {
              speakersV2(first: 10, filter: { name: $name }) {
                edges {
                  node {
                    id
                    fullName
                  }
                }
              }
            }
          `),
          variables: { name },
        })

        const fetchedSpeakers =
          response.data?.speakersV2?.edges
            ?.map((edge) => edge?.node)
            .filter((node): node is Speaker => !!node) ?? []

        setSpeakers(fetchedSpeakers)
      } finally {
        setLoading(false)
      }
    }, 500),
    [setLoading, setSpeakers]
  )

  useEffect(() => {
    fetchSpeakers(searchTerm)
  }, [searchTerm, fetchSpeakers])

  return (
    <div className="ck-block-quote-dialog ck-reset_all-excluded">
      <div className="ck-block-quote-dialog__content">
        <div className="ck-block-quote-dialog__section">
          <Fieldset className="mt-4">
            <Legend className="text-base font-semibold leading-7 text-gray-900">
              Vyhledat řečníka
            </Legend>

            <div className="ck-block-quote-dialog__section">
              <Input
                type="search"
                placeholder="Zadejte jméno řečníka"
                value={searchTerm}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSearchTerm(e.target.value)
                }
              />
            </div>

            <ul className="ck-list">
              {loading ? (
                <li>Načítání...</li>
              ) : (
                speakers.map((speaker) => (
                  <li
                    key={speaker.id}
                    className={
                      selectedSpeakerId === speaker.id ? 'ck-selected' : ''
                    }
                    onClick={() => setSelectedSpeakerId(speaker.id)}
                  >
                    <span>{speaker.fullName}</span>
                    {selectedSpeakerId === speaker.id && (
                      <span
                        className="ck-icon ck-icon-check"
                        style={{ marginLeft: '8px' }}
                      />
                    )}
                  </li>
                ))
              )}
            </ul>

            <Input
              type="text"
              placeholder="Řečník mimo databázi"
              name="speakerCustomName"
              value={speakerCustomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSpeakerCustomName(e.target.value)
              }
            />
          </Fieldset>
        </div>

        <Fieldset className="mt-4">
          <Legend className="text-base font-semibold leading-7 text-gray-900">
            Údaje o citátu
          </Legend>

          <div className="ck-block-quote-dialog__section">
            <Input
              name="link"
              type="url"
              placeholder="Zadejte URL citátu ve formátu https://"
              value={link}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setLink(e.target.value)
              }
            />
          </div>
          <div className="ck-block-quote-dialog__section">
            <Input
              name="media"
              type="text"
              placeholder="Název zdroje citátu"
              value={media}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMedia(e.target.value)
              }
            />
          </div>
          <div className="ck-block-quote-dialog__section">
            <Input
              name="quotedAt"
              type="date"
              placeholder="Datum citátu"
              value={quotedAt}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setQuotedAt(e.target.value)
              }
            />
          </div>
        </Fieldset>
      </div>

      <div className="ck-block-quote-dialog__actions">
        <button
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={() =>
            onSave(selectedSpeakerId, link, media, quotedAt, speakerCustomName)
          }
        >
          {selectedSpeakerId || speakerCustomName
            ? 'Vložit'
            : 'Vložit (bez řečníka)'}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
        >
          Zavřít
        </button>
      </div>
    </div>
  )
}
