import { query } from '@/libs/apollo-client'
import { WorkshopOffer } from '@/components/workshops/WorkshopOffer'
import { gql } from '@/__generated__'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('Workshopy'),
}

export default async function Workshops() {
  const { data } = await query({
    query: gql(`
      query workshopsData {
        workshops {
          nodes {
            id
            ...WorkshopOfferFragment
          }
        }
      }
    `),
  })

  return (
    <div className="container">
      <div className="row g-5 mb-5">
        <h1 className="display-4 fw-600">Workshopy</h1>

        <h2 className="fs-2 fw-bold">Nabízíme workshopy</h2>
      </div>
      <div className="row">
        <div className="col col-12 col-lg-7">
          <p className="fs-5 mb-5">
            Projekt Demagog.cz se soustředí na ověřování faktických výroků
            veřejných představitelů. Rozhodli jsme se ale nabídnout naše
            zkušenosti a znalosti dál a nabízet pořádání workshopů pro instituce
            veřejné i soukromé o tom, co zahrnuje mediální gramotnost a jak
            správně rozpoznat hoax od hlavních zpráv, fake news od skutečných
            novin. V dnešní době, kdy jsou zejména ze sociálních sítí lidé
            atakováni záplavou informací a dezinformací, je velmi složité
            rozpoznat, zda je daná informace přesná, nebo se jedná o hoax či o
            obskurní text.
          </p>

          <p className="fs-5 mb-5">
            Námi pořádané workshopy si kladou za cíl předat několik v dnešní
            době zásadních dovedností. S pomocí interaktivních aktivit pomůžeme
            studentům, zaměstnancům i ostatním v základní orientaci v mediální
            oblasti, předáme také znalost rozlišovat fakta od názorově
            zabarvených textů a prohloubíme rovněž kritické myšlení, což je pro
            dnešní dobu zcela zásadní dovednost. A nebyl by to správný
            factcheckingový projekt, kdyby nešířil povědomí, jak si co možná
            nejsnadněji ověřovat fakta, či alespoň jak nenaletět nezřídka
            přítomným vymyšleným či zavádějícím zprávám.
          </p>

          <p className="fs-5 mb-5">
            V současné době nabízíme čtyři základní moduly workshopů jejichž
            popis naleznete níže.
          </p>

          <p className="fs-5 mb-5">
            Toto tematické rozdělení je pouze orientační, vždy záleží na
            konkrétní domluvě mezi zadavatelem a našim lektorem; moduly jde
            kombinovat či přidávat témata dle zájmu, můžeme vytvořit akci i tak
            trochu "na klíč". Workshopy také aktualizujeme o současné dění.
          </p>

          <p className="fs-5 mb-5">
            Pro zachování interaktivní formy workshopu je maximální počet
            účastníků 35. Pro vyšší počet účastníků se bude jednat o
            přednáškovou formu.
          </p>

          <p className="fs-5">
            Za uspořádání workshopu žádáme od pořadatele finanční ocenění, a to
            z důvodu časové a organizační náročnosti těchto akcí. Cenu naleznete
            pod vybraným workshopem a připočítává se cestovné lektorky z Liberce
          </p>
        </div>
      </div>

      <div className="row mt-1 gx-20 gy-20 display-flex">
        {data.workshops.nodes?.map((workshop) => {
          if (!workshop) {
            return null
          }

          return <WorkshopOffer key={workshop.id} workshop={workshop} />
        })}
      </div>

      <div className="row">
        <div className="col col-12 col-lg-7">
          <p className="fs-5 mt-5">
            Objednávejte na <a href="mailto:info@demagog.cz">info@demagog.cz</a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
