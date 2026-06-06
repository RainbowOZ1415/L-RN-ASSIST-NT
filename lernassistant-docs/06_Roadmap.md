# Lernassistant — Produkt-Roadmap

**Stand:** Juni 2026 · Hackathon-Tag  
**Kern:** Bubble (Altersgruppe) + Szenario-Impulse aus YouTube/Podcasts/News — ohne Creator-Namen. Login personalisiert spaeter.

---

## Vision

> Aus **Medienkonsum** (YouTube allgemein, Podcasts, News) passend zur **Bubble** Situationen extrahieren, mit **Lehrplan** matchen, **Szenarien + Einstiegsfragen** liefern.

**Beispiel:** *Jemand schrieb im Chat: 'Er sagte du bist cool.' Wo ist der Fehler bei der woertlichen Rede?*

| Lehrkraft | Schueler |
|---|---|
| Fertige Einstiegsfrage + Unterrichtsidee | Hook + Challenge ohne YouTuber-Namen |
| Passt/Verwerfen | Bezug: das kennst du — das ist auch Schulstoff |

---

## Ist-Stand (Phase 0 — Hackathon)

| Feature | Status |
|---|---|
| Bubble-System (4 Altersgruppen) | Done — `bubbles.json` |
| 4 Tabs: Lehrkraft, Schueler, Muster, Konsum | Done |
| Szenario-Impulse ohne Creator | Done |
| Deutsch Kommasetzung + Mathe Brueche | Done |
| Bubble-Samples 4–5 und 10+ | Done — `data/bubbles/` |
| Login-Demo-Toggle | Done |
| Pipeline extract/match bubble-aware | Done |
| YouTube Live-Pipeline | Braucht `.env` Keys |
| Echter YouTube OAuth | Phase 2 |

---

## Phase 1 — Stabilisieren (Woche 1–2)

- Git + Partner-Collaboration
- YouTube-Pipeline regelmaessig laufen lassen, JSON cachen
- Seeds pro Bubble verfeinern
- Podcast-RSS (Checkpod, Komm call)
- News-Ingest (logo!)
- Konsum-Tab → echte Pipeline

## Phase 2 — Personalisierung (Woche 3–6)

- YouTube OAuth Login
- Personalisierter Feed innerhalb Bubble
- `inspire.py` separater Generator
- Content-Safety
- Feedback speichern (Passt/Verwerfen)

## Phase 3 — Schule (Monat 2–4)

- Pilot-Klasse
- Mehr Faecher, Bundesland-Seeds
- Messung Engagement

## Phase 4 — Vision

- TikTok/Instagram, Community, LMS

---

## Design-Prinzipien

1. **Bubble first** — Altersgruppe, nicht einzelne Kanäle
2. **Szenario, nicht Creator**
3. **Mensch im Loop**
4. **Sample-Fallback immer verfuegbar**
5. **Login = Personalisierung innerhalb Bubble**

---

## YouTube-Pipeline (heute)

```bash
cd lernassistant
cp .env.example .env   # YOUTUBE_API_KEY + ANTHROPIC_API_KEY
python ingest_youtube.py
python extract.py
BUBBLE_ID=klasse_6 SEED_FILE=seed_deutsch.json MATCHES_OUT=data/matches_deutsch.json python match.py
BUBBLE_ID=klasse_6 SEED_FILE=seed_mathe.json MATCHES_OUT=data/matches_mathe.json python match.py
streamlit run app.py
```
