# Schritt 2 — Match (Claude Max)

## Ablauf

1. **`data/extracted.json`** aus Schritt 1 bereithalten
2. **Zuerst Deutsch-Prompt** → Ergebnis als `data/matches_deutsch.json`
3. **Dann Mathe-Prompt** → Ergebnis als `data/matches_mathe.json`
4. App starten: `streamlit run app.py` (lädt Live-Daten statt Samples)

---

## 2a — Deutsch-Match

---PROMPT START DE---

Du bist Teil der Pipeline „Lernassistant“. Ordne Medien-Inhalte Lehrplan-Themen zu und formuliere **szenario-basierte** Unterrichtsimpulse.

**Bubble:** Klasse 6, Alter 11–12, Sprachniveau: klar, altersgerecht  
**bubble_id:** `klasse_6`

**Lehrplan-Themen (Deutsch):**
```json
[{"id": 1, "thema": "Wortarten", "kernkonzept": "Nomen, Verb, Adjektiv, Artikel"}, {"id": 2, "thema": "Satzbau & Satzglieder", "kernkonzept": "Subjekt, Prädikat, Objekt, Nebensätze"}, {"id": 3, "thema": "Rechtschreibung", "kernkonzept": "Dehnung, Schärfung, Groß-/Kleinschreibung"}, {"id": 4, "thema": "Wortfelder & Synonyme", "kernkonzept": "Wortschatz erweitern, präzise formulieren"}, {"id": 5, "thema": "Märchen", "kernkonzept": "Märchenmerkmale, Motive, Erzählstruktur"}, {"id": 6, "thema": "Fabeln", "kernkonzept": "Fabeltiere, Moral, kurze Erzählform"}, {"id": 7, "thema": "Gedichte", "kernkonzept": "Reim, Rhythmus, Stilmittel"}, {"id": 8, "thema": "Nacherzählen", "kernkonzept": "Inhalt wiedergeben, Reihenfolge, Hauptfiguren"}, {"id": 9, "thema": "Leseverstehen", "kernkonzept": "Text verstehen, Informationen entnehmen"}, {"id": 10, "thema": "Präsentieren & Sprechen", "kernkonzept": "Vortrag halten, Zuhörer ansprechen"}, {"id": 11, "thema": "Medien & Sprache", "kernkonzept": "Werbung, Social Media, Sprache beeinflusst"}, {"id": 12, "thema": "Wörterbuch & Recherche", "kernkonzept": "Bedeutungen nachschlagen, Quellen nutzen"}, {"id": 13, "thema": "Kommasetzung", "kernkonzept": "Haupt- und Nebensätze, Aufzählungen, dass-Sätze, Einschübe"}]
```

**Medien-Inhalte (aus Extract — HIER EINFÜGEN):**

```json
HIER extracted.json EINFÜGEN
```

**Regeln — streng einhalten:**
- **Keine Creator-/Kanalnamen** im Output
- Generische **Szenarien** (Chat-Satz, Kommentar, Podcast-Zitat, Stream-Situation)
- Einstiegsfrage passend zum Sprachniveau Klasse 6
- Nur Themen, die wirklich passen (nicht jedes Video forcieren)
- Pro passendem Video 0–2 Treffer
- Jeder Treffer braucht `"bubble_id": "klasse_6"`

**Ausgabe — NUR dieses JSON-Array** (kein Markdown):

```json
[
  {
    "thema_id": 13,
    "bubble_id": "klasse_6",
    "szenario": "kurze Situation ohne Kanalnamen",
    "begruendung": "2 Sätze",
    "einstiegsfrage": "1 konkrete Frage",
    "unterrichtsidee": "1 Aktivität 10-20 Min",
    "schueler_hook": "1 Satz Du-Form",
    "schueler_challenge": "1 kurze Aufgabe",
    "video_id": "yt1",
    "quelle": "youtube",
    "datum": "2026-06"
  }
]
```

Analysiere alle Videos aus der Eingabe und gib **ein flaches JSON-Array** aller Treffer zurück.

---PROMPT END DE---

**Speichern als:** `lernassistant/data/matches_deutsch.json`

---

## 2b — Mathe-Match

