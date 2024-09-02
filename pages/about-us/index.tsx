import { gql } from '@/__generated__'
import { AboutUsQuery } from '@/__generated__/graphql'
import { AboutUsContent } from '@/components/about-us/AboutUsContent'
import { AboutUsMenu } from '@/components/about-us/AboutUsMenu'
import client from '@/libs/apollo-client'

export async function getServerSideProps() {
  const { data } = await client.query<AboutUsQuery>({
    query: gql(`
      query AboutUs {
        ...AboutUsMenu
        ...AboutUsContent
      }
    `),
  })

  return {
    props: {
      aboutUs: data,
    },
  }
}

export default function AboutUs(props: { aboutUs: AboutUsQuery }) {
  return (
    <div className="container">
      <div
        className="row g-5 g-lg-10"
        data-controller="components--sticky"
        data-action="scroll@window->components--sticky#onScroll"
        data-components--sticky-breakpoint="992"
      >
        <div className="col col-12 col-lg-3 position-relative">
          <AboutUsMenu data={props.aboutUs} />
        </div>

        <div
          className="col col-12 col-lg-9"
          data-target="components--sticky.content"
        >
          <AboutUsContent data={props.aboutUs} />
        </div>
      </div>
    </div>
  )
}
