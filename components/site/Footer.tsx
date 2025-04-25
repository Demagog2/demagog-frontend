import Newsletter from './Newsletter'
import Social from './Social'
import ElvaiIcon from '../../assets/icons/elvai.svg'

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
            <div className="col-12 col-lg-8">
              <div className="row g-5">
                {/** DEMAGOG-CZ */}
                <div className="col-12 col-md-6">
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
                {/** KONTAKTY */}
                <div className="col-12 col-md-6">
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
                {/** BADGES */}
                <div
                  className="col-12 col-md-6 
                 d-lg-none"
                >
                  <div className="d-flex">
                    <div className="me-5 mb-5">
                      <a
                        href="https://ifcncodeofprinciples.poynter.org/profile/demagogcz"
                        target="_blank"
                      >
                        <img
                          width={100}
                          height={123}
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
                    <div className="me-5 mb-5">
                      <a
                        href="https://fb.me/Third-Party-Fact-Checking"
                        target="_blank"
                      >
                        <img
                          width={100}
                          height={125}
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
                    <div className="me-5 mb-5">
                      <a
                        href="https://cedmohub.eu/cs/"
                        title="CEDMO"
                        target="_blank"
                      >
                        <img
                          width={250}
                          height={80}
                          src="/images/cedmo.jpg"
                          alt="CEDMO"
                        />
                      </a>
                    </div>
                  </div>
                  <div className="d-flex">
                    <div className="me-5 mb-5">
                      <a
                        title="EFCSN"
                        href="https://efcsn.com/"
                        target="_blank"
                      >
                        <img
                          width={100}
                          height={100}
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
                {/** COOPERATION */}
                <div className="col-12 col-md-6 col-lg-12">
                  <div className="row g-5">
                    <div className="col-12 col-lg-6">
                      <h6 className="mb-4">Projekt Demagog.cz podporují:</h6>
                      <div className="d-flex flex-wrap align-items-center">
                        <a
                          className="me-4 mb-4"
                          href="https://www.nfnz.cz/"
                          title="Nadační fond nezávislé žurnalistiky"
                          target="_blank"
                        >
                          <img
                            width={120}
                            height={50}
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
                            width={120}
                            height={50}
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
                            width={186}
                            height={50}
                            src="/images/eu.svg"
                            alt="Next Generation EU"
                          />
                        </a>
                      </div>
                    </div>
                    <div className="col-12 col-lg-6">
                      <h6 className="mb-4">
                        Projekt Demagog.cz spolupracuje s:
                      </h6>
                      <div className="d-flex flex-wrap align-items-center">
                        <a
                          className="me-4 mb-4"
                          href="http://littlegreta.co.uk/"
                          title="Little Greta"
                          target="_blank"
                        >
                          <img
                            width={96}
                            height={50}
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
                            width={150}
                            height={50}
                            src="/images/newton_media_light.svg"
                            alt="Newton Media"
                          />
                        </a>
                        <a
                          title="elv.ai"
                          href="https://elv.ai/"
                          target="_blank"
                        >
                          <ElvaiIcon width={186} height={50} />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/** BADGES - Desktop only */}
            <div className="col-12 col-lg-4 d-none d-lg-block">
              <div className="d-flex">
                <div className="me-5 mb-5">
                  <a
                    href="https://ifcncodeofprinciples.poynter.org/profile/demagogcz"
                    target="_blank"
                  >
                    <img
                      width={100}
                      height={123}
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
                <div className="me-5 mb-5">
                  <a
                    href="https://fb.me/Third-Party-Fact-Checking"
                    target="_blank"
                  >
                    <img
                      width={100}
                      height={125}
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
                <div className="me-5 mb-5">
                  <a
                    href="https://cedmohub.eu/cs/"
                    title="CEDMO"
                    target="_blank"
                  >
                    <img
                      width={250}
                      height={80}
                      src="/images/cedmo.jpg"
                      alt="CEDMO"
                    />
                  </a>
                </div>
              </div>
              <div className="d-flex">
                <div className="me-5 mb-5">
                  <a title="EFCSN" href="https://efcsn.com/" target="_blank">
                    <img
                      width={100}
                      height={100}
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
