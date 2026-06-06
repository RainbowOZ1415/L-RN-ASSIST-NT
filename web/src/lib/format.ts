// Kleine, client-sichere Helfer (keine Server-Abhängigkeiten).

export const QUELLE_LABEL: Record<string, string> = {
  youtube: "YouTube / Stream",
  podcast: "Podcast",
  news: "News",
};

export function quelleLabel(q?: string): string {
  if (!q) return "";
  return QUELLE_LABEL[q] ?? q;
}

export function szenarioText(m: { szenario?: string }): string {
  return m.szenario ?? "";
}
