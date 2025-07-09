export function NavDonateLink(props: { onClick(): void }) {
  return (
    <li className="menu-item me-10 d-flex d-xl-none">
      <span
        className="menu-link d-flex align-items-center text-white text-none state-hover-color-secondary min-h-40px"
        onClick={props.onClick}
      >
        <span>Podpořte nás</span>
      </span>
    </li>
  )
}
