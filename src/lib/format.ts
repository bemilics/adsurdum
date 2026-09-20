const USD = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
})

export function formatUsd(cents: number): string {
  return USD.format(cents / 100)
}
