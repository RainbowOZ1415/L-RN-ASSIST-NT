# Hackathon — 6-Stunden-Sprint (HEUTE)

**Ziel:** Demo-fertig um 18:00 · Deutsch + Mathe Klasse 6 · YouTube + Podcasts + News

## Start (alle, 0:00–0:15)

```bash
cd lernassistant
pip install -r requirements.txt
streamlit run app.py
```

App muss laufen — Sample-Daten reichen für die Jury.

### Git parallel (Vater + Partner)

> Falls `git` einen xcrun-Fehler wirft: `xcode-select --install` ausführen, dann neu versuchen.

```bash
# Einmalig: Remote verbinden (GitHub-Repo anlegen, URL eintragen)
git remote add origin https://github.com/EUER-USER/lernassistant.git

# Arbeiten
git pull origin main
# ... ändern ...
git add lernassistant/
git commit -m "Beschreibung"
git push origin main
```

**Regel:** Kleine Commits, oft pullen, Konflikte in `data/*.json` und `app.py` zuerst klären.

### Rollen heute

| Wer | Aufgaben | Dateien |
|---|---|---|
| **Partner** | Echte Kanäle eintragen, Klassen-Input, Pitch üben, UI-Texte | `data/matches_*.sample.json`, `ingest_podcasts.py` FEEDS, `PITCH.md` |
| **Vater/Cursor** | Pipeline, News-Ingest, Code, Matching | `ingest_*.py`, `extract.py`, `match.py`, `app.py` |
| **Gemeinsam** | Demo 3× durchspielen, API-Keys testen | — |

---

## Stundenplan

| Zeit | Was | Done? |
|---|---|---|
| **0:00–0:30** | App starten, Rollen, Partner nennt 6 Kanäle + 2 News-Themen | ☐ |
| **0:30–1:30** | Sample-Daten mit echten Kanälen füllen · 4 Tabs testen | ☐ |
| **1:30–2:30** | Optional: `.env` + Pipeline (`ingest` → `extract` → `match`) | ☐ |
| **2:30–3:30** | UI polieren · Pitch schreiben (`PITCH.md`) · Klassen-Input live üben | ☐ |
| **3:30–4:30** | Demo-Durchlauf 1+2 · Edge Cases (Fach wechseln, leeres Thema) | ☐ |
| **4:30–5:30** | Buffer: ElevenLabs TTS **oder** mehr Matches **oder** News-Ingest live | ☐ |
| **5:30–6:00** | Finaler Durchlauf · `git push` · Laptop/Beamer checken | ☐ |

---

## Demo-Ablauf (90 Sek) — auswendig

1. **Trend-View:** „Das schauen/hören/lesen Kinder in Klasse 6 — YouTube, Podcast, News."
2. **Klick:** „Deckt Lehrplan-Themen X, Y ab."
3. **Fach wechseln → Lehrkraft-View:** „Zu Brüchen/Märchen: dieses Video + Einstiegsfrage + Unterrichtsidee."
4. **Schüler-View:** „Für Schüler: Das kennst du — das hängt mit dem Stoff zusammen."
5. **Klassen-Input:** Partner trägt live einen Kanal ein.
6. **Pointe:** „Aus Konsum wird die Neugier-Brücke zum Lehrplan — mit News, Podcasts und YouTube."

---

## Fallback-Strategie

| Problem | Lösung |
|---|---|
| Kein Internet | Sample-Daten — läuft offline |
| API-Key fehlt | Sample-Daten — Badge „Sample-Daten" ist ok |
| Pipeline langsam | Nicht live laufen lassen — gecachte JSON zeigen |
| Git kaputt | USB-Stick / AirDrop den `lernassistant/`-Ordner |

---

## Checkliste vor Jury

- [ ] `streamlit run app.py` startet ohne Fehler
- [ ] Deutsch + Mathe Umschalter funktioniert
- [ ] Mindestens 1 Match pro Demo-Hauptthema (Märchen, Brüche)
- [ ] News-Eintrag sichtbar in Trend-View
- [ ] Schüler-Tab zeigt Hook + Challenge
- [ ] Klassen-Input: 1 live + 3 vorbereitet
- [ ] Pitch 2× geprobt
