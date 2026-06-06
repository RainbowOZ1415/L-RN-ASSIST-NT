#!/bin/bash
# Lernassistant Pipeline — öffentliche Quellen, kein YouTube-Login
set -e
cd "$(dirname "$0")"

if [ ! -f .env ]; then
  echo "FEHLER: .env fehlt. Kopiere .env.example und trage Keys ein."
  exit 1
fi

BUBBLE="${BUBBLE_ID:-klasse_6}"
echo "=== Bubble: $BUBBLE ==="

echo ">>> 1/5 YouTube (öffentlich, YOUTUBE_API_KEY)"
python3 ingest_youtube.py || echo "WARN: YouTube ingest fehlgeschlagen — weiter mit vorhandenen Daten"

echo ">>> 2/5 News (logo! RSS, kein Key)"
python3 ingest_news.py || echo "WARN: News ingest fehlgeschlagen"

echo ">>> 3/5 Extract (ANTHROPIC_API_KEY)"
BUBBLE_ID="$BUBBLE" python3 extract.py

echo ">>> 4/5 Match Deutsch"
BUBBLE_ID="$BUBBLE" SEED_FILE=seed_deutsch.json MATCHES_OUT=data/matches_deutsch.json python3 match.py

echo ">>> 5/5 Match Mathe"
BUBBLE_ID="$BUBBLE" SEED_FILE=seed_mathe.json MATCHES_OUT=data/matches_mathe.json python3 match.py

echo "=== Fertig. Starte App: streamlit run app.py ==="
