// Datenmodell — Spiegel von lernassistant/SCHEMA.md

export type QuelleKey = "youtube" | "podcast" | "news" | string;

export interface Bubble {
  id: string;
  name: string;
  alter: string;
  stufe_label: string;
  sprachniveau: string;
  konsum_default: string[];
  faecher: string[];
}

export interface FachConfig {
  seed: string;
  demo_thema_id?: number;
  emoji: string;
}

export interface BubblesConfig {
  bubbles: Bubble[];
  faecher_config: Record<string, FachConfig>;
}

export interface Thema {
  id: number;
  thema: string;
  kernkonzept: string;
  trend_hook?: string;
  eltern_klartext?: string;
  material?: Material;
}

export interface Seed {
  fach: string;
  stufe: string;
  bundesland: string;
  themen: Thema[];
}

export interface MaterialPhase {
  phase: string;
  dauer_min?: number;
  beschreibung: string;
}

export interface Material {
  titel: string;
  lernziel?: string;
  dauer_min?: number;
  ablauf?: MaterialPhase[];
  arbeitsblatt?: { aufgaben?: string[]; loesungen?: string[] };
  differenzierung?: { leichter?: string; schwerer?: string };
}

export interface Eltern {
  schulbezug?: string;
  gespraechsanlass?: string;
  tipp?: string;
  safety?: string | null;
}

export interface Match {
  thema_id: number;
  bubble_id: string;
  fach?: string;
  szenario: string;
  quelle?: QuelleKey;
  datum?: string;
  video_id?: string;
  begruendung?: string;
  einstiegsfrage?: string;
  unterrichtsidee?: string;
  material?: Material;
  schueler_hook?: string;
  schueler_challenge?: string;
  eltern?: Eltern;
}

/** Ein Fach innerhalb einer Bubble: Seed-Themen + zugehörige Matches. */
export interface FachBundle {
  fach: string;
  emoji: string;
  demoThemaId?: number;
  themen: Thema[];
  matches: Match[];
  isSample: boolean;
}

/** Alles, was eine Zielgruppen-Ansicht braucht — serialisierbar für Client-Komponenten. */
export interface AppData {
  bubbles: Bubble[];
  /** bubbleId -> fachKey -> Bundle */
  byBubble: Record<string, Record<string, FachBundle>>;
}
