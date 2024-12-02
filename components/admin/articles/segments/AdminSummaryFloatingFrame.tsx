import classNames from 'classnames'

export function AdminSummaryFloatingFrame(props: { isFloating?: boolean }) {
  return (
    <div
      className={classNames(
        'ul-summary rounded-3xl p-6 lg:px-8 mt-8 bg-gray-100',
        {
          'custom-lg-float': props.isFloating,
        }
      )}
    >
      <h4 className="text-lg font-bold">Nárůst koncentrace CO₂</h4>
      <ul className="list-disc mb-0 px-6">
        <li>
          Pokud bychom nepoužili vyjádření v ppm, ale v procentech, odpovídala v
          roce 2023 koncentrace CO₂ v atmosféře 0,0419 % (výše zmíněných 419
          ppm). V roce 1973 to bylo 0,033 %.
        </li>
        <li>
          Pokud bychom nepoužili vyjádření v ppm, ale v procentech, odpovídala
        </li>
        <li>
          Vhodné je zmínit, že k nárůstu nedochází jen v posledních 50 letech.
        </li>
      </ul>
    </div>
  )
}
