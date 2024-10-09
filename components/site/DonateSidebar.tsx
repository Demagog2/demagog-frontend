'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function DonateSidebar() {
  const [customAmountOpened, setCustomAmountOpened] = useState(false)
  const [amount, setAmount] = useState('')

  return (
    <div className="bg-light text-dark p-5 p-lg-8 rounded-l d-none d-lg-flex">
      <div className="w-100">
        <h2 className="fs-2">Podpořte Demagog.cz</h2>
        <div className="mt-2">
          <span className="fs-6">
            Fungujeme díky podpoře od&nbsp;čtenářů, jako jste vy.
          </span>
        </div>
        <div className="widget">
          <form action="" className="donate-form">
            <div className="widget-periodic">
              <input
                type="radio"
                name="frequency"
                id="onetime"
                value="onetime"
                className="btn-check"
                onClick={() => setCustomAmountOpened(false)}
              ></input>
              <label htmlFor="onetime" className="widget-periodic-button">
                Jednorázově
              </label>

              <input
                type="radio"
                name="frequency"
                id="monthly"
                value="monthly"
                className="btn-check"
                onClick={() => setCustomAmountOpened(false)}
              ></input>
              <label htmlFor="monthly" className="widget-periodic-button">
                Měsíčně
              </label>
            </div>
            <div className="widget-custom">
              <div className="widget-custom-row">
                <div className="widget-custom-title">
                  <label htmlFor="customAmount">
                    Přispět v{' '}
                    <span className="widget-custom-currency">Kč:</span>
                  </label>
                </div>
                {!customAmountOpened && (
                  <button
                    type="button"
                    className="widget-custom-open"
                    onClick={() => setCustomAmountOpened(true)}
                  >
                    Jiná částka
                  </button>
                )}{' '}
              </div>

              {customAmountOpened && (
                <div className="widget-custom-fieldset">
                  <input
                    type="number"
                    id="customAmount"
                    className="widget-custom-input"
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
              )}
            </div>

            <div className="widget-entries">
              {[100, 300, 1000].map((amount) => {
                return (
                  <div className="widget-entries-item">
                    <input
                      type="radio"
                      className="btn-check"
                      id={amount.toString()}
                      name="amount"
                      value={amount.toString()}
                      onClick={() => {
                        setCustomAmountOpened(false)
                        setAmount(amount.toString())
                      }}
                    />
                    <label
                      htmlFor={amount.toString()}
                      className="widget-entries-button"
                    >
                      {amount} Kč
                    </label>
                  </div>
                )
              })}
            </div>
            <button type="submit" className="donate-submit">
              {amount ? `Darovat ${amount} Kč` : `Darovat`}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
