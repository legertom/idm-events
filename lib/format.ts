const UTC_FMT = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
  timeZone: "UTC",
});

const DATE_ONLY = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export function formatUtc(iso: string): string {
  return `${UTC_FMT.format(new Date(iso))} UTC`;
}

export function formatDateOnly(iso: string): string {
  return DATE_ONLY.format(new Date(iso));
}

/** Same instant in US Central (the example district's local time), for contrast. */
export function formatLocalHint(iso: string): string {
  const fmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "America/Chicago",
  });
  return `${fmt.format(new Date(iso))} Central`;
}
