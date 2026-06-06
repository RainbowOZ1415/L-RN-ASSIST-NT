# Lernassistant — Hackathon

**Repo:** https://github.com/RainbowOZ1415/L-RN-ASSIST-NT.git  
**Fach:** Deutsch + Mathe · **Bubbles:** Klasse 4–5 bis 10+

## Sofort starten (ohne Keys)

```bash
cd lernassistant
pip install -r requirements.txt
streamlit run app.py
```

4 Tabs + Bubble-Sidebar — läuft mit Sample-Daten offline.

## YouTube — ohne Login (öffentliche Inhalte)

**Kein YouTube-Account nötig.** Öffentliche Videos + Transkripte:

| Schritt | Braucht |
|---|---|
| `ingest_youtube.py` | `YOUTUBE_API_KEY` (Google Cloud, gratis) |
| Transkripte | automatisch via `youtube-transcript-api` |
| `extract.py` + `match.py` | `ANTHROPIC_API_KEY` |

```bash
cp .env.example .env
python ingest_youtube.py
python extract.py
BUBBLE_ID=klasse_6 SEED_FILE=seed_deutsch.json MATCHES_OUT=data/matches_deutsch.json python match.py
BUBBLE_ID=klasse_6 SEED_FILE=seed_mathe.json MATCHES_OUT=data/matches_mathe.json python match.py
streamlit run app.py
```

**Sidebar „Login"-Toggle** = später persönlicher Feed. **Nicht** nötig für YouTube-Ingest heute.

## Git (schon verbunden)

```bash
git pull origin main
git push origin main
```

Partner cloned dasselbe Repo und arbeitet parallel.

## Partner-Aufgaben

1. Pitch üben → `PITCH.md`
2. Demo: Bubble wechseln, Kommasetzung, Brüche
3. Konsum-Tab: Kategorie live hinzufügen

## Roadmap

`../lernassistant-docs/06_Roadmap.md`
