import TitleIcon from '@/assets/icons/demagog.svg'
// TODO - List results

export default function Search() {
    return (
      <div className="container">
            <div className="row g-5 g-lg-10 justify-content-center">
                <div className="col col-12 col-lg-8">
                    <form className="position-relative" action="/vyhledavani" acceptCharset="UTF-8" method="get">
                        <input type="text" name="q" id="q" value="test" className="input outline focus-primary fs-4 min-h-50px s-search-field" placeholder="Zadejte hledaný výraz…" />
                        <button type="submit" className="search-btn d-flex align-items-center justify-content-center right top w-50px">
                            <svg height="17" viewBox="0 0 17 17" width="17" xmlns="http://www.w3.org/2000/svg">
                            <path d="m1181.34341 104.52344-4.0019-4.018708c1.69829-2.5558307 1.36199-5.9523952-.8071-8.1214883-1.22747-1.2106567-2.84168-1.8832437-4.57359-1.8832437s-3.34612.672587-4.55678 1.8832437c-2.50539 2.5222013-2.50539 6.6081675 0 9.1135543 2.16909 2.169093 5.56566 2.505387 8.12149.823919l4.01871 4.018707c.18496.184962.50444.184962.6894 0l1.10977-1.109768c.20177-.201776.20177-.521255 0-.706216zm-6.28869-4.489519c-1.69828 1.698282-4.47271 1.698282-6.1878 0-1.69829-1.6982821-1.69829-4.4727036 0-6.1878005 1.69828-1.6982823 4.4727-1.6982823 6.1878 0 1.69828 1.7150969 1.69828 4.4895184 0 6.1878005z" fill="#3c325c" transform="translate(-1165 -90)"></path>
                            </svg>
                        </button>
                    </form>
                </div>
                <div className="col col-12 s-section-articles">
                    <div className="d-flex">
                        <span className="d-flex align-items-center me-2">
                            <TitleIcon />
                        </span>
                        <h2 className="display-5 fw-bold m-0 p-0">Nalezení politici</h2>
                    </div>
                </div>
                <div className="col col-12 s-section-articles">
                    <div className="d-flex">
                        <span className="d-flex align-items-center me-2">
                            <TitleIcon />
                        </span>
                        <h2 className="display-5 fw-bold m-0 p-0">Nalezené výstupy</h2>
                    </div>
                </div>
                <div className="col col-12 s-section-articles">
                    <div className="d-flex">
                        <span className="d-flex align-items-center me-2">
                            <TitleIcon />
                        </span>
                        <h2 className="display-5 fw-bold m-0 p-0">Nalezené výroky</h2>
                    </div>
                </div>
            </div>
            
      </div>
    )
}