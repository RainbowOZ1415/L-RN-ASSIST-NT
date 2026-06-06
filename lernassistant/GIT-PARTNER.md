# Git — Parallel mit Partner arbeiten

## Setup (einmalig, Vater)

1. Repo auf GitHub anlegen (z.B. `lernassistant-hackathon`)
2. Im Projektordner:

```bash
cd /pfad/zu/LΞRN-ASSISTΞNT
git init   # falls noch nicht
git add lernassistant/ lernassistant-docs/
git commit -m "Hackathon-Stand: Deutsch/Mathe Klasse 6, 4 Tabs, News"
git branch -M main
git remote add origin https://github.com/EUER-USER/lernassistant-hackathon.git
git push -u origin main
```

3. Partner als Collaborator auf GitHub einladen

## Partner cloned

```bash
git clone https://github.com/EUER-USER/lernassistant-hackathon.git
cd lernassistant-hackathon/lernassistant
pip install -r requirements.txt
streamlit run app.py
```

Partner arbeitet in **Cursor mit eigenem LLM** am gleichen Repo.

## Workflow (beide)

```
pull → ändern → commit → push
```

**Immer zuerst pullen:**

```bash
git pull origin main
```

**Dann committen:**

```bash
git add lernassistant/data/matches_deutsch.sample.json   # Beispiel
git commit -m "Partner: echte Kanäle eingetragen"
git push origin main
```

## Wer ändert was? (Konflikte vermeiden)

| Partner | Vater/Cursor |
|---|---|
| `data/matches_*.sample.json` | `app.py`, `ingest_*.py` |
| `ingest_podcasts.py` FEEDS | `match.py`, `extract.py` |
| `PITCH.md` | `HACKATHON-SPRINT.md` |
| Texte in Seeds (`trend_hook`) | Pipeline, neue Features |

**Nicht gleichzeitig** an `app.py` arbeiten — absprechen oder nacheinander.

## xcrun-Fehler auf dem Mac

```bash
xcode-select --install
```

Danach Terminal neu starten.

## Ohne Git (Notfall)

Ordner `lernassistant/` per AirDrop/USB teilen — **Vater-Version ist Master**, Partner schickt JSON-Dateien zurück.
