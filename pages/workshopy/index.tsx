import client from '@/libs/apollo-client'
import gql from 'graphql-tag'
import {
  WorkshopOffer,
  WorkshopType,
} from '@/components/workshops/WorkshopOffer'

export async function getStaticProps() {
  const { data } = await client.query({
    query: gql`
      query workshopsData {
        workshops {
          nodes {
            id
            # Zde doplnit dalsi policka, ktere potrebujeme z API
            # Dokumentace:
            # https://demagog.cz/graphiql
            # - docs v pravem hornim rohu
            # - query -> workshops -> nodes -> workshop

            # Budeme potrebovat pole ID viz pouziti komponety nize
            # a dale policka name, description atd. viz komponenta WorkshopOffer
          }
        }
      }
    `,
  })

  return {
    props: {
      workshops: data.workshops.nodes,
    },
  }
}

const Workshops = (props: { workshops: Array<WorkshopType> }) => {
  return (
    <div className="container">
      <div className="row g-5 mb-5">
        <h1 className="display-4 fw-600">Workshopy</h1>

        <h2 className="fs-2 fw-bold">Nabízíme workshopy</h2>
      </div>

      {/*
        Sem dat zbytek stranky z https://github.com/Demagog2/demagog/blob/master/app/views/workshops/index.html.erb
        */}

      <div className="row mt-1 gx-20 gy-20 display-flex">
        {/* Zde projit pres props.workshops a pouzit komponentu WorkshopOffer */}

        {/* Komponenta: <WorkshopOffer key={workshop.id} workshop={workshop} /> */}
      </div>
    </div>
  )
}

export default Workshops
