"use client";

import { useEffect, useState } from "react";
import type { Match } from "@/lib/types";
import { ExerciseRunner, hatAufgaben } from "@/components/exercise";
import { playSound } from "@/lib/sound";
import { quelleLabel, quelleEmoji } from "@/lib/format";

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Eigenständiges HTML-Dokument der Lernunterlage (zum Download). */
function buildLessonHtml(match: Match, meta: string, themaName: string, kernkonzept: string): string {
  const m = match.material!;
  const ablauf = (m.ablauf ?? [])
    .map((p) => `<tr><td>${esc(p.phase)}${p.dauer_min ? ` · ${p.dauer_min}′` : ""}</td><td>${esc(p.beschreibung)}</td></tr>`)
    .join("");
  const aufgaben = (m.arbeitsblatt?.aufgaben ?? []).map((a) => `<li>${esc(a)}</li>`).join("");
  const loesungen = (m.arbeitsblatt?.loesungen ?? []).map((l) => `<li>${esc(l)}</li>`).join("");
  return `<!doctype html><html lang="de"><head><meta charset="utf-8">
<title>${esc(m.titel)}</title>
<style>
 body{font-family:-apple-system,Segoe UI,Roboto,sans-serif;color:#0f172a;max-width:720px;margin:40px auto;padding:0 20px;line-height:1.5}
 h1{font-size:1.5rem} h2{font-size:1.1rem;margin-top:1.6em;border-bottom:1px solid #d8e1ee;padding-bottom:.2em}
 .meta{color:#64748b;font-size:.9rem} table{border-collapse:collapse;width:100%} td{border:1px solid #d8e1ee;padding:6px 8px;vertical-align:top}
 td:first-child{white-space:nowrap;font-weight:600;width:30%} .src{color:#64748b;font-size:.8rem;margin-top:2em}
 .match{background:#e3f2fd;border-radius:10px;padding:10px 14px;margin:14px 0}
 .match p{margin:.3em 0} .mlabel{font-size:.72rem;font-weight:700;letter-spacing:.06em;color:#0d47a1;margin:0 0 4px}
</style></head><body>
<h1>${esc(m.titel)}</h1>
<p class="meta">${esc(meta)}${m.dauer_min ? ` · ${m.dauer_min} Min` : ""}</p>
<div class="match">
<p class="mlabel">MEDIENINHALT ↔ LEHRPLAN</p>
<p>${quelleEmoji(match.quelle)} ${esc(quelleLabel(match.quelle))}${match.datum ? ` · ${esc(match.datum)}` : ""} &nbsp;→&nbsp; <strong>${esc(themaName)}</strong></p>
<p><strong>Aktuell in den Medien:</strong> <em>${esc(match.szenario)}</em></p>
${kernkonzept ? `<p><strong>Lehrplan-Bezug:</strong> ${esc(kernkonzept)}</p>` : ""}
${match.begruendung ? `<p><strong>Warum das passt:</strong> ${esc(match.begruendung)}</p>` : ""}
</div>
${m.lernziel ? `<p><strong>Lernziel:</strong> ${esc(m.lernziel)}</p>` : ""}
${match.einstiegsfrage ? `<p><strong>Einstiegsfrage:</strong> ${esc(match.einstiegsfrage)}</p>` : ""}
${ablauf ? `<h2>Ablauf</h2><table>${ablauf}</table>` : ""}
${aufgaben ? `<h2>Arbeitsblatt</h2><ol>${aufgaben}</ol>` : ""}
${loesungen ? `<h2>Lösungen</h2><ol>${loesungen}</ol>` : ""}
${m.differenzierung?.leichter || m.differenzierung?.schwerer ? `<h2>Differenzierung</h2>${m.differenzierung?.leichter ? `<p><strong>Leichter:</strong> ${esc(m.differenzierung.leichter)}</p>` : ""}${m.differenzierung?.schwerer ? `<p><strong>Schwerer:</strong> ${esc(m.differenzierung.schwerer)}</p>` : ""}` : ""}
<p class="src">Erstellt mit Lernassistent — gemeinnützig, kostenlos. Aus Medienkonsum wird Schulstoff.</p>
</body></html>`;
}

