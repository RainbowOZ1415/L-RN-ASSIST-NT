"use client";

const VOL: Record<string, number> = { click: 0.22, entry: 0.25, delete: 0.23, swipe: 0.18 };

/** Kurzer UI-Sound (aus web/public/sounds). Bewusst fehlertolerant. */
export function playSound(name: "click" | "entry" | "delete" | "swipe") {
  try {
    const a = new Audio(`/sounds/${name}.wav`);
    a.volume = VOL[name] ?? 0.2;
    void a.play().catch(() => {});
  } catch {
    /* Autoplay/Audio nicht verfügbar — ignorieren */
  }
}
