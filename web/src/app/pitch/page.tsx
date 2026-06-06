import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pitch & Konzept — Lernassistent",
  description:
    "Aus Medienkonsum wird Schulstoff: Bottom-up vom realen Medienkonsum Jugendlicher rückwärts auf den Lehrplan — für Lehrkräfte, Schüler:innen und Eltern. Gemeinnützig, kostenlos, werbefrei.",
};

/* ---- Inhaltsdaten (aus den Konzept-Docs, nichts erfunden) ---- */

const ZIELGRUPPEN = [
  {
    emoji: "👩‍🏫",
    title: "Lehrkraft",
    text: "Lehrplan-Thema → aktuelle Szenarien, fertige Einstiegsfrage und einsetzbare Unterlage. Passt/Verwerfen — die Lehrkraft entscheidet.",
    accent: "from-[#1565c0] to-[#0d47a1]",
    href: "/lehrkraft",
  },
  {
    emoji: "🎒",
    title: "Schüler:in",
    text: "„Das kennst du — das ist auch Schulstoff.“ Hook ohne Creator-Namen, dann gleich interaktiv üben mit Sofort-Feedback.",
    accent: "from-[#0f9d6c] to-[#0b7a53]",
    href: "/schueler",
  },
  {
    emoji: "👪",
    title: "Eltern",
    text: "Was schaut/hört mein Kind — und was steckt schulisch dahinter? Mit Gesprächsanlässen und parinhood-Safety-Hinweisen.",
    accent: "from-[#b5530b] to-[#8a3f08]",
    href: "/eltern",
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
  "eduki",
  "lehrer-online",
  "schulportal",
  "4teachers",
  "meinUnterricht",
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

const PREISE = [
  { name: "eduki", preis: "Marktplatz, 0,60–19,99 € je Material" },
  { name: "lehrer-online", preis: "Premium-Abo ~7,99 €/Monat" },
  { name: "meinUnterricht", preis: "Abo ~20 €/Monat" },
];

const FINANZIERUNG = [
  {
    t: "Stiftungen & Förderprogramme",
    d: "Gemeinnützige Bildungsförderung und öffentliche Bildungsmittel finanzieren den kostenlosen Kern.",
  },
  {
    t: "Schul- & Träger-Lizenzen (B2B/B2G)",
    d: "Optionale Lizenzen für Schulen, Bundesländer oder Schulträger — Mehrwert-Funktionen, nie eine Paywall für den Kern.",
  },
  {
    t: "Partnerschaften",
    d: "Daten- und Safety-Partnerschaften, z. B. parinhood für das Podcast-Signal und den Eltern-Safety-Layer.",
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

export default function PitchPage() {
  return (
    <div className="overflow-hidden">
      {/* 1 — Hook / Vision */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="mx-auto flex min-h-[78vh] max-w-5xl flex-col justify-center px-4 py-20 sm:px-6">
          <span className="la-chip w-fit bg-white/15 text-white border-white/25">
            Pitch &amp; Konzept · gemeinnützig
          </span>
          <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-6xl">
            Aus Medienkonsum wird{" "}
            <span className="underline decoration-white/40 decoration-4 underline-offset-8">
              Schulstoff
            </span>
            .
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-white/90 sm:text-xl">
            Jugendliche verbringen Stunden mit YouTube, Podcasts und News. Im
            Unterricht wirkt derselbe Stoff oft trocken. Wir bauen die
            Neugier-Brücke — vom realen Konsum rückwärts auf den Lehrplan.
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            <span>✅ Ohne Creator-Namen</span>
            <span>✅ Mensch im Loop</span>
            <span>✅ DSGVO-konform, EU-Hosting</span>
          </div>
        </div>
      </section>

      {/* 2 — Problem */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <span className="la-chip">Das Problem</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Neugier draußen, trockener Stoff drinnen.
        </h2>
        <div className="mt-8 grid gap-5 md:grid-cols-2">
          <div className="la-card p-7">
            <p className="text-2xl">🧑‍🎓</p>
            <h3 className="mt-3 text-xl font-bold">Schüler:innen</h3>
            <p className="mt-2 text-muted">
              Sind bei YouTube, Podcasts und News neugierig — sehen aber nicht,
              dass das, was sie konsumieren, mit Mathe, Deutsch &amp; Co. zu tun
              hat. Im Unterricht wirkt derselbe Stoff abstrakt.
            </p>
          </div>
          <div className="la-card p-7">
            <p className="text-2xl">👩‍🏫</p>
            <h3 className="mt-3 text-xl font-bold">Lehrkräfte</h3>
            <p className="mt-2 text-muted">
              Haben keine Zeit, aktuelle Medien laufend auf den Lehrplan zu
              übersetzen. Aktuelle, „angesagte“ Aufhänger zu finden und
              didaktisch aufzubereiten kostet zu viel Vorbereitung.
            </p>
          </div>
        </div>
      </section>

      {/* 3 — Lösung */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <span className="la-chip">Die Lösung</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Bottom-up: vom echten Konsum rückwärts auf den Lehrplan.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Wir starten bei dem, was Jugendliche freiwillig schauen und hören —
            und bauen die Brücke zum Pflichtstoff. Pro Treffer liefern wir ein
            Szenario, eine fertige Einstiegsfrage und eine einsetzbare Unterlage.
          </p>

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {[
              {
                n: "1",
                t: "Konsum erkennen",
                d: "Was die Altersgruppe (Bubble) auf YouTube, in Podcasts & News wirklich schaut — nicht einzelne Creator.",
              },
              {
                n: "2",
                t: "Auf den Lehrplan mappen",
                d: "KI zieht die Situation heraus und matcht sie rückwärts mit dem Lehrplan-Thema.",
              },
              {
                n: "3",
                t: "Einstieg liefern",
                d: "Szenario + Einstiegsfrage + fertige Unterlage. Die Lehrkraft bestätigt oder verwirft.",
              },
            ].map((s) => (
              <div key={s.n} className="la-card p-6">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-brand font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
                <p className="mt-1 text-muted">{s.d}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <span className="la-chip-muted la-chip">Ohne Creator-Namen</span>
            <span className="la-chip-muted la-chip">Szenario statt Creator</span>
            <span className="la-chip-muted la-chip">Mensch im Loop</span>
          </div>

          <div className="mt-6 la-card border-l-4 border-brand bg-brand-soft p-6">
            <p className="text-sm font-semibold text-muted">Beispiel-Szenario</p>
            <p className="mt-1 text-lg font-semibold italic text-brand-dark">
              „Jemand schrieb im Chat: ‚Er sagte du bist cool.‘ Wo ist der Fehler
              bei der wörtlichen Rede?“
            </p>
            <p className="mt-2 text-sm text-brand-dark">
              Aus „nur ein Chat“ wird ein Lehrplan-Einstieg in die Kommasetzung.
            </p>
          </div>
        </div>
      </section>

      {/* 4 — Produkt */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <span className="la-chip">Das Produkt</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
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
              <p className="mt-2 text-muted">{z.text}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-5 sm:grid-cols-2">
          {PRODUKT_FEATURES.map((f) => (
            <div key={f.t} className="la-card p-6">
              <h3 className="text-lg font-bold">{f.t}</h3>
              <p className="mt-1 text-muted">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5 — Markt & Wettbewerb */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <span className="la-chip">Markt &amp; Wettbewerb</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Ein Material-Marktplatz-Markt — mit einer offenen Flanke.
          </h2>
          <p className="mt-4 max-w-2xl text-lg text-muted">
            Der deutsche Markt für Unterrichtsmaterial besteht fast nur aus
            Marktplätzen für fertige Arbeitsblätter &amp; Stundenentwürfe — alle
            top-down und fast ausschließlich für Lehrkräfte.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            {WETTBEWERBER.map((w) => (
              <span key={w} className="la-chip-muted la-chip">
                {w}
              </span>
            ))}
          </div>

          <h3 className="mt-10 text-xl font-bold">Unser Whitespace</h3>
          <div className="mt-4 grid gap-5 md:grid-cols-3">
            {WHITESPACE.map((w) => (
              <div key={w.t} className="la-card p-6">
                <h4 className="text-lg font-bold text-brand">{w.t}</h4>
                <p className="mt-1 text-muted">{w.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 — Geschäftsmodell */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <span className="la-chip">Geschäftsmodell</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Kern kostenlos &amp; werbefrei — Finanzierung marktüblich gemischt.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Wir sind gemeinnützig: Der Kern bleibt kostenlos und werbefrei — das
          schafft Vertrauen bei Schule, Schüler:innen und Eltern. Finanziert wird
          über einen marktüblichen, gemischten Mix.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-3">
          {FINANZIERUNG.map((f) => (
            <div key={f.t} className="la-card p-6">
              <h3 className="text-lg font-bold">{f.t}</h3>
              <p className="mt-1 text-muted">{f.d}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 la-card bg-gradient-to-br from-brand to-brand-dark p-7 text-white">
          <h3 className="text-xl font-bold">Zum Vergleich: der Markt zahlt</h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-3">
            {PREISE.map((p) => (
              <li key={p.name} className="rounded-xl bg-white/10 p-4">
                <p className="font-semibold">{p.name}</p>
                <p className="mt-1 text-sm text-white/85">{p.preis}</p>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-lg font-semibold">
            Lernassistent bleibt für Lehrkräfte, Schüler:innen und Eltern
            kostenlos.
          </p>
        </div>
      </section>

      {/* 7 — Roadmap */}
      <section className="bg-canvas">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
          <span className="la-chip">Roadmap</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Vom Prototyp zur Skalierung.
          </h2>
          <ol className="mt-8 space-y-4">
            {ROADMAP.map((r, i) => (
              <li key={r.phase} className="la-card flex gap-5 p-6">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-brand font-bold text-white">
                  {i}
                </span>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-wide text-muted">
                    {r.phase}
                  </p>
                  <h3 className="text-lg font-bold">{r.titel}</h3>
                  <p className="mt-1 text-muted">{r.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 8 — Team / Trägerschaft */}
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6">
        <span className="la-chip">Team &amp; Trägerschaft</span>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
          Ein gemeinnütziges Vater-Sohn-Projekt.
        </h2>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          Lernassistent entsteht als gemeinnütziges noorder-Projekt — gebaut von
          Vater und Sohn. Der Sohn bringt ein, was Jugendliche wirklich schauen;
          der Vater die technische Pipeline. Gemeinsam: die Zielgruppen-Views und
          die Demo-Story.
        </p>
      </section>

      {/* 9 — Call to Action */}
      <section className="bg-gradient-to-br from-brand to-brand-dark text-white">
        <div className="mx-auto max-w-5xl px-4 py-20 text-center sm:px-6">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Pilotklassen &amp; Förderpartner gesucht.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-white/90">
            Wir suchen Pilot-Klassen, die mit uns die Neugier-Brücke testen — und
            Förderpartner, die einen kostenlosen, werbefreien Lernassistenten
            möglich machen.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
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
      </section>
    </div>
  );
}
