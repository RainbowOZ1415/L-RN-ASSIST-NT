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

Welche Lehrplan-Themen passen als Einstieg? Sei streng.
REGELN:
- Keine Creator-/Kanalnamen im Output
- Generische Szenarien (Chat-Satz, Kommentar, Podcast-Zitat, Stream-Situation)
- Einstiegsfrage passend zum Sprachniveau der Bubble
- bubble_id: "{bubble_id}" in jedem Treffer

Gib NUR JSON zurück:
{{"treffer": [{{"thema_id": <id>, "bubble_id": "{bubble_id}",
  "szenario": "kurze Situation ohne Kanalnamen",
  "begruendung": "2 Sätze",
  "einstiegsfrage": "1 konkrete Frage",
  "unterrichtsidee": "1 Aktivität 10-20 Min",
  "schueler_hook": "1 Satz Du-Form",
  "schueler_challenge": "1 kurze Aufgabe"}}]}}"""


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
            max_tokens=800,
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
