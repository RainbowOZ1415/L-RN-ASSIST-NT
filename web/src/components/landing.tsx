"use client";

import Link from "next/link";
import { useT } from "@/lib/i18n";

/* Marketing-Texte der Landing über useT(). Das Beispiel-Szenario (deutscher
 * Lehrplan-Inhalt) bleibt deutsch und kommt als Prop herein. */

type Beispiel = { szenario?: string; einstiegsfrage?: string } | null;

const AUDIENCES = [
  { href: "/lehrkraft", emoji: "👩‍🏫", titleKey: "home.aud.teacher.title", textKey: "home.aud.teacher.text", accent: "from-[#1565c0] to-[#0d47a1]" },
  { href: "/schueler", emoji: "🎒", titleKey: "home.aud.student.title", textKey: "home.aud.student.text", accent: "from-[#0f9d6c] to-[#0b7a53]" },
  { href: "/eltern", emoji: "👪", titleKey: "home.aud.parent.title", textKey: "home.aud.parent.text", accent: "from-[#b5530b] to-[#8a3f08]" },
] as const;

const STEPS = [
  { n: "1", tKey: "home.step1.t", dKey: "home.step1.d" },
  { n: "2", tKey: "home.step2.t", dKey: "home.step2.d" },
  { n: "3", tKey: "home.step3.t", dKey: "home.step3.d" },
] as const;

export function Landing({ beispiel }: { beispiel: Beispiel }) {
  const t = useT();

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="la-chip">{t("home.hero.chip")}</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              {t("home.hero.title.a")}
              <span className="text-brand">{t("home.hero.title.b")}</span>.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">{t("home.hero.subtitle")}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/lehrkraft"
                className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                {t("home.hero.ctaTeacher")}
              </Link>
              <Link
                href="/eltern"
                className="rounded-full border border-line bg-surface px-5 py-2.5 font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                {t("home.hero.ctaParent")}
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span>{t("home.hero.badge1")}</span>
              <span>{t("home.hero.badge2")}</span>
              <span>{t("home.hero.badge3")}</span>
            </div>
          </div>

          {/* Live-Beispiel-Karte (Inhalt bleibt deutsch) */}
          {beispiel && (
            <div className="la-card p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <span className="la-chip">{t("home.example.chip")}</span>
                <span>{t("home.example.context")}</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">{t("home.example.situation")}</p>
              <p className="mt-1 text-lg font-semibold italic">„{beispiel.szenario}“</p>
              {beispiel.einstiegsfrage && (
                <>
                  <p className="mt-4 text-sm font-semibold text-muted">{t("home.example.question")}</p>
                  <p className="mt-1 text-base">{beispiel.einstiegsfrage}</p>
                </>
              )}
              <div className="mt-5 rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">
                {t("home.example.note")}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Zielgruppen-Routing */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">{t("home.audiences.heading")}</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <Link key={a.href} href={a.href} className="la-card group p-6 transition hover:-translate-y-0.5">
              <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${a.accent} text-2xl`}>
                {a.emoji}
              </div>
              <h3 className="mt-4 text-xl font-bold">{t(a.titleKey)}</h3>
              <p className="mt-2 text-muted">{t(a.textKey)}</p>
              <span className="mt-4 inline-block font-semibold text-brand group-hover:underline">{t("home.audiences.open")}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold">{t("home.how.heading")}</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="la-card p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white font-bold">{s.n}</span>
              <h3 className="mt-3 text-lg font-bold">{t(s.tKey)}</h3>
              <p className="mt-1 text-muted">{t(s.dKey)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warum anders */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="la-card bg-gradient-to-br from-brand to-brand-dark p-8 text-white">
          <h2 className="text-2xl font-bold">{t("home.diff.heading")}</h2>
          <p className="mt-3 max-w-2xl text-white/90">
            {t("home.diff.text.a")}
            <strong>{t("home.diff.text.strong")}</strong>
            {t("home.diff.text.b")}
          </p>
        </div>
      </section>
    </div>
  );
}
