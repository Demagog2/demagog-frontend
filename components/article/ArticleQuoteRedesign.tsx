export function ArticleQuoteRedesign(props: { text: string }) {
  return (
    <div className="quote align-items-start fw-semibold mt-39 mx-3 text-start mt-lg-87 mx-lg-0 fs-lg-96">
      <blockquote className="blockquote fst-italic fs-6 lh-base d-flex align-items-center mb-0">
        <span className="fs-64 quote-mark fst-italic me-4 mt-minus-10 align-self-start fs-lg-96 me-lg-30">
          ”
        </span>
        <p className="mb-0 px-0 py-0 fw-semibold fs-lg-24">{props.text}</p>
      </blockquote>
    </div>
  )
}
