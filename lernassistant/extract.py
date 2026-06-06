"""Themen je Video/Folge mit Claude extrahieren -> data/extracted.json"""
import os, json
from dotenv import load_dotenv
import anthropic

load_dotenv()
MODEL = os.environ.get("CLAUDE_MODEL", "claude-sonnet-4-6")
client = anthropic.Anthropic()

PROMPT = """Du analysierst Medien-Inhalt fuer Schueller:innen (Bubble: {bubble}).
NUR Inhalt analysieren — kein Kanal, kein Creator.

Titel/Kontext: {titel}
Transkript/Beschreibung:
{transkript}

Gib NUR JSON zurueck:
{{"themen": ["..."], "entitaeten": ["..."], "niveau": "Primar|Sek I|Sek II", "zusammenfassung": "1 Satz ohne Creator-Namen"}}"""

def extract(item):
    bubble = os.environ.get("BUBBLE_ID", "klasse_6")
    msg = client.messages.create(
        model=MODEL, max_tokens=400,
        messages=[{"role": "user", "content": PROMPT.format(
            bubble=bubble,
            titel=item["titel"],
            transkript=(item.get("transkript") or "")[:4000])}])
    text = msg.content[0].text.strip().strip("`")
    if text.startswith("json"):
        text = text[4:]
    try:
        data = json.loads(text)
    except Exception:
        data = {"themen": [], "entitaeten": [], "niveau": "allgemein", "zusammenfassung": ""}
    return {**item, **data}

def main():
    items = json.load(open("data/transcripts.json"))
    out = []
    for it in items:
        out.append(extract(it))
        print("  ok", it["titel"][:55])
    json.dump(out, open("data/extracted.json", "w"), ensure_ascii=False, indent=2)
    print(f"-> data/extracted.json ({len(out)})")

if __name__ == "__main__":
    main()
