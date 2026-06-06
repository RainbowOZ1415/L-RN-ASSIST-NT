"""Extrahierte Themen gegen seed.json matchen -> data/matches.json"""
import os, json
from llm_client import complete, parse_json

PROMPT = """Bubble (Altersgruppe): {bubble_name}, Alter {bubble_alter}, Sprachniveau: {bubble_niveau}

Lehrplan-Themen (JSON):
{seed}

Medien-Inhalt (nur zur Analyse — Kanalname NICHT im Output verwenden):
Themen: {themen}
Zusammenfassung: {zus}
Quelle: {quelle}

Welche Lehrplan-Themen lassen sich mit diesem Medien-Inhalt als NEUGIER-EINSTIEG verbinden?
WICHTIG: Der Medien-Inhalt ist der AUFHÄNGER, nicht das Unterrichtsthema selbst. Ein Inhalt passt
auch, wenn das Sachthema abweicht — solange er ein glaubwürdiger Einstieg in die KOMPETENZ des
Lehrplan-Themas ist (Neugier-Brücke). Beispiel-Brücken:
- politische/werbliche/Meinungs-Inhalte, Sprache/Framing -> "Medien & Sprache", "Wortfelder", "Leseverstehen"
- jede Geschichte/jeder Text/jedes Zitat -> "Leseverstehen", "Nacherzählen", "Wortarten", "Satzbau", "Kommasetzung"
- Zahlen, Geld, Statistiken, Chancen, Diagramme, Mengen -> "Prozentrechnung", "Daten & Diagramme", "Wahrscheinlichkeit", "Brüche", "Dezimalzahlen"
Gib 1–3 BESTE Treffer (nicht erzwingen). Nur wenn wirklich nichts passt: leere Liste.
REGELN:
- Keine Creator-/Kanalnamen im Output (in KEINEM Feld)
- Generische Szenarien (Chat-Satz, Kommentar, Podcast-Zitat, Stream-Situation)
- Sprache aller Felder passend zum Sprachniveau der Bubble
- bubble_id: "{bubble_id}" in jedem Treffer
- DREI Zielgruppen bedienen: Lehrkraft (begruendung/einstiegsfrage/unterrichtsidee),
  Schüler (schueler_hook/schueler_challenge), Eltern (eltern.*)
- KEIN material-Feld erzeugen (die fertige Lernunterlage liegt bereits im Seed pro Thema).
- eltern: Alltagssprache. eltern.safety nur füllen, wenn nötig (z.B. Lootbox/Glücksspiel/Geld/politische Beeinflussung), sonst null.

Gib NUR kompaktes JSON zurück (kein Markdown):
{{"treffer": [{{"thema_id": <id>, "bubble_id": "{bubble_id}",
  "szenario": "kurze Situation ohne Kanalnamen",
  "begruendung": "1-2 Sätze: warum der Inhalt ein Einstieg ins Thema ist",
  "einstiegsfrage": "1 konkrete Frage",
  "unterrichtsidee": "1 Aktivität 10-20 Min",
  "schueler_hook": "1 Satz Du-Form",
  "schueler_challenge": "1 kurze Aufgabe",
  "eltern": {{"schulbezug": "Klartext: welcher Schulstoff steckt drin",
    "gespraechsanlass": "1 Frage fürs Eltern-Kind-Gespräch",
    "tipp": "1 Hinweis", "safety": null}}}}]}}"""


def load_bubble():
    bid = os.environ.get("BUBBLE_ID", "klasse_6")
    bubbles = {b["id"]: b for b in json.load(open("bubbles.json"))["bubbles"]}
    return bubbles.get(bid, bubbles["klasse_6"])


def main():
    seed_file = os.environ.get("SEED_FILE", "seed.json")
    seed = json.load(open(seed_file))
    bubble = load_bubble()
    seed_min = [{"id": t["id"], "thema": t["thema"], "kernkonzept": t["kernkonzept"]}
                for t in seed["themen"]]
    items = json.load(open("data/extracted.json"))
    limit = int(os.environ.get("MATCH_LIMIT", "0"))
    if limit:
        items = items[:limit]
    matches = []
    for it in items:
        text = complete(
            PROMPT.format(
                bubble_id=bubble["id"], bubble_name=bubble["name"],
                bubble_alter=bubble["alter"], bubble_niveau=bubble["sprachniveau"],
                seed=json.dumps(seed_min, ensure_ascii=False),
                themen=", ".join(it.get("themen", [])),
                zus=it.get("zusammenfassung", ""),
                quelle=it.get("quelle", ""),
            ),
            max_tokens=2200,
        )
        try:
            treffer = parse_json(text).get("treffer", [])
        except Exception:
            treffer = []
        for t in treffer:
            t.setdefault("szenario", it["titel"])
            t.update({"video_id": it["id"], "quelle": it.get("quelle", "")})
        matches.extend(treffer)
        print(f"  {len(treffer)} Treffer: {it['titel'][:50]}")
    out_path = os.environ.get("MATCHES_OUT", "data/matches.json")
    json.dump(matches, open(out_path, "w"), ensure_ascii=False, indent=2)
    print(f"-> {out_path} ({len(matches)} Treffer, Bubble {bubble['name']})")


if __name__ == "__main__":
    main()
