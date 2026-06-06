# Lernassistant — Projekt-Brief

*Aktuelle Inhalte, die Jugendliche begeistern, als Brücke zum Schul-Lehrplan.*

## Die Beobachtung

Schüler:innen verbringen Stunden mit YouTube und Podcasts — und sind dort echt neugierig.
Im Unterricht wirken dieselben Themen oft trocken. Lehrkräfte wissen das, haben aber keine
Zeit, ständig aktuelle, „angesagte" Inhalte zu suchen und auf ihren Lehrplan zu übersetzen.

## Die Idee

Ein Tool, das aus dem **Medienkonsum von Jugendlichen** (YouTube-Trends, Podcasts, plus
das, was eine konkrete Klasse selbst schaut) automatisch erkennt, **welche aktuellen Themen
gerade interessieren**, und das **rückwärts auf den Lehrplan** mappt.

Ergebnis für die Lehrkraft: *„Zu deinem Pflicht-Thema ‚Immunsystem' passen diese 2 aktuellen
Videos — inkl. fertiger Einstiegsfrage für den Unterricht."*
Und umgekehrt: *„Dieses Trend-Thema deckt folgende Lehrplan-Punkte ab."*

Aus Konsum wird also eine **Neugier-Brücke** in den Pflichtstoff.

## Warum das neu ist

Es gibt Tools, die fertiges Lehrmaterial auf Bildungsstandards taggen (EdGate, Instructure
Elevate, mapEDU) oder die redaktionell News-Stunden bauen (PBS NewsHour). **Niemand startet
aber bei dem, was Kinder freiwillig schauen, und mappt das auf den Lehrplan.** Genau dieser
Blickwinkel ist der Kern der Idee.

## Was wir bauen (Kern-Produkt)

1. **Trend-Erkennung** — was läuft gerade auf YouTube/Podcasts + optional anonymer
   Klassen-Input (Schüler nennen ihre Lieblinge → datenschutzfreundlich, echtes Klassensignal).
2. **KI-Abgleich** — eine KI liest die Inhalte, zieht die Themen heraus und gleicht sie mit
   einer strukturierten Lehrplan-Themenliste ab; liefert Begründung + Einstiegsfrage.
3. **Zwei Ansichten** —
   - *Lehrkraft-Ansicht:* vom Lehrplan-Thema zu passenden aktuellen Inhalten.
   - *Trend-Ansicht:* vom angesagten Inhalt zu den abgedeckten Lehrplan-Punkten.
4. **Mensch im Loop** — die Lehrkraft bestätigt/verwirft Vorschläge. Das schafft Vertrauen
   und macht KI-Unsicherheit zur Stärke.

## Wie es technisch funktioniert (kurz)

Inhalte holen (YouTube-API, Podcast-RSS) → Transkripte → KI extrahiert Themen → KI matcht
gegen die Lehrplan-Liste → einfache Web-Oberfläche (zwei Ansichten).
Der einzige „harte" Punkt: In Deutschland gibt es **keine maschinenlesbaren Lehrpläne** —
sie liegen als PDF je Bundesland vor. Lösung: pro Fach/Stufe einmal eine strukturierte
Themenliste anlegen (KI-gestützt). Den Rest erledigt die Pipeline fachunabhängig.

## Roadmap

**Phase 0 — Hackathon-MVP (1 Tag, steht schon als lauffähiger Prototyp)**
- 1 Fach (Start: Biologie Kl. 9/10), ~25 Lehrplan-Themen, ~30 vorab geladene Videos/Podcasts.
- Beide Ansichten + Klassen-Input + „bestätigt/verworfen"-Funktion.
- Bewusst „demo-safe": Daten vorab geladen, läuft auch ohne Internet/Keys.
- *Ziel: greifbare Demo + Pitch.*

**Phase 1 — Vom Prototyp zum echten Werkzeug (Wochen)**
- Mehrere Fächer & Stufen, weitere Bundesländer.
- Echte Live-Aktualisierung statt vorab geladener Daten.
- Content-Safety-Filter (nur altersgerechte Inhalte).
- Bessere Matching-Qualität + Lehrkraft-Feedback fließt zurück ins System.

**Phase 2 — Pilot mit einer echten Klasse/Schule (1–2 Monate)**
- Eine Lehrkraft nutzt es real über ein paar Wochen.
- Messen: Spart es Vorbereitungszeit? Steigt das Engagement der Schüler?
- Anonymer Klassen-Input als fester Bestandteil.

**Phase 3 — Skalierung & Vision (später)**
- Mehr Plattformen (TikTok/Instagram-Trends), Mehrsprachigkeit.
- Lehrkräfte-Community: geteilte, bewährte „Trend-zu-Thema"-Verknüpfungen.
- Optionale Integration in bestehende Schul-Tools (Lernplattformen).

## Wo du andocken / ergänzen kannst

Diese Punkte sind bewusst offen — gute Stellen für deine Ideen:
- **Welche Plattformen & Inhalte** spiegeln den echten Konsum von Jugendlichen am besten?
- **Trend-Signal:** allgemeine Trends vs. konkreter Klassen-Input — wie gewichten?
- **Lehrkraft-Mehrwert:** reicht „Einstiegsfrage", oder braucht es ganze Stundenentwürfe?
- **Geschäftsmodell / Trägerschaft:** Schule, Verlag, gemeinnützig, B2C-Lehrkräfte?
- **Datenschutz** rund um den Klassen-Input — wie maximal sauber lösen?

Wenn du magst, ergänz die Idee direkt in deinen Worten — und wir bringen das zusammen.
