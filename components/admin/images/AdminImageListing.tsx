import { gql, FragmentType, useFragment } from '@/__generated__'
import { imagePath } from '@/libs/images/path'
import { CopyButton } from '@/components/admin/images/CopyButton'
import { PhotoIcon, ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { LinkButton } from '@/components/admin/forms/LinkButton'

const ImagesListingFragment = gql(`
  fragment ImagesListing on ContentImageConnection {
    edges {
      node {
        id
        name
        image
        image50x50
        user {
          fullName
        }
      }
    }
  }
`)

export function ImagesListing(props: {
  isShowAll: boolean
  data: FragmentType<typeof ImagesListingFragment>
}) {
  const data = useFragment(ImagesListingFragment, props.data)

  if (data.edges?.length === 0) {
    return <EmptyListing isShowAll={props.isShowAll} />
  }

  return (
    <div className="bg-white">
      <div className="px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
          {data?.edges?.map((edge) => {
            const contentImage = edge?.node

            if (!contentImage) {
              return null
            }

            return (
              <div key={contentImage.id}>
                <div className="relative">
                  <div className="relative h-72 w-full overflow-hidden rounded-lg">
                    <a href={`/beta/admin/images/${contentImage.id}`}>
                      <img
                        alt={contentImage.name}
                        src={imagePath(contentImage.image)}
                        className="h-full w-full object-cover object-center"
                      />
                    </a>
                  </div>
                  <div className="relative mt-4">
                    <h3 className="text-sm font-medium text-gray-900 truncate">
                      {contentImage.name}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {contentImage.user?.fullName}
                    </p>
                  </div>
                </div>
                <div className="mt-6">
                  <CopyButton link={imagePath(contentImage.image)} />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function EmptyListing(props: { isShowAll: boolean }) {
  const description = props.isShowAll ? (
    <>Začněte nahráním obrázku.</>
  ) : (
    <>
      Začněte nahráním obrázku nebo{' '}
      <LinkButton className="underline" href={'?showAll=true'}>
        zobrazte všechny obrázky
      </LinkButton>
    </>
  )
  return (
    <div className="text-center my-20">
      <PhotoIcon className="mx-auto w-20 h-20" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        Žádné obrázky
      </h3>
      <p className="mt-1 text-sm text-gray-500">{description}</p>
      <div className="mt-6">
        <LinkButton
          href="/admin/images/new"
          className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          <ArrowUpOnSquareIcon
            aria-hidden="true"
            className="-ml-0.5 mr-1.5 h-5 w-5"
          />
          Nahrát obrázek
        </LinkButton>
      </div>
    </div>
  )
}
