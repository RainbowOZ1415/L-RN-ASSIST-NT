# Datenmodell — Lernassistant

**Stand:** 2026-06-06 · Maßgebliches Schema für Seeds & Matches.
**Prinzip:** Drei Zielgruppen (Lehrkraft, Schüler, Eltern) über *eine* Datenbasis. Volle Liefer-Tiefe (Impuls → fertiges Material), alles gratis. Erweiterungen sind **additiv & rückwärtskompatibel** — bestehende flache Felder bleiben erhalten, `app.py` bricht nicht.

---

## 1. `bubbles.json` — Altersgruppen + Fächer-Konfig

```jsonc
{
  "bubbles": [
    {
      "id": "klasse_6",                 // stabiler Schlüssel
      "name": "Klasse 6",
      "alter": "11–12",
      "stufe_label": "Sek I",
      "sprachniveau": "klar, altersgerecht",
      "konsum_default": ["YouTube-Videos", "Live-Streams", "..."],
      "faecher": ["Deutsch", "Mathe"]
    }
  ],
  "faecher_config": {
    "Deutsch": { "seed": "seed_deutsch.json", "demo_thema_id": 13, "emoji": "📗" }
  }
}
```

## 2. Seed (`seed_<fach>.json`) — Lehrplan-Themenliste

```jsonc
{
  "fach": "Deutsch",
  "stufe": "Sek I (Bubble-abhängig)",
  "bundesland": "generisch (anpassbar)",
  "themen": [
    {
      "id": 13,                          // stabile thema_id, von Matches referenziert
      "thema": "Kommasetzung",
      "kernkonzept": "Haupt-/Nebensätze, Aufzählungen, Einschübe",   // Lehrkraft-fachlich
      "trend_hook": "Video-Titel, Chat, Podcast-Dialoge",            // wo es im Konsum auftaucht
      "eltern_klartext": "Wo im Alltagstext (Chat, Titel) Kommas hingehören."  // NEU: Eltern-Sprache, Fallback
    }
  ]
}
```

## 3. Match-Record (`matches_<fach>.json` / `.sample.json`) — EIN Impuls

Liste von Records. Felder gruppiert nach: **gemeinsam · Lehrkraft · Schüler · Eltern**.

```jsonc
{
  // ── gemeinsam ──
  "thema_id": 13,                  // -> seed.themen[].id  (Pflicht)
  "bubble_id": "klasse_6",         // -> bubbles[].id; "*" = alle  (Pflicht)
  "fach": "Deutsch",               // optional, sonst aus Dateipfad
  "szenario": "Im Live-Chat: 'Er sagte ich bin der Beste.'",  // Situation OHNE Creator-Namen (Pflicht)
  "quelle": "youtube",             // youtube | podcast | news
  "datum": "2026-06",
  "video_id": "yt1",               // interne Referenz auf Quell-Item

  // ── Lehrkraft ──
  "begruendung": "...",            // 1–2 Sätze: warum passt der Impuls zum Thema
  "einstiegsfrage": "...",         // 1 konkrete Frage für den Stundeneinstieg
  "unterrichtsidee": "...",        // KURZ: 1 Aktivität (10–20 Min) — Schnellansicht
  "material": {                    // NEU, optional: volle Tiefe (gratis), fertige Stunde
    "titel": "Kommas in der wörtlichen Rede",
    "lernziel": "Die Lernenden setzen Kommas bei Redewiedergabe korrekt.",
    "dauer_min": 45,
    "ablauf": [                    // Stundenphasen
      { "phase": "Einstieg",     "dauer_min": 5,  "beschreibung": "Chat-Satz an die Tafel, Fehler suchen." },
      { "phase": "Erarbeitung",  "dauer_min": 20, "beschreibung": "Regel ableiten, Beispiele sammeln." },
      { "phase": "Sicherung",    "dauer_min": 15, "beschreibung": "Arbeitsblatt in Partnerarbeit." },
      { "phase": "Transfer",     "dauer_min": 5,  "beschreibung": "Eigene Chat-Sätze korrigieren." }
    ],
    "arbeitsblatt": {              // ausdruckbares Material
      "aufgaben":  ["Setze die Kommas: Er sagte du bist cool.", "..."],
      "loesungen": ["Er sagte, du bist cool.", "..."]
    },
    "differenzierung": { "leichter": "...", "schwerer": "..." }
  },

  // ── Schüler ──
  "schueler_hook": "...",          // 1 Satz Du-Form: Bezug zum Alltag
  "schueler_challenge": "...",     // 1 kurze Aufgabe

  // ── Eltern ── (NEU)
  "eltern": {
    "schulbezug": "...",           // Klartext: welcher Schulstoff steckt hier drin
    "gespraechsanlass": "...",     // 1 Frage, die Eltern dem Kind stellen können
    "tipp": "...",                 // optional: unterstützender Hinweis
    "safety": null                 // optional: Content-Safety-Hinweis (parinhood-Stil), sonst null
  }
}
```

### Konventionen
- **Keine Creator-/Kanalnamen** in irgendeinem Output-Feld. Nur generische Szenarien.
- `material`, `eltern` sind **optional** — fehlen sie, zeigt die UI Impuls bzw. Seed-Fallback (`eltern_klartext`).
- Sprachniveau jedes Felds richtet sich nach `bubbles[].sprachniveau`.
- `thema_id` + `bubble_id` müssen auf vorhandene Seed-/Bubble-Einträge zeigen.

### Dateiauflösung (siehe `app.load_matches`)
Reihenfolge: `data/bubbles/<bubble>/matches_<fach>.json` → `…sample.json` → `data/matches_<fach>.json` → `…sample.json`.
`<fach>` = Fach-Schlüssel kleingeschrieben (`deutsch`, `mathe`).
