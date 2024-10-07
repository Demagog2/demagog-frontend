'use client'

import Script from 'next/script'
import { useState } from 'react'

export default function DonateSidebar() {
  const [differentAmountOpened, setDifferentAmountOpened] = useState(false)
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
              onClick={() => setDifferentAmountOpened(false)}
            ></input>

            <label htmlFor="monthly">Měsíčně</label>
            <input
              type="radio"
              name="frequency"
              id="monthly"
              value="monthly"
              onClick={() => setDifferentAmountOpened(false)}
            ></input>
          </div>
          <label htmlFor="differentAmount">Přispět v Kč:</label>
          {differentAmountOpened ? (
            <>
              <input
                type="number"
                id="differentAmount"
                onChange={(e) => setAmount(e.target.value)}
              />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setDifferentAmountOpened(true)}
            >
              Jiná částka
            </button>
          )}

          <div>
            <label htmlFor="100" className="btn btn-success">
              100 Kč
            </label>
            <input
              type="radio"
              className="btn-check"
              id="100"
              name="amount"
              value="100"
              onClick={() => {
                setDifferentAmountOpened(false)
                setAmount('100')
              }}
            />
            <label htmlFor="300" className="btn btn-success">
              300 Kč
            </label>
            <input
              type="radio"
              className="btn-check"
              id="300"
              name="amount"
              value="300"
              onClick={() => {
                setDifferentAmountOpened(false)
                setAmount('300')
              }}
            />
            <label htmlFor="1000" className="btn btn-success">
              1000 Kč
            </label>
            <input
              type="radio"
              className="btn-check"
              id="1000"
              name="amount"
              value="1000"
              onClick={() => {
                setDifferentAmountOpened(false)
                setAmount('1000')
              }}
            />
          </div>
          <button type="submit" className="btn btn-success">
            {amount ? `Darovat ${amount} Kč` : `Darovat`}
          </button>
        </form>
      </div>
    </div>
  )
}
