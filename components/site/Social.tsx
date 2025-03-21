import FacebookIcon from '@/assets/icons/facebook.svg'
import InstagramIcon from '@/assets/icons/instagram.svg'
import XIcon from '@/assets/icons/x.svg'

export default function SiteSocial() {
  return (
    <div className="bg-primary min-h-100 rounded-l p-5 p-lg-10">
      <h3 className="display-2 fw-bold mb-5 text-white">Sociální sítě</h3>
      <div className="mb-4">
        <span className="fs-4">
          Nenechte si ujít nejnovější události z&nbsp;Demagog.cz. Sdílením
          našich příspěvků přátelům podpoříte naši práci.
        </span>
      </div>
      <div className="d-flex flex-wrap">
        <a
          className="btn white me-2 mb-2 ps-2"
          href="https://www.facebook.com/Demagog.CZ"
        >
          <span className="w-30px h-30px me-2">
            <FacebookIcon />
          </span>
          <span className="fw-bolder">Facebook</span>
        </a>
        <a
          className="btn white me-2 mb-2 ps-2"
          href="https://www.instagram.com/demagog.cz/"
        >
          <span className="w-30px h-30px me-2">
            <InstagramIcon />
          </span>
          <span className="fw-bolder">Instagram</span>
        </a>
        <a className="btn white me-2 mb-2" href="https://twitter.com/DemagogCZ">
          <span className="w-30px h-30px me-2 d-inline-flex align-items-center justify-content-center text-dark">
            <XIcon />
          </span>
          <span className="fw-bolder">X</span>
        </a>
      </div>
    </div>
  )
}
