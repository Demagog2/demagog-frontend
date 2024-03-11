import client from '@/libs/apollo-client'
import gql from 'graphql-tag'
import TitleIcon from '@/assets/icons/promises.svg'
import Fulfilled from '@/assets/icons/promises/fulfilled.svg'
import InProgress from '@/assets/icons/promises/in_progress.svg'
import PartiallyFulfilled from '@/assets/icons/promises/partially_fulfilled.svg'
import Broken from '@/assets/icons/promises/broken.svg'
import Stalled from '@/assets/icons/promises/stalled.svg'
import NotYetEvaluated from '@/assets/icons/promises/not_yet_evaluated.svg'
import { pluralize } from '@/libs/pluralize'
import classNames from 'classnames'

export async function getServerSideProps({
  params,
}: {
  params: { slug: string }
}) {
  const { data } = await client.query({
    query: gql`
      query promises($slug: String) {
        governmentPromisesEvaluationBySlug(slug: "my-slug") {
          id
          title
          perex
          promises {
            id
          }
          promiseCount
          stats {
            key
            count
            percentage
          }
        }
      }
    `,
    variables: {
      slug: params?.slug || '',
    },
  })

  return {
    props: {
      article: data.governmentPromisesEvaluationBySlug,
      stats: [
        { key: 'fulfilled', count: 3, percentage: 10 },
        { key: 'in_progress', count: 15, percentage: 70 },
      ],
    },
  }
}

type PromisesProps = {
  article: {
    id: string
    title: string
    perex: string
    promiseCount: number
    promises: {
      id: string
    }[]
  }
  stats: { key: string; count: number; percentage: number }[]
}

const PromiseRatings = {
  fulfilled: {
    backgroundColor: 'bg-primary',
    textColor: 'text-primary',
    label: {
      singular: 'splněný',
      plural: 'splněné',
      other: 'splněno',
    },
    icon: Fulfilled,
  },
  in_progress: {
    backgroundColor: 'bg-primary-light',
    textColor: 'text-primary-light',
    label: {
      singular: 'rozpracovaný',
      plural: 'rozpracované',
      other: 'rozpracováno',
    },
    icon: InProgress,
  },
  partially_fulfilled: {
    backgroundColor: 'bg-secondary',
    textColor: 'text-secondary',
    label: {
      singular: 'část. splněný',
      plural: 'část. splněné',
      other: 'část. splněno',
    },
    icon: PartiallyFulfilled,
  },
  not_yet_evaluated: {
    backgroundColor: 'bg-dark',
    textColor: 'text-dark',
    label: {
      singular: 'zatím nehodnocený',
      plural: 'zatím nehodnocené',
      other: 'zatím nehodnoceno',
    },
    icon: NotYetEvaluated,
    isVisible: (count: number) => count > 0,
  },
  broken: {
    backgroundColor: 'bg-red',
    textColor: 'text-red',
    label: {
      singular: 'porušený',
      plural: 'porušené',
      other: 'porušeno',
    },
    icon: Broken,
  },
  stalled: {
    backgroundColor: 'bg-gray',
    textColor: 'text-gray',
    label: {
      singular: 'nerealizovaný',
      plural: 'nerealizované',
      other: 'nerealizováno',
    },
    icon: Stalled,
  },
}

function PromiseRating({
  ratingKey,
  count,
}: {
  ratingKey: string
  count: number
}) {
  const {
    backgroundColor,
    textColor,
    label,
    icon: Icon,
    isVisible = (_count: number) => true,
  } = PromiseRatings[ratingKey]

  if (!isVisible(count)) {
    return null
  }

  return (
    <>
      <span
        className={classNames(
          'w-30px h-30px d-flex align-items-center justify-content-center rounded-circle me-2',
          {
            [backgroundColor]: true,
          }
        )}
      >
        <Icon />
      </span>
      <span
        className={classNames('fs-4 fw-600 text-uppercase', {
          [textColor]: true,
        })}
      >
        {`${count} ${pluralize(
          count,
          label.singular,
          label.plural,
          label.other
        )}`}
      </span>
    </>
  )
}

