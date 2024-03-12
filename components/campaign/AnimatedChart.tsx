export function AnimatedChart(props: { value: number }) {
  return (
    <svg
      className="animated-chart"
      data-value={props.value}
      style={{ position: 'relative' }}
      width="100"
      height="100"
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="50"
        cy="50"
        r="46"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      <circle
        cx="50"
        cy="50"
        r="30"
        fill="none"
        stroke="white"
        strokeWidth="2"
      />
      <circle
        className="circle"
        cx="50"
        cy="50"
        r="38"
        fill="none"
        stroke="white"
        strokeWidth="17"
        strokeDasharray="0, 2000"
        transform="rotate(-90,50,50)"
      />
    </svg>
  )
}
