"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useT } from "@/lib/i18n";

/* ----------------------------------------------------------------------------
 * Pitch-Deck — eine Slide pro Ansicht, mit Pfeiltasten-Navigation.
 * Alle Texte zweisprachig über useT(). Marktzahlen sind als Schätzung markiert.
 * -------------------------------------------------------------------------- */

type T = ReturnType<typeof useT>;

/* Hilfsfunktion: gepackte "name|note;;name|note"-Strings entpacken. */
function parsePairs(s: string): { a: string; b: string }[] {
  return s
    .split(";;")
    .filter(Boolean)
    .map((part) => {
      const [a, b = ""] = part.split("|");
      return { a, b };
    });
}

/* ---- kleine Layout-Helfer ---- */

function Chip({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span className={light ? "la-chip w-fit border-white/25 bg-white/15 text-white" : "la-chip w-fit"}>
      {children}
    </span>
  );
}

/* ---- die einzelnen Slides ---- */

function SlideTitel({ t }: { t: T }) {
  return (
    <div className="flex h-full flex-col justify-center text-white">
      <Chip light>{t("pitch.title.chip")}</Chip>
      <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        {t("pitch.title.h.a")}
        <span className="underline decoration-white/40 decoration-4 underline-offset-8">
          {t("pitch.title.h.b")}
        </span>
        .
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-white/90 sm:text-2xl">{t("pitch.title.sub")}</p>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85 sm:text-base">
        <span>{t("pitch.title.b1")}</span>
        <span>{t("pitch.title.b2")}</span>
        <span>{t("pitch.title.b3")}</span>
      </div>
    </div>
  );
}

function SlideProblem({ t }: { t: T }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.problem.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.problem.h")}</h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="la-card p-7">
          <p className="text-3xl">🧑‍🎓</p>
          <h3 className="mt-3 text-xl font-bold">{t("pitch.problem.students.t")}</h3>
          <p className="mt-2 text-muted">{t("pitch.problem.students.d")}</p>
        </div>
        <div className="la-card p-7">
          <p className="text-3xl">👩‍🏫👪</p>
          <h3 className="mt-3 text-xl font-bold">{t("pitch.problem.adults.t")}</h3>
          <p className="mt-2 text-muted">{t("pitch.problem.adults.d")}</p>
        </div>
      </div>
    </div>
  );
}

