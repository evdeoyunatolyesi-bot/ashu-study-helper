export function prettyDate(date = new Date()) {
  return new Intl.DateTimeFormat(undefined, { weekday: "long", month: "long", day: "numeric", year: "numeric" }).format(date);
}
export function minutesToLabel(minutes: number) {
  const h = Math.floor(minutes / 60), m = minutes % 60;
  return `${h ? `${h}h ` : ""}${m}m`;
}
