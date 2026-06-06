import Link from "next/link";
import { getAppData } from "@/lib/data";

const AUDIENCES = [
  {
    href: "/lehrkraft",
    emoji: "👩‍🏫",
    title: "Für Lehrkräfte",
    text: "Vom Lehrplan-Thema zu aktuellen Einstiegen, Einstiegsfragen und fertigen Stunden.",
    accent: "from-[#1565c0] to-[#0d47a1]",
  },
  {
    href: "/schueler",
    emoji: "🎒",
    title: "Für Schüler:innen",
    text: "Dein Alltag steckt voller Schulstoff — entdecken und gleich interaktiv üben.",
    accent: "from-[#0f9d6c] to-[#0b7a53]",
  },
  {
    href: "/eltern",
    emoji: "👪",
    title: "Für Eltern",
    text: "Was dein Kind schaut — und was schulisch dahintersteckt, mit Gesprächsanlässen.",
    accent: "from-[#b5530b] to-[#8a3f08]",
  },
];

const STEPS = [
  { n: "1", t: "Konsum erkennen", d: "Was Jugendliche auf YouTube, in Podcasts & News wirklich schauen." },
  { n: "2", t: "Auf den Lehrplan mappen", d: "KI zieht die Situation heraus und matcht sie mit dem Lehrplan." },
  { n: "3", t: "Einstieg & Übung liefern", d: "Szenario, Einstiegsfrage, fertige Stunde — und Übungen für Schüler:innen." },
];

export default function Home() {
  // Echtes Beispiel-Szenario aus den Daten (Aktualität sichtbar machen).
  const data = getAppData();
  const demo = data.byBubble["klasse_6"]?.["Deutsch"];
  const beispiel = demo?.matches.find((m) => m.einstiegsfrage) ?? demo?.matches[0];

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pt-14 pb-10 sm:px-6 sm:pt-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <span className="la-chip">Gemeinnützig · kostenlos · werbefrei</span>
            <h1 className="mt-4 text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
              Aus Medienkonsum wird <span className="text-brand">Schulstoff</span>.
            </h1>
            <p className="mt-4 max-w-xl text-lg text-muted">
              Wir schenken Zeit: Aus dem, was Jugendliche wirklich schauen und hören, werden in
              Minuten passende Einstiege und Übungen zum Lehrplan — für Lehrkräfte, Schüler:innen
              und Eltern.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/lehrkraft"
                className="rounded-full bg-brand px-5 py-2.5 font-semibold text-white shadow-sm transition hover:bg-brand-dark"
              >
                Loslegen als Lehrkraft
              </Link>
              <Link
                href="/eltern"
                className="rounded-full border border-line bg-surface px-5 py-2.5 font-semibold text-ink transition hover:border-brand hover:text-brand"
              >
                Für Eltern entdecken
              </Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted">
              <span>✅ Ohne YouTuber-Namen</span>
              <span>✅ Mensch im Loop</span>
              <span>✅ DSGVO-konform, EU-Hosting</span>
            </div>
          </div>

          {/* Live-Beispiel-Karte */}
          {beispiel && (
            <div className="la-card p-6">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-muted">
                <span className="la-chip">Aktuelles Beispiel</span>
                <span>Klasse 6 · Deutsch</span>
              </div>
              <p className="mt-4 text-sm font-semibold text-muted">Situation aus dem Alltag</p>
              <p className="mt-1 text-lg font-semibold italic">„{beispiel.szenario}“</p>
              {beispiel.einstiegsfrage && (
                <>
                  <p className="mt-4 text-sm font-semibold text-muted">Fertige Einstiegsfrage</p>
                  <p className="mt-1 text-base">{beispiel.einstiegsfrage}</p>
                </>
              )}
              <div className="mt-5 rounded-xl bg-brand-soft p-3 text-sm text-brand-dark">
                Aus „nur ein Chat“ wird ein Lehrplan-Einstieg — genau das macht der Lernassistent.
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Zielgruppen-Routing */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <h2 className="text-sm font-bold uppercase tracking-wider text-muted">Für wen bist du hier?</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <Link key={a.href} href={a.href} className="la-card group p-6 transition hover:-translate-y-0.5">
              <div
                className={`grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br ${a.accent} text-2xl`}
              >
                {a.emoji}
              </div>
              <h3 className="mt-4 text-xl font-bold">{a.title}</h3>
              <p className="mt-2 text-muted">{a.text}</p>
              <span className="mt-4 inline-block font-semibold text-brand group-hover:underline">Öffnen →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* So funktioniert's */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h2 className="text-2xl font-bold">So funktioniert’s</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n} className="la-card p-6">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-brand text-white font-bold">
                {s.n}
              </span>
              <h3 className="mt-3 text-lg font-bold">{s.t}</h3>
              <p className="mt-1 text-muted">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Warum anders */}
      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="la-card bg-gradient-to-br from-brand to-brand-dark p-8 text-white">
          <h2 className="text-2xl font-bold">Was uns anders macht</h2>
          <p className="mt-3 max-w-2xl text-white/90">
            Andere Plattformen taggen fertiges Lehrmaterial. Wir starten bei dem, was Kinder{" "}
            <strong>freiwillig</strong> schauen, und bauen rückwärts die Brücke zum Pflichtstoff —
            szenario-basiert, ohne Creator-Namen, mit der Lehrkraft als Entscheiderin.
          </p>
        </div>
      </section>
    </div>
  );
}
