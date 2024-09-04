export function formatNumber(number: number) {
  return new Intl.NumberFormat('cz-CS', { style: 'decimal' }).format(number)
}
