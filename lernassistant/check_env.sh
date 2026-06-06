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

set -a
source .env
set +a

check() {
  local name=$1 val=$2
  if [ -n "$val" ] && [[ "$val" != *"..."* ]]; then
    echo "✅ $name gesetzt"
  else
    echo "❌ $name fehlt oder Platzhalter"
  fi
}

check "YOUTUBE_API_KEY" "$YOUTUBE_API_KEY"
check "OPENAI_API_KEY" "$OPENAI_API_KEY"
check "ANTHROPIC_API_KEY" "$ANTHROPIC_API_KEY"
echo
echo "LLM: ${LLM_PROVIDER:-auto (OpenAI wenn OPENAI_API_KEY gesetzt)}"
echo "Modell: ${OPENAI_MODEL:-gpt-4o-mini}"
echo
echo "YouTube only  → python3 ingest_youtube.py"
echo "LLM only      → python3 extract.py && python3 match.py"
echo "Alles         → ./run_pipeline.sh"
