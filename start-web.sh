#!/usr/bin/env bash
# Next.js-Web-App starten — funktioniert nach 'git pull' auf JEDEM Rechner.
# Aufruf aus dem Projektroot:  ./start-web.sh
set -e
cd "$(dirname "$0")/web"

# Abhängigkeiten einmalig installieren (pnpm bevorzugt, sonst npm)
if [ ! -d node_modules ]; then
  echo "→ Installiere Abhängigkeiten (einmalig, kann ein paar Minuten dauern)…"
  if command -v pnpm >/dev/null 2>&1; then
    pnpm install
  else
    npm install
  fi
fi

echo "→ Web-App läuft gleich auf http://localhost:3000  (Beenden mit Ctrl+C)"
if command -v pnpm >/dev/null 2>&1; then
  exec pnpm dev
else
  exec npm run dev
fi
