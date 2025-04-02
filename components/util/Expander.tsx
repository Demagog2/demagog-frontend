'use client'

import classNames from 'classnames'
import { PropsWithChildren, useCallback, useState } from 'react'

// The height of the expander in the folded (non-expanded) state
const EXPANDER_FOLDED_HEIGHT = 100

export function Expander(props: PropsWithChildren<{ className: string }>) {
  const [isFolded, setFolded] = useState(true)

  const toggleFolded = useCallback(() => {
    setFolded(!isFolded)
  }, [isFolded, setFolded])

  return (
    <div className={props.className}>
      <div className="d-none d-lg-block">{props.children}</div>
      <div className="d-block d-lg-none">
        <div
          className={classNames(' expander expander-dark-light', {
            'is-hidden': isFolded,
          })}
          style={isFolded ? { maxHeight: EXPANDER_FOLDED_HEIGHT } : {}}
        >
          {props.children}
        </div>

        <div className="d-flex">
          <a
            href="#"
            className="text-white text-decoration-underline mt-3"
            onClick={toggleFolded}
          >
            <span className="py-2 fs-5">
              {isFolded ? 'Zobrazit více' : 'Skrýt obsah'}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}
