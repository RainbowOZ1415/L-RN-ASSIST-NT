# Recherche & Konzept — „Trending-Content → Lehrplan" (Hackathon-Idee)

**Für:** Martin + Sohn · **Status:** Recherche, zur gemeinsamen Entscheidung · AUTP-98

## 1. Die Idee in einem Satz

Ein Tool, das aus dem **Medien-Konsum von Jugendlichen** (YouTube, Podcasts, später TikTok) automatisch erkennt, *welche aktuellen Themen Schüler:innen gerade interessieren*, und das mit dem **Lehrplan** abgleicht — damit Lehrkräfte aktuelle, „angesagte" Inhalte als Einstieg in ihre Pflicht-Themen nutzen können. Neugier als Brücke zum Curriculum.

## 2. Was es schon gibt (und wo die Lücke ist)

| Lösung | Was es macht | Warum es NICHT die Idee ist |
|---|---|---|
| **EdGate ExACT**, **Instructure Elevate**, **1EdTech CASE** | Tagging von Verlags-Lerninhalten zu US-Standards (Common Core, NGSS). KI + Experten. | Richtung *Content → Standard*. Startet bei fertigem Lehrmaterial, nicht bei dem, was Kinder **freiwillig** konsumieren. US-fokussiert, B2B-teuer. |
| **mapEDU** | KI-Curriculum-Mapping, frisst auch Audio/Video, extrahiert Themen, mappt auf Lernziele in <1 Tag. | Healthcare/Hochschule. Mappt institutionelle Inhalte, keine Trend-Medien. |
| **Boclips** | Kuratierte Lern-Videos, standard-aligned, Bloom-Taxonomie. | Kuratierter Katalog, kein Trend-Signal. |
| **PBS NewsHour Classroom** | Tägliche Aktuelles-Stunden für Lehrkräfte. | **Manuell** redaktionell, nur News, USA. |

**→ Whitespace:** Niemand startet bei *„was schauen Jugendliche gerade wirklich"* und mappt das **rückwärts** auf Lehrplan-Themen, um der Lehrkraft einen aktuellen Aufhänger zu liefern. Genau das ist neu und gut für einen Hackathon — klein, demobar, mit echtem „Aha".

## 3. Die drei Bausteine, die man braucht

### A) Trend-/Content-Quelle (was interessiert die Kids?)
- **YouTube Data API v3** — offizielle API, `mostPopular`-Charts + Suche, Metadaten. Limit: 10.000 Quota-Einheiten/Tag (reicht für Demo). Transkripte gibt die offizielle API **nicht** her.
- **Transkripte:** `youtube-transcript-api` (Python, gratis), oder Dritt-APIs (Supadata, Apify) für Skalierung. Für Podcasts: **Whisper / whisperfile lokal** (open source, gratis) auf die Audio-Files aus dem **RSS-Feed** (Podcasts sind offene RSS). Podcast-Discovery via **Podcast Index API** oder Apple-Charts.
- **Wichtige Design-Entscheidung:** „Trending allgemein" ≠ „was DIESE Klasse schaut". Eleganteste, datenschutzfreundliche Variante: Schüler:innen tragen anonym ihre 3 Lieblings-Kanäle/Videos ein → kein Tracking, echtes Klassen-Signal.

### B) Themen-Extraktion + Matching (das KI-Herz)
- Transkript → **LLM (Claude)** extrahiert Themen, Entitäten, Konzepte je Video/Folge.
- Lehrplan-Themen + extrahierte Themen → **Embeddings** für Grob-Match, dann **LLM** für „passt das wirklich + warum + welcher Einstieg".
- Output pro Treffer: *Lehrplan-Thema ↔ aktuelles Video/Folge ↔ 2-Satz-Begründung + Einstiegs-Frage für den Unterricht.*

