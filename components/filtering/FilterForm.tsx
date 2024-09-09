import { Pagination } from '@/components/pagination'
import {
  ChangeEvent,
  PropsWithChildren,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { debounceTime, Subject } from 'rxjs'
import { usePathname, useRouter } from 'next/navigation'
import { FilterFormRenderer } from './FilterFormRenderer'
import { SearchButton } from '../search/SearchButton'

type FilterFormProps = PropsWithChildren<{
  hasAnyFilters: boolean
  term: string
  pageSize: number
  page: number
  totalCount: number
  searchPlaceholder: string

  renderFilters(): ReactNode
}>

export function FilterForm(props: FilterFormProps) {
  const [areFiltersOpen, setFiltersOpen] = useState(props.hasAnyFilters)
  const pathname = usePathname()
  const router = useRouter()

  const submit$ = useMemo(() => {
    const subject = new Subject<HTMLFormElement>()

    subject.pipe(debounceTime(1000)).subscribe((form) => {
      form.submit()
    })

    return subject
  }, [])

  const handleChange = useCallback(
    (evt: ChangeEvent<HTMLFormElement>) => submit$.next(evt.target.form),
    [submit$]
  )

  const handleReset = useCallback(() => {
    setFiltersOpen(false)
    router.push(pathname)
  }, [pathname, router])

  return (
    <FilterFormRenderer
      hasAnyFilters={props.hasAnyFilters}
      onChange={handleChange}
      onReset={handleReset}
      renderFilters={props.renderFilters}
      renderSearch={() => (
        <div className="d-flex justify-content-end">
          <div className="w-100 mw-350px">
            <div className="w-100 position-relative">
              <input
                name="q"
                type="text"
                defaultValue={props.term}
                className="input outline focus-primary search"
                placeholder={props.searchPlaceholder}
              />
              <SearchButton />
            </div>
          </div>
        </div>
      )}
      renderFooter={() => (
        <div className="d-flex justify-content-center my-5 my-lg-10">
          <Pagination
            pageSize={props.pageSize}
            currentPage={props.page}
            totalCount={props.totalCount}
          />
        </div>
      )}
    >
      {props.children}
    </FilterFormRenderer>
  )
}
