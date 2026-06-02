import type { Metadata } from "next";
import "./globals.css";
import { ProgressProvider } from "@/components/ProgressProvider";
import { SiteHeader } from "@/components/SiteHeader";

export const metadata: Metadata = {
  title: "Reading Clever IDM Events Exports — CS Training",
  description:
    "A short, interactive course for Customer Support: how to read a Clever IDM events export and tell whether Clever or the incoming data caused a problem.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <ProgressProvider>
          <SiteHeader />
          <main className="mx-auto max-w-5xl px-4 pb-24 pt-8">{children}</main>
          <footer className="border-t border-slate-200 bg-white">
            <div className="mx-auto max-w-5xl px-4 py-6 text-xs text-ink-muted">
              Internal training · Example data is fully anonymized — “Jordan
              Avery” and <code className="font-mono">maplewood.example.org</code>{" "}
              are fictional.
            </div>
          </footer>
        </ProgressProvider>
      </body>
    </html>
  );
}
