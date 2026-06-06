"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

/* ----------------------------------------------------------------------------
 * Pitch-Deck — eine Slide pro Ansicht, mit Pfeiltasten-Navigation.
 * Inhalte aus den Konzept-Docs (07 Wettbewerb, 08 Design, 06 Roadmap,
 * 09 parinhood). Marktzahlen sind klar als Schätzung gekennzeichnet.
 * -------------------------------------------------------------------------- */

/* ---- Inhaltsdaten ---- */

const ZIELGRUPPEN = [
  {
    emoji: "👩‍🏫",
    title: "Lehrkraft",
    text: "Lehrplan-Thema → aktuelle Szenarien, fertige Einstiegsfrage und einsetzbare Unterlage. Passt/Verwerfen — die Lehrkraft entscheidet.",
    accent: "from-[#1565c0] to-[#0d47a1]",
  },
  {
    emoji: "🎒",
    title: "Schüler:in",
    text: "„Das kennst du — das ist auch Schulstoff.“ Hook ohne Creator-Namen, dann gleich interaktiv üben mit Sofort-Feedback.",
    accent: "from-[#0f9d6c] to-[#0b7a53]",
  },
  {
    emoji: "👪",
    title: "Eltern",
    text: "Was schaut/hört mein Kind — und was steckt schulisch dahinter? Mit Gesprächsanlässen und parinhood-Safety-Hinweisen.",
    accent: "from-[#b5530b] to-[#8a3f08]",
  },
];

const PRODUKT_FEATURES = [
  {
    t: "Matchmaking Medieninhalt ↔ Lehrplan",
    d: "KI extrahiert Situationen aus YouTube, Podcasts & News und matcht sie rückwärts mit dem Lehrplan.",
  },
  {
    t: "Fertige Lernunterlagen",
    d: "Druck- und teilbare Unterlagen: Szenario, Einstiegsfrage und Unterrichtsidee — sofort einsetzbar.",
  },
  {
    t: "Interaktive Whiteboard-Aufgaben",
    d: "Schüler:innen üben direkt in der App; Antworten werden geprüft, Folgeaufgaben passend vorgeschlagen.",
  },
  {
    t: "parinhood-Safety für Eltern",
    d: "Altersempfehlung, Manipulationsradar und Quellen-Beleg aus der parinhood-API — „von Eltern für Eltern“.",
  },
];

const WETTBEWERBER = [
  { name: "eduki", note: "Marktplatz, Lehrkraft-only" },
  { name: "lehrer-online", note: "Redaktion + KI, top-down" },
  { name: "schulportal", note: "kostenlos, Lehrkraft-only" },
  { name: "4teachers", note: "Community, veraltete UX" },
  { name: "meinUnterricht", note: "Verlags-Abo + KI „Muki“" },
];

const WHITESPACE = [
  {
    t: "Bottom-up statt top-down",
    d: "Einstieg beim realen Medienkonsum der Altersgruppe, nicht bei der Redaktions-Auswahl. Niemand sonst macht das.",
  },
  {
    t: "Drei Zielgruppen statt nur Lehrkraft",
    d: "Lehrkraft, Schüler:in und Eltern auf derselben Datenbasis — der Markt ist fast rein Lehrkraft.",
  },
  {
    t: "Szenario statt Material",
    d: "„Situation aus dem Chat/Stream“ als Einstieg — nicht das fertige PDF als Kernobjekt.",
  },
];

const WERT = [
  {
    t: "Mitwirken ohne Vorab-Aufwand",
    d: "Lehrkräfte und Eltern müssen nicht selbst stundenlang schauen, hören oder lesen — die KI bereitet den Bezug auf, der Mensch entscheidet nur „passt/verwerfen“.",
  },
  {
    t: "Sicherheit über die Inhalte",
    d: "Was Kinder gerade erleben, wird sinnvoll und geprüft ins Curriculum verarbeitet — kein Kontrollverlust, sondern verlässlicher Lehrplan-Bezug.",
  },
  {
    t: "Spielerisches Lernen",
    d: "Aus dem freiwilligen Medienkonsum wird Motivation: Alltagsbezug, Neugier-Brücke und interaktives Üben statt trockenem Pflichtstoff.",
  },
];

