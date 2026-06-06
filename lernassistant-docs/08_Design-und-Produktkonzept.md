# Design- & Produktkonzept — Learnings → Umsetzung

**Stand:** 2026-06-06 · Basis: [[07_Wettbewerbsanalyse]] + Vision (gemeinnützig, 3 Zielgruppen, kostenlos)
**Zweck:** Die besten Learnings der Konkurrenz in konkretes Design, Inhalte und Funktionen übersetzen — zielgruppengerecht.

---

## 1. Design-Leitprinzipien (aus den Learnings abgeleitet)

1. **„Wir schenken Zeit."** — Klares, emotionales Nutzenversprechen oben (von *lehrer-online*). Bei uns: *„Aus dem, was deine Klasse/dein Kind schaut, wird Schulstoff — in Minuten."*
2. **Vertrauen sichtbar machen.** — Stats, „pädagogisch geprüft", DSGVO/DE-Hosting, gemeinnützig (von *lehrer-online*, *schulportal*, *parinhood*). Bei gemeinnützig + Jugend-Content **kritisch**.
3. **Aktualität als Held.** — *lehrer-online* macht „Bildungsnachrichten/Themenwelten" prominent. Das ist unser Kern — aber **bottom-up** (echter Konsum), nicht redaktionell. Muss visuell im Zentrum stehen.
4. **Modern, aufgeräumt, Social Proof.** — *eduki*-Benchmark: Hero, klare Filter-Hierarchie, Bestseller/„beliebt", Karten-Layout. Gegenbeispiel *4teachers* (2000er-Optik) = bewusst vermeiden.
5. **Zielgruppen-Einstieg.** — Direkt auf der Startseite in die Rolle routen (Lehrkraft/Schüler/Eltern), statt eine Oberfläche für alle.
6. **Transparenz & Safety für Eltern.** — *parinhood*: neutral, „von Eltern für Eltern", Manipulationsmuster, Faktencheck, DSGVO. Unser Eltern-View dockt hier an.
7. **Kostenlos & ohne Hürde kommunizieren.** — Gemeinnützig = kein Paywall-Druck (Abgrenzung zu eduki/meinUnterricht). Das ist ein Vertrauens-Vorteil — offensiv zeigen.
8. **Mobile-first für Schüler & Eltern.** — Diese nutzen Handy; Lehrkraft eher Desktop. Responsive ist Pflicht.

## 2. Learnings-Matrix — was übernehmen, was lassen

