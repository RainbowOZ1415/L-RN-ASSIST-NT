// Kleine, client-sichere Helfer (keine Server-Abhängigkeiten).

export const QUELLE_LABEL: Record<string, string> = {
  youtube: "YouTube / Stream",
  podcast: "Podcast",
  news: "News",
  gaming: "Gaming",
  doku: "Doku",
  social: "Social Media",
  stream: "Live-Stream",
};

export const QUELLE_EMOJI: Record<string, string> = {
  youtube: "📺",
  podcast: "🎙️",
  news: "📰",
  gaming: "🎮",
  doku: "🎬",
  social: "📱",
  stream: "📺",
};

export function quelleLabel(q?: string): string {
  if (!q) return "";
  return QUELLE_LABEL[q] ?? q;
}

export function quelleEmoji(q?: string): string {
  if (!q) return "🌐";
  return QUELLE_EMOJI[q] ?? "🌐";
}

export function szenarioText(m: { szenario?: string }): string {
  return m.szenario ?? "";
}
