export default function NotFound() {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center text-center mt-12 mb-12">
      <h1 className="mb-3">Hledáme, ale nic nenacházíme. Ani vlevo dole.</h1>
      <p className="mb-4">
        Pokud jste se sem doklikali z webu Demagog.cz, je to chyba a brzy ji
        opravíme. Pokud jste zadali adresu do prohlížeče ručně, zkontrolujte ji
        prosím.
      </p>
      <a href="/" className="btn btn-primary">
        Zpět na hlavní stránku
      </a>
    </div>
  )
}
