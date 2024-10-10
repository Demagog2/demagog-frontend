'use client'

import { useState } from 'react'

export default function DonateWidget() {
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
          <form
            action="https://www.darujme.cz/darovat/1202717"
            className="donate-form"
          >
            <input type="hidden" name="currency" value="CZK" />
            <input type="hidden" name="locale" value="cs" />
            <input type="hidden" name="widget" value="1204039" />
            <input type="hidden" name="project" value="1202717" />

            {/* TODO: Use bootstrap utils classes and grid for the rest of the widget */}

            <div className="container">
              <div className="row g-2 mb-3">
                {['once', 'monthly'].map((frequency) => (
                  <div key={frequency} className="col-6">
                    <input
                      type="radio"
                      name="frequency"
                      id={frequency}
                      value={frequency}
                      className="btn-check"
                      defaultChecked={frequency === 'monthly'}
                      onClick={() => setCustomAmountOpened(false)}
                    />
                    <label
                      htmlFor={frequency}
                      className="widget-periodic-button w-100"
                    >
                      {frequency === 'once' ? 'Jednorázově' : 'Měsíčně'}
                    </label>
                  </div>
                ))}
              </div>
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
                    name="amount"
                    min={0}
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
                  <div className="widget-entries-item" key={amount}>
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
