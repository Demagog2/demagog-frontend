export type WorkshopType = {
  id: string
  name: string
  description: string
  priceFormatted: string
  image?: string
}

export function WorkshopOffer({ workshop }: { workshop: WorkshopType }) {
  const mediaUrl = process.env.NEXT_PUBLIC_MEDIA_URL ?? ''

  return (
    <div className="col col-12 col-lg-6">
      {workshop.image ? (
        <img
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
