import StatementItem from '../statement/Item'
import {
  SpeakerWithStats,
  SpeakerWithStatsProps,
} from '@/components/speaker/SpeakerWithStats'

type ArticleStatementsProps = {
  statements: any
  debateStats: SpeakerWithStatsProps[]
}

export default function ArticleStatements({
  statements,
  debateStats,
}: ArticleStatementsProps) {
  return (
    <div>
      <div className="row g-5 g-lg-10">
        <div className="col col-12">
          <h2 className="fs-2 text-bold">
            Řečníci s&nbsp;počty výroků dle hodnocení
          </h2>
        </div>

        {debateStats.map(({ speaker, stats }) => (
          <div key={speaker.id} className="col col-12 col-lg-4">
            <div className="speakers-overview-speaker">
              <SpeakerWithStats
                key={speaker.id}
                speaker={speaker}
                stats={stats}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-5 mt-lg-10">
        {statements.map((statement: any) => (
          <StatementItem key={statement.id} statement={statement} />
        ))}
      </div>
    </div>
  )
}
