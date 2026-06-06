"use client";

import { useEffect, useState } from "react";
import { generiere, hatAufgaben, type Task } from "@/lib/exercises";
import { playSound } from "@/lib/sound";

type Status = "idle" | "correct" | "wrong" | "revealed";

export { hatAufgaben };

/**
 * Interaktive Aufgabe zu einem Lehrplan-Thema.
 * - Schüler: antworten + sofort prüfen (+ Punkte, Sound).
 * - Lehrkraft/Whiteboard: „Lösung zeigen" für die Präsentation vorne.
 */
export function ExerciseRunner({
  themaId,
  themaName,
  big = false,
}: {
  themaId: number;
  themaName: string;
  big?: boolean;
}) {
  const [task, setTask] = useState<Task | null>(null);
  const [sel, setSel] = useState<number | null>(null);
  const [num, setNum] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [points, setPoints] = useState(0);

  useEffect(() => {
    setTask(generiere(themaId));
    setSel(null);
    setNum("");
    setStatus("idle");
  }, [themaId]);

  if (!task) {
    return (
      <p className="text-sm text-muted">
        Für „{themaName}" gibt es hier noch keine automatische Aufgabe — nutze die Aufgaben aus der Unterlage.
      </p>
    );
  }

  function neu() {
    playSound("swipe");
    setTask(generiere(themaId));
    setSel(null);
    setNum("");
    setStatus("idle");
  }

  function pruefe() {
    if (!task) return;
    let ok = false;
    if (task.typ === "mc") ok = sel === task.richtig;
    else if (task.typ === "zahl") ok = num !== "" && Math.abs(Number(num) - task.richtig) <= task.toleranz;
    else if (task.typ === "janein") ok = sel === (task.richtig ? 1 : 0);
    if (ok) {
      setStatus("correct");
      setPoints((p) => p + 1);
      playSound("entry");
    } else {
      setStatus("wrong");
      playSound("delete");
    }
  }

  const reveal = () => {
    playSound("click");
    setStatus("revealed");
  };
  const solved = status === "correct" || status === "revealed";
  const txt = big ? "text-xl" : "text-base";

  return (
    <div className={big ? "text-lg" : ""}>
      <div className="flex items-center justify-between">
        <span className="la-chip la-chip-muted">{themaName}</span>
        <span className="text-sm font-semibold text-[#0b7a53]">⭐ {points}</span>
      </div>
      {task.szenario && <p className={`mt-3 italic text-muted ${big ? "text-lg" : "text-sm"}`}>„{task.szenario}"</p>}
      <p className={`mt-2 font-semibold ${txt}`}>{task.frage}</p>

      {task.typ === "mc" && (
        <div className="mt-3 grid gap-2">
          {task.optionen.map((o, i) => {
            const isRight = solved && i === task.richtig;
            const isWrongPick = status === "wrong" && i === sel;
            return (
              <button
                key={i}
                onClick={() => status === "idle" && setSel(i)}
                disabled={solved}
                className={`rounded-xl border px-4 py-2.5 text-left transition ${
                  isRight
                    ? "border-[#0f9d6c] bg-[#0f9d6c]/10 font-semibold"
                    : isWrongPick
                    ? "border-[#b5530b] bg-[#b5530b]/10"
                    : sel === i
                    ? "border-brand bg-brand-soft"
                    : "border-line hover:border-brand"
                } ${big ? "text-xl" : ""}`}
              >
                {o}
              </button>
            );
          })}
        </div>
      )}

      {task.typ === "janein" && (
        <div className="mt-3 flex gap-2">
          {["Ja", "Nein"].map((label, i) => (
            <button
              key={label}
              onClick={() => status === "idle" && setSel(i)}
              disabled={solved}
              className={`rounded-xl border px-5 py-2.5 font-semibold transition ${
                sel === i ? "border-brand bg-brand-soft" : "border-line hover:border-brand"
              } ${big ? "text-xl" : ""}`}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      {task.typ === "zahl" && (
        <input
          type="number"
          value={num}
          onChange={(e) => setNum(e.target.value)}
          disabled={solved}
          placeholder="Deine Antwort"
          className={`mt-3 w-40 rounded-xl border border-line px-3 py-2 ${big ? "text-xl" : ""}`}
        />
      )}

      <div className="mt-4 flex flex-wrap items-center gap-2">
        {status === "idle" && (
          <button onClick={pruefe} className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-brand-dark">
            Prüfen
          </button>
        )}
        {!solved && (
          <button onClick={reveal} className="rounded-lg border border-line px-4 py-2 font-semibold text-muted hover:border-brand">
            Lösung zeigen
          </button>
        )}
        <button onClick={neu} className="rounded-lg border border-line px-4 py-2 font-semibold text-muted hover:border-brand">
          Neue Aufgabe
        </button>
      </div>

      {status === "correct" && <p className="mt-3 font-semibold text-[#0b7a53]">✅ Richtig! {task.loesung}</p>}
      {status === "wrong" && <p className="mt-3 font-semibold text-[#b5530b]">Noch nicht — probier es nochmal oder zeig die Lösung.</p>}
      {status === "revealed" && <p className="mt-3 rounded-xl bg-brand-soft p-3 text-brand-dark">💡 {task.loesung}</p>}
    </div>
  );
}
