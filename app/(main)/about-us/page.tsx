import { gql } from '@/__generated__'
import { AboutUsQuery } from '@/__generated__/graphql'
import { AboutUsContent } from '@/components/about-us/AboutUsContent'
import { AboutUsMenu } from '@/components/about-us/AboutUsMenu'
import { query } from '@/libs/apollo-client'
import {
  getCanonicalMetadata,
  getMetadataTitle,
  getRobotsMetadata,
} from '@/libs/metadata'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: getMetadataTitle('O nás'),
  ...getRobotsMetadata(),
  ...getCanonicalMetadata('/o-nas'),
}

export default async function AboutUs() {
  const { data } = await query<AboutUsQuery>({
    query: gql(`
      query AboutUs {
        ...AboutUsMenu
        ...AboutUsContent
      }
    `),
  })

  return (
    <div className="container">
      <div
        className="row g-5 g-lg-10"
        data-controller="components--sticky"
        data-action="scroll@window->components--sticky#onScroll"
        data-components--sticky-breakpoint="992"
      >
        <div className="col col-12 col-lg-3 position-relative">
          <AboutUsMenu data={data} />
        </div>

        <div
          className="col col-12 col-lg-9"
          data-target="components--sticky.content"
        >
          <AboutUsContent data={data} />
        </div>
      </div>
    </div>
  )
}
