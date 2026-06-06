#!/usr/bin/env bash
# Echte Live-Daten ziehen, mit Claude auf den Lehrplan matchen und ERGÄNZEND
# in die kuratierten Daten mergen (überschreibt die Sample-Inhalte nicht).
# Voraussetzung: lernassistant/.env mit YOUTUBE_API_KEY + ANTHROPIC_API_KEY,
# venv unter lernassistant/.venv (pip install -r requirements.txt).
set -e
cd "$(dirname "$0")"
PY=.venv/bin/python

echo "=== 1) Quellen holen (parinhood + News-RSS) ==="
rm -f data/transcripts.json data/extracted.json
PARINHOOD_LIMIT="${PARINHOOD_LIMIT:-12}" $PY ingest_parinhood.py
$PY ingest_news.py || echo "(News-Feed übersprungen)"

echo "=== 2) Themen extrahieren (Claude) ==="
$PY extract.py

echo "=== 3) Matchen je Klassenstufe/Fach + mergen ==="
for b in klasse_4_5 klasse_6 klasse_7_9 klasse_10_plus; do
  for f in deutsch mathe; do
    BUBBLE_ID="$b" SEED_FILE="seed_${f}.json" MATCHES_OUT="data/_live_tmp.json" $PY match.py >/dev/null 2>&1 || true
    base="data/bubbles/$b/matches_${f}.sample.json"
    out="data/bubbles/$b/matches_${f}.json"
    $PY merge_matches.py "$base" "data/_live_tmp.json" "$out"
  done
done
rm -f data/_live_tmp.json
echo "=== fertig — Live-Daten gemerged in data/bubbles/*/matches_*.json ==="
