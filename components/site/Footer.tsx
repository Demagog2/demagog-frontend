import Newsletter from './Newsletter'
import Social from './Social'
import Link from "next/link"

// TODO - Google tag manager

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
                <div className='bg-dark text-white p-5 p-lg-10 rounded-l my-10'>
                    <div className='row g-5'>
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
                                    Demagog.cz má <a className="text-white" href="https://www.rb.cz/povinne-zverejnovane-informace/transparentni-ucty?mvcPath=transactions&amp;accountNumber=9711283001&amp;path=transactions">transparentní bankovní účet 9711283001/5500</a> vedený u Raiffeisenbank, a.s.
                                </span>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <h4 className="fs-5 mb-4">Kontakty</h4>
                            <h6 className="small mb-1">Kontaktní osoba</h6>
                            <div className="mb-1">
                                <span className="small">Petr Gongala | koordinátor projektu</span>
                            </div>
                            <div className="mb-1">
                                <Link className="small text-white" href="mailto:petr.gongala@demagog.cz">
                                    petr.gongala@demagog.cz
                                </Link>
                            </div>
                            <div className="mb-4">
                                <span className="small">+420 775 275 177</span>
                            </div>
                            <h6 className="small mb-1">Výtky k hodnocením, workshopy, různé</h6>
                            <div className="mb-4">
                                <Link className="text-white" href="mailto:info@demagog.cz">
                                    info@demagog.cz
                                </Link>
                            </div>
                            <h6 className="small mb-1">Pro média</h6>
                            <div className="mb-4">
                                <Link
                                    className="text-white"
                                    href="https://onedrive.live.com/?authkey=%21APcY4m0I%5F%2DYrtMo&amp;id=A3F546CED092EB9D%2191240&amp;cid=A3F546CED092EB9D"
                                >
                                    Loga ke stažení
                                </Link>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-4">
                            <div className="d-flex">
                                <div className="mw-100px w-100 me-5 mb-5">
                                    <Link
                                        href="https://ifcncodeofprinciples.poynter.org/profile/demagogcz"
                                        target="_blank"
                                    >
                                        <img
                                            className="mw-100 w-100"
                                            src="https://cdn.ifcncodeofprinciples.poynter.org/storage/badges/36C9D629-AED1-C760-8B88-9FD45DD9156F.png"
                                            alt="Demagog.cz is IFCN signatory"
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <h6 className="small">
                                        Demagog.cz ctí kodex zásad Mezinárodní fact-checkingové organizace (IFCN)
                                    </h6>
                                </div>
                            </div>
                            <div className="d-flex">
                                <div className="mw-100px w-100 me-5 mb-5">
                                    <Link
                                        href="https://fb.me/Third-Party-Fact-Checking"
                                        target="_blank"
                                    >
                                        <img
                                            className="mw-100 w-100"
                                            src="/images/Digital_Badge_Fact-Checkers_FOR_DARK_BACKGROUND.png"
                                            alt="Demagog.cz is IFCN signatory"
                                        />
                                    </Link>
                                </div>
                                <div>
                                    <h6 className="small">
                                        Demagog.cz ověřuje pravdivost vybraného obsahu pro společnost Meta
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div className="col col-12 col-md-6 col-lg-12">
                            <div className="row g-5">
                                <div className="col col-12 col-lg-4">
                                    <h4 className="small mb-2">
                                        Projekt Demagog.cz podporují:
                                    </h4>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <Link
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
                                        </Link>
                                        <Link
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
                                        </Link>
                                        <Link
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
                                        </Link>
                                    </div>
                                </div>
                                <div className="col col-12 col-lg-4">
                                    <h4 className="small mb-2">
                                        Projekt Demagog.cz spolupracuje s:
                                    </h4>
                                    <div className="d-flex flex-wrap align-items-center">
                                        <Link
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
                                        </Link>
                                        <Link
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
                                        </Link>
                                    </div>
                                </div>
                                <div className="col col-12 col-lg-4">
                                    <div className="mt-4">
                                        <Link
                                            className="me-4 mb-4"
                                            href="https://cedmohub.eu/cs/"
                                            title="CEDMO"
                                            target="_blank"
                                        >
                                            <img
                                                className="h-80px"
                                                src="/images/cedmo.jpg"
                                                alt="CEDMO"
                                            />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                </div>
                <div className='d-flex justify-content-between'>
                    <div>
                        <Link className="text-dark small" href="/zasady-zpracovani-osobnich-udaju">
                            Zásady zpracování osobních údajů
                        </Link>
                    </div>
                    <div>
                    <span className="small me-2">Souhlas použitím cookies pro měření návštěvnosti udělen.</span>
                        <a href="#" className="text-dark small">Změnit na nesouhlas</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}