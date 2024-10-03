import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

type AdminSearchProps = {
  label: string
  defaultValue?: string
}

export function AdminSearch(props: AdminSearchProps) {
  return (
    <>
      <div className="sm:flex">
        <div className="mt-3 sm:ml-4 sm:mt-0">
          {/* Mobile search */}
          <form method="GET" className="visible md:invisible">
            <label htmlFor="mobile-search-candidate" className="sr-only">
              {props.label}
            </label>

            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="mobile-search-candidate"
                  name="q"
                  type="text"
                  placeholder={props.label}
                  defaultValue={props.defaultValue}
                  className="block w-full rounded-none rounded-l-md rounded-r-md border-0 py-1.5 pl-10 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:hidden"
                />
              </div>
            </div>
          </form>

          {/* Desktop search */}
          <form method="GET" className="invisible md:visible">
            <label htmlFor="desktop-search-candidate" className="sr-only">
              {props.label}
            </label>

            <div className="flex rounded-md shadow-sm">
              <div className="relative flex-grow focus-within:z-10">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                  />
                </div>
                <input
                  id="desktop-search-candidate"
                  name="q"
                  type="text"
                  placeholder={props.label}
                  defaultValue={props.defaultValue}
                  className="hidden w-full rounded-none rounded-l-md rounded-r-md border-0 py-1.5 pl-10 text-sm leading-6 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:block"
                />
              </div>
            </div>
          </form>
        </div>

        <div className="mt-3 sm:ml-4 sm:mt-0 sm:flex-none flex-shrink-0"></div>
      </div>
    </>
  )
}
