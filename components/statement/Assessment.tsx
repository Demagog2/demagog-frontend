import { VeracityIcon } from '@/components/veracity/VeracityIcon'

interface HomeProps {
  assessment: any
  type: string
  name?: string
  size: any
}

export default function StatementAssessment({ type, name, size }: any) {
  const iconSize = size ? size : '30'
  const colors: Record<string, string> = {
    true: 'primary',
    untrue: 'red',
    unverifiable: 'gray',
    misleading: 'secondary',
  }
  const currentColor = colors[type]
  return (
    <div className="d-flex align-items-center mb-2">
      <span
        className={`bg-${currentColor} d-flex align-items-center justify-content-center rounded-circle me-2 p-2`}
      >
        <VeracityIcon type={type} iconSize={iconSize} />
      </span>
      {name && (
        <span
          className={'text-' + currentColor + ' fs-5 text-uppercase fw-600'}
        >
          {name}
        </span>
      )}
    </div>
  )
}
