import classNames from 'classnames'

export function FormCheckbox(props: {
  inputName: string
  value: string
  name: string
  label?: JSX.Element
  isSelected: boolean
  isDisabled?: boolean
}) {
  return (
    <div
      className={classNames('check-btn', 'py-2', {
        disabled: props.isDisabled,
      })}
    >
      <input
        name={props.inputName}
        type="checkbox"
        value={props.value}
        defaultChecked={props.isSelected}
      />
      <span className="checkmark" />
      <span className="small fw-600 me-2">{props.name}</span>
      {props.label && (
        <span className="smallest min-w-40px">{props.label}</span>
      )}
    </div>
  )
}
