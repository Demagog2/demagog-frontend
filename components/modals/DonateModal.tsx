'use client'

import { useCallback, useEffect } from 'react'
import classNames from 'classnames'
import DonateWidget from '@/components/site/DonateWidget'

export function DonateModal(props: { isModalOpen: boolean; onClose(): void }) {
  const { isModalOpen, onClose } = props

  const onKeyDown = useCallback(
    (evt: KeyboardEvent) => {
      if (evt.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [onKeyDown])

  return (
    <div>
      <div
        className={classNames('modal', {
          'is-open': isModalOpen,
        })}
      >
        <div className="modal-overlay" />
        <div className="modal-container px-5">
          <DonateWidget />
        </div>
        <div className="close-button rounded-circle bg-white" onClick={onClose}>
          <span className="symbol symbol-50px d-flex align-items-center justify-content-center ">
            <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24">
              <path d="M6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5l5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6Z"></path>
            </svg>
          </span>
        </div>
      </div>
    </div>
  )
}
