"""parinhood (PodGuard) als Inhalts- & Safety-Quelle in die Pipeline holen.

Nutzt die öffentliche, rate-limitierte API von parinhood.com:
  GET /api/recent?limit=N                      -> zuletzt analysierte Folgen
  GET /api/podcast/{podcast}/{episode}         -> Detailanalyse (lerneffekte, categories …)

Schreibt Pipeline-kompatible Einträge nach data/transcripts.json
({id, titel, kanal, quelle, transkript}) — so fließen echte, jugendrelevante
Podcast-Inhalte ins Lehrplan-Matching (extract.py -> match.py).

Zusätzlich wird je Eintrag ein `parinhood`-Block mit Safety-Infos abgelegt
(recommended_age, manipulations_radar, empfehlung) — Basis für den Eltern-View.

Lauf:
  python ingest_parinhood.py            # holt & schreibt
  python ingest_parinhood.py --dry-run  # nur Vorschau, nichts schreiben

Env:
  PARINHOOD_API_BASE (default https://parinhood.com)
  PARINHOOD_LIMIT    (default 10)
"""
import json
import os
import sys
import urllib.request
import urllib.error

API_BASE = os.environ.get("PARINHOOD_API_BASE", "https://parinhood.com").rstrip("/")
LIMIT = int(os.environ.get("PARINHOOD_LIMIT", "10"))
TRANSCRIPTS = "data/transcripts.json"
TIMEOUT = 15


def _get(path):
    url = f"{API_BASE}{path}"
    req = urllib.request.Request(url, headers={"Accept": "application/json", "User-Agent": "lernassistant-ingest"})
    with urllib.request.urlopen(req, timeout=TIMEOUT) as r:
        return json.loads(r.read().decode("utf-8"))


def fetch_recent(limit):
    data = _get(f"/api/recent?limit={limit}")
    # API liefert dict; Items robust herausziehen.
    if isinstance(data, list):
        return data
    for key in ("items", "recent", "analyses", "results"):
        if isinstance(data.get(key), list):
            return data[key]
    # Fallback: erste Liste im dict
    for v in data.values():
        if isinstance(v, list):
            return v
    return []


def fetch_detail(podcast_slug, episode_slug):
    try:
        return _get(f"/api/podcast/{podcast_slug}/{episode_slug}")
    except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError):
        return {}


def build_transkript(rec, detail):
    """Reichhaltiger Analyse-Text als Matching-Input (ohne Creator-Fokus)."""
    parts = []
    if rec.get("eltern_zusammenfassung"):
        parts.append(rec["eltern_zusammenfassung"])
    lern = detail.get("lerneffekte") or []
    if lern:
        parts.append("Lerneffekte: " + "; ".join(lern))
    cats = detail.get("categories") or {}
    for key in ("inhalt", "werte", "sprache"):
        c = cats.get(key) or {}
        ex = c.get("examples") or []
        if ex:
            parts.append(f"{key.capitalize()}: " + "; ".join(ex[:3]))
    if rec.get("empfehlung"):
        parts.append("Empfehlung: " + rec["empfehlung"])
    return "\n".join(parts)[:6000]


def to_item(rec, detail):
    podcast_slug = rec.get("podcast_slug", "")
    episode_slug = rec.get("episode_slug", "")
    return {
        "id": f"parinhood:{podcast_slug}/{episode_slug}",
        "titel": rec.get("episode_title", "Podcast-Folge"),
        "kanal": rec.get("podcast_title") or detail.get("podcast_name", ""),
        "quelle": "podcast",
        "transkript": build_transkript(rec, detail),
        # Safety-/Eignungs-Metadaten für den Eltern-View:
        "parinhood": {
            "recommended_age": rec.get("recommended_age", ""),
            "target_age_group": rec.get("target_age_group", ""),
            "overall_score": rec.get("overall_score"),
            "manipulations_radar": rec.get("manipulations_radar_summary")
            or detail.get("manipulations_radar"),
            "empfehlung": rec.get("empfehlung", ""),
            "quelle_url": f"{API_BASE}/api/podcast/{podcast_slug}/{episode_slug}",
        },
    }


def main():
    dry = "--dry-run" in sys.argv or os.environ.get("DRY_RUN") == "1"
    print(f"parinhood-Ingest: {API_BASE} (limit {LIMIT}){' [DRY-RUN]' if dry else ''}")
    recent = fetch_recent(LIMIT)
    print(f"  {len(recent)} Folgen gefunden")

    new_items = []
    for rec in recent:
        detail = fetch_detail(rec.get("podcast_slug", ""), rec.get("episode_slug", ""))
        item = to_item(rec, detail)
        new_items.append(item)
        age = item["parinhood"]["recommended_age"]
        print(f"  • {item['titel'][:55]}  [{age}]")

    if dry:
        print("\n--- Vorschau erster Eintrag ---")
        print(json.dumps(new_items[0], ensure_ascii=False, indent=2) if new_items else "(leer)")
        return

    existing = json.load(open(TRANSCRIPTS)) if os.path.exists(TRANSCRIPTS) else []
    seen = {it.get("id") for it in existing}
    added = [it for it in new_items if it["id"] not in seen]
    existing.extend(added)
    os.makedirs(os.path.dirname(TRANSCRIPTS), exist_ok=True)
    json.dump(existing, open(TRANSCRIPTS, "w"), ensure_ascii=False, indent=2)
    print(f"-> {TRANSCRIPTS} (+{len(added)} neu, {len(existing)} gesamt)")


if __name__ == "__main__":
    main()
