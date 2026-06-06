# Demo — 90 Sekunden (Hackathon)

## Start

```bash
./start.sh
# oder: cd lernassistant && streamlit run app.py
```

## Ablauf (Top-Navigation oben)

1. **Sidebar:** Bubble **Klasse 6** wählen
2. **Lehrkraft** (Nav oben) → Fach **Deutsch** → Thema **Kommasetzung**
3. Einstiegsfrage vorlesen: *Jemand schrieb im Chat: 'Er sagte du bist cool.' …*
4. Fach **Mathe** → Thema **Brüche** → Einstiegsfrage (Pack-Opening)
5. **Schüler** → Hook ohne YouTuber-Namen
6. **Üben** → Aufgabe beantworten → **Einreichen & prüfen** → Feedback + Extra-Übungen
7. **Login-Toggle** (Sidebar): „Später personalisierter Feed"
8. Optional **Muster** → typische Situationen · **Was läuft?** → Konsum-Kategorie hinzufügen

## Bubble-Vergleich (+30 Sek)

- **Klasse 4–5** → einfachere Fragen
- **Klasse 10+** → komplexere Fragen

## Übungs-Checkliste (Partner, 2–3× durchspielen)

- [ ] `./start.sh` startet ohne Fehler
- [ ] Logo links + 5 Nav-Buttons oben sichtbar
- [ ] Deutsch Kommasetzung + Mathe Brüche gezeigt
- [ ] **Üben** → mindestens 1 Aufgabe eingereicht, Feedback gelesen
- [ ] Login-Toggle kurz erklärt
- [ ] Pointe in eigenen Worten: Medien → Lehrplan, ohne Creator-Namen

## Pointe

Aus Medienkonsum wird die Neugier-Brücke zum Lehrplan — szenario-basiert, altersgerecht, ohne Creator-Namen.

## Fallback

Live-Daten: `data/matches_deutsch.json` + `matches_mathe.json` (Claude). Ohne Keys: Sample-Daten in `data/*.sample.json`.
