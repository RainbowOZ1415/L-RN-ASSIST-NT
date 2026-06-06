# Build-Plan — 1-Tages-Hackathon: „Lernassistant"

**Für:** Martin + Sohn · AUTP-98 · Basiert auf deinen Antworten: **Zeit = 1 Tag** · **Signal = Trending + Klassen-Input kombiniert** · **Fach = „Anderes" (noch zu bestätigen)**

> Konzept-Hintergrund: siehe [Recherche-Doc](/AUTP/issues/AUTP-98#document-recherche). Lehrplan-Themenliste: siehe [Seed-Doc](/AUTP/issues/AUTP-98#document-lehrplan-seed).

## Leitprinzip für EINEN Tag: „Demo-safe, nicht skalierbar"

An einem Tag gewinnt nicht das robusteste System, sondern die klarste Demo. Deshalb:
- **Daten am Vorabend stagen** (Transkripte ziehen + als JSON cachen). Am Hackathon-Tag **kein Live-API-Risiko** im kritischen Pfad.
- Der Tag gehört **Matching + zwei Views + Pitch**.
- Scope hart begrenzt: **1 Fach, 1 Stufe, ~25 Lehrplan-Themen, ~30 vorgefetchte Videos/Folgen.**

## Architektur (minimal)

```
[Trend-Quelle: YouTube mostPopular DE + 3 Podcast-RSS + Klassen-Input]
        ↓ (Vorabend, gecacht)
[Transkripte als JSON]  →  [Themen-Extraktion: Claude]  →  [Matching gg. Seed: Claude (+ optional Embeddings)]
        ↓
[matches.json]  →  [UI: 2 Views in Streamlit]
```

Für **30 Videos × 25 Themen** reicht **direktes LLM-Matching** — keine Vektor-DB, kein RAG nötig. Das spart Stunden.

## Tech-Stack (was an 1 Tag trägt)

| Schicht | Wahl | Warum |
|---|---|---|
| Trend-Pull | YouTube Data API v3 (`videos?chart=mostPopular&regionCode=DE`) + 3 Podcast-RSS | offiziell, gratis-Quota reicht |
| Transkripte | `youtube-transcript-api` (gratis) · Podcasts: Whisper lokal **oder** Show-Notes als Shortcut | kein Scraper-Stress |
| Klassen-Input | Streamlit-Formular: Schüler tippen 1–3 Lieblings-Kanäle/Videos | erfüllt „beides kombinieren" |
| LLM | Claude API — Themen-Extraktion + Matching-Begründung + Einstiegsfrage | ein Modell, ein Prompt-Stil |
| UI | **Streamlit** | schnellste 2-View-UI an einem Tag, kein Frontend-Framework |
| Daten | JSON-Files im Repo (transcripts.json, seed.json, matches.json) | keine DB nötig |

## Stunden-Plan (~8 h)

- **Vor-Abend (1–2 h, dringend empfohlen):** Seed final machen · Sohn wählt 30 Videos + 3 Podcastfolgen („was schaut ihr wirklich") · Transkripte ziehen + cachen.
- **0:00–0:30** Setup: Repo, API-Keys, Rollen, Streamlit-Hello-World.
- **0:30–2:00** `extract.py`: Transkript → `{themen[], entitäten[], niveau}` per Claude, Batch über alle gecachten Transkripte.
- **2:00–3:30** `match.py`: extrahierte Themen × Seed → Treffer + 2-Satz-Begründung + Einstiegsfrage → `matches.json`.
- **3:30–5:00** **View 1 (Lehrkraft):** Lehrplan-Thema wählen → passende aktuelle Videos/Folgen + fertige Einstiegsfrage.
- **5:00–6:00** **View 2 (Reverse):** Trend-Thema → gedeckte Lehrplan-Punkte. + Klassen-Input-Formular.
- **6:00–7:00** Polieren: „Lehrkraft bestätigt/verwirft"-Toggle (macht KI-Schwäche zur Stärke), Edge-Cases.
- **7:00–8:00** Pitch bauen + 2× durchspielen.

## Rollen (Vater / Sohn)

- **Sohn (sichtbar, motivierend):** Vorabend-Kanal-/Podcast-Auswahl · View-Texte & Design · Klassen-Input-Beispiele · **Pitch-Vortrag**.
- **Martin (Plumbing):** `extract.py` · `match.py` · API-Keys · Streamlit-Gerüst.
- **Gemeinsam:** Claude-Prompt-Tuning · Demo-Story.

## Demo-Story (was die Jury sieht — 90 Sek)

1. „Das schauen Jugendliche gerade" — 3 echte Trend-Videos/Podcasts + **1 vom Sohn live eingegeben** (zeigt das Kombi-Signal).
2. Klick → „Diese decken Lehrplan-Thema **X**, **Y** ab."
3. Wechsel Lehrkraft-View → „Zu deinem Pflicht-Thema **‚Immunsystem'** passen DIESE 2 aktuellen Videos + fertige Einstiegsfrage."
4. Pointe: **„Aus Konsum wird die Neugier-Brücke zum Lehrplan."**

## Bewusst draußen (Post-Hackathon)

Mehrere Fächer/Länder · Live-Crawl · Accounts · Content-Safety-Pipeline · echte Vektor-DB · Lehrkraft-Backend/Persistenz.

## Risiken & Mitigation

| Risiko | Mitigation |
|---|---|
| API-Quota/Ausfall am Tag | **Alles vorab cachen** — Live-Pull nur für den einen Sohn-Demo-Input |
| Matching-Qualität schwankt | 30 kuratierte Videos mit sicheren Treffern · **Lehrkraft-Review-Toggle** macht Schwäche zur Stärke |
| Zeit läuft weg | Streamlit statt eigenem Frontend · direktes LLM-Matching statt Vektor-DB |
| Fach noch offen | Seed in ~5 Min tauschbar (siehe Seed-Doc) |

## Offen / zu bestätigen (von dir)

1. **Fach + Stufe + Bundesland** — du hast „Anderes" ohne Angabe gewählt. **Default-Seed = Biologie Klasse 9/10 (NRW-nah).** Bitte bestätigen oder Fach nennen, dann tausche ich den Seed.
2. **Hackathon-Datum / Ort / Jury-Kriterien** — skaliert Pitch & Prioritäten.
3. **Klassen-Input live oder vorbereitet** in der Demo? (Empfehlung: 1 live + 2 vorbereitet.)
