"""Kinder-News aus RSS -> data/transcripts.json (oder eigene news.json)
Für Hackathon: Show-Notes/Titel+Beschreibung als 'Transkript'."""
import json, os, feedparser

FEEDS = [
    ("logo!", "https://www.zdf.de/feeds/rss/kinder/logo"),
]
PER_FEED = 5


def main():
    path = "data/transcripts.json"
    items = json.load(open(path)) if os.path.exists(path) else []
    for show, url in FEEDS:
        feed = feedparser.parse(url)
        for e in feed.entries[:PER_FEED]:
            items.append({
                "id": e.get("id", e.get("link", e.title)),
                "titel": e.title,
                "kanal": show,
                "quelle": "news",
                "transkript": (e.get("summary", "") or e.get("description", ""))[:6000],
            })
            print("  +", show, "-", e.title[:55])
    json.dump(items, open(path, "w"), ensure_ascii=False, indent=2)
    print(f"-> {path} ({len(items)} Einträge gesamt)")


if __name__ == "__main__":
    main()
