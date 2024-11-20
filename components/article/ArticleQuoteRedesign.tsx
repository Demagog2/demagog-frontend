export function ArticleQuoteRedesign(props: {
  text: string
  withSpeaker?: boolean
}) {
  return (
    <div className="quote align-items-start fw-semibold mt-39 mx-3 text-start mt-lg-87 mx-lg-0 fs-lg-96">
      <blockquote className="blockquote fs-6 lh-base d-flex align-items-center mb-0">
        <span className="fs-64 quote-mark fst-italic me-4 mt-minus-10 align-self-start fs-lg-96 me-lg-30">
          ”
        </span>
        <div>
          <p className="mb-0 px-0 py-0 fw-semibold fs-lg-24 fst-italic">
            {props.text}
          </p>
          {props.withSpeaker && (
            <div className="d-flex align-items-start mt-4 mt-lg-5">
              <img
                className="me-4 me-lg-5 symbol-size rounded-circle bg-gray-500 overflow-hidden"
                src="https://1gr.cz/fotky/lidovky/18/092/maxi/MPR760d2c_82661247.jpg"
                alt="Pavel Dvoracek"
              />
              <div className="mb-0 fs-7 fs-lg-5">
                <p className="fw-semibold">Pavel Dvořáček</p>
                <p className="fw-normal">ředitel likérny Rudolf Jelínek</p>
              </div>
            </div>
          )}
        </div>
      </blockquote>
    </div>
  )
}
