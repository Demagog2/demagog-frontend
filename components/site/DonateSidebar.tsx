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
        <form action="">
          <div>
            <label htmlFor="onetime">Jednorázově</label>
            <input
              type="radio"
              name="frequency"
              id="onetime"
              value="onetime"
              onClick={() => setCustomAmountOpened(false)}
            ></input>

            <label htmlFor="monthly">Měsíčně</label>
            <input
              type="radio"
              name="frequency"
              id="monthly"
              value="monthly"
              onClick={() => setCustomAmountOpened(false)}
            ></input>
          </div>
          <label htmlFor="customAmount">Přispět v Kč:</label>
          {customAmountOpened ? (
            <>
              <input
                type="number"
                id="customAmount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </>
          ) : (
            <button type="button" onClick={() => setCustomAmountOpened(true)}>
              Jiná částka
            </button>
          )}
          <div>
            {[100, 300, 1000].map((amount) => {
              return (
                <>
                  <label
                    htmlFor={amount.toString()}
                    className="btn btn-success"
                  >
                    {amount} Kč
                  </label>
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
                </>
              )
            })}
          </div>
          <button type="submit" className="btn btn-success">
            {amount ? `Darovat ${amount} Kč` : `Darovat`}
          </button>
        </form>
      </div>
    </div>
  )
}
