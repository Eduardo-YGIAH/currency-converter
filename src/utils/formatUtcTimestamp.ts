export function formatUtcTimestamp(timestampMs: number): string {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "UTC",
  });

  return `${formatter.format(new Date(timestampMs))} UTC`;
}
