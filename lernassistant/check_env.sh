#!/bin/bash
# Prüft, welche Keys für die Pipeline fehlen
cd "$(dirname "$0")"

echo "=== Lernassistant — Key-Check ==="
echo

if [ ! -f .env ]; then
  echo "❌ .env fehlt"
  echo "   → cp .env.example .env && Keys eintragen"
  echo
  echo "✅ Demo ohne Keys: streamlit run app.py (Sample-Daten)"
  exit 0
fi

source .env 2>/dev/null || true

check() {
  local name=$1 val=$2
  if [ -n "$val" ] && [ "$val" != "AIza..." ] && [ "$val" != "sk-ant-..." ]; then
    echo "✅ $name gesetzt"
  else
    echo "❌ $name fehlt oder Platzhalter"
  fi
}

check "YOUTUBE_API_KEY" "$YOUTUBE_API_KEY"
check "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
echo
echo "YouTube only  → python3 ingest_youtube.py"
echo "Claude only   → python3 extract.py && python3 match.py"
echo "Alles         → ./run_pipeline.sh"
