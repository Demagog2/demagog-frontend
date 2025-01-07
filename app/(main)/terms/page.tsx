import { gql } from '@/__generated__'
import { getMetadataTitle } from '@/libs/metadata'
import { Metadata } from 'next'
import { serverQuery } from '@/libs/apollo-client-server'
import { notFound } from 'next/navigation'

export async function generateMetadata(): Promise<Metadata> {
  const { data } = await serverQuery({
    query: gql(`
      query metadataTerms($slug: String){
        page(slug: $slug){
          title
         }
       }
     `),
    variables: {
      slug: 'zasady-zpracovani-osobnich-udaju',
    },
  })

  if (!data.page.title) {
    notFound()
  }

  return {
    title: getMetadataTitle(data.page.title),
  }
}

export default async function terms() {
  const { data } = await serverQuery({
    query: gql(`
      query terms($slug: String){
        page(slug: $slug){
          title
          textHtml
         }
       }
     `),
    variables: {
      slug: 'zasady-zpracovani-osobnich-udaju',
    },
  })

  if (!data.page.textHtml) {
    notFound()
  }

  return (
    <div className="container">
      <div className="content row g-5">
        <h1>{data.page.title}</h1>
        <div
          dangerouslySetInnerHTML={{ __html: data.page.textHtml ?? '' }}
        ></div>
      </div>
    </div>
  )
}
