"""Themen je Video/Folge extrahieren -> data/extracted.json"""
import os, json
from llm_client import complete, parse_json

PROMPT = """Du analysierst Medien-Inhalt fuer Schueller:innen (Bubble: {bubble}).
NUR Inhalt analysieren — kein Kanal, kein Creator.

Titel/Kontext: {titel}
Transkript/Beschreibung:
{transkript}

Gib NUR JSON zurueck:
{{"themen": ["..."], "entitaeten": ["..."], "niveau": "Primar|Sek I|Sek II", "zusammenfassung": "1 Satz ohne Creator-Namen"}}"""


def extract(item):
    bubble = os.environ.get("BUBBLE_ID", "klasse_6")
    text = complete(
        PROMPT.format(
            bubble=bubble,
            titel=item["titel"],
            transkript=(item.get("transkript") or item.get("titel") or "")[:4000],
        ),
        max_tokens=400,
    )
    try:
        data = parse_json(text)
    except Exception:
        data = {"themen": [], "entitaeten": [], "niveau": "allgemein", "zusammenfassung": ""}
    return {**item, **data}


def main():
    items = json.load(open("data/transcripts.json"))
    limit = int(os.environ.get("EXTRACT_LIMIT", "0"))
    if limit:
        items = items[:limit]
    out = []
    for it in items:
        out.append(extract(it))
        print("  ok", it["titel"][:55])
    json.dump(out, open("data/extracted.json", "w"), ensure_ascii=False, indent=2)
    print(f"-> data/extracted.json ({len(out)}, LLM={os.environ.get('LLM_PROVIDER', 'auto')})")


if __name__ == "__main__":
    main()