const PREISE = [
  { name: "eduki", preis: "0,60–19,99 € je Material" },
  { name: "lehrer-online", preis: "Premium ~7,99 €/Monat" },
  { name: "meinUnterricht", preis: "Abo ~19,90 €/Monat" },
];

const GESCHAEFT_HEUTE = [
  {
    t: "Gemeinnützig & kostenlos",
    d: "Der Kern bleibt kostenlos und werbefrei — das schafft Vertrauen bei Schule, Schüler:innen und Eltern und baut Reichweite auf.",
  },
  {
    t: "Beschaffung über Förderwege",
    d: "Schulförderverein, Stiftungen und öffentliche Bildungsmittel finanzieren den Betrieb — realistisch und marktüblich für gemeinnützige Bildung.",
  },
];

const GESCHAEFT_SPAETER = [
  {
    t: "Abo-/Lizenzmodell für Schulen",
    d: "Skalierbare Schul- & Träger-Lizenzen (B2B/B2G) für Mehrwert-Funktionen — nie eine Paywall für den Kern.",
  },
  {
    t: "MCP-/API-Integration",
    d: "Inhalte und Analysen lassen sich direkt in Schul-/Verwaltungssysteme & LMS ziehen — Anschluss statt Insellösung.",
  },
  {
    t: "Analyse-Dashboards",
    d: "Engagement- und Lernfortschritts-Auswertungen in höheren Pricing-Tiers — für Schulen und Träger.",
  },
];

const ROADMAP = [
  {
    phase: "Phase 0",
    titel: "Prototyp",
    d: "Bubble-System, Lehrkraft-/Schüler-View, Szenario-Impulse ohne Creator, interaktives Üben, erste Live-Matches (Deutsch, Mathe).",
  },
  {
    phase: "Phase 1",
    titel: "Stabilisieren",
    d: "YouTube-Pipeline regelmäßig laufen lassen & cachen, Seeds pro Bubble verfeinern, Podcast-RSS und News-Ingest.",
  },
  {
    phase: "Phase 2",
    titel: "Personalisierung",
    d: "YouTube-OAuth-Login, personalisierter Feed innerhalb der Bubble, Content-Safety, Feedback speichern (Passt/Verwerfen).",
  },
  {
    phase: "Phase 3",
    titel: "Pilot-Klasse",
    d: "Echte Pilot-Klasse, mehr Fächer und Bundesland-Seeds, Messung von Engagement.",
  },
  {
    phase: "Phase 4",
    titel: "Skalierung",
    d: "TikTok/Instagram-Trends, Community, LMS-Anschluss.",
  },
];

const MARKT = [
  {
    kuerzel: "TAM",
    label: "Gesamtmarkt",
    wert: "~1,5 Mrd. €",
    d: "Bildungs-/EdTech-Markt Deutschland (digitale Bildungsangebote). DE entspricht grob ~8 % eines globalen EdTech-Markts von ~190 Mrd. $.",
    accent: "from-[#1565c0] to-[#0d47a1]",
  },
  {
    kuerzel: "SAM",
    label: "Erreichbarer Markt",
    wert: "~800.000 Lehrkräfte · ~40.000 Schulen",
    d: "Allgemeinbildende Schulen Sek I/II in Deutschland plus die zugehörigen Lehrkräfte — unsere primäre Nutzerbasis (Destatis: ~851.000 Lehrkräfte 2024/25).",
    accent: "from-[#0f9d6c] to-[#0b7a53]",
  },
  {
    kuerzel: "SOM",
    label: "Realistisch in 1–3 Jahren",
    wert: "~50–500 Pilot-Schulen",
    d: "Über Schulfördervereine, Stiftungen und öffentliche Mittel erreichbare Pilot-Schulen und Förderkreise im Anlaufzeitraum.",
    accent: "from-[#b5530b] to-[#8a3f08]",
  },
];

/* ---- kleine Layout-Helfer ---- */

