'use client'

import { AdminSourceTranscript } from './AdminSourceTranscript'
import { gql } from '@/__generated__'
import type { AdminSourceTranscriptStatementsFormQuery } from '@/__generated__/graphql'
import { useQuery } from '@apollo/client'
import { LoadingMessage } from '@/components/admin/forms/LoadingMessage'
import { AdminSourceStatements } from '@/components/admin/sources/AdminSourceStatements'
import { useState } from 'react'

interface TranscriptPosition {
  startLine: number
  startOffset: number
  endLine: number
  endOffset: number
  text: string
}

const SOURCE_QUERY = gql(`
  query AdminSourceTranscriptStatementsForm($id: ID!) {
    sourceV2(id: $id) {
      id
      transcript
      statements(includeUnpublished: true) {
        id
        statementTranscriptPosition {
          startLine
          startOffset
          endLine
          endOffset
        }
      }
      ...SourceStatements
    }
    ...AdminSourceStatementsData
  }
`)

interface AdminStatementsFromTranscriptProps {
  sourceId: string
}

export function AdminStatementsFromTranscript({
  sourceId,
}: AdminStatementsFromTranscriptProps) {
  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(
    null
  )
  const [newStatementTranscriptPosition, setNewStatementTranscriptPosition] =
    useState<TranscriptPosition | null>(null)

  const { data, loading, error } =
    useQuery<AdminSourceTranscriptStatementsFormQuery>(SOURCE_QUERY, {
      variables: { id: sourceId },
    })

  if (loading) {
    return <LoadingMessage message="Načítám přepis..." />
  }

  if (error) {
    return <div>Chyba při načítání přepisu: {error.message}</div>
  }

  if (!data?.sourceV2) {
    return <div>Přepis nebyl nalezen</div>
  }

  const statements = data.sourceV2.statements.filter(
    (statement) => statement.statementTranscriptPosition
  )

  const filteredStatements = selectedStatementId
    ? statements.filter((statement) => statement.id === selectedStatementId)
    : statements

  return (
    <div className="grid grid-cols-2 gap-8">
      <div>
        <AdminSourceTranscript
          transcript={data.sourceV2.transcript ?? ''}
          statementTranscriptPositions={statements.flatMap((statement) => {
            const pos = statement.statementTranscriptPosition
            return pos ? [{ ...pos, statementId: statement.id }] : []
          })}
          onStatementClick={setSelectedStatementId}
          onTextSelect={setNewStatementTranscriptPosition}
        />
      </div>
      <div className="h-[calc(100vh-12rem)] overflow-y-auto">
        <h3>{filteredStatements.length} výroků</h3>

        <p className="text-gray-500">
          Klikněte do označené části v přepisu k zobrazení pouze výroku k ní se
          vztahujícího. Pokud chcete vytvořit nový výrok, označte část přepisu,
          ze které jej chcete vytvořit.
        </p>
        {newStatementTranscriptPosition ? (
          <div>Form</div>
        ) : (
          <AdminSourceStatements
            source={data.sourceV2}
            data={data}
            filteredStatementsIds={filteredStatements.map(
              (statement) => statement.id
            )}
            isCondensed={true}
          />
        )}
      </div>
    </div>
  )
}
