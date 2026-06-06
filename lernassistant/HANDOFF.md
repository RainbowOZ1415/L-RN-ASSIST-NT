# Lernassistant — Hackathon HEUTE

**Fach:** Deutsch + Mathe · **Klasse 6** · **Quellen:** YouTube, Podcasts, News

## Sofort starten (ohne Keys)

```bash
cd lernassistant
pip install -r requirements.txt
streamlit run app.py
```

4 Tabs: **Lehrkraft** · **Schüler** · **Trends** · **Klassen-Input** — läuft mit Sample-Daten offline.

## Deine Aufgaben (Partner)

1. **Echte Kanäle** in `data/matches_deutsch.sample.json` und `matches_mathe.sample.json` eintragen
2. **Podcast-Feeds** in `ingest_podcasts.py` → `FEEDS`
3. **Pitch üben** → `PITCH.md` (90 Sek)
4. **Klassen-Input live** in der Demo — 1 Kanal live hinzufügen
5. Optional: **ElevenLabs** 🔊 neben Einstiegsfrage in `app.py`

## Stundenplan

Siehe **`HACKATHON-SPRINT.md`** — 6-Stunden-Plan mit Checkliste.

## Git (parallel arbeiten)

```bash
git pull origin main
# ändern ...
git add lernassistant/
git commit -m "Deine Änderung"
git push origin main
```

Falls `git` xcrun-Fehler: `xcode-select --install`

## Echte Daten (wenn API-Keys da)

```bash
cp .env.example .env
python ingest_youtube.py    # oder kuratierte Liste statt Trending
python ingest_podcasts.py
python ingest_news.py
python extract.py           # SEED_FILE=seed_deutsch.json für Deutsch
python match.py
streamlit run app.py
```

## Roadmap (nach dem Hackathon)

`../lernassistant-docs/06_Roadmap.md`