---PROMPT START MA---

Du bist Teil der Pipeline „Lernassistant“. Ordne Medien-Inhalte Lehrplan-Themen zu und formuliere **szenario-basierte** Unterrichtsimpulse.

**Bubble:** Klasse 6, Alter 11–12, Sprachniveau: klar, altersgerecht  
**bubble_id:** `klasse_6`

**Lehrplan-Themen (Mathe):**
```json
[{"id": 1, "thema": "Natürliche Zahlen", "kernkonzept": "Addition, Subtraktion, Multiplikation, Division"}, {"id": 2, "thema": "Brüche", "kernkonzept": "Erweitern, Kürzen, addieren, vergleichen"}, {"id": 3, "thema": "Dezimalzahlen", "kernkonzept": "Kommaschreibweise, Umrechnung Bruch und Dezimal"}, {"id": 4, "thema": "Negative Zahlen", "kernkonzept": "Zahlengerade, Temperatur, Schulden"}, {"id": 5, "thema": "Prozentrechnung", "kernkonzept": "Prozent verstehen, Rabatte, Anteile"}, {"id": 6, "thema": "Winkel & Dreiecke", "kernkonzept": "Winkelarten, Dreiecksarten, Winkelsumme"}, {"id": 7, "thema": "Flächeninhalt", "kernkonzept": "Rechteck, Dreieck, zusammengesetzte Flächen"}, {"id": 8, "thema": "Volumen", "kernkonzept": "Quader, Würfel, Rauminhalt berechnen"}, {"id": 9, "thema": "Koordinatensystem", "kernkonzept": "Punkte eintragen, Lage beschreiben"}, {"id": 10, "thema": "Terme & Gleichungen", "kernkonzept": "Einfache Terme, Gleichungen lösen"}, {"id": 11, "thema": "Daten & Diagramme", "kernkonzept": "Mittelwert, Säulendiagramm, Daten lesen"}, {"id": 12, "thema": "Wahrscheinlichkeit", "kernkonzept": "Zufall, Würfel, Münze, Chancen einschätzen"}]
```

**Medien-Inhalte (dieselbe extracted.json wie oben — HIER EINFÜGEN):**

```json
HIER extracted.json EINFÜGEN
```

**Regeln — streng einhalten:**
- **Keine Creator-/Kanalnamen** im Output
- Generische **Szenarien** (Pack-Opening, Timer, Challenge, Pizza teilen — ohne Kanalbezug)
- Einstiegsfrage passend zum Sprachniveau Klasse 6
- Fokus auf **Brüche**, **Prozente**, **Wahrscheinlichkeit** wo es passt
- Pro passendem Video 0–2 Treffer
- Jeder Treffer braucht `"bubble_id": "klasse_6"`

**Ausgabe — NUR dieses JSON-Array** (kein Markdown):

```json
[
  {
    "thema_id": 2,
    "bubble_id": "klasse_6",
    "szenario": "kurze Situation ohne Kanalnamen",
    "begruendung": "2 Sätze",
    "einstiegsfrage": "1 konkrete Frage",
    "unterrichtsidee": "1 Aktivität 10-20 Min",
    "schueler_hook": "1 Satz Du-Form",
    "schueler_challenge": "1 kurze Aufgabe",
    "video_id": "yt1",
    "quelle": "youtube",
    "datum": "2026-06"
  }
]
```

Analysiere alle Videos aus der Eingabe und gib **ein flaches JSON-Array** aller Treffer zurück.

---PROMPT END MA---

**Speichern als:** `lernassistant/data/matches_mathe.json`

---

## App testen

```bash
cd lernassistant
streamlit run app.py
```

In der App sollte stehen: **Live-Daten** (nicht Sample-Daten), Quelle `data/matches_deutsch.json`.

## JSON bereinigen

Falls Claude Markdown liefert (` ```json `), nur den Inhalt zwischen den Backticks speichern.

Schnellcheck:
```bash
python3 -c "
import json
for f in ['data/extracted.json','data/matches_deutsch.json','data/matches_mathe.json']:
    d=json.load(open(f))
    print(f, '→', len(d), 'Einträge')
"
```
