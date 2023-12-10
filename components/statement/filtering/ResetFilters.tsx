export function ResetFilters(props: { onClick(): void }) {
  return (
    <div className="w-100 mt-5">
      <a className="btn w-100" onClick={props.onClick}>
        <span className="text-white">Zrušit filtry</span>
      </a>
    </div>
  )
}
