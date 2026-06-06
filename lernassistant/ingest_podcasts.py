"""Add podcast episodes from RSS feeds to data/transcripts.json.
Shortcut: nutzt Episoden-Beschreibung als 'Transkript'. Für echte Transkripte:
Audio + Whisper (siehe README)."""
import json, os, feedparser

FEEDS = [
    # Checkpod, Komm call — RSS-URLs hier eintragen wenn bekannt:
    # "https://...checkpod....rss",
    # "https://...kommcall....rss",
]
PER_FEED = 3

def main():
    path = "data/transcripts.json"
    items = json.load(open(path)) if os.path.exists(path) else []
    for url in FEEDS:
        feed = feedparser.parse(url)
        show = feed.feed.get("title", "Podcast")
        for e in feed.entries[:PER_FEED]:
            items.append({
                "id": e.get("id", e.get("link", e.title)),
                "titel": e.title,
                "kanal": show,
                "quelle": "podcast",
                "transkript": (e.get("summary", "") or e.get("description", ""))[:6000],
            })
            print("  +", show, "-", e.title[:50])
    json.dump(items, open(path, "w"), ensure_ascii=False, indent=2)
    print(f"-> {path} ({len(items)} Einträge gesamt)")

if __name__ == "__main__":
    main()
