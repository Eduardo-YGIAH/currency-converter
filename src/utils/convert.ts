export function convert(amount: number, rate: number): number {
  if (Number.isNaN(amount) || Number.isNaN(rate)) return 0;
  return amount * rate;
}
