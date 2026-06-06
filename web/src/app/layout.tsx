import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Lernassistent — aus Medienkonsum wird Schulstoff",
  description:
    "Gemeinnützig & kostenlos: Aus dem, was Jugendliche auf YouTube, in Podcasts und News wirklich schauen, werden Einstiege und Übungen passend zum Lehrplan — für Lehrkräfte, Schüler:innen und Eltern.",
};

function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="Lernassistent — Startseite">
          <Image
            src="/logo.png"
            alt="Lernassistent"
            width={195}
            height={31}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <nav className="hidden items-center gap-1 text-sm font-semibold sm:flex">
          <Link href="/lehrkraft" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
            Lehrkraft
          </Link>
          <Link href="/schueler" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
            Schüler
          </Link>
          <Link href="/eltern" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
            Eltern
          </Link>
        </nav>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="mt-16 border-t border-line/70 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6">
        <p className="font-semibold text-ink">Lernassistent</p>
        <p className="mt-1 max-w-xl">
          Gemeinnütziges Projekt. Aus dem realen Medienkonsum Jugendlicher wird die Neugier-Brücke
          zum Lehrplan — kostenlos, werbefrei, datenschutzfreundlich.
        </p>
        <p className="mt-4">
          <Link href="/pitch" className="font-semibold text-brand hover:text-brand-dark hover:underline">
            Pitch &amp; Konzept
          </Link>
        </p>
        <p className="mt-3 text-xs">© {new Date().getFullYear()} Lernassistent · DSGVO-konform · Hosting in der EU</p>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
