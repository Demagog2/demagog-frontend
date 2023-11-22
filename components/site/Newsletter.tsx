import Link from "next/link"

export default function SiteNewsletter() {
    const onSend = (e:any) => {
        e.preventDefault();    
    }
    return (
        <div className="bg-secondary min-h-100 rounded-l p-5 p-lg-10">
            <h3 className="display-5 fw-bold mb-5">Zůstaňte v kontaktu</h3>
            <div className="mb-4">
                <span className="fs-4">
                    Každých pár týdnů posíláme newsletter se shrnutím naší práce a&nbsp;zajímavostmi ze zákulisí.
                </span>
            </div>
            <form className="d-block">
                <div className="d-flex flex-wrap flex-lg-nowrap">
                    <div className="w-100 me-4">
                        <input type="email" className="input" placeholder="Váš e-mail" name="MERGE0" id="MERGE0" />
                        <div className="mt-4">
                            <span className="small">
                                Stisknutím „začít odebírat‟ souhlasíte se zpracováním e‑mailu dle <br/>
                                <Link
                                    className="text-dark"
                                    href="/zasady-zpracovani-osobnich-udaju"
                                >
                                    Zásad zpracování osobních údajů
                                </Link>
                                .
                            </span>
                        </div>
                    </div>
                    <div className="min-w-150px mt-5 mt-lg-0">
                        <button type="submit" className="btn w-100 h-44px">Začít odebírat</button>
                    </div>
                </div>
            </form>
        </div>
    )
}