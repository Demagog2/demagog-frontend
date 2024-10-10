'use client'

export function NavDonateButton(props: { onClick(): void }) {
  return (
    <button className="btn bg-primary" onClick={props.onClick}>
      <span className="mx-2">Podpořte nás</span>
    </button>
  )
}