function Chip({ children, light = false }: { children: React.ReactNode; light?: boolean }) {
  return (
    <span
      className={
        light
          ? "la-chip w-fit border-white/25 bg-white/15 text-white"
          : "la-chip w-fit"
      }
    >
      {children}
    </span>
  );
}

/* ---- die einzelnen Slides ---- */
/* Jede Slide ist eine Funktion, die JSX zurückgibt. Reihenfolge = SLIDES. */

function SlideTitel() {
  return (
    <div className="flex h-full flex-col justify-center text-white">
      <Chip light>Pitch &amp; Konzept · gemeinnützig</Chip>
      <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
        Aus Medienkonsum wird{" "}
        <span className="underline decoration-white/40 decoration-4 underline-offset-8">
          Schulstoff
        </span>
        .
      </h1>
      <p className="mt-8 max-w-2xl text-lg text-white/90 sm:text-2xl">
        Jugendliche verbringen Stunden mit YouTube, Podcasts und News. Im
        Unterricht wirkt derselbe Stoff oft trocken. Wir bauen die
        Neugier-Brücke — vom realen Konsum rückwärts auf den Lehrplan.
      </p>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85 sm:text-base">
        <span>✅ Ohne Creator-Namen</span>
        <span>✅ Mensch im Loop</span>
        <span>✅ DSGVO-konform, EU-Hosting</span>
      </div>
    </div>
  );
}

function SlideProblem() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Das Problem</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Neugier draußen, trockener Stoff drinnen.
      </h2>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        <div className="la-card p-7">
          <p className="text-3xl">🧑‍🎓</p>
          <h3 className="mt-3 text-xl font-bold">Schüler:innen</h3>
          <p className="mt-2 text-muted">
            Sind bei YouTube, Podcasts und News neugierig — sehen aber nicht,
            dass das, was sie konsumieren, mit Mathe, Deutsch &amp; Co. zu tun
            hat. Im Unterricht wirkt derselbe Stoff abstrakt.
          </p>
        </div>
        <div className="la-card p-7">
          <p className="text-3xl">👩‍🏫👪</p>
          <h3 className="mt-3 text-xl font-bold">Lehrkräfte &amp; Eltern</h3>
          <p className="mt-2 text-muted">
            Haben keine Zeit, alles selbst zu schauen, zu hören und zu lesen.
            Aktuelle, „angesagte“ Aufhänger zu finden und didaktisch
            aufzubereiten kostet zu viel Vorbereitung.
          </p>
        </div>
      </div>
    </div>
  );
}

