import Link from 'next/link'

export function CookiesBanner() {
  return (
    <div className="cookies p-5 p-lg-8" data-controller="components--footer">
      <div className="cookies-wrap bg-white shadow-l p-5 mw-400px rounded-l">
        <p className="fs-7">
          Abychom mohli měřit návštěvnost webu, potřebujeme Váš souhlas
          se&nbsp;zpracováním osobních údajů prostřednictvím cookies.
          <Link
            className="text-dark text-underline link"
            href="/stranka/zasady-zpracovani-osobnich-udaju"
          >
            Více o&nbsp;zpracování osobních údajů
          </Link>
        </p>
        <div className="mt-4">
          <button className="btn me-2 my-2" onClick={() => console.log('TODO')}>
            <span>Souhlasím s&nbsp;cookies</span>
          </button>
          <a className="btn outline  my-2" onClick={() => console.log('TODO')}>
            <span className="text-dark">Nesouhlasím</span>
          </a>
        </div>
      </div>
    </div>
  )
}
