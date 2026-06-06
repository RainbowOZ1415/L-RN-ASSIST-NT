# Manuelle Pipeline mit Claude Max (ohne API-Key)

Kein `ANTHROPIC_API_KEY` nötig — Prompts in claude.ai, JSON zurück ins Projekt.

## Reihenfolge

| Schritt | Prompt-Datei | Ergebnis speichern als |
|---|---|---|
| 1 Extract | `prompts/01-EXTRACT-CLAUDE.md` | `data/extracted.json` |
| 2 Match DE | `prompts/02-MATCH-CLAUDE.md` (Abschnitt 2a) | `data/matches_deutsch.json` |
| 3 Match MA | `prompts/02-MATCH-CLAUDE.md` (Abschnitt 2b) | `data/matches_mathe.json` |
| 4 Demo | — | `streamlit run app.py` |

## Tipps

- **Ein Chat pro Schritt** — Extract einmal, dann Match DE, dann Match MA
- Bei Extract: Demo-Videos sind schon im Prompt — oder `transcripts.json` einfügen
- Bei Match: **dieselbe** `extracted.json` in beide Prompts kopieren
- Claude manchmal zu Markdown — nur reines JSON in die Dateien

## Optional: YouTube vorher

Mit `YOUTUBE_API_KEY`:
```bash
python3 ingest_youtube.py
```
Dann Inhalt von `data/transcripts.json` in Schritt 1 statt Demo-Eingabe.
