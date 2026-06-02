import type { Metadata } from "next";
import Link from "next/link";
import { Callout } from "@/components/Callout";
import { DownloadCsv } from "@/components/DownloadCsv";

export const metadata: Metadata = {
  title: "Follow along in Excel — IDM Events Training",
};

const STEPS: Array<{ title: string; body: React.ReactNode; tie?: string }> = [
  {
    title: "Open it in Excel",
    body: (
      <>
        Download the file above, then double-click it. If it opens in{" "}
        <strong>Numbers</strong> instead, right-click the file ▸{" "}
        <strong>Open With ▸ Microsoft Excel</strong>. You’ll see{" "}
        <strong>seven columns</strong> and <strong>twelve rows</strong> (newest
        first). The <code className="font-mono">Data</code> column looks enormous —
        that’s normal. The entire JSON for each event lives in that one cell.
      </>
    ),
  },
  {
    title: "Turn on filters",
    body: (
      <>
        Click any cell that has data, then on the ribbon go to the{" "}
        <strong>Data</strong> tab ▸ <strong>Filter</strong> (the funnel icon). A
        small dropdown arrow appears on every column header. Those arrows are how
        you slice the export.
      </>
    ),
  },
  {
    title: "Sort oldest-first",
    body: (
      <>
        Click the arrow on the <strong>Timestamp</strong> header ▸{" "}
        <strong>Ascending</strong>. Because the timestamps are ISO-8601 (they start
        with the year), sorting the text ascending also puts them in true
        chronological order — oldest at the top.
      </>
    ),
    tie: "Method step 1 — sort oldest-first.",
  },
  {
    title: "Split by destination",
    body: (
      <>
        Click the arrow on <strong>Destination</strong> ▸ uncheck{" "}
        <em>(Select All)</em> ▸ check only <code className="font-mono">google</code>{" "}
        ▸ <strong>OK</strong>. You’re now reading just the Google timeline. Swap to{" "}
        <code className="font-mono">activeDirectory</code> to read AD on its own.
      </>
    ),
    tie: "Method step 2 — Google and AD are separate timelines.",
  },
  {
    title: "Find the anchors",
    body: (
      <>
        Click the arrow on <strong>EventType</strong> ▸ check only{" "}
        <code className="font-mono">idm-user-matched</code>. Those are the rows
        where Clever first linked an account — your starting points.
      </>
    ),
    tie: "Method step 3 — find the matched events.",
  },
  {
    title: "Read a Data cell",
    body: (
      <>
        Click a <code className="font-mono">Data</code> cell. The JSON shows in the{" "}
        <strong>formula bar</strong> at the top of the window — click the little{" "}
        <strong>⌄</strong> at its right edge to expand it. Or select the column,
        then <strong>Home ▸ Wrap Text</strong> and widen the row. To jump to the
        rows that mention a value, press <strong>⌘F</strong> and search for
        something like <code className="font-mono">*Restricted</code> or{" "}
        <code className="font-mono">SouthWest</code>.
      </>
    ),
    tie: "Method steps 4–5 — read org_unit, previous_org_unit, and config_string.",
  },
];

export default function ExcelPage() {
  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 text-xs font-medium text-ink-muted">
          <Link href="/" className="hover:text-brand-700">
            Course
          </Link>
          <span>/</span>
          <span>Follow along in Excel</span>
        </div>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink">
          Follow along in Excel
        </h1>
        <p className="mt-2 max-w-2xl text-[15px] leading-7 text-ink-soft">
          The fastest way to make any of this stick is to do it yourself. Download
          Jordan’s anonymized export, open it in Excel for Mac, and replicate each
          move as you work through the course. The five-step method <em>is</em> just
          a few filter and sort clicks.
        </p>
      </div>

      <div className="card flex flex-wrap items-center gap-4 p-5">
        <DownloadCsv />
        <p className="text-sm text-ink-muted">
          12 rows · 7 columns · fully anonymized (Jordan Avery /{" "}
          <code className="font-mono">maplewood.example.org</code>).
        </p>
      </div>

      <ol className="space-y-3">
        {STEPS.map((s, i) => (
          <li key={s.title} className="card p-5">
            <div className="flex items-start gap-3">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-brand-600 text-sm font-bold text-white">
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-ink">{s.title}</p>
                <p className="mt-1 text-[15px] leading-7 text-ink-soft">{s.body}</p>
                {s.tie && (
                  <p className="mt-2 inline-block rounded-md bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700">
                    {s.tie}
                  </p>
                )}
              </div>
            </div>
          </li>
        ))}
      </ol>

      <Callout tone="tip" title="Reading the Data cell">
        Every <code className="font-mono">Data</code> cell is{" "}
        <code className="font-mono">{`{"content": { … }}`}</code> — one big{" "}
        <code className="font-mono">content</code> object holding all the fields.
        That’s exactly what the course’s Data panels show you, one level in. If the
        columns don’t split on open, use <strong>Data ▸ Text to Columns ▸
        Delimited ▸ Comma</strong>.
      </Callout>

      <Callout tone="info" title="It’s the same method, just in a spreadsheet">
        Sort ascending = step 1. Filter Destination = step 2. Filter EventType to{" "}
        <code className="font-mono">matched</code> = step 3. Then read{" "}
        <code className="font-mono">org_unit</code> vs{" "}
        <code className="font-mono">previous_org_unit</code> and the{" "}
        <code className="font-mono">config_string</code> for steps 4–5. Excel and
        the in-app timeline are two views of the same export.
      </Callout>

      <div className="flex flex-wrap gap-4 text-sm">
        <Link
          href="/modules/tracing-a-problem"
          className="focus-ring rounded-lg font-medium text-brand-700 hover:underline"
        >
          Go to the tracing module →
        </Link>
        <Link
          href="/cheat-sheet"
          className="focus-ring rounded-lg font-medium text-brand-700 hover:underline"
        >
          Cheat sheet →
        </Link>
      </div>
    </div>
  );
}
