import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { SiteHeader, SiteFooter } from "@/components/site-chrome";

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={`${dmSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <LanguageProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </LanguageProvider>
      </body>
    </html>
  );
}
