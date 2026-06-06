# Schritt 1 — Extract (Claude Max)

## Ablauf

1. Unten den **Prompt** kopieren (alles ab `---PROMPT START---`)
2. In **claude.ai** einfügen und absenden
3. Antwort als **`data/extracted.json`** speichern (nur JSON, kein Markdown)
4. Weiter mit **`02-MATCH-CLAUDE.md`**

## Vorher: Eingabe vorbereiten

**Option A — YouTube schon geladen:** Inhalt von `data/transcripts.json` in den Prompt unter `EINGABE:` einfügen.

**Option B — Demo ohne YouTube-Key:** Die Demo-Eingabe unten im Prompt ist schon drin (5 Videos, Klasse 6).

---

---PROMPT START---

Du bist Teil der Pipeline „Lernassistant“. Analysiere Medien-Inhalte für Schüler:innen.

**Bubble:** klasse_6 (Klasse 6, Alter 11–12, Sek I, Sprachniveau: klar, altersgerecht)

**Regeln:**
- NUR Inhalt analysieren — **kein Kanal, kein Creator** in der Zusammenfassung
- Pro Video ein JSON-Objekt
- Antwort **NUR** als gültiges JSON-Array — kein Markdown, keine Erklärung

**Ausgabeformat pro Video** (Felder aus Eingabe übernehmen + ergänzen):
```json
{
  "id": "...",
  "titel": "...",
  "kanal": "...",
  "quelle": "youtube",
  "transkript": "...",
  "themen": ["Thema1", "Thema2"],
  "entitaeten": ["..."],
  "niveau": "Primar|Sek I|Sek II",
  "zusammenfassung": "1 Satz ohne Creator-Namen"
}
```

**EINGABE** (ersetze ggf. durch deine `transcripts.json`):

```json
[
  {
    "id": "yt1",
    "titel": "MEGA PACK OPENING - 3 von 100 Karten waren LEGENDARY",
    "kanal": "Demo",
    "quelle": "youtube",
    "transkript": "Willkommen zurück Leute, heute öffnen wir hundert Packs. Okay erste zehn Packs, nichts Besonderes. Pack Nummer 47, oh mein Gott, drei legendäre Karten in Folge! Das sind drei von einhundert, also statistisch eigentlich krass. Wer von euch würde weitermachen oder aufhören? Schreibt in den Chat. Übrigens: Luca sagte ich bin der Beste — nee Spaß. Also 3 von 100, das kann man auch als Bruch schreiben right?"
  },
  {
    "id": "yt2",
    "titel": "24 Stunden Challenge ohne Pause",
    "kanal": "Demo",
    "quelle": "youtube",
    "transkript": "Wir sind jetzt bei Stunde 18 von 24, das Projekt ist ungefähr drei Viertel fertig. Noch sechs Stunden, dann schaffen wir es hoffentlich. Im Chat steht: Er sagte du schaffst das nicht. Leute, wo ist da der Fehler? Also grammatikalisch meine ich. Timer zeigt 45 von 60 Minuten in dieser Runde."
  },
  {
    "id": "yt3",
    "titel": "Anna Tom Max spielen Minecraft Hardcore",
    "kanal": "Demo",
    "quelle": "youtube",
    "transkript": "Dritter Tag Hardcore, wir bauen das Haus zu zwei Dritteln fertig. Kommentar unter dem letzten Video: Geil aber zu lang. Im Podcast neulich: Social Media ist finde ich manchmal übertrieben. Titel vom Stream gestern: Anna Tom und Max gegen den Wither — fehlen da Kommas?"
  },
  {
    "id": "yt4",
    "titel": "Wahrscheinlichkeit erklärt - Lootboxen und Glücksrad",
    "kanal": "Demo",
    "quelle": "youtube",
    "transkript": "Eine Lootbox hat oft eine Chance von 1 zu 50 für das seltene Item. Das ist ein Fünfzigstel oder zwei Prozent. Wenn du fünfmal öffnest, heißt das nicht automatisch dass du es bekommst — Zufall bleibt Zufall. Pizza-Metapher: Du isst drei von acht Stücken, wie viel ist übrig?"
  },
  {
    "id": "yt5",
    "titel": "Podcast Clip: Kommas in der Alltagssprache",
    "kanal": "Demo",
    "quelle": "podcast",
    "transkript": "Moderator: 'Ich finde, dass man in Chats oft Kommas vergisst.' Gast: 'Stimmt, aber bei wörtlicher Rede muss man aufpassen.' Beispiel: Er meinte ich soll mehr lernen. Kein Komma, kein Anführungszeichen — in der Schule wäre das ein Fehler. Abschluss: Schreibt mal einen Satz mit Einschub, so wie: Das ist, meiner Meinung nach, wichtig."
  }
]
```

Gib jetzt das **komplette JSON-Array** mit allen analysierten Videos zurück.

---PROMPT END---

## Ergebnis speichern

Datei: `lernassistant/data/extracted.json`

Prüfen:
```bash
python3 -c "import json; d=json.load(open('data/extracted.json')); print(len(d), 'Videos')"
```