function SlideMarkt() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Marktanalyse</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Ein großer Bildungsmarkt — mit klarem Einstiegspfad.
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        TAM/SAM/SOM für den deutschen Bildungs-/EdTech-Markt.{" "}
        <strong className="text-ink">Alle Zahlen sind grobe Schätzungen</strong>{" "}
        — Lehrkraft-/Schulzahlen nach Destatis (2024/25), Marktvolumen aus
        EdTech-Benchmarks abgeleitet.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {MARKT.map((m) => (
          <div key={m.kuerzel} className="la-card flex flex-col p-6">
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${m.accent} text-sm font-bold text-white`}
            >
              {m.kuerzel}
            </div>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted">
              {m.label}{" "}
              <span className="ml-1 rounded bg-brand-soft px-1.5 py-0.5 text-[10px] text-brand-dark">
                Schätzung
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

function SlideWettbewerb() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Wettbewerb</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Ein Material-Marktplatz-Markt — mit offener Flanke.
      </h2>
      <p className="mt-3 max-w-2xl text-muted">
        Die etablierten Plattformen sind Marktplätze für fertige Arbeitsblätter
        &amp; Stundenentwürfe — alle top-down und fast ausschließlich für
        Lehrkräfte.
      </p>

      <div className="mt-6 flex flex-wrap gap-2">
        {WETTBEWERBER.map((w) => (
          <span key={w.name} className="la-chip-muted la-chip">
            <strong className="font-bold text-ink">{w.name}</strong>
            <span className="text-muted">· {w.note}</span>
          </span>
        ))}
      </div>

      <h3 className="mt-8 text-xl font-bold">Unser Whitespace</h3>
      <div className="mt-4 grid gap-5 md:grid-cols-3">
        {WHITESPACE.map((w) => (
          <div key={w.t} className="la-card p-6">
            <h4 className="text-lg font-bold text-brand">{w.t}</h4>
            <p className="mt-1 text-sm text-muted">{w.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideLoesung() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Lösung &amp; Wertversprechen</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Mitwirken — ohne selbst alles schauen zu müssen.
      </h2>
      <p className="mt-3 max-w-3xl text-lg text-muted">
        Lehrkräfte <strong className="text-ink">und</strong> Eltern können an
        aktuellen Themen mitwirken, ohne selbst stundenlang zu schauen, zu hören
        oder zu lesen — mit der Sicherheit, dass die Inhalte, die Kinder gerade
        erleben, sinnvoll ins Curriculum verarbeitet werden.
      </p>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {WERT.map((w) => (
          <div key={w.t} className="la-card p-6">
            <h3 className="text-lg font-bold">{w.t}</h3>
            <p className="mt-1 text-sm text-muted">{w.d}</p>
          </div>
        ))}
      </div>
      <div className="mt-6 la-card border-l-4 border-brand bg-brand-soft p-6">
        <p className="text-sm font-semibold text-muted">Beispiel-Szenario</p>
        <p className="mt-1 text-lg font-semibold italic text-brand-dark">
          „Jemand schrieb im Chat: ‚Er sagte du bist cool.‘ Wo ist der Fehler bei
          der wörtlichen Rede?“
        </p>
        <p className="mt-2 text-sm text-brand-dark">
          Bottom-up, Szenario + Einstiegsfrage + fertige Unterlage — ohne
          Creator-Namen, Mensch im Loop. Aus „nur ein Chat“ wird spielerisches
          Lernen am Lehrplan.
        </p>
      </div>
    </div>
  );
}

function SlideProdukt() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Das Produkt</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Eine Datenbasis, drei Zielgruppen.
      </h2>
      <div className="mt-8 grid gap-5 md:grid-cols-3">
        {ZIELGRUPPEN.map((z) => (
          <div key={z.title} className="la-card p-6">
            <div
              className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${z.accent} text-2xl`}
            >
              {z.emoji}
            </div>
            <h3 className="mt-4 text-xl font-bold">{z.title}</h3>
            <p className="mt-2 text-sm text-muted">{z.text}</p>
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        {PRODUKT_FEATURES.map((f) => (
          <div key={f.t} className="la-card p-5">
            <h3 className="text-base font-bold">{f.t}</h3>
            <p className="mt-1 text-sm text-muted">{f.d}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SlideGeschaeft() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Geschäftsmodell</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Heute gemeinnützig — morgen skalierbar.
      </h2>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <div className="la-card p-6">
          <span className="la-chip">Heute</span>
          <h3 className="mt-3 text-lg font-bold">Vertrauen &amp; Reichweite</h3>
          <div className="mt-4 space-y-4">
            {GESCHAEFT_HEUTE.map((g) => (
              <div key={g.t}>
                <p className="font-semibold">{g.t}</p>
                <p className="mt-0.5 text-sm text-muted">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="la-card p-6">
          <span className="la-chip">Später</span>
          <h3 className="mt-3 text-lg font-bold">Skalierbar &amp; integriert</h3>
          <div className="mt-4 space-y-4">
            {GESCHAEFT_SPAETER.map((g) => (
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
          <h3 className="text-lg font-bold">
            Nutzen für die Kids: Motivation, Alltagsbezug, spielerisch.
          </h3>
          <span className="text-sm text-white/80">Marktpreis-Vergleich:</span>
        </div>
        <ul className="mt-4 grid gap-3 sm:grid-cols-3">
          {PREISE.map((p) => (
            <li key={p.name} className="rounded-xl bg-white/10 p-3">
              <p className="font-semibold">{p.name}</p>
              <p className="mt-1 text-sm text-white/85">{p.preis}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SlideRoadmap() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Roadmap</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Vom Prototyp zur Skalierung.
      </h2>
      <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {ROADMAP.map((r, i) => (
          <li key={r.phase} className="la-card flex flex-col p-5">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-white">
              {i}
            </span>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-muted">
              {r.phase}
            </p>
            <h3 className="text-base font-bold">{r.titel}</h3>
            <p className="mt-1 text-sm text-muted">{r.d}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}

function SlideTeam() {
  return (
    <div className="flex h-full flex-col justify-center">
      <Chip>Team &amp; Trägerschaft</Chip>
      <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-5xl">
        Ein gemeinnütziges Vater-Sohn-Projekt.
      </h2>
      <p className="mt-6 max-w-2xl text-lg text-muted">
        Lernassistent entsteht als gemeinnütziges noorder-Projekt — gebaut von
        Vater und Sohn. Der Sohn bringt ein, was Jugendliche wirklich schauen;
        der Vater die technische Pipeline. Gemeinsam: die Zielgruppen-Views und
        die Demo-Story.
      </p>
    </div>
  );
}

function SlideCTA() {
  return (
    <div className="flex h-full flex-col justify-center text-center text-white">
      <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
        Pilotklassen &amp; Förderpartner gesucht.
      </h2>
      <p className="mx-auto mt-6 max-w-2xl text-lg text-white/90">
        Wir suchen Pilot-Klassen, die mit uns die Neugier-Brücke testen — und
        Förderpartner, die einen kostenlosen, werbefreien Lernassistenten
        möglich machen.
      </p>
      <div className="mt-10 flex flex-wrap justify-center gap-3">
        <Link
          href="/lehrkraft"
          className="rounded-full bg-white px-5 py-2.5 font-semibold text-brand-dark shadow-sm transition hover:bg-white/90"
        >
          Für Lehrkräfte
        </Link>
        <Link
          href="/schueler"
          className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
        >
          Für Schüler:innen
        </Link>
        <Link
          href="/eltern"
          className="rounded-full border border-white/40 px-5 py-2.5 font-semibold text-white transition hover:bg-white/10"
        >
          Für Eltern
        </Link>
      </div>
    </div>
  );
}

/* ---- Slide-Registry: Reihenfolge + Hintergrund (dunkel = Brand-Gradient) ---- */

type Slide = { id: string; dark?: boolean; render: () => React.ReactNode };

const SLIDES: Slide[] = [
  { id: "titel", dark: true, render: SlideTitel },
  { id: "problem", render: SlideProblem },
  { id: "markt", render: SlideMarkt },
  { id: "wettbewerb", render: SlideWettbewerb },
  { id: "loesung", render: SlideLoesung },
  { id: "produkt", render: SlideProdukt },
  { id: "geschaeft", render: SlideGeschaeft },
  { id: "roadmap", render: SlideRoadmap },
  { id: "team", render: SlideTeam },
  { id: "cta", dark: true, render: SlideCTA },
];

export default function PitchPage() {
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
        <div className="w-full">{slide.render()}</div>
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
              aria-label="Vorherige Slide"
              className={
                dark
                  ? "rounded-full border border-white/40 px-4 py-1.5 text-sm font-semibold text-white transition enabled:hover:bg-white/10 disabled:opacity-35"
                  : "rounded-full border border-line bg-surface px-4 py-1.5 text-sm font-semibold text-ink transition enabled:hover:border-brand enabled:hover:text-brand disabled:opacity-40"
              }
            >
              ← Zurück
            </button>

            {/* Dots */}
            <div className="flex items-center gap-1.5">
              {SLIDES.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => go(i)}
                  aria-label={`Zu Slide ${i + 1}`}
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
                aria-label="Nächste Slide"
                className={
                  dark
                    ? "rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-brand-dark shadow-sm transition enabled:hover:bg-white/90 disabled:opacity-35"
                    : "rounded-full bg-brand px-4 py-1.5 text-sm font-semibold text-white shadow-sm transition enabled:hover:bg-brand-dark disabled:opacity-40"
                }
              >
                Weiter →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
