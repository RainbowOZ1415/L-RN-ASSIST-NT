// Hinweis: Nur aus Server Components importieren (nutzt node:fs).
import fs from "node:fs";
import path from "node:path";
import type {
  AppData,
  Bubble,
  BubblesConfig,
  FachBundle,
  Match,
  Seed,
} from "./types";

// Eine Quelle der Wahrheit: die JSON-Daten der bestehenden Pipeline.
// Überschreibbar via LERNASSISTANT_DATA_DIR (z.B. für Deployment).
const DATA_DIR =
  process.env.LERNASSISTANT_DATA_DIR ??
  path.resolve(process.cwd(), "..", "lernassistant");

function readJson<T>(relPath: string): T {
  const full = path.join(DATA_DIR, relPath);
  return JSON.parse(fs.readFileSync(full, "utf-8")) as T;
}

function fileExists(relPath: string): boolean {
  return fs.existsSync(path.join(DATA_DIR, relPath));
}

export function getBubblesConfig(): BubblesConfig {
  return readJson<BubblesConfig>("bubbles.json");
}

export function getSeed(seedFile: string): Seed {
  return readJson<Seed>(seedFile);
}

/** Spiegelt die Dateiauflösung aus app.py (load_matches). */
function loadMatches(
  bubbleId: string,
  fachKey: string,
): { matches: Match[]; isSample: boolean } {
  const slug = fachKey.toLowerCase();
  const candidates = [
    `data/bubbles/${bubbleId}/matches_${slug}.json`,
    `data/bubbles/${bubbleId}/matches_${slug}.sample.json`,
    `data/matches_${slug}.json`,
    `data/matches_${slug}.sample.json`,
  ];
  for (const rel of candidates) {
    if (fileExists(rel)) {
      return { matches: readJson<Match[]>(rel), isSample: rel.includes("sample") };
    }
  }
  return { matches: [], isSample: true };
}

/** filter_matches aus app.py: bubble-eigene + "*"; sonst Fallback auf alle. */
function filterMatches(matches: Match[], bubbleId: string): Match[] {
  const out = matches.filter(
    (m) => !m.bubble_id || m.bubble_id === bubbleId || m.bubble_id === "*",
  );
  return out.length ? out : matches;
}

export function getFachBundle(bubble: Bubble, fachKey: string): FachBundle {
  const cfg = getBubblesConfig().faecher_config[fachKey];
  const seed = getSeed(cfg.seed);
  const { matches, isSample } = loadMatches(bubble.id, fachKey);
  return {
    fach: seed.fach,
    emoji: cfg.emoji,
    demoThemaId: cfg.demo_thema_id,
    themen: seed.themen,
    matches: filterMatches(matches, bubble.id),
    isSample,
  };
}

/** Komplettes, serialisierbares Daten-Bundle für die Zielgruppen-Ansichten. */
export function getAppData(): AppData {
  const { bubbles, faecher_config } = getBubblesConfig();
  const byBubble: AppData["byBubble"] = {};
  for (const bubble of bubbles) {
    byBubble[bubble.id] = {};
    const faecher = bubble.faecher?.length ? bubble.faecher : Object.keys(faecher_config);
    for (const fachKey of faecher) {
      if (!faecher_config[fachKey]) continue;
      byBubble[bubble.id][fachKey] = getFachBundle(bubble, fachKey);
    }
  }
  return { bubbles, byBubble };
}
