import { FilterToggleIcon } from '@/components/filtering/FilterToggleIcon'
import classNames from 'classnames'
import { PropsWithChildren, useCallback, useState } from 'react'

export function FilterSection(
  props: PropsWithChildren<{ name: string; defaultOpen?: boolean }>
) {
  const [isFilterSectionOpen, setOpenFilterSection] = useState(
    props.defaultOpen
  )

  const toggleIsOpenFilterSection = useCallback(() => {
    setOpenFilterSection(!isFilterSectionOpen)
  }, [isFilterSectionOpen])

  return (
    <div className="filter w-100 mb-5">
      <div
        className={classNames(
          'filter-link d-flex align-items-center justify-content-between w-100 min-h-40px',
          { open: isFilterSectionOpen }
        )}
        onClick={toggleIsOpenFilterSection}
      >
        <span className="fs-6 fw-600">{props.name}</span>
        <FilterToggleIcon />
      </div>

      {isFilterSectionOpen && (
        <div className="filter-content">{props.children}</div>
      )}
    </div>
  )
}
