"""Pull trending YouTube videos (DE) + transcripts -> data/transcripts.json
Run am Vorabend und Ergebnis committen (demo-safe caching)."""
import os, json
from dotenv import load_dotenv
from googleapiclient.discovery import build
from youtube_transcript_api import YouTubeTranscriptApi

load_dotenv()

MAX = int(os.environ.get("MAX_VIDEOS", "30"))
PLACEHOLDER = ("HIER-DEIN", "AIza...", "dein-key", "einfügen", "EINFÜGEN")


def validate_key(key):
    if not key or any(p.lower() in key.lower() for p in PLACEHOLDER):
        raise SystemExit(
            "FEHLER: Kein gültiger YOUTUBE_API_KEY in .env\n"
            "→ Google Cloud → Anmeldedaten → API-Schlüssel kopieren\n"
            "→ In lernassistant/.env eintragen und Datei SPEICHERN (Cmd+S)"
        )
    if not key.startswith("AIza"):
        raise SystemExit("FEHLER: YouTube-Key sollte mit AIza beginnen.")

def trending(api_key, region="DE", maxn=MAX):
    yt = build("youtube", "v3", developerKey=api_key)
    res = yt.videos().list(part="snippet", chart="mostPopular",
                           regionCode=region, maxResults=min(maxn, 50)).execute()
    return [{"id": i["id"],
             "titel": i["snippet"]["title"],
             "kanal": i["snippet"]["channelTitle"],
             "quelle": "youtube"} for i in res.get("items", [])]

def transcript(video_id):
    for langs in (["de"], ["en"], None):
        try:
            parts = (YouTubeTranscriptApi.get_transcript(video_id, languages=langs)
                     if langs else YouTubeTranscriptApi.get_transcript(video_id))
            return " ".join(p["text"] for p in parts)[:6000]
        except Exception:
            continue
    return ""

def main():
    key = os.environ.get("YOUTUBE_API_KEY", "")
    validate_key(key)
    items = trending(key)
    for it in items:
        it["transkript"] = transcript(it["id"])
        print(("  ok " if it["transkript"] else "  -- "), it["titel"][:60])
    path = "data/transcripts.json"
    json.dump(items, open(path, "w"), ensure_ascii=False, indent=2)
    print(f"-> {path} ({len(items)} Videos)")

if __name__ == "__main__":
    main()
