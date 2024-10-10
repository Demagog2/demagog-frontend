import classNames from 'classnames'

// TODO: @zuzubel Use fragments instead of direct props
export function AdminTagType(props: { statementType: string }) {
  const className = classNames(
    'inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
    {
      'bg-yellow-50 text-yellow-800 ring-yellow-600/20':
        props.statementType === 'factual',
      'bg-pink-50 text-pink-700 ring-pink-700/10':
        props.statementType === 'promise',
    }
  )

  return (
    <span className={className}>
      {props.statementType === 'factual' ? 'Výroky' : 'Sliby'}
    </span>
  )
}
