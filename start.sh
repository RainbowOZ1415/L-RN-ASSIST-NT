#!/bin/bash
# App starten — aus Projektroot oder lernassistant/
cd "$(dirname "$0")/lernassistant" 2>/dev/null || cd "$(dirname "$0")"
exec streamlit run app.py "$@"
