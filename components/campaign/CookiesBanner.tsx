import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import { hasCookie, setCookie } from 'cookies-next'

export function CookiesBanner() {
  const [showConsent, setShowConsent] = useState(false)

  useEffect(() => {
    setShowConsent(!hasCookie('localConsent'))
  }, [])

  const acceptCookies = () => {
    setShowConsent(false)
    setCookie('localConsent', 'true', {})
  }

  const rejectCookies = () => {
    setShowConsent(false)
    setCookie('localConsent', 'false', {})
  }

  if (!showConsent) {
    return null
  }

  return (
    <div className="cookies p-5 p-lg-8" data-controller="components--footer">
      <div className="cookies-wrap bg-white shadow-l p-5 mw-400px rounded-l">
        <p className="fs-7">
          Abychom mohli měřit návštěvnost webu, potřebujeme Váš souhlas
          se&nbsp;zpracováním osobních údajů prostřednictvím cookies.
          <Link
            className="text-dark text-decoration-underline link"
            href="/stranka/zasady-zpracovani-osobnich-udaju"
          >
            Více o&nbsp;zpracování osobních údajů
          </Link>
        </p>
        <div className="mt-4">
          <button className="btn me-2 my-2" onClick={acceptCookies}>
            <span>Souhlasím s&nbsp;cookies</span>
          </button>
          <a className="btn outline  my-2" onClick={rejectCookies}>
            <span className="text-dark">Nesouhlasím</span>
          </a>
        </div>
      </div>
    </div>
  )
}
