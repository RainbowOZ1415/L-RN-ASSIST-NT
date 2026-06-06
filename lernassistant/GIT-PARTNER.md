# Git — Parallel mit Partner arbeiten

**Repo:** https://github.com/RainbowOZ1415/L-RN-ASSIST-NT  
**SSH:** `git@github.com:RainbowOZ1415/L-RN-ASSIST-NT.git`

## Partner cloned

```bash
git clone git@github.com:RainbowOZ1415/L-RN-ASSIST-NT.git
cd L-RN-ASSIST-NT
pip install -r lernassistant/requirements.txt
./start.sh
```

Wichtig: `./start.sh` (mit `./`) — nicht `.start.sh`

## Täglicher Workflow

```bash
git pull origin main
./start.sh
```

## Wer ändert was?

| Partner | Technik |
|---|---|
| `PITCH.md`, `DEMO.md` — Demo üben | `app.py`, Pipeline |
| Texte in Sample-JSON | `run_pipeline.sh` |

**Regel:** Nicht gleichzeitig an `app.py` arbeiten.

## Demo-Daten

`matches_*.sample.json` enthält die Hackathon-Demo (Kommasetzung, Brüche).  
Läuft ohne `.env` und ohne lokale Live-JSON.

## SSH-Key (einmalig)

Falls Push nach Passwort fragt: https://github.com/settings/keys
