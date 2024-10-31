import { FragmentType, gql, useFragment } from '@/__generated__'

export const WorkshopOfferFragment = gql(`
  fragment WorkshopOfferFragment on Workshop {
    id
    name
    description
    image
    priceFormatted
  }
`)

export function WorkshopOffer(props: {
  workshop: FragmentType<typeof WorkshopOfferFragment>
}) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  const workshop = useFragment(WorkshopOfferFragment, props.workshop)

  return (
    <div className="col col-12 col-lg-6">
      {workshop.image ? (
        <img
          style={{ maxHeight: 308 }}
          src={`${mediaUrl}${workshop.image}`}
          alt={`Obrázek k workshopu ${workshop.name}`}
          className="rounded-l mb-10"
        />
      ) : (
        <img
          src="/images/article-illustration-default-preview.svg"
          alt={`Obrázek k workshopu ${workshop.name}`}
          className="rounded-l mb-10"
        />
      )}

      <h3 className="fs-3 mb-5">{workshop.name}</h3>

      <p className="fs-5 mb-5">{workshop.description}</p>

      <span className="price fs-3 text-primary fw-600">
        od {workshop.priceFormatted}
      </span>
    </div>
  )
}
