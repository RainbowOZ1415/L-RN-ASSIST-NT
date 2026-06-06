# Starten — nach `git pull`

Das Projekt enthält **zwei Apps**. Beide werden aus dem **Repo-Ordner** gestartet
(egal wo der bei dir liegt — es braucht keinen festen Pfad wie „Developer").

## 🌐 Web-App (Next.js) — das aktuelle Frontend

Aus dem **Projekt-Root** (der Ordner mit `web/`, `lernassistant/`, dieser Datei):

```bash
./start-web.sh
```

Das installiert beim ersten Mal automatisch die Abhängigkeiten (pnpm oder npm)
und startet den Server auf **http://localhost:3000**.

Manuell geht es genauso:
```bash
cd web
pnpm install   # einmalig (oder: npm install)
pnpm dev       # (oder: npm run dev)
```

> Wichtig: immer aus dem **`web/`**-Ordner starten. „localhost:3000" im Browser öffnen
> (nicht 8501 — das ist die alte Streamlit-App).

## 🐍 Streamlit-Prototyp (optional, alt)

```bash
./start.sh
# oder:  cd lernassistant && pip install -r requirements.txt && streamlit run app.py
```

## Typischer Ablauf zu zweit

```bash
git pull            # Stand der/des anderen holen
./start-web.sh      # ansehen / weiterarbeiten
# ... Änderungen ...
git add . && git commit -m "…" && git push
```
