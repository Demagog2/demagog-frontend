import classNames from 'classnames'

export function ArticleSummaryGreyFrameRedesign(props: {
  isFloating?: boolean
}) {
  return (
    <div
      className={classNames('custom-ul border-0 mt-sm-56px bg-lightgrey', {
        'custom-lg-float': props.isFloating,
      })}
    >
      <h5>Nárůst koncentrace CO₂</h5>
      <ul className="mb-0 mt-3">
        <li className="li-item">
          Pokud bychom nepoužili vyjádření v ppm, ale v procentech, odpovídala v
          roce 2023 koncentrace CO₂ v atmosféře 0,0419 % (výše zmíněných 419
          ppm). V roce 1973 to bylo 0,033 %.
        </li>
        <li className="li-item">
          Pokud bychom nepoužili vyjádření v ppm, ale v procentech, odpovídala
        </li>
        <li className="li-item">
          Vhodné je zmínit, že k nárůstu nedochází jen v posledních 50 letech.
        </li>
      </ul>
    </div>
  )
}
