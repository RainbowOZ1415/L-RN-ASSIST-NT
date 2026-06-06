# Lernassistant — Hackathon Starter Kit

Aus dem Medienkonsum von Jugendlichen (YouTube-Trending + Podcasts + Klassen-Input)
automatisch erkennen, welche aktuellen Themen interessieren, und **rückwärts auf den
Lehrplan** mappen. Lehrkräfte bekommen aktuelle Aufhänger für Pflicht-Themen.

> Plan & Konzept: Paperclip-Issue AUTP-98 (Docs `plan`, `recherche`, `lehrplan-seed`).

## Sofort starten (demo-safe, OHNE API-Keys)
```bash
pip install -r requirements.txt
streamlit run app.py
```
Die App läuft direkt mit den mitgelieferten **Sample-Daten** (`data/transcripts.sample.json`,
`data/matches.sample.json`). So habt ihr am Hackathon einen garantiert funktionierenden Fallback.

## Echter Lauf (mit Daten)
```bash
cp .env.example .env          # ANTHROPIC_API_KEY + YOUTUBE_API_KEY eintragen
python ingest_youtube.py      # Trending DE + Transkripte -> data/transcripts.json
python ingest_podcasts.py     # 3 RSS-Feeds -> hängt Episoden an transcripts.json
python extract.py             # Themen je Video/Folge (Claude) -> data/extracted.json
python match.py               # Matching gg. seed.json (Claude) -> data/matches.json
streamlit run app.py          # nutzt jetzt die echten Daten
```

## Stunden-Plan (1 Tag, ~8h)
- [ ] **Vorabend:** `seed.json` final · Sohn wählt 30 Videos + 3 Podcasts · `ingest_*` laufen lassen + Daten committen (CACHEN!)
- [ ] 0:00–0:30 Setup, Keys, Rollen
- [ ] 0:30–2:00 `extract.py` zum Laufen bringen (Prompt-Tuning)
- [ ] 2:00–3:30 `match.py` (Treffer + Begründung + Einstiegsfrage)
- [ ] 3:30–5:00 View 1 (Lehrkraft) polieren
- [ ] 5:00–6:00 View 2 (Reverse) + Klassen-Input
- [ ] 6:00–7:00 „Bestätigt/Verwirft"-Toggle, Edge-Cases
- [ ] 7:00–8:00 Pitch 2× durchspielen

## Rollen
- **Sohn:** Vorabend-Kanal-/Podcast-Auswahl · View-Texte · Klassen-Input-Beispiele · **Pitch**
- **Martin:** `extract.py` · `match.py` · Keys · Streamlit-Gerüst

## Fach tauschen
`seed.json` ersetzen (gleiches Schema) — Rest bleibt fachunabhängig.
