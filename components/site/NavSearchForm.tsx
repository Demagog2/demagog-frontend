import { SearchButton } from '@/components/search/SearchButton'

export default function NavSeachForm() {
  return (
    <form
      className="w-100"
      action="/vyhledavani"
      acceptCharset="UTF-8"
      method="get"
    >
      <div className="d-flex align-items-center w-100 position-relative">
        <input
          name="q"
          type="text"
          className="input outline white focus-secondary search"
          placeholder="Zadejte hledaný výraz…"
        />
        <SearchButton color="white" />
      </div>
    </form>
  )
}