export default function Promises(props: PromisesProps) {
  return (
    <div className="container">
      <div className="section">
        <div className="row row g-5 mb-5">
          <div className="col col-12">
            <div className="d-flex">
              <span className="d-flex align-items-center me-2">
                <TitleIcon />
              </span>
              <h1 className="display-4 fw-bold m-0 p-0">
                {props.article.title}
              </h1>
            </div>
          </div>
          <div className="col col-12 col-lg-6">
            <span className="fs-2 fw-bold">{props.article.perex}</span>
          </div>
        </div>
        <div className="row g-10">
          <div className="col col-12 col-lg-6">
            <div className="mb-4">
              <span className="fs-6">
                S&nbsp;končícím volebním obdobím zpracoval Demagog.cz unikátní
                analýzu, nakolik menšinová vláda hnutí ANO a&nbsp;ČSSD splnila
                závazky, které si na začátku volebního období sama vytyčila.
                Vláda Andreje Babiše schválila své programové prohlášení
                27.&nbsp;června&nbsp;2018. Z&nbsp;něj jsme vybrali padesátku
                slibů napříč tématy a&nbsp;ty jsme po celé volební období
                průběžně sledovali.
              </span>
            </div>
            <div>
              <span className="fs-6">
                Nyní si tak můžete přečíst, jak si druhá Babišova vláda vedla
                v&nbsp;plnění slibů v&nbsp;oblasti hospodářství, životního
                prostředí, sociálního státu, vzdělanosti, právního státu
                a&nbsp;bezpečnosti. U&nbsp;každého slibu jsme na základě
                dohledávání primárních zdrojů informací zkoumali, zda se jej
                koalici podařilo naplnit. Pro potřeby tohoto výstupu pracujeme
                s&nbsp;třemi kategoriemi hodnocení — jde o&nbsp;sliby splněné,
                částečně splněné nebo porušené (více v{' '}
                <a href="https://demagog.cz/diskuze/overujeme-sliby-vlady-andreje-babise">
                  metodice
                </a>
                ). Cílem hodnocení není říct, zda vláda byla dobrá, nebo špatná,
                úspěšná, nebo neúspěšná. To si rozhodne každý volič
                8.&nbsp;a&nbsp;9.&nbsp;října u&nbsp;volební urny. Naším cílem
                bylo nabídnout veřejnosti tvrdá data a&nbsp;poctivou analýzu
                namísto impulzivních a zkratkovitých hodnocení, která
                s&nbsp;sebou nese (nejen) předvolební kampaň.
              </span>
            </div>
          </div>
          <div className="col col-12 col-lg-6">
            <div className="mb-4">
              <span className="fs-6">
                Z&nbsp;výsledků analýzy vyplývá, že z&nbsp;celkových 50 slibů
                vláda splnila 22 slibů, 13 splnila částečně a&nbsp;zbývajících
                15 slibů porušila.
              </span>
            </div>
            <div className="mb-4">
              <span className="fs-6">
                Druhá polovina funkčního období vlády byla charakterizována
                probíhající pandemií covidu-19. S&nbsp;ní spojené výzvy se
                pochopitelně podepsaly i&nbsp;na plnění programového prohlášení.
                Na naši metodiku hodnocení jednotlivých slibů to vliv nemělo,
                při čtení naší analýzy ale dopad pandemie na práci vlády mějte
                na paměti.
              </span>
            </div>
            <div className="mb-4">
              <span className="fs-6">
                Analýzu jsme zpracovali k&nbsp;17.&nbsp;září&nbsp;2021,
                s&nbsp;ohledem na případné legislativní posuny u&nbsp;některých
                slibů ji budeme do sněmovních voleb aktualizovat.
              </span>
            </div>
            <div>
              <span className="fs-6">
                Za podporu děkujeme Nadačnímu fondu pro nezávislou žurnalistiku.
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="section">
        <h2 className="fs-1 fw-600">
          {props.article.promiseCount} sledovaných slibů
        </h2>

        <div>
          <div className="d-flex flex-wrap my-10">
            {props.stats.map(({ key, count }) => (
              <div
                key={key}
                className="d-flex flex-wrap align-items-center me-5 me-lg-10 py-2"
              >
                <PromiseRating ratingKey={key} count={count} />
              </div>
            ))}
          </div>

          <div className="d-none d-md-flex rounded-pill overflow-hidden h-30px">
            {props.stats.map(({ key, count }) => (
              <div key={key} style={{ width: `${count}%` }}>
                <span
                  className={classNames('d-block h-100 mb-4', {
                    [PromiseRatings[key].backgroundColor]: true,
                  })}
                />
              </div>
            ))}
          </div>

          <div className="d-none d-md-flex mt-5">
            {props.stats
              .filter(({ key }) => key !== 'not_yet_evaluated')
              .map(({ key, percentage }) => (
                <div key={key} style={{ width: `${percentage}%` }}>
                  <span
                    className={classNames('fs-4 fw-600', {
                      [`${percentage}%`]: true,
                    })}
                  >
                    <span
                      className={classNames('d-block h-25px mb-4', {
                        [PromiseRatings[key].textColor]: true,
                      })}
                    >
                      {percentage}%
                    </span>
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
