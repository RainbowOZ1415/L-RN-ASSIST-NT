// Interaktive Aufgaben — TS-Port von aufgaben_generator.py (Demo-Themen).
// Erzeugt prüfbare Aufgaben pro Lehrplan-Thema (clientseitig, Math.random ok).

export type Task =
  | { id: string; thema_id: number; typ: "mc"; szenario: string; frage: string; optionen: string[]; richtig: number; loesung: string }
  | { id: string; thema_id: number; typ: "zahl"; szenario: string; frage: string; richtig: number; toleranz: number; loesung: string }
  | { id: string; thema_id: number; typ: "janein"; szenario: string; frage: string; richtig: boolean; loesung: string };

const rint = (a: number, b: number) => a + Math.floor(Math.random() * (b - a + 1));
const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const sample = <T,>(arr: T[], n: number): T[] => [...arr].sort(() => Math.random() - 0.5).slice(0, n);
const uid = () => Math.random().toString(36).slice(2, 10);
function gcd(a: number, b: number): number { return b ? gcd(b, a % b) : a; }

function shuffleOptions(richtig: string, falsch: string[]): { optionen: string[]; richtig: number } {
  const optionen = [richtig, ...falsch].sort(() => Math.random() - 0.5);
  return { optionen, richtig: optionen.indexOf(richtig) };
}

const NAMES = ["Mia", "Jan", "Ben", "Leo", "Emma", "Noah", "Lina", "Finn", "Sara", "Tim"];
const CHAT_VERBEN = ["sagte", "meinte", "schrieb", "fragte"];
const CHAT_INHALT = ["du bist cool", "ich schaff das nicht", "das war krass", "morgen geht nicht", "ich bin der Beste", "komm in den Stream"];
const EINSCHUEBE = ["finde ich", "meiner Meinung nach", "ehrlich gesagt", "glaube ich"];
const KONTEXT = ["Pack-Opening", "Challenge", "Stream", "Chat", "Podcast", "Kommentar"];

// ── Kommasetzung (Thema 13) ──
function kommaIndirekt(): Task {
  const subj = pick(["Er", "Sie", "Jemand", "Ein User"]);
  const verb = pick(CHAT_VERBEN);
  const inh = pick(CHAT_INHALT);
  const falsch = `${subj} ${verb} ${inh}.`;
  const richtig = `${subj} ${verb}, ${inh}.`;
  const { optionen, richtig: idx } = shuffleOptions(richtig, [`${subj}, ${verb} ${inh}.`, `${subj} ${verb} ${inh},.`, falsch]);
  return { id: uid(), thema_id: 13, typ: "mc", szenario: `Im ${pick(KONTEXT)}: ${falsch}`, frage: `Wo gehört das Komma hin?`, optionen, richtig: idx, loesung: `Richtig: „${richtig}" — das Komma trennt Begleitsatz und das Gesagte.` };
}
function kommaAufzaehlung(): Task {
  const [a, b, c] = sample(NAMES, 3);
  const richtig = `${a}, ${b} und ${c} starten die Runde.`;
  const { optionen, richtig: idx } = shuffleOptions(richtig, [`${a} ${b} und ${c} starten die Runde.`, `${a} ${b}, und ${c} starten die Runde.`, "Kein Komma nötig."]);
  return { id: uid(), thema_id: 13, typ: "mc", szenario: `Video-Titel: ${a} ${b} und ${c} …`, frage: `Welche Schreibweise ist bei der Aufzählung richtig?`, optionen, richtig: idx, loesung: `„${richtig}" — zwischen Aufzählungsgliedern steht ein Komma, vor „und" nicht.` };
}
function kommaEinschub(): Task {
  const e = pick(EINSCHUEBE);
  const kern = pick(["wichtig", "langweilig", "fair", "schwer", "cool"]);
  const richtig = `Das ist, ${e}, ${kern}.`;
  const { optionen, richtig: idx } = shuffleOptions(richtig, [`Das ist ${e} ${kern}.`, `Das ist ${e}, ${kern}.`, `Das, ist ${e} ${kern}.`]);
  return { id: uid(), thema_id: 13, typ: "mc", szenario: `Im Podcast: „Das ist ${e} ${kern}."`, frage: `Wie wird der Einschub „${e}" richtig eingerahmt?`, optionen, richtig: idx, loesung: `„${richtig}" — ein Einschub wird von zwei Kommas eingeschlossen.` };
}

