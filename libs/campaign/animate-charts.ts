export function runAnimatedChartEffects() {
  const animateChart = (chart: Element) => {
    const circle = chart.querySelector('.circle')
    const r = circle?.getAttribute('r') ?? 0

    const circleCircumference = 2 * Math.PI * Number(r)
    const targetDistance =
      (circleCircumference * Number(chart.getAttribute('data-value'))) / 100.0

    let currentDistance = 0
    const step = () => {
      currentDistance += 2

      // Updates SVG circle with new angle
      circle?.setAttribute('stroke-dasharray', currentDistance + ', 2000')

      // Animate till we reach the desired angle
      if (currentDistance <= targetDistance) {
        requestAnimationFrame(step)
      }
    }

    requestAnimationFrame(step)
  }

  const charts = document.querySelectorAll('.animated-chart')
  charts.forEach(animateChart)
}
