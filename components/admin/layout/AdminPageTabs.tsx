import classNames from 'classnames'

export function AdminPageTabs(props: {
  tabs: { name: string; href: string; current: boolean }[]
}) {
  return (
    <div>
      <div className="sm:hidden">
        <label htmlFor="tabs" className="sr-only">
          Select a tab
        </label>
        {/* Use an "onChange" listener to redirect the user to the selected tab URL. */}
        <select
          id="tabs"
          name="tabs"
          defaultValue={props.tabs.find((tab) => tab.current)?.name}
          className="block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
        >
          {props.tabs.map((tab) => (
            <option key={tab.name}>{tab.name}</option>
          ))}
        </select>
      </div>
      <div className="hidden sm:block px-4 mb-8">
        <nav aria-label="Tabs" className="flex space-x-4">
          {props.tabs.map((tab) => (
            <a
              key={tab.name}
              href={tab.href}
              aria-current={tab.current ? 'page' : undefined}
              className={classNames(
                tab.current
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700',
                'rounded-md px-3 py-2 text-sm font-medium'
              )}
            >
              {tab.name}
            </a>
          ))}
        </nav>
      </div>
    </div>
  )
}