// ── Brüche (Thema 2) ──
function bruchFehlt(): Task {
  const teile = pick([3, 4, 5, 6]);
  const fertig = rint(1, teile - 1);
  const fehlt = teile - fertig;
  const { optionen, richtig: idx } = shuffleOptions(`${fehlt}/${teile}`, [`${fertig}/${teile}`, `1/${teile}`, `${teile}/${teile}`]);
  return { id: uid(), thema_id: 2, typ: "mc", szenario: `Projekt zu ${fertig}/${teile} fertig.`, frage: `${fertig} von ${teile} Teilen sind fertig — welcher Anteil fehlt?`, optionen, richtig: idx, loesung: `Es fehlen ${fehlt}/${teile}.` };
}
function bruchKuerzen(): Task {
  const base = pick([[1, 2], [1, 4], [3, 4], [1, 3], [2, 3], [1, 5]]);
  const g = pick([2, 3, 4, 5]);
  const z = base[0] * g, n = base[1] * g;
  const gek = `${base[0]}/${base[1]}`;
  const { optionen, richtig: idx } = shuffleOptions(gek, [`${z}/${n}`, `${base[0]}/${n}`, `${z}/${base[1]}`]);
  return { id: uid(), thema_id: 2, typ: "mc", szenario: `Timer: ${z} von ${n}.`, frage: `Kürze den Bruch ${z}/${n} so weit wie möglich.`, optionen, richtig: idx, loesung: `${z}/${n} = ${gek} (beide durch ${gcd(z, n)} geteilt).` };
}

// ── Prozent (Thema 5) ──
function prozent(): Task {
  const [z, n] = pick([[1, 4], [1, 2], [3, 4], [1, 5], [2, 5], [1, 10]]);
  const pct = Math.round((100 * z) / n);
  return { id: uid(), thema_id: 5, typ: "zahl", szenario: `Fortschritt: ${z} von ${n} geschafft.`, frage: `Wie viel Prozent sind ${z}/${n}? (nur Zahl)`, richtig: pct, toleranz: 0, loesung: `${z}/${n} = ${pct} %.` };
}

// ── Wahrscheinlichkeit (Thema 12) ──
function wktJaNein(): Task {
  const n = pick([10, 20, 50, 100]);
  return { id: uid(), thema_id: 12, typ: "janein", szenario: `Seltenes Item: Chance 1 zu ${n}.`, frage: `Bekommst du das Item garantiert, wenn du genau ${n}-mal öffnest?`, richtig: false, loesung: `Nein — jeder Versuch ist Zufall; ${n}× öffnen garantiert nichts.` };
}
function wktProzent(): Task {
  const n = pick([20, 25, 50, 100]);
  const pct = Math.round(100 / n);
  return { id: uid(), thema_id: 12, typ: "zahl", szenario: `Drop-Chance: 1 von ${n}.`, frage: `1/${n} als Prozent? (nur Zahl, gerundet)`, richtig: pct, toleranz: 1, loesung: `1/${n} ≈ ${pct} %.` };
}

const GENERATOREN: Record<number, (() => Task)[]> = {
  13: [kommaIndirekt, kommaAufzaehlung, kommaEinschub],
  2: [bruchFehlt, bruchKuerzen],
  5: [prozent],
  12: [wktJaNein, wktProzent],
};

/** Gibt es für dieses Thema generierbare interaktive Aufgaben? */
export function hatAufgaben(themaId: number): boolean {
  return themaId in GENERATOREN;
}

/** Eine zufällige Aufgabe zum Thema; null, wenn kein Generator existiert. */
export function generiere(themaId: number): Task | null {
  const pool = GENERATOREN[themaId];
  if (!pool) return null;
  return pick(pool)();
}