### C) Lehrplan-Daten (der schwierigste Teil — bitte lesen)
- **Es gibt KEINE maschinenlesbare Lehrplan-API in Deutschland.** Lehrpläne liegen als **PDF pro Bundesland** vor; KMK-Bildungsstandards ebenfalls PDF. (Bayern „LehrplanPLUS", je Land eigenes Portal.)
- **Konsequenz für den Hackathon:** Genau **EIN** Fach + EINE Stufe + EIN Bundesland wählen und dessen Lehrplan **einmalig** in eine strukturierte Themenliste (~30–50 Einträge) überführen — LLM-gestützt aus dem PDF, einmal geseedet. Das ist der Trick, der das Projekt an einem Wochenende machbar macht.

## 4. Empfohlener Hackathon-MVP (1 Wochenende)

**Wähle:** z.B. **Physik oder Biologie, Klasse 9–10, ein Bundesland** (anschauliche, „trendige" Themen: KI, Klima, Raumfahrt, Gesundheit).

1. **Seed:** Lehrplan-PDF → strukturierte Themenliste (einmal, LLM-assistiert). *(Vorab, nicht live)*
2. **Pull:** ~50 aktuelle deutschsprachige YouTube-Videos + 3–5 Teen-relevante Podcasts.
3. **Transkribieren:** youtube-transcript-api + Whisper.
4. **Extrahieren & Matchen:** Claude zieht Themen, matcht gegen die Lehrplan-Liste.
5. **Demo-UI (das, was den Eindruck macht):** Zwei Views —
   - *Lehrkraft-View:* „Diese 3 aktuellen Videos passen zu deinem Pflicht-Thema **X** — nutze sie als Einstieg" + fertige Einstiegsfrage.
   - *Reverse-View:* „Bei Schüler:innen gerade angesagt: **Thema Y** → deckt Lehrplan-Punkte A, B ab."
6. **Human-in-the-loop:** Lehrkraft bestätigt/verwirft Vorschläge (Qualität + Vertrauen).

**Bewusst weggelassen:** Mehrere Fächer/Länder, Live-Crawling, Accounts, TikTok. Alles Post-Hackathon.

## 5. Vater-Sohn-Rollenaufteilung (Vorschlag)

- **Sohn (sichtbar & motivierend):** Welche Kanäle/Podcasts schauen Jugendliche wirklich? + die **Demo-UI** + Pitch. Das ist der Teil mit „seinem" Wissen und sofort sichtbarem Ergebnis.
- **Du (Plumbing):** APIs, Transkript-Pipeline, LLM-Matching, Lehrplan-Seed.
- Gemeinsam: die zwei Views + Demo-Story.

## 6. Risiken / offene Fragen für unsere Entscheidung

1. **Lehrplan-Scope:** Welches Fach/Stufe/Bundesland? (Bestimmt alles andere.)
2. **Trend-Signal:** Allgemeines Trending **oder** Klassen-Input (Schüler:innen nennen Lieblinge)? Letzteres ist stärker + datenschutzfreundlich.
3. **Content-Safety:** Filter, damit nur altersgerechte Inhalte auftauchen.
4. **Matching-Qualität:** Immer mit Lehrkraft-Review, kein Voll-Automatismus.
5. **Hackathon-Rahmen:** Welcher konkret, wann, wie lang, Team-Größe, Tech-Vorgaben? (Skaliert den Scope.)

## Quellen
- EdGate ExACT — https://edgate.com/ · Instructure Elevate — https://www.instructure.com/elevate/elevate-standards-alignment · 1EdTech CASE — https://www.1edtech.org/standards/case
- mapEDU — https://mapedu.com/ · Boclips — https://www.boclips.com/blog/the-role-of-ai-in-personalizing-video-based-learning
- PBS NewsHour Classroom — https://www.pbs.org/newshour/classroom/
- YouTube/Transcript APIs — https://supadata.ai/youtube-api · https://use-apify.com/blog/youtube-transcripts-llm-rag-pipelines-2026 · Whisper/whisperfile — https://blog.stephenturner.us/p/video-to-audio-transcript-to-summary-whisperfile-llama
- DE-Lehrpläne (PDF, keine API) — https://www.lehrer-online.de/fokusthemen/dossier/do/lehrplaene-der-bundeslaender/ · KMK Bildungsstandards — https://www.kmk.org/bildungsministerkonferenz/bildungsthemen/bildungsstandards.html · Bayern LehrplanPLUS — https://www.lehrplanplus.bayern.de