| Seite | Übernehmen | Vermeiden |
|---|---|---|
| **eduki** | Moderne Karten-UI, Filter-Hierarchie, Social Proof, „beliebt" | Marktplatz/Verkaufslogik, Paywall |
| **lehrer-online** | „Zeit schenken"-Framing, Themenwelten/News prominent, Trust-Stats, Classroom-Tools | Top-down-Redaktion als einzige Quelle |
| **schulportal** | Verifizierung = Vertrauen, Gamification fürs Beitragen, klare Fächer/Typ-Struktur | Reine Lehrkraft-Exklusivität (wir sind 3 Zielgruppen) |
| **meinUnterricht** | Kuratierte Qualität, KI-Material („Muki") als *Feature*, nicht USP | Verlags-Abo-Modell |
| **4teachers** | Community/Austausch-Idee (Muster, geteilte Verknüpfungen) | Veraltete UX komplett |
| **parinhood** | Eltern-Tonalität, Safety/Manipulationsmuster, Tagesbrief, API, DSGVO/DE | — (eng verwandt, eher Partner) |
| **gostudent** | Content-Marketing/SEO als Reichweite (gemeinnützig!), emotionale Problem-Story | Conversion-zu-Nachhilfe-Logik |

## 3. Inhalte & Funktionen je Zielgruppe (Soll)

### 👩‍🏫 Lehrkraft (Desktop-fokus)
- **Inhalte:** Lehrplan-Thema → aktuelle Szenarien + Einstiegsfrage + **fertige Stunde** (Material-Block; ausbauen, Punkt 2).
- **Funktionen:** Filter (Fach/Stufe/Bubble), Passt/Verwerfen (Vertrauen), **Material exportieren** (PDF/Druck — Markt-Erwartung), Favoriten/Merkliste (eduki-Learning), „Muster"-Querblick.
- **Trust:** „pädagogisch sinnvoll", Lehrplan-Bezug sichtbar, Quellenangabe.

### 🧑‍🎓 Schüler (Mobile-first)
- **Inhalte:** Hook ohne Creator → „das ist auch Schulstoff" → Üben mit Sofort-Feedback.
- **Funktionen:** Gamification (Punkte/Streak — schulportal-Learning, schon angelegt), Zufalls-/Folgeaufgaben, Fortschritt.
- **Tonalität:** kurz, du-Form, alltagsnah, motivierend.

### 👨‍👩‍👧 Eltern (Mobile-first) — *parinhood-Synergie*
- **Inhalte:** „Was schaut/hört mein Kind?" → Schulbezug + Gesprächsanlass + Tipp + **Safety-Hinweis**.
- **Funktionen:** Konsum-Input, optional **Tagesbrief**-Idee (parinhood), Safety-Flags (Lootbox/Glücksspiel etc.), DSGVO-Transparenz.
- **Tonalität:** neutral, unterstützend, „von Eltern für Eltern".

## 4. Konkrete UI/UX-Schritte für unsere App

**A. Startseite/Hero mit Zielgruppen-Routing** (neu): Nutzenversprechen + 3 große Karten (Lehrkraft/Schüler/Eltern) + Trust-Zeile (gemeinnützig, kostenlos, DSGVO). Heute springt man direkt in „Lehrkraft".
**B. „Was läuft?"-Aktualität als Hero-Element** statt versteckt — der USP sichtbar.
**C. Karten-Design vereinheitlichen** (Quelle-Badge, Datum, Thema-Chip, klare Hierarchie) — eduki-Niveau.
**D. Trust-Leiste** global (Stats/gemeinnützig/DSGVO).
**E. Material-Export** (Druck/PDF) für Lehrkraft.
**F. Mobile-Layout** für Schüler/Eltern.

## 5. Tech-Empfehlung (Punkt 4)

**Frage:** Streamlit weiter oder Next.js/React?

- **Streamlit:** super für Daten-/Logik-Prototyp (haben wir). **Schwach** bei: polierter Marketing-/Startseite, feinem Responsive/Mobile, eigener Komponenten-Optik, SEO (Konkurrenz gewinnt über SEO/Content), Login/Integrationen. Hero-Routing & Trust-Design sind in Streamlit nur mit CSS-Hacks (siehe theme.py) machbar.
- **Next.js/React:** volle Design-Kontrolle, Mobile, SEO (wichtig für gemeinnützige Reichweite à la gostudent), Login, parinhood-API-Integration, LMS-Anschluss später.

**Empfehlung:** Für ein ernsthaftes „Gesamtdesign", das die Zielgruppen wirklich erreicht (inkl. öffentlicher, SEO-fähiger Startseite — bei gemeinnützig zentral), führt der Weg zu **Next.js**. Die **Pipeline/Datenmodell** (Seeds, Matches, `match.py`) bleibt erhalten und wird zur Datenquelle/API. Streamlit kann als internes Lehrkraft-Tool/Prototyp weiterlaufen, bis das neue Frontend steht.

→ **Entscheidung nötig**, bevor wir das Gesamtdesign bauen (siehe offene Frage).

## 6. Reihenfolge (Punkte 2–4 eingeordnet)

1. **Tech-Entscheidung (4)** — gatet alles.
2. **Gesamtdesign** nach Entscheidung umsetzen (Hero-Routing, Karten, Trust, Mobile).
3. **Material ausweiten (2)** — Datenmodell steht; Material-Blöcke auf mehr Impulse, ggf. per Pipeline generieren.
4. **parinhood-Integration (3)** — Eltern-View + Safety; API evaluieren.