function SlideMarkt({ t }: { t: T }) {
  const MARKT = [
    { kuerzel: "TAM", label: t("pitch.market.tam.label"), wert: t("pitch.market.tam.wert"), d: t("pitch.market.tam.d"), accent: "from-[#1565c0] to-[#0d47a1]" },
    { kuerzel: "SAM", label: t("pitch.market.sam.label"), wert: t("pitch.market.sam.wert"), d: t("pitch.market.sam.d"), accent: "from-[#0f9d6c] to-[#0b7a53]" },
    { kuerzel: "SOM", label: t("pitch.market.som.label"), wert: t("pitch.market.som.wert"), d: t("pitch.market.som.d"), accent: "from-[#b5530b] to-[#8a3f08]" },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.market.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.market.h")}</h2>
      <p className="mt-3 max-w-2xl text-muted">
        {t("pitch.market.sub.a")}
        <strong className="text-ink">{t("pitch.market.sub.strong")}</strong>
        {t("pitch.market.sub.b")}
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {MARKT.map((m) => (
          <div key={m.kuerzel} className="la-card flex flex-col p-6">
            <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-sm font-bold text-white`}>
              {m.kuerzel}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              {m.label}{" "}
              <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-[10px] text-brand-dark">
                {t("pitch.market.estimate")}
              </span>
            </p>
            <p className="mt-1 text-xl font-bold text-brand-dark">{m.wert}</p>
            <p className="mt-2 text-sm text-muted">{m.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideWettbewerb({ t }: { t: T }) {
  const competitors = parsePairs(t("pitch.comp.competitors"));
  const whitespace = [
    { t: t("pitch.comp.ws1.t"), d: t("pitch.comp.ws1.d") },
    { t: t("pitch.comp.ws2.t"), d: t("pitch.comp.ws2.d") },
    { t: t("pitch.comp.ws3.t"), d: t("pitch.comp.ws3.d") },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.comp.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.comp.h")}</h2>
      <p className="mt-3 max-w-2xl text-muted">{t("pitch.comp.sub")}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {competitors.map((w) => (
          <span key={w.a} className="la-chip-muted la-chip">
            <strong className="font-bold text-ink">{w.a}</strong>
            <span className="text-muted">· {w.b}</span>
          </span>
        ))}
      </div>

      <h3 className="mt-8 text-xl font-bold">{t("pitch.comp.whitespaceH")}</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        {whitespace.map((w) => (
          <div key={w.t} className="la-card p-6">
            <h4 className="text-lg font-bold text-brand">{w.t}</h4>
            <p className="mt-1 text-sm text-muted">{w.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideLoesung({ t }: { t: T }) {
  const wert = [
    { t: t("pitch.sol.v1.t"), d: t("pitch.sol.v1.d") },
    { t: t("pitch.sol.v2.t"), d: t("pitch.sol.v2.d") },
    { t: t("pitch.sol.v3.t"), d: t("pitch.sol.v3.d") },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.sol.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.sol.h")}</h2>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        {t("pitch.sol.sub.a")}
        <strong className="text-ink">{t("pitch.sol.sub.strong")}</strong>
        {t("pitch.sol.sub.b")}
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {wert.map((w) => (
          <div key={w.t} className="la-card p-6">
            <h3 className="text-lg font-bold">{w.t}</h3>
            <p className="mt-1 text-sm text-muted">{w.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 la-card border-l-4 border-brand bg-brand-soft p-6">
        <p className="text-sm font-semibold text-muted">{t("pitch.sol.exLabel")}</p>
        <p className="mt-1 text-lg font-semibold italic text-brand-dark">{t("pitch.sol.exQuote")}</p>
        <p className="mt-2 text-sm text-brand-dark">{t("pitch.sol.exNote")}</p>
      </div>
    </div>
  );
}

function SlideProdukt({ t }: { t: T }) {
  const zielgruppen = [
    { emoji: "👩‍🏫", title: t("pitch.prod.aud1.title"), text: t("pitch.prod.aud1.text"), accent: "from-[#1565c0] to-[#0d47a1]" },
    { emoji: "🎒", title: t("pitch.prod.aud2.title"), text: t("pitch.prod.aud2.text"), accent: "from-[#0f9d6c] to-[#0b7a53]" },
    { emoji: "👪", title: t("pitch.prod.aud3.title"), text: t("pitch.prod.aud3.text"), accent: "from-[#b5530b] to-[#8a3f08]" },
  ];
  const features = [
    { t: t("pitch.prod.f1.t"), d: t("pitch.prod.f1.d") },
    { t: t("pitch.prod.f2.t"), d: t("pitch.prod.f2.d") },
    { t: t("pitch.prod.f3.t"), d: t("pitch.prod.f3.d") },
    { t: t("pitch.prod.f4.t"), d: t("pitch.prod.f4.d") },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.prod.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.prod.h")}</h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {zielgruppen.map((z) => (
          <div key={z.title} className="la-card p-6">
            <div className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${z.accent} text-2xl`}>
              {z.emoji}
            </div>
            <h3 className="mt-4 text-xl font-bold">{z.title}</h3>
            <p className="mt-2 text-sm text-muted">{z.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {features.map((f) => (
          <div key={f.t} className="la-card p-5">
            <h3 className="text-base font-bold">{f.t}</h3>
            <p className="mt-1 text-sm text-muted">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideGeschaeft({ t }: { t: T }) {
  const heute = [
    { t: t("pitch.biz.today1.t"), d: t("pitch.biz.today1.d") },
    { t: t("pitch.biz.today2.t"), d: t("pitch.biz.today2.d") },
  ];
  const spaeter = [
    { t: t("pitch.biz.later1.t"), d: t("pitch.biz.later1.d") },
    { t: t("pitch.biz.later2.t"), d: t("pitch.biz.later2.d") },
    { t: t("pitch.biz.later3.t"), d: t("pitch.biz.later3.d") },
  ];
  const preise = parsePairs(t("pitch.biz.prices"));
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.biz.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.biz.h")}</h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="la-card p-6">
          <span className="la-chip">{t("pitch.biz.todayChip")}</span>
          <h3 className="mt-3 text-lg font-bold">{t("pitch.biz.todayH")}</h3>
          <div className="mt-4 space-y-4">
            {heute.map((g) => (
              <div key={g.t}>
                <p className="font-semibold">{g.t}</p>
                <p className="mt-0.5 text-sm text-muted">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="la-card p-6">
          <span className="la-chip">{t("pitch.biz.laterChip")}</span>
          <h3 className="mt-3 text-lg font-bold">{t("pitch.biz.laterH")}</h3>
          <div className="mt-4 space-y-4">
            {spaeter.map((g) => (
              <div key={g.t}>
                <p className="font-semibold">{g.t}</p>
                <p className="mt-0.5 text-sm text-muted">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 la-card bg-gradient-to-br from-brand to-brand-dark p-6 text-white">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h3 className="text-lg font-bold">{t("pitch.biz.valueH")}</h3>
          <span className="text-sm text-white/80">{t("pitch.biz.priceLabel")}</span>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {preise.map((p) => (
            <li key={p.a} className="rounded-xl bg-white/10 p-3">
              <p className="font-semibold">{p.a}</p>
              <p className="mt-1 text-sm text-white/85">{p.b}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SlideRoadmap({ t }: { t: T }) {
  const roadmap = [
    { phase: t("pitch.road.p0.phase"), titel: t("pitch.road.p0.titel"), d: t("pitch.road.p0.d") },
    { phase: t("pitch.road.p1.phase"), titel: t("pitch.road.p1.titel"), d: t("pitch.road.p1.d") },
    { phase: t("pitch.road.p2.phase"), titel: t("pitch.road.p2.titel"), d: t("pitch.road.p2.d") },
    { phase: t("pitch.road.p3.phase"), titel: t("pitch.road.p3.titel"), d: t("pitch.road.p3.d") },
    { phase: t("pitch.road.p4.phase"), titel: t("pitch.road.p4.titel"), d: t("pitch.road.p4.d") },
  ];
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.road.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.road.h")}</h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {roadmap.map((r, i) => (
          <li key={r.phase} className="la-card flex flex-col p-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-white">{i}</span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">{r.phase}</p>
            <h3 className="text-base font-bold">{r.titel}</h3>
            <p className="mt-1 text-sm text-muted">{r.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SlideTeam({ t }: { t: T }) {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>{t("pitch.team.chip")}</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.team.h")}</h2>
      <p className="mt-6 max-w-2xl text-lg text-muted">{t("pitch.team.text")}</p>
    </div>
  );
}

function SlideCTA({ t }: { t: T }) {
  return (
    <div className="flex h-full flex-col justify-center text-center text-white">
      <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">{t("pitch.cta.h")}</h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">{t("pitch.cta.text")}</p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link href="/lehrkraft" className="rounded-full bg-white px-5 py-2.5 font-semibold text-brand-dark shadow-sm transition hover:bg-white/90">
          {t("pitch.cta.teacher")}
        </Link>
        <Link href="/schueler" className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
          {t("pitch.cta.student")}
        </Link>
        <Link href="/eltern" className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10">
          {t("pitch.cta.parent")}
        </Link>
      </div>
    </div>
  );
}

/* ---- Slide-Registry: Reihenfolge + Hintergrund (dunkel = Brand-Gradient) ---- */

type Slide = { id: string; dark?: boolean; render: (t: T) => React.ReactNode };

const SLIDES: Slide[] = [
  { id: "titel", dark: true, render: (t) => <SlideTitel t={t} /> },
  { id: "problem", render: (t) => <SlideProblem t={t} /> },
  { id: "markt", render: (t) => <SlideMarkt t={t} /> },
  { id: "wettbewerb", render: (t) => <SlideWettbewerb t={t} /> },
  { id: "loesung", render: (t) => <SlideLoesung t={t} /> },
  { id: "produkt", render: (t) => <SlideProdukt t={t} /> },
  { id: "geschaeft", render: (t) => <SlideGeschaeft t={t} /> },
  { id: "roadmap", render: (t) => <SlideRoadmap t={t} /> },
  { id: "team", render: (t) => <SlideTeam t={t} /> },
  { id: "cta", dark: true, render: (t) => <SlideCTA t={t} /> },
];

export default function PitchPage() {
  const t = useT();
  const [index, setIndex] = useState(0);
  const last = SLIDES.length - 1;

  const go = useCallback(
    (next: number) => {
      setIndex((cur) => Math.min(last, Math.max(0, typeof next === "number" ? next : cur)));
    },
    [last],
  );
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);
  const nextSlide = useCallback(() => setIndex((i) => Math.min(last, i + 1)), [last]);

  // Pfeiltasten ← → ↑ ↓ (+ Home/End). SSR-sicher: nur im useEffect aufs window.
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
        case "PageDown":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
        case "ArrowUp":
        case "PageUp":
          e.preventDefault();
          prev();
          break;
        case "Home":
          e.preventDefault();
          setIndex(0);
          break;
        case "End":
          e.preventDefault();
          setIndex(last);
          break;
        default:
          break;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nextSlide, prev, last]);

  // Touch-Swipe (Mobil).
  const [touchX, setTouchX] = useState<number | null>(null);
  function onTouchStart(e: React.TouchEvent) {
    setTouchX(e.changedTouches[0]?.clientX ?? null);
  }
  function onTouchEnd(e: React.TouchEvent) {
    if (touchX === null) return;
    const dx = (e.changedTouches[0]?.clientX ?? touchX) - touchX;
    if (Math.abs(dx) > 50) {
      if (dx < 0) nextSlide();
      else prev();
    }
    setTouchX(null);
  }

  const slide = SLIDES[index];
  const dark = slide.dark;

  return (
    <div
      className={
        dark
          ? "relative flex min-h-[calc(100vh-4rem)] flex-col bg-gradient-to-br from-brand to-brand-dark"
          : "relative flex min-h-[calc(100vh-4rem)] flex-col bg-canvas"
      }
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      {/* Slide-Inhalt */}
      <div className="mx-auto flex w-full max-w-6xl flex-1 px-4 pb-28 pt-10 sm:px-6">
        <div className="w-full">{slide.render(t)}</div>
      </div>

      {/* Steuerleiste unten */}
      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-40">
        <div
          className={
            dark
              ? "border-t border-white/15 bg-brand-dark/40 backdrop-blur"
              : "border-t border-line/70 bg-surface/85 backdrop-blur"
          }
        >
          <div className="pointer-events-auto mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <button
              type="button"
              onClick={prev}
              disabled={index === 0}
              aria-label={t("pitch.nav.prevAria")}
              className={
                dark
                  ? "rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white transition enabled:hover:bg-white/10 disabled:opacity-35"
                  : "rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-ink transition enabled:hover:border-brand enabled:hover:text-brand disabled:opacity-40"
              }
            >
              {t("pitch.nav.prev")}
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={t("pitch.nav.toSlide", { n: i + 1 })}
                  aria-current={i === index ? "true" : undefined}
                  className={[
                    "h-2.5 rounded-full transition-all",
                    i === index ? "w-6" : "w-2.5",
                    dark
                      ? i === index
                        ? "bg-white"
                        : "bg-white/40 hover:bg-white/70"
                      : i === index
                        ? "bg-brand"
                        : "bg-line hover:bg-brand/50",
                  ].join(" ")}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <span
                className={
                  dark
                    ? "hidden text-sm font-semibold tabular-nums text-white/85 sm:inline"
                    : "hidden text-sm font-semibold tabular-nums text-muted sm:inline"
                }
              >
                {index + 1} / {SLIDES.length}
              </span>
              <button
                type="button"
                onClick={nextSlide}
                disabled={index === last}
                aria-label={t("pitch.nav.nextAria")}
                className={
                  dark
                    ? "rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-dark shadow-sm transition enabled:hover:bg-white/90 disabled:opacity-35"
                    : "rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-brand-dark disabled:opacity-40"
                }
              >
                {t("pitch.nav.next")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
