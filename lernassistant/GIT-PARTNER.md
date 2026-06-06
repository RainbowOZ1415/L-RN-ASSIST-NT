# Git — Parallel mit Partner arbeiten

**Repo:** https://github.com/RainbowOZ1415/L-RN-ASSIST-NT  
**SSH:** `git@github.com:RainbowOZ1415/L-RN-ASSIST-NT.git`

## Partner cloned

```bash
git clone git@github.com:RainbowOZ1415/L-RN-ASSIST-NT.git
cd L-RN-ASSIST-NT/lernassistant
pip install -r requirements.txt
streamlit run app.py
```

## Täglicher Workflow

```bash
git pull origin main
# ändern ...
git add lernassistant/
git commit -m "Beschreibung"
git push origin main
```

## Wer ändert was?

| Partner | Vater/Cursor |
|---|---|
| `PITCH.md`, `DEMO.md` | `app.py`, Pipeline |
| Texte in Sample-JSON | `run_pipeline.sh`, `match.py` |
| Demo üben | `ingest_*.py` |

**Regel:** Nicht gleichzeitig an `app.py` arbeiten.

## SSH-Key (einmalig)

Falls Push nach Passwort fragt: https://github.com/settings/keys