function download(filename: string, content: string, type = "text/html") {
  const blob = new Blob([content], { type: `${type};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function MaterialModal({
  match,
  themaName,
  kernkonzept = "",
  meta,
  onClose,
}: {
  match: Match;
  themaName: string;
  kernkonzept?: string;
  meta: string;
  onClose: () => void;
}) {
  const m = match.material;
  const [tab, setTab] = useState<"unterlage" | "whiteboard">("unterlage");
  const [showLoes, setShowLoes] = useState(false);
  const [shareMsg, setShareMsg] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  if (!m) return null;

  const slug = m.titel.toLowerCase().replace(/[^a-z0-9äöü]+/gi, "-").replace(/^-|-$/g, "").slice(0, 60);

  async function share() {
    playSound("click");
    const text = `Unterrichtsmaterial „${m!.titel}" (${meta}) — Lernassistent, gemeinnützig & kostenlos.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: m!.titel, text });
        return;
      }
    } catch {
      /* abgebrochen */
    }
    try {
      await navigator.clipboard.writeText(`${text}\n${window.location.href}`);
      setShareMsg("In Zwischenablage kopiert ✓");
      setTimeout(() => setShareMsg(""), 2500);
    } catch {
      setShareMsg("Teilen nicht verfügbar");
      setTimeout(() => setShareMsg(""), 2500);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="la-card my-6 w-full max-w-2xl p-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Kopf + Aktionen (nicht im Druck) */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line p-4 no-print">
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">Lernunterlage · {meta}</p>
            <h2 className="truncate text-lg font-bold">{m.titel}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => { playSound("click"); window.print(); }} className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand" title="Drucken">
              🖨️ Drucken
            </button>
            <button onClick={() => { playSound("click"); download(`${slug || "unterlage"}.html`, buildLessonHtml(match, meta, themaName, kernkonzept)); }} className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand" title="Herunterladen">
              ⬇️ Download
            </button>
            <button onClick={share} className="rounded-lg border border-line px-3 py-1.5 text-sm font-semibold hover:border-brand" title="Teilen">
              🔗 Teilen
            </button>
            <button onClick={onClose} className="rounded-lg px-2 py-1.5 text-xl text-muted hover:text-ink" aria-label="Schließen">
              ✕
            </button>
          </div>
        </div>

        {shareMsg && <p className="px-4 pt-2 text-sm text-[#0b7a53] no-print">{shareMsg}</p>}

        {/* Tabs */}
        <div className="flex gap-1 px-4 pt-3 no-print">
          <button onClick={() => setTab("unterlage")} className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === "unterlage" ? "bg-brand-soft text-brand-dark" : "text-muted hover:text-brand"}`}>
            📄 Komplette Unterlage
          </button>
          {hatAufgaben(match.thema_id) && (
            <button onClick={() => setTab("whiteboard")} className={`rounded-t-lg px-4 py-2 text-sm font-semibold ${tab === "whiteboard" ? "bg-brand-soft text-brand-dark" : "text-muted hover:text-brand"}`}>
              🖥️ Whiteboard-Aufgabe
            </button>
          )}
        </div>

        {/* Inhalt */}
        <div className="p-5">
          {tab === "unterlage" ? (
            <div className="la-print space-y-4">
              <div>
                <h3 className="text-xl font-bold">{m.titel}</h3>
                <p className="text-sm text-muted">{meta}{m.dauer_min ? ` · ${m.dauer_min} Min` : ""}</p>
              </div>

              {/* Das Match: Medieninhalt ↔ Lehrplan */}
              <div className="rounded-xl bg-brand-soft p-4">
                <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">Medieninhalt ↔ Lehrplan</p>
                <p className="mt-1 flex flex-wrap items-center gap-2 font-semibold">
                  <span>{quelleEmoji(match.quelle)} {quelleLabel(match.quelle)}{match.datum ? ` · ${match.datum}` : ""}</span>
                  <span className="text-muted">→</span>
                  <span>{themaName}</span>
                </p>
                <p className="mt-2 text-sm"><span className="font-semibold">Aktuell in den Medien:</span> <em>„{match.szenario}"</em></p>
                {kernkonzept && <p className="mt-1 text-sm"><span className="font-semibold">Lehrplan-Bezug:</span> {kernkonzept}</p>}
                {match.begruendung && <p className="mt-1 text-sm"><span className="font-semibold">Warum das passt:</span> {match.begruendung}</p>}
              </div>

              {m.lernziel && <p><span className="font-semibold">Lernziel:</span> {m.lernziel}</p>}
              {match.einstiegsfrage && <p><span className="font-semibold">Einstiegsfrage:</span> {match.einstiegsfrage}</p>}

              {m.ablauf?.length ? (
                <div>
                  <h4 className="font-semibold">Ablauf</h4>
                  <table className="mt-1 w-full border-collapse text-sm">
                    <tbody>
                      {m.ablauf.map((p, i) => (
                        <tr key={i} className="border-b border-line">
                          <td className="whitespace-nowrap py-1.5 pr-3 font-medium align-top">
                            {p.phase}{p.dauer_min ? ` · ${p.dauer_min}′` : ""}
                          </td>
                          <td className="py-1.5 text-muted">{p.beschreibung}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : null}

              {m.arbeitsblatt?.aufgaben?.length ? (
                <div>
                  <h4 className="font-semibold">Arbeitsblatt</h4>
                  <ol className="mt-1 list-decimal space-y-1 pl-5">
                    {m.arbeitsblatt.aufgaben.map((a, i) => <li key={i}>{a}</li>)}
                  </ol>
                  {m.arbeitsblatt.loesungen?.length ? (
                    <div className="mt-2">
                      <button onClick={() => setShowLoes((s) => !s)} className="text-sm font-semibold text-brand no-print">
                        {showLoes ? "Lösungen verbergen" : "Lösungen anzeigen"}
                      </button>
                      <ol className={`mt-1 list-decimal space-y-1 pl-5 text-muted ${showLoes ? "" : "hidden print:block"}`}>
                        {m.arbeitsblatt.loesungen.map((l, i) => <li key={i}>{l}</li>)}
                      </ol>
                    </div>
                  ) : null}
                </div>
              ) : null}

              {(m.differenzierung?.leichter || m.differenzierung?.schwerer) && (
                <div className="grid gap-3 sm:grid-cols-2">
                  {m.differenzierung?.leichter && (
                    <div className="rounded-lg bg-brand-soft p-3"><p className="font-semibold">Leichter</p><p className="text-muted">{m.differenzierung.leichter}</p></div>
                  )}
                  {m.differenzierung?.schwerer && (
                    <div className="rounded-lg bg-brand-soft p-3"><p className="font-semibold">Schwerer</p><p className="text-muted">{m.differenzierung.schwerer}</p></div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="mb-3 text-sm text-muted">
                Für die Klasse vorne am digitalen Whiteboard lösen — „Lösung zeigen" deckt die Antwort auf.
              </p>
              <ExerciseRunner themaId={match.thema_id} themaName={themaName} big />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
