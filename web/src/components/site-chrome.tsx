"use client";

import Link from "next/link";
import Image from "next/image";
import { useLang, useT, type Lang } from "@/lib/i18n";

/* Header + Footer als Client-Komponenten, damit sie den Sprach-Umschalter
 * und die Übersetzungen nutzen können. Inhalte (Daten) bleiben deutsch. */

function LangSwitch() {
  const { lang, setLang } = useLang();
  const t = useT();
  const opts: Lang[] = ["de", "en"];
  return (
    <div
      className="flex items-center gap-1 rounded-full border border-line bg-surface p-0.5"
      role="group"
      aria-label={t("nav.langLabel")}
    >
      {opts.map((l) => {
        const active = l === lang;
        return (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            aria-pressed={active}
            className={`rounded-full px-2.5 py-1 text-xs font-bold uppercase transition ${
              active
                ? "bg-brand text-white shadow-sm"
                : "text-muted hover:text-brand"
            }`}
          >
            {l}
          </button>
        );
      })}
    </div>
  );
}

export function SiteHeader() {
  const t = useT();
  return (
    <header className="sticky top-0 z-50 border-b border-line/70 bg-surface/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center" aria-label="Lernassistent — Start">
          <Image
            src="/logo.png"
            alt="Lernassistent"
            width={195}
            height={31}
            priority
            className="h-7 w-auto"
          />
        </Link>
        <div className="flex items-center gap-2">
          <nav className="hidden items-center gap-1 text-sm font-semibold sm:flex">
            <Link href="/lehrkraft" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
              {t("nav.lehrkraft")}
            </Link>
            <Link href="/schueler" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
              {t("nav.schueler")}
            </Link>
            <Link href="/eltern" className="rounded-full px-3 py-1.5 text-muted hover:bg-brand-soft hover:text-brand-dark">
              {t("nav.eltern")}
            </Link>
          </nav>
          <LangSwitch />
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  const t = useT();
  return (
    <footer className="mt-16 border-t border-line/70 bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted sm:px-6">
        <p className="font-semibold text-ink">{t("footer.brand")}</p>
        <p className="mt-1 max-w-xl">{t("footer.tagline")}</p>
        <p className="mt-4">
          <Link href="/pitch" className="font-semibold text-brand hover:text-brand-dark hover:underline">
            {t("footer.pitch")}
          </Link>
        </p>
        <p className="mt-3 text-xs">
          {t("footer.legal", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
}
