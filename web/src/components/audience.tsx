"use client";

import { useState } from "react";
import type { AppData, FachBundle, Match, Material, Thema } from "@/lib/types";
import { quelleLabel } from "@/lib/format";
import { MaterialModal } from "@/components/material-modal";
import { ExerciseRunner, hatAufgaben } from "@/components/exercise";
import { playSound } from "@/lib/sound";

/* ────────────────────────── gemeinsame Steuerung ────────────────────────── */

function useSelection(data: AppData) {
  const [bubbleId, setBubbleId] = useState(
    data.bubbles.find((b) => b.id === "klasse_6")?.id ?? data.bubbles[0]?.id,
  );
  const bubble = data.bubbles.find((b) => b.id === bubbleId) ?? data.bubbles[0];
  const faecher = Object.keys(data.byBubble[bubble.id] ?? {});
  const [fachKey, setFachKey] = useState(faecher[0]);
  const activeFach = data.byBubble[bubble.id]?.[fachKey] ? fachKey : faecher[0];
  const bundle: FachBundle | undefined = data.byBubble[bubble.id]?.[activeFach];
  return { data, bubble, setBubbleId, faecher, fachKey: activeFach, setFachKey, bundle };
}

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-semibold transition ${
        active
          ? "bg-brand text-white shadow-sm"
          : "border border-line bg-surface text-muted hover:border-brand hover:text-brand"
      }`}
    >
      {children}
    </button>
  );
}

function Controls({ sel }: { sel: ReturnType<typeof useSelection> }) {
  return (
    <div className="la-card mb-6 flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">Altersgruppe</p>
        <div className="flex flex-wrap gap-2">
          {sel.data.bubbles.map((b) => (
            <Pill key={b.id} active={b.id === sel.bubble.id} onClick={() => sel.setBubbleId(b.id)}>
              {b.name}
            </Pill>
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-muted">Fach</p>
        <div className="flex flex-wrap gap-2">
          {sel.faecher.map((f) => (
            <Pill key={f} active={f === sel.fachKey} onClick={() => sel.setFachKey(f)}>
              {sel.data.byBubble[sel.bubble.id]?.[f]?.emoji} {f}
            </Pill>
          ))}
        </div>
      </div>
    </div>
  );
}

function PageHead({
  emoji,
  title,
  subtitle,
  bundle,
  bubbleName,
}: {
  emoji: string;
  title: string;
  subtitle: string;
  bundle?: FachBundle;
  bubbleName: string;
}) {
  return (
    <div className="mb-6">
      <h1 className="text-3xl font-bold tracking-tight">
        {emoji} {title}
      </h1>
      <p className="mt-1 text-muted">{subtitle}</p>
      {bundle && (
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="la-chip">
            {bundle.emoji} {bundle.fach} · {bubbleName}
          </span>
          <span className="la-chip la-chip-muted">{bundle.matches.length} Impulse</span>
          <span className="la-chip la-chip-muted">{bundle.isSample ? "Beispiel-Daten" : "Live"}</span>
        </div>
      )}
    </div>
  );
}

function SourceBadge({ m }: { m: Match }) {
  const label = quelleLabel(m.quelle);
  if (!label) return null;
  return (
    <span className="text-xs font-semibold uppercase tracking-wide text-muted">
      {label}
      {m.datum ? ` · ${m.datum}` : ""}
    </span>
  );
}

/* ────────────────────────── Material (fertige Stunde) ────────────────────────── */

function MaterialBlock({ material }: { material: Material }) {
  return (
    <details className="mt-3 rounded-xl border border-line bg-[#fafcff] p-3">
      <summary className="cursor-pointer font-semibold text-brand-dark">
        📄 Fertige Stunde anzeigen — {material.titel}
        {material.dauer_min ? ` (${material.dauer_min} Min)` : ""}
      </summary>
      <div className="mt-3 space-y-3 text-sm">
        {material.lernziel && (
          <p>
            <span className="font-semibold">Lernziel:</span> {material.lernziel}
          </p>
        )}
        {material.ablauf?.length ? (
          <div>
            <p className="font-semibold">Ablauf</p>
            <ul className="mt-1 space-y-1">
              {material.ablauf.map((p, i) => (
                <li key={i} className="flex gap-2">
                  <span className="min-w-24 font-medium">
                    {p.phase}
                    {p.dauer_min ? ` · ${p.dauer_min}′` : ""}
                  </span>
                  <span className="text-muted">{p.beschreibung}</span>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {material.arbeitsblatt?.aufgaben?.length ? (
          <div>
            <p className="font-semibold">Arbeitsblatt</p>
            <ol className="mt-1 list-decimal space-y-1 pl-5">
              {material.arbeitsblatt.aufgaben.map((a, i) => (
                <li key={i}>{a}</li>
              ))}
            </ol>
            {material.arbeitsblatt.loesungen?.length ? (
              <details className="mt-2">
                <summary className="cursor-pointer font-semibold text-muted">Lösungen</summary>
                <ol className="mt-1 list-decimal space-y-1 pl-5 text-muted">
                  {material.arbeitsblatt.loesungen.map((l, i) => (
                    <li key={i}>{l}</li>
                  ))}
                </ol>
              </details>
            ) : null}
          </div>
        ) : null}
        {(material.differenzierung?.leichter || material.differenzierung?.schwerer) && (
          <div className="grid gap-3 sm:grid-cols-2">
            {material.differenzierung?.leichter && (
              <div className="rounded-lg bg-brand-soft p-2">
                <p className="font-semibold">Leichter</p>
                <p className="text-muted">{material.differenzierung.leichter}</p>
              </div>
            )}
            {material.differenzierung?.schwerer && (
              <div className="rounded-lg bg-brand-soft p-2">
                <p className="font-semibold">Schwerer</p>
                <p className="text-muted">{material.differenzierung.schwerer}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </details>
  );
}

function EmptyState() {
  return (
    <div className="la-card p-6 text-muted">
      Noch keine Impulse für diese Auswahl — über die Pipeline oder Beispiel-Daten kommen sie hinzu.
    </div>
  );
}

/* ────────────────────────── Lehrkraft ────────────────────────── */

export function LehrkraftView({ data }: { data: AppData }) {
  const sel = useSelection(data);
  const { bundle } = sel;
  const themen: Thema[] = bundle?.themen ?? [];
  const demoIdx = Math.max(
    0,
    themen.findIndex((t) => t.id === bundle?.demoThemaId),
  );
  const [themaId, setThemaId] = useState<number | undefined>(themen[demoIdx]?.id);
  const activeThemaId = themen.some((t) => t.id === themaId) ? themaId : themen[demoIdx]?.id;
  const thema = themen.find((t) => t.id === activeThemaId);
  const matches = (bundle?.matches ?? []).filter((m) => m.thema_id === activeThemaId);
  const [bestaetigt, setBestaetigt] = useState<Record<string, boolean>>({});
  const [openMatch, setOpenMatch] = useState<Match | null>(null);
  const meta = `${bundle?.emoji ?? ""} ${bundle?.fach ?? ""} · ${sel.bubble.name}`;

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <PageHead
        emoji="👩‍🏫"
        title="Lehrkraft"
        subtitle="Vom Lehrplan-Thema zu aktuellen Einstiegen & fertigem Material"
        bundle={bundle}
        bubbleName={sel.bubble.name}
      />
      <Controls sel={sel} />

      <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">
        Lehrplan-Thema
      </label>
      <select
        value={activeThemaId}
        onChange={(e) => setThemaId(Number(e.target.value))}
        className="mb-2 w-full rounded-xl border border-line bg-surface px-3 py-2 font-semibold"
      >
        {themen.map((t) => (
          <option key={t.id} value={t.id}>
            {t.thema}
          </option>
        ))}
      </select>
      {thema && <p className="mb-5 text-sm text-muted">Kernkonzept: {thema.kernkonzept}</p>}

      <div className="space-y-4">
        {matches.map((m, i) => {
          const key = `${m.thema_id}-${m.video_id ?? i}`;
          return (
            <article key={key} className="la-card p-5">
              <SourceBadge m={m} />
              <p className="mt-2">
                <span className="font-semibold">Situation:</span> {m.szenario}
              </p>
              {m.einstiegsfrage && (
                <p className="mt-1">
                  <span className="font-semibold">Einstiegsfrage:</span> {m.einstiegsfrage}
                </p>
              )}
              {m.unterrichtsidee && (
                <p className="mt-1 text-muted">
                  <span className="font-semibold text-ink">Unterrichtsidee:</span> {m.unterrichtsidee}
                </p>
              )}
              {m.material && (
                <button
                  onClick={() => { playSound("click"); setOpenMatch(m); }}
                  className="mt-3 inline-flex items-center gap-2 rounded-lg border border-brand bg-brand-soft px-3 py-1.5 text-sm font-semibold text-brand-dark transition hover:bg-brand hover:text-white"
                >
                  📄 Komplette Unterlage öffnen
                </button>
              )}
              <div className="mt-4 flex items-center gap-2">
                <button
                  onClick={() => setBestaetigt((s) => ({ ...s, [key]: true }))}
                  className="rounded-lg bg-brand px-3 py-1.5 text-sm font-semibold text-white hover:bg-brand-dark"
                >
                  Passt
                </button>
                <button
                  onClick={() => setBestaetigt((s) => ({ ...s, [key]: false }))}
                  className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold text-muted hover:border-brand"
                >
                  Verwerfen
                </button>
                {bestaetigt[key] === true && <span className="text-sm font-semibold text-[#0f9d6c]">✅ Bestätigt</span>}
                {bestaetigt[key] === false && <span className="text-sm text-muted">Verworfen</span>}
              </div>
            </article>
          );
        })}
        {matches.length === 0 && <EmptyState />}
      </div>

      {openMatch && (
        <MaterialModal
          match={openMatch}
          themaName={themen.find((t) => t.id === openMatch.thema_id)?.thema ?? ""}
          meta={meta}
          onClose={() => setOpenMatch(null)}
        />
      )}
    </div>
  );
}

/* ────────────────────────── Schüler ────────────────────────── */

export function SchuelerView({ data }: { data: AppData }) {
  const sel = useSelection(data);
  const { bundle } = sel;
  const matches = (bundle?.matches ?? []).filter((m) => m.schueler_hook);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const punkte = Object.values(done).filter(Boolean).length;
  const themaName = (id: number) => bundle?.themen.find((t) => t.id === id)?.thema ?? "";

  const uebThemen = (bundle?.themen ?? []).filter((t) => hatAufgaben(t.id));
  const [tab, setTab] = useState<"entdecken" | "ueben">("entdecken");
  const [uebThema, setUebThema] = useState<number | undefined>(undefined);
  const activeUeb = uebThemen.some((t) => t.id === uebThema) ? uebThema : uebThemen[0]?.id;

  const tabCls = (active: boolean) =>
    `rounded-full px-4 py-1.5 text-sm font-semibold transition ${
      active ? "bg-[#0f9d6c] text-white" : "border border-line text-muted hover:border-[#0f9d6c]"
    }`;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHead
        emoji="🎒"
        title="Schüler"
        subtitle="Dein Alltag steckt voller Schulstoff — entdecken & üben"
        bundle={bundle}
        bubbleName={sel.bubble.name}
      />
      <Controls sel={sel} />

      <div className="mb-5 flex gap-2">
        <button onClick={() => setTab("entdecken")} className={tabCls(tab === "entdecken")}>🔎 Entdecken</button>
        <button onClick={() => setTab("ueben")} className={tabCls(tab === "ueben")}>✏️ Üben</button>
      </div>

      {tab === "entdecken" ? (
        <>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-[#0f9d6c]/10 px-4 py-1.5 font-semibold text-[#0b7a53]">
            ⭐ {punkte} Punkte
          </div>
          <div className="space-y-4">
            {matches.map((m, i) => {
              const key = `${m.thema_id}-${m.video_id ?? i}`;
              return (
                <article key={key} className="la-card p-5">
                  <span className="la-chip la-chip-muted">{themaName(m.thema_id)}</span>
                  <p className="mt-3 text-lg font-semibold">{m.schueler_hook}</p>
                  {m.schueler_challenge && (
                    <div className="mt-3 rounded-xl bg-[#0f9d6c]/8 p-3">
                      <p className="text-sm font-semibold text-[#0b7a53]">🎯 Deine Challenge</p>
                      <p className="mt-1">{m.schueler_challenge}</p>
                      <button
                        onClick={() => { playSound("entry"); setDone((s) => ({ ...s, [key]: !s[key] })); }}
                        className={`mt-3 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                          done[key]
                            ? "bg-[#0f9d6c] text-white"
                            : "border border-[#0f9d6c] text-[#0b7a53] hover:bg-[#0f9d6c]/10"
                        }`}
                      >
                        {done[key] ? "✅ Geschafft" : "Als geschafft markieren"}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
            {matches.length === 0 && <EmptyState />}
          </div>
        </>
      ) : (
        <div className="la-card p-5">
          {activeUeb ? (
            <>
              <label className="mb-1 block text-xs font-bold uppercase tracking-wider text-muted">Thema wählen</label>
              <select
                value={activeUeb}
                onChange={(e) => { playSound("swipe"); setUebThema(Number(e.target.value)); }}
                className="mb-4 w-full rounded-xl border border-line bg-surface px-3 py-2 font-semibold"
              >
                {uebThemen.map((t) => (
                  <option key={t.id} value={t.id}>{t.thema}</option>
                ))}
              </select>
              <ExerciseRunner key={activeUeb} themaId={activeUeb} themaName={themaName(activeUeb)} />
            </>
          ) : (
            <p className="text-muted">Für dieses Fach gibt es hier noch keine automatischen Übungen.</p>
          )}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────── Eltern ────────────────────────── */

export function ElternView({ data }: { data: AppData }) {
  const sel = useSelection(data);
  const { bundle } = sel;
  const matches = (bundle?.matches ?? []).filter((m) => m.eltern || m.schueler_hook);
  const themaName = (id: number) => bundle?.themen.find((t) => t.id === id)?.thema ?? "";
  const klartext = (id: number) => bundle?.themen.find((t) => t.id === id)?.eltern_klartext ?? "";

  const [konsum, setKonsum] = useState<{ name: string; warum: string }[]>([
    { name: "Gaming-Streams", warum: "Challenges und Chats" },
  ]);
  const [name, setName] = useState("");
  const [warum, setWarum] = useState("");

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHead
        emoji="👪"
        title="Eltern"
        subtitle="Was dein Kind schaut — und was schulisch dahintersteckt"
        bundle={bundle}
        bubbleName={sel.bubble.name}
      />
      <Controls sel={sel} />

      <details className="la-card mb-6 p-4">
        <summary className="cursor-pointer font-semibold">📱 Was schaut oder hört dein Kind gerade?</summary>
        <div className="mt-3 space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="z.B. Gaming-Streams, Podcasts, News"
              className="flex-1 rounded-lg border border-line px-3 py-2"
            />
            <input
              value={warum}
              onChange={(e) => setWarum(e.target.value)}
              placeholder="Warum? (optional)"
              className="flex-1 rounded-lg border border-line px-3 py-2"
            />
            <button
              onClick={() => {
                if (!name.trim()) return;
                setKonsum((k) => [...k, { name: name.trim(), warum: warum.trim() }]);
                setName("");
                setWarum("");
              }}
              className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark"
            >
              Hinzufügen
            </button>
          </div>
          <ul className="mt-2 space-y-1 text-sm">
            {konsum.map((e, i) => (
              <li key={i}>
                • <span className="font-semibold">{e.name}</span>
                {e.warum ? ` — ${e.warum}` : ""}
              </li>
            ))}
          </ul>
        </div>
      </details>

      <h2 className="mb-3 font-semibold">Das steckt schulisch in typischen Alltags-Situationen:</h2>
      <div className="space-y-4">
        {matches.map((m, i) => {
          const el = m.eltern ?? {};
          const schulbezug = el.schulbezug || klartext(m.thema_id);
          return (
            <article key={`${m.thema_id}-${m.video_id ?? i}`} className="la-card p-5">
              <div className="flex items-center gap-2">
                <SourceBadge m={m} />
                <span className="la-chip la-chip-muted">{themaName(m.thema_id)}</span>
              </div>
              <p className="mt-2 italic">„{m.szenario}“</p>
              {schulbezug && (
                <p className="mt-3">
                  📚 <span className="font-semibold">Das ist Schulstoff:</span> {schulbezug}
                </p>
              )}
              {el.gespraechsanlass && (
                <p className="mt-2">
                  💬 <span className="font-semibold">Reden mit deinem Kind:</span> {el.gespraechsanlass}
                </p>
              )}
              {el.tipp && (
                <p className="mt-2 text-muted">
                  💡 <span className="font-semibold text-ink">Tipp:</span> {el.tipp}
                </p>
              )}
              {el.safety && (
                <p className="mt-3 rounded-xl bg-[#b5530b]/10 p-3 text-sm text-[#8a3f08]">
                  ⚠️ {el.safety}
                </p>
              )}
            </article>
          );
        })}
        {matches.length === 0 && <EmptyState />}
      </div>
    </div>
  );
}
