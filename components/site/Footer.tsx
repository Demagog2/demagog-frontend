import Newsletter from './Newsletter'
import Social from './Social'

export default function Footer() {
  return (
    <footer className="footer py-10">
      <div className="container">
        <div className="row g-5 g-lg-10">
          <div className="col col-12 col-lg-7">
            <Newsletter />
          </div>
          <div className="col col-12 col-lg-5">
            <Social />
          </div>
        </div>
        <div className="bg-dark text-white p-5 p-lg-10 rounded-l my-10">
          <div className="row g-5">
            <div className="col col-12 col-md-6 col-lg-4">
              <h4 className="fs-5 mb-4">Demagog.cz, z.s.</h4>
              <div className="mb-1">
                <span className="small">IČO: 05140544</span>
              </div>
              <div className="mb-1">
                <span className="small">se sídlem Roháčova 145/14</span>
              </div>
              <div className="mb-4">
                <span className="small">Žižkov, 130 00 Praha 3</span>
              </div>
              <div className="mb-2">
                <span className="small">
                  Zapsaný ve spolkovém rejstříku u Městského soudu v Praze.
                </span>
              </div>
              <div className="mb-2">
                <span className="small">
                  Demagog.cz má{' '}
                  <a
                    className="text-white"
                    href="https://www.rb.cz/povinne-zverejnovane-informace/transparentni-ucty?mvcPath=transactions&amp;accountNumber=9711283001&amp;path=transactions"
                  >
                    transparentní bankovní účet 9711283001/5500
                  </a>{' '}
                  vedený u Raiffeisenbank, a.s.
                </span>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-lg-4">
              <h4 className="fs-5 mb-4">Kontakty</h4>
              <h6 className="small mb-1">Kontaktní osoba</h6>
              <div className="mb-1">
                <span className="small">
                  Petr Gongala | koordinátor projektu
                </span>
              </div>
              <div className="mb-1">
                <a
                  className="small text-white"
                  href="mailto:petr.gongala@demagog.cz"
                >
                  petr.gongala@demagog.cz
                </a>
              </div>
              <div className="mb-4">
                <span className="small">+420 775 275 177</span>
              </div>
              <h6 className="small mb-1">
                Výtky k hodnocením, workshopy, různé
              </h6>
              <div className="mb-4">
                <a className="text-white" href="mailto:info@demagog.cz">
                  info@demagog.cz
                </a>
              </div>
              <h6 className="small mb-1">Pro média</h6>
              <div className="mb-4">
                <a
                  className="text-white"
                  href="https://drive.google.com/drive/folders/1J6nkGqAan4B5tet7dG5I9rRxHGyUwHGq"
                >
                  Loga ke stažení
                </a>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-lg-4">
              <div className="d-flex">
                <div className="mw-100px w-100 me-5 mb-5">
                  <a
                    href="https://ifcncodeofprinciples.poynter.org/profile/demagogcz"
                    target="_blank"
                  >
                    <img
                      className="mw-100 w-100"
                      src="https://cdn.ifcncodeofprinciples.poynter.org/storage/badges/36C9D629-AED1-C760-8B88-9FD45DD9156F.png"
                      alt="Demagog.cz is IFCN signatory"
                    />
                  </a>
                </div>
                <div>
                  <h6 className="small">
                    Demagog.cz ctí kodex zásad Mezinárodní fact-checkingové
                    organizace (IFCN)
                  </h6>
                </div>
              </div>
              <div className="d-flex">
                <div className="mw-100px w-100 me-5 mb-5">
                  <a
                    href="https://fb.me/Third-Party-Fact-Checking"
                    target="_blank"
                  >
                    <img
                      className="mw-100 w-100"
                      src="/images/Digital_Badge_Fact-Checkers_FOR_DARK_BACKGROUND.png"
                      alt="Demagog.cz is IFCN signatory"
                    />
                  </a>
                </div>
                <div>
                  <h6 className="small">
                    Demagog.cz ověřuje pravdivost vybraného obsahu pro
                    společnost Meta
                  </h6>
                </div>
              </div>
              <div className="d-flex">
                <div className="mw-100px w-100 me-5 mb-5">
                  <a
                    href="https://cedmohub.eu/cs/"
                    title="CEDMO"
                    target="_blank"
                  >
                    <img
                      className="h-80px"
                      src="/images/cedmo.jpg"
                      alt="CEDMO"
                    />
                  </a>
                </div>
              </div>
              <div className="d-flex">
                <div className="mw-100px w-100 me-5 mb-5">
                  <a title="EFCSN" href="https://efcsn.com/" target="_blank">
                    <img
                      className="mw-100 w-100"
                      src="/images/badge-verified-member.png"
                      alt="EFCSN"
                    />
                  </a>
                </div>
                <div>
                  <h6 className="small">
                    Demagog.cz je členem evropské sítě fact-checkingových
                    organizací EFCSN.
                  </h6>
                </div>
              </div>
            </div>
            <div className="col col-12 col-md-6 col-lg-12">
              <div className="row g-5">
                <div className="col col-12 col-lg-4">
                  <h6 className="mb-4">Projekt Demagog.cz podporují:</h6>
                  <div className="d-flex flex-wrap align-items-center">
                    <a
                      className="me-4 mb-4"
                      href="https://www.nfnz.cz/"
                      title="Nadační fond nezávislé žurnalistiky"
                      target="_blank"
                    >
                      <img
                        className="h-50px"
                        src="/images/nfnz_light.svg"
                        alt="Nadační fond nezávislé žurnalistiky"
                      />
                    </a>
                    <a
                      className="me-4 mb-4"
                      href="https://www.nfnz.cz/"
                      title="Národní plán obnovy"
                      target="_blank"
                    >
                      <img
                        className="h-50px"
                        src="/images/npo.svg"
                        alt="Národní plán obnovy"
                      />
                    </a>
                    <a
                      className="me-4 mb-4"
                      href="https://next-generation-eu.europa.eu/index_cs"
                      title="Next Generation EU"
                      target="_blank"
                    >
                      <img
                        className="h-50px"
                        src="/images/eu.svg"
                        alt="Next Generation EU"
                      />
                    </a>
                  </div>
                </div>
                <div className="col col-12 col-lg-4">
                  <h6 className="mb-4">Projekt Demagog.cz spolupracuje s:</h6>
                  <div className="d-flex flex-wrap align-items-center">
                    <a
                      className="me-4 mb-4"
                      href="http://littlegreta.co.uk/"
                      title="Little Greta"
                      target="_blank"
                    >
                      <img
                        className="h-50px"
                        src="/images/little_greta_white.svg"
                        alt="Little Greta"
                      />
                    </a>
                    <a
                      className="me-4 mb-4"
                      href="https://www.newtonmedia.cz/cs"
                      title="Newton Media"
                      target="_blank"
                    >
                      <img
                        className="h-50px"
                        src="/images/newton_media_light.svg"
                        alt="Newton Media"
                      />
                    </a>
                    <a title="elv.ai" href="https://elv.ai/">
                      <img
                        alt="Elv.ai"
                        loading="lazy"
                        className="h-50px"
                        src="/images/elvai.svg"
                      />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="d-flex justify-content-between">
          <div>
            <a
              className="text-dark small"
              href="/zasady-zpracovani-osobnich-udaju"
            >
              Zásady zpracování osobních údajů
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
