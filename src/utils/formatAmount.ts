export function formatAmount(
  value: number,
): string {
  if (!Number.isFinite(value)) return "";

  return new Intl.NumberFormat("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
