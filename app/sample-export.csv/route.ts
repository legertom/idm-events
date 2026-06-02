import { EVENTS_NEWEST_FIRST } from "@/lib/events";

/** Quote a CSV field if it contains a comma, quote, or newline; double inner quotes. */
function csvField(value: string): string {
  return /[",\r\n]/.test(value) ? `"${value.replace(/"/g, '""')}"` : value;
}

const HEADER = [
  "Timestamp",
  "EventType",
  "Clever User ID",
  "Username",
  "UserType",
  "Data",
  "Destination",
];

/**
 * Serves the anonymized worked example as a real-format CSV export so learners
 * can open it in Excel and follow along. Built from the same data the app uses,
 * so the two never drift. The Data column wraps everything in a `content` object,
 * exactly like a production export.
 */
export function GET() {
  const rows = EVENTS_NEWEST_FIRST.map((e) =>
    [
      e.timestamp,
      e.eventType,
      String(e.content.clever_id ?? ""),
      e.username,
      e.userType,
      JSON.stringify({ content: e.content }),
      e.destination,
    ]
      .map(csvField)
      .join(","),
  );

  const csv = [HEADER.join(","), ...rows].join("\r\n") + "\r\n";

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'attachment; filename="events_export_sample.csv"',
      "Cache-Control": "no-store",
    },
  });
}
