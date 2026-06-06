# Starter-Kit „Lernassistant" — Inhalt & Nutzung

**Quelle:** Code-Ordner `../lernassistant/` (im Projektordner Lernassistant).

## Sofort starten (OHNE API-Keys — demo-safe Fallback)
```bash
pip install -r requirements.txt
streamlit run app.py
```
Läuft direkt mit Sample-Daten → garantiert funktionierende Demo am Hackathon, auch ohne Keys/Netz.

## Echter Lauf
```bash
cp .env.example .env      # ANTHROPIC_API_KEY + YOUTUBE_API_KEY
python ingest_youtube.py  # Trending DE + Transkripte -> data/transcripts.json
python ingest_podcasts.py # RSS-Feeds (Sohn trägt ein) -> hängt an
python extract.py         # Themen je Inhalt (Claude) -> data/extracted.json
python match.py           # Matching gg. seed.json -> data/matches.json
streamlit run app.py
```

## Dateien
| Datei | Zweck |
|---|---|
| `app.py` | Streamlit, **2 Views** (Lehrkraft / Reverse) + **Klassen-Input-Formular** |
| `seed.json` | 25 Lehrplan-Themen (Bio 9/10) mit Trend-Hooks — **Fach hier tauschen** |
| `ingest_youtube.py` | Trending DE (YouTube Data API) + Transkripte cachen |
| `ingest_podcasts.py` | Podcast-RSS → Episoden |
| `extract.py` | Claude: Transkript → Themen/Entitäten |
| `match.py` | Claude: Inhalt × Seed → Treffer + Begründung + Einstiegsfrage |
| `data/*.sample.json` | Beispiel-Daten, damit die App offline läuft |
| `README.md` | Setup + Stunden-Plan-Checkliste + Rollen |

## Bewusste Design-Entscheidungen
- **Kein Vektor-DB/RAG** — bei 30×25 reicht direktes LLM-Matching (spart Stunden).
- **Sample-Daten mitgeliefert** — die Demo kann nie „live failen".
- **Lehrkraft-Bestätigt-Toggle** — macht KI-Unsicherheit zur Stärke (Mensch im Loop).
- **Klassen-Input** umgesetzt — erfüllt dein „beides kombinieren" (Trending + Klasse).

## Vorabend-To-Do (wichtig!)
`ingest_*` laufen lassen und `data/*.json` **committen** → am Hackathon kein API-Risiko im kritischen Pfad.
