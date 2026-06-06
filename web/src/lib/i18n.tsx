"use client";

/* ----------------------------------------------------------------------------
 * Leichtgewichtige Zweisprachigkeit (Deutsch/Englisch) — ohne externe Pakete.
 *
 * Wichtig: Nur Bedien-/Marketing-Texte werden übersetzt. Lehrplan-INHALTE
 * (Szenarien, Begründungen, Einstiegsfragen, Material, Eltern-Texte, Themen-
 * Namen, Kernkonzepte) bleiben immer Deutsch (kommen direkt aus den Daten).
 *
 * Hydration-sicher: Server + erster Client-Render nutzen IMMER "de". Erst nach
 * dem Mount wird ggf. die gespeicherte Sprache aus localStorage übernommen.
 * -------------------------------------------------------------------------- */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Lang = "de" | "en";

const STORAGE_KEY = "lang";

/* ---- Wörterbuch ---- */

const dict = {
  de: {
    /* Header / Nav */
    "nav.lehrkraft": "Lehrkraft",
    "nav.schueler": "Schüler",
    "nav.eltern": "Eltern",
    "nav.langLabel": "Sprache",

    /* Footer */
    "footer.brand": "Lernassistent",
    "footer.tagline":
      "Gemeinnütziges Projekt. Aus dem realen Medienkonsum Jugendlicher wird die Neugier-Brücke zum Lehrplan — kostenlos, werbefrei, datenschutzfreundlich.",
    "footer.pitch": "Pitch & Konzept",
    "footer.legal": "© {year} Lernassistent · DSGVO-konform · Hosting in der EU",

    /* Landing — Hero */
    "home.hero.chip": "Gemeinnützig · kostenlos · werbefrei",
    "home.hero.title.a": "Aus Medienkonsum wird ",
    "home.hero.title.b": "Schulstoff",
    "home.hero.subtitle":
      "Wir schenken Zeit: Aus dem, was Jugendliche wirklich schauen und hören, werden in Minuten passende Einstiege und Übungen zum Lehrplan — für Lehrkräfte, Schüler:innen und Eltern.",
    "home.hero.ctaTeacher": "Loslegen als Lehrkraft",
    "home.hero.ctaParent": "Für Eltern entdecken",
    "home.hero.badge1": "✅ Ohne YouTuber-Namen",
    "home.hero.badge2": "✅ Mensch im Loop",
    "home.hero.badge3": "✅ DSGVO-konform, EU-Hosting",
    "home.example.chip": "Aktuelles Beispiel",
    "home.example.context": "Klasse 6 · Deutsch",
    "home.example.situation": "Situation aus dem Alltag",
    "home.example.question": "Fertige Einstiegsfrage",
    "home.example.note":
      "Aus „nur ein Chat“ wird ein Lehrplan-Einstieg — genau das macht der Lernassistent.",

    /* Landing — Zielgruppen */
    "home.audiences.heading": "Für wen bist du hier?",
    "home.audiences.open": "Öffnen →",
    "home.aud.teacher.title": "Für Lehrkräfte",
    "home.aud.teacher.text":
      "Vom Lehrplan-Thema zu aktuellen Einstiegen, Einstiegsfragen und fertigen Stunden.",
    "home.aud.student.title": "Für Schüler:innen",
    "home.aud.student.text":
      "Dein Alltag steckt voller Schulstoff — entdecken und gleich interaktiv üben.",
    "home.aud.parent.title": "Für Eltern",
    "home.aud.parent.text":
      "Was dein Kind schaut — und was schulisch dahintersteckt, mit Gesprächsanlässen.",

    /* Landing — So funktioniert's */
    "home.how.heading": "So funktioniert’s",
    "home.step1.t": "Konsum erkennen",
    "home.step1.d": "Was Jugendliche auf YouTube, in Podcasts & News wirklich schauen.",
    "home.step2.t": "Auf den Lehrplan mappen",
    "home.step2.d": "KI zieht die Situation heraus und matcht sie mit dem Lehrplan.",
    "home.step3.t": "Einstieg & Übung liefern",
    "home.step3.d":
      "Szenario, Einstiegsfrage, fertige Stunde — und Übungen für Schüler:innen.",

    /* Landing — Was uns anders macht */
    "home.diff.heading": "Was uns anders macht",
    "home.diff.text.a":
      "Andere Plattformen taggen fertiges Lehrmaterial. Wir starten bei dem, was Kinder ",
    "home.diff.text.strong": "freiwillig",
    "home.diff.text.b":
      " schauen, und bauen rückwärts die Brücke zum Pflichtstoff — szenario-basiert, ohne Creator-Namen, mit der Lehrkraft als Entscheiderin.",

    /* Audience-Views — Controls */
    "ctrl.ageGroup": "Altersgruppe",
    "ctrl.subject": "Fach",
    "ctrl.topic": "Lehrplan-Thema",
    "ctrl.chooseTopic": "Thema wählen",
    "view.impulses": "Impulse",
    "view.sampleData": "Beispiel-Daten",
    "view.live": "Live",
    "view.empty":
      "Noch keine Impulse für diese Auswahl — über die Pipeline oder Beispiel-Daten kommen sie hinzu.",

    /* Lehrkraft */
    "teacher.title": "Lehrkraft",
    "teacher.subtitle":
      "Vom Lehrplan-Thema zu aktuellen Einstiegen & fertigem Material",
    "teacher.coreConcept": "Kernkonzept:",
    "teacher.openMaterialFor": "📄 Lernunterlage zu „{topic}“ öffnen",
    "teacher.inMediaNow": "Aktuell in den Medien:",
    "teacher.whyCurriculum": "Warum das zum Lehrplan passt:",
    "teacher.starterQuestion": "Einstiegsfrage:",
    "teacher.lessonIdea": "Unterrichtsidee:",
    "teacher.openFullMaterial": "📄 Komplette Unterlage öffnen",
    "teacher.fits": "Passt",
    "teacher.discard": "Verwerfen",
    "teacher.confirmed": "✅ Bestätigt",
    "teacher.discarded": "Verworfen",
    "teacher.appearsInMedia": "Taucht in den Medien auf: {hook}",

    /* Schüler */
    "student.title": "Schüler",
    "student.subtitle": "Dein Alltag steckt voller Schulstoff — entdecken & üben",
    "student.tab.discover": "🔎 Entdecken",
    "student.tab.practice": "✏️ Üben",
    "student.points": "⭐ {n} Punkte",
    "student.challenge": "🎯 Deine Challenge",
    "student.done": "✅ Geschafft",
    "student.markDone": "Als geschafft markieren",
    "student.noExercises":
      "Für dieses Fach gibt es hier noch keine automatischen Übungen.",

    /* Eltern */
    "parent.title": "Eltern",
    "parent.subtitle": "Was dein Kind schaut — und was schulisch dahintersteckt",
    "parent.consumeSummary": "📱 Was schaut oder hört dein Kind gerade?",
    "parent.consumePlaceholderName": "z.B. Gaming-Streams, Podcasts, News",
    "parent.consumePlaceholderWhy": "Warum? (optional)",
    "parent.add": "Hinzufügen",
    "parent.heading": "Das steckt schulisch in typischen Alltags-Situationen:",
    "parent.isSchoolStuff": "Das ist Schulstoff:",
    "parent.talkWithChild": "Reden mit deinem Kind:",
    "parent.tip": "Tipp:",

    /* Exercise */
    "ex.noTaskFor":
      "Für „{topic}“ gibt es hier noch keine automatische Aufgabe — nutze die Aufgaben aus der Unterlage.",
    "ex.yes": "Ja",
    "ex.no": "Nein",
    "ex.answerPlaceholder": "Deine Antwort",
    "ex.check": "Prüfen",
    "ex.showSolution": "Lösung zeigen",
    "ex.newTask": "Neue Aufgabe",
    "ex.correct": "✅ Richtig! {solution}",
    "ex.wrong": "Noch nicht — probier es nochmal oder zeig die Lösung.",
    "ex.revealed": "💡 {solution}",

    /* Material-Modal */
    "mat.materialMeta": "Lernunterlage · {meta}",
    "mat.print": "🖨️ Drucken",
    "mat.download": "⬇️ Download",
    "mat.share": "🔗 Teilen",
    "mat.close": "Schließen",
    "mat.copied": "In Zwischenablage kopiert ✓",
    "mat.shareUnavailable": "Teilen nicht verfügbar",
    "mat.shareText":
      "Unterrichtsmaterial „{title}“ ({meta}) — Lernassistent, gemeinnützig & kostenlos.",
    "mat.tab.full": "📄 Komplette Unterlage",
    "mat.tab.whiteboard": "🖥️ Whiteboard-Aufgabe",
    "mat.mediaCurriculum": "Medieninhalt ↔ Lehrplan",
    "mat.inMediaNow": "Aktuell in den Medien:",
    "mat.curriculumLink": "Lehrplan-Bezug:",
    "mat.whyFits": "Warum das passt:",
    "mat.goal": "Lernziel:",
    "mat.starterQuestion": "Einstiegsfrage:",
    "mat.sequence": "Ablauf",
    "mat.worksheet": "Arbeitsblatt",
    "mat.showSolutions": "Lösungen anzeigen",
    "mat.hideSolutions": "Lösungen verbergen",
    "mat.differentiation": "Differenzierung",
    "mat.easier": "Leichter",
    "mat.harder": "Schwerer",
    "mat.whiteboardHint":
      "Für die Klasse vorne am digitalen Whiteboard lösen — „Lösung zeigen“ deckt die Antwort auf.",
    "mat.minShort": "Min",

    /* MaterialBlock (inline details) */
    "matblock.showLesson": "📄 Fertige Stunde anzeigen — {title}",
    "matblock.goal": "Lernziel:",
    "matblock.sequence": "Ablauf",
    "matblock.worksheet": "Arbeitsblatt",
    "matblock.solutions": "Lösungen",
    "matblock.easier": "Leichter",
    "matblock.harder": "Schwerer",

    /* Pitch-Deck */
    "pitch.nav.prev": "← Zurück",
    "pitch.nav.next": "Weiter →",
    "pitch.nav.prevAria": "Vorherige Slide",
    "pitch.nav.nextAria": "Nächste Slide",
    "pitch.nav.toSlide": "Zu Slide {n}",

    "pitch.title.chip": "Pitch & Konzept · gemeinnützig",
    "pitch.title.h.a": "Aus Medienkonsum wird ",
    "pitch.title.h.b": "Schulstoff",
    "pitch.title.sub":
      "Jugendliche verbringen Stunden mit YouTube, Podcasts und News. Im Unterricht wirkt derselbe Stoff oft trocken. Wir bauen die Neugier-Brücke — vom realen Konsum rückwärts auf den Lehrplan.",
    "pitch.title.b1": "✅ Ohne Creator-Namen",
    "pitch.title.b2": "✅ Mensch im Loop",
    "pitch.title.b3": "✅ DSGVO-konform, EU-Hosting",

    "pitch.problem.chip": "Das Problem",
    "pitch.problem.h": "Neugier draußen, trockener Stoff drinnen.",
    "pitch.problem.students.t": "Schüler:innen",
    "pitch.problem.students.d":
      "Sind bei YouTube, Podcasts und News neugierig — sehen aber nicht, dass das, was sie konsumieren, mit Mathe, Deutsch & Co. zu tun hat. Im Unterricht wirkt derselbe Stoff abstrakt.",
    "pitch.problem.adults.t": "Lehrkräfte & Eltern",
    "pitch.problem.adults.d":
      "Haben keine Zeit, alles selbst zu schauen, zu hören und zu lesen. Aktuelle, „angesagte“ Aufhänger zu finden und didaktisch aufzubereiten kostet zu viel Vorbereitung.",

    "pitch.market.chip": "Marktanalyse",
    "pitch.market.h": "Ein großer Bildungsmarkt — mit klarem Einstiegspfad.",
    "pitch.market.sub.a": "TAM/SAM/SOM für den deutschen Bildungs-/EdTech-Markt. ",
    "pitch.market.sub.strong": "Alle Zahlen sind grobe Schätzungen",
    "pitch.market.sub.b":
      " — Lehrkraft-/Schulzahlen nach Destatis (2024/25), Marktvolumen aus EdTech-Benchmarks abgeleitet.",
    "pitch.market.estimate": "Schätzung",
    "pitch.market.tam.label": "Gesamtmarkt",
    "pitch.market.tam.wert": "~1,5 Mrd. €",
    "pitch.market.tam.d":
      "Bildungs-/EdTech-Markt Deutschland (digitale Bildungsangebote). DE entspricht grob ~8 % eines globalen EdTech-Markts von ~190 Mrd. $.",
    "pitch.market.sam.label": "Erreichbarer Markt",
    "pitch.market.sam.wert": "~800.000 Lehrkräfte · ~40.000 Schulen",
    "pitch.market.sam.d":
      "Allgemeinbildende Schulen Sek I/II in Deutschland plus die zugehörigen Lehrkräfte — unsere primäre Nutzerbasis (Destatis: ~851.000 Lehrkräfte 2024/25).",
    "pitch.market.som.label": "Realistisch in 1–3 Jahren",
    "pitch.market.som.wert": "~50–500 Pilot-Schulen",
    "pitch.market.som.d":
      "Über Schulfördervereine, Stiftungen und öffentliche Mittel erreichbare Pilot-Schulen und Förderkreise im Anlaufzeitraum.",

    "pitch.comp.chip": "Wettbewerb",
    "pitch.comp.h": "Ein Material-Marktplatz-Markt — mit offener Flanke.",
    "pitch.comp.sub":
      "Die etablierten Plattformen sind Marktplätze für fertige Arbeitsblätter & Stundenentwürfe — alle top-down und fast ausschließlich für Lehrkräfte.",
    "pitch.comp.competitors": "eduki|Marktplatz, Lehrkraft-only;;lehrer-online|Redaktion + KI, top-down;;schulportal|kostenlos, Lehrkraft-only;;4teachers|Community, veraltete UX;;meinUnterricht|Verlags-Abo + KI „Muki“",
    "pitch.comp.whitespaceH": "Unser Whitespace",
    "pitch.comp.ws1.t": "Bottom-up statt top-down",
    "pitch.comp.ws1.d":
      "Einstieg beim realen Medienkonsum der Altersgruppe, nicht bei der Redaktions-Auswahl. Niemand sonst macht das.",
    "pitch.comp.ws2.t": "Drei Zielgruppen statt nur Lehrkraft",
    "pitch.comp.ws2.d":
      "Lehrkraft, Schüler:in und Eltern auf derselben Datenbasis — der Markt ist fast rein Lehrkraft.",
    "pitch.comp.ws3.t": "Szenario statt Material",
    "pitch.comp.ws3.d":
      "„Situation aus dem Chat/Stream“ als Einstieg — nicht das fertige PDF als Kernobjekt.",

    "pitch.sol.chip": "Lösung & Wertversprechen",
    "pitch.sol.h": "Mitwirken — ohne selbst alles schauen zu müssen.",
    "pitch.sol.sub.a": "Lehrkräfte ",
    "pitch.sol.sub.strong": "und",
    "pitch.sol.sub.b":
      " Eltern können an aktuellen Themen mitwirken, ohne selbst stundenlang zu schauen, zu hören oder zu lesen — mit der Sicherheit, dass die Inhalte, die Kinder gerade erleben, sinnvoll ins Curriculum verarbeitet werden.",
    "pitch.sol.v1.t": "Mitwirken ohne Vorab-Aufwand",
    "pitch.sol.v1.d":
      "Lehrkräfte und Eltern müssen nicht selbst stundenlang schauen, hören oder lesen — die KI bereitet den Bezug auf, der Mensch entscheidet nur „passt/verwerfen“.",
    "pitch.sol.v2.t": "Sicherheit über die Inhalte",
    "pitch.sol.v2.d":
      "Was Kinder gerade erleben, wird sinnvoll und geprüft ins Curriculum verarbeitet — kein Kontrollverlust, sondern verlässlicher Lehrplan-Bezug.",
    "pitch.sol.v3.t": "Spielerisches Lernen",
    "pitch.sol.v3.d":
      "Aus dem freiwilligen Medienkonsum wird Motivation: Alltagsbezug, Neugier-Brücke und interaktives Üben statt trockenem Pflichtstoff.",
    "pitch.sol.exLabel": "Beispiel-Szenario",
    "pitch.sol.exQuote":
      "„Jemand schrieb im Chat: ‚Er sagte du bist cool.‘ Wo ist der Fehler bei der wörtlichen Rede?“",
    "pitch.sol.exNote":
      "Bottom-up, Szenario + Einstiegsfrage + fertige Unterlage — ohne Creator-Namen, Mensch im Loop. Aus „nur ein Chat“ wird spielerisches Lernen am Lehrplan.",

    "pitch.prod.chip": "Das Produkt",
    "pitch.prod.h": "Eine Datenbasis, drei Zielgruppen.",
    "pitch.prod.aud1.title": "Lehrkraft",
    "pitch.prod.aud1.text":
      "Lehrplan-Thema → aktuelle Szenarien, fertige Einstiegsfrage und einsetzbare Unterlage. Passt/Verwerfen — die Lehrkraft entscheidet.",
    "pitch.prod.aud2.title": "Schüler:in",
    "pitch.prod.aud2.text":
      "„Das kennst du — das ist auch Schulstoff.“ Hook ohne Creator-Namen, dann gleich interaktiv üben mit Sofort-Feedback.",
    "pitch.prod.aud3.title": "Eltern",
    "pitch.prod.aud3.text":
      "Was schaut/hört mein Kind — und was steckt schulisch dahinter? Mit Gesprächsanlässen und parinhood-Safety-Hinweisen.",
    "pitch.prod.f1.t": "Matchmaking Medieninhalt ↔ Lehrplan",
    "pitch.prod.f1.d":
      "KI extrahiert Situationen aus YouTube, Podcasts & News und matcht sie rückwärts mit dem Lehrplan.",
    "pitch.prod.f2.t": "Fertige Lernunterlagen",
    "pitch.prod.f2.d":
      "Druck- und teilbare Unterlagen: Szenario, Einstiegsfrage und Unterrichtsidee — sofort einsetzbar.",
    "pitch.prod.f3.t": "Interaktive Whiteboard-Aufgaben",
    "pitch.prod.f3.d":
      "Schüler:innen üben direkt in der App; Antworten werden geprüft, Folgeaufgaben passend vorgeschlagen.",
    "pitch.prod.f4.t": "parinhood-Safety für Eltern",
    "pitch.prod.f4.d":
      "Altersempfehlung, Manipulationsradar und Quellen-Beleg aus der parinhood-API — „von Eltern für Eltern“.",

    "pitch.biz.chip": "Geschäftsmodell",
    "pitch.biz.h": "Heute gemeinnützig — morgen skalierbar.",
    "pitch.biz.todayChip": "Heute",
    "pitch.biz.todayH": "Vertrauen & Reichweite",
    "pitch.biz.laterChip": "Später",
    "pitch.biz.laterH": "Skalierbar & integriert",
    "pitch.biz.today1.t": "Gemeinnützig & kostenlos",
    "pitch.biz.today1.d":
      "Der Kern bleibt kostenlos und werbefrei — das schafft Vertrauen bei Schule, Schüler:innen und Eltern und baut Reichweite auf.",
    "pitch.biz.today2.t": "Beschaffung über Förderwege",
    "pitch.biz.today2.d":
      "Schulförderverein, Stiftungen und öffentliche Bildungsmittel finanzieren den Betrieb — realistisch und marktüblich für gemeinnützige Bildung.",
    "pitch.biz.later1.t": "Abo-/Lizenzmodell für Schulen",
    "pitch.biz.later1.d":
      "Skalierbare Schul- & Träger-Lizenzen (B2B/B2G) für Mehrwert-Funktionen — nie eine Paywall für den Kern.",
    "pitch.biz.later2.t": "MCP-/API-Integration",
    "pitch.biz.later2.d":
      "Inhalte und Analysen lassen sich direkt in Schul-/Verwaltungssysteme & LMS ziehen — Anschluss statt Insellösung.",
    "pitch.biz.later3.t": "Analyse-Dashboards",
    "pitch.biz.later3.d":
      "Engagement- und Lernfortschritts-Auswertungen in höheren Pricing-Tiers — für Schulen und Träger.",
    "pitch.biz.valueH": "Nutzen für die Kids: Motivation, Alltagsbezug, spielerisch.",
    "pitch.biz.priceLabel": "Marktpreis-Vergleich:",
    "pitch.biz.prices": "eduki|0,60–19,99 € je Material;;lehrer-online|Premium ~7,99 €/Monat;;meinUnterricht|Abo ~19,90 €/Monat",

    "pitch.road.chip": "Roadmap",
    "pitch.road.h": "Vom Prototyp zur Skalierung.",
    "pitch.road.p0.phase": "Phase 0",
    "pitch.road.p0.titel": "Prototyp",
    "pitch.road.p0.d":
      "Bubble-System, Lehrkraft-/Schüler-View, Szenario-Impulse ohne Creator, interaktives Üben, erste Live-Matches (Deutsch, Mathe).",
    "pitch.road.p1.phase": "Phase 1",
    "pitch.road.p1.titel": "Stabilisieren",
    "pitch.road.p1.d":
      "YouTube-Pipeline regelmäßig laufen lassen & cachen, Seeds pro Bubble verfeinern, Podcast-RSS und News-Ingest.",
    "pitch.road.p2.phase": "Phase 2",
    "pitch.road.p2.titel": "Personalisierung",
    "pitch.road.p2.d":
      "YouTube-OAuth-Login, personalisierter Feed innerhalb der Bubble, Content-Safety, Feedback speichern (Passt/Verwerfen).",
    "pitch.road.p3.phase": "Phase 3",
    "pitch.road.p3.titel": "Pilot-Klasse",
    "pitch.road.p3.d":
      "Echte Pilot-Klasse, mehr Fächer und Bundesland-Seeds, Messung von Engagement.",
    "pitch.road.p4.phase": "Phase 4",
    "pitch.road.p4.titel": "Skalierung",
    "pitch.road.p4.d": "TikTok/Instagram-Trends, Community, LMS-Anschluss.",

    "pitch.team.chip": "Team & Trägerschaft",
    "pitch.team.h": "Ein gemeinnütziges Vater-Sohn-Projekt.",
    "pitch.team.text":
      "Lernassistent entsteht als gemeinnütziges noorder-Projekt — gebaut von Vater und Sohn. Der Sohn bringt ein, was Jugendliche wirklich schauen; der Vater die technische Pipeline. Gemeinsam: die Zielgruppen-Views und die Demo-Story.",

    "pitch.cta.h": "Pilotklassen & Förderpartner gesucht.",
    "pitch.cta.text":
      "Wir suchen Pilot-Klassen, die mit uns die Neugier-Brücke testen — und Förderpartner, die einen kostenlosen, werbefreien Lernassistenten möglich machen.",
    "pitch.cta.teacher": "Für Lehrkräfte",
    "pitch.cta.student": "Für Schüler:innen",
    "pitch.cta.parent": "Für Eltern",
  },

  en: {
    /* Header / Nav */
    "nav.lehrkraft": "Teachers",
    "nav.schueler": "Students",
    "nav.eltern": "Parents",
    "nav.langLabel": "Language",

    /* Footer */
    "footer.brand": "Lernassistent",
    "footer.tagline":
      "A non-profit project. We turn what teenagers really watch and listen to into a curiosity bridge to the curriculum — free, ad-free and privacy-friendly.",
    "footer.pitch": "Pitch & concept",
    "footer.legal": "© {year} Lernassistent · GDPR-compliant · Hosted in the EU",

    /* Landing — Hero */
    "home.hero.chip": "Non-profit · free · ad-free",
    "home.hero.title.a": "Turning media into ",
    "home.hero.title.b": "lessons",
    "home.hero.subtitle":
      "We give time back: from what teenagers actually watch and listen to, we create matching lesson starters and exercises aligned with the curriculum in minutes — for teachers, students and parents.",
    "home.hero.ctaTeacher": "Get started as a teacher",
    "home.hero.ctaParent": "Explore for parents",
    "home.hero.badge1": "✅ No YouTuber names",
    "home.hero.badge2": "✅ Human in the loop",
    "home.hero.badge3": "✅ GDPR-compliant, EU hosting",
    "home.example.chip": "Current example",
    "home.example.context": "Grade 6 · German",
    "home.example.situation": "A situation from everyday life",
    "home.example.question": "Ready-made opening question",
    "home.example.note":
      "“Just a chat message” becomes a curriculum starter — that’s exactly what Lernassistent does.",

    /* Landing — Audiences */
    "home.audiences.heading": "Who are you here as?",
    "home.audiences.open": "Open →",
    "home.aud.teacher.title": "For teachers",
    "home.aud.teacher.text":
      "From a curriculum topic to timely lesson starters, opening questions and ready-made lessons.",
    "home.aud.student.title": "For students",
    "home.aud.student.text":
      "Your everyday life is full of school content — discover it and practise interactively right away.",
    "home.aud.parent.title": "For parents",
    "home.aud.parent.text":
      "What your child watches — and the school content behind it, with conversation starters.",

    /* Landing — How it works */
    "home.how.heading": "How it works",
    "home.step1.t": "Spot the consumption",
    "home.step1.d": "What teenagers really watch on YouTube, in podcasts & news.",
    "home.step2.t": "Map it to the curriculum",
    "home.step2.d": "AI extracts the situation and matches it with the curriculum.",
    "home.step3.t": "Deliver starter & exercise",
    "home.step3.d":
      "Scenario, opening question, ready-made lesson — plus exercises for students.",

    /* Landing — What makes us different */
    "home.diff.heading": "What makes us different",
    "home.diff.text.a":
      "Other platforms tag finished teaching material. We start with what children watch ",
    "home.diff.text.strong": "voluntarily",
    "home.diff.text.b":
      " and build the bridge back to the required curriculum — scenario-based, without creator names, with the teacher as the decision-maker.",

    /* Audience views — Controls */
    "ctrl.ageGroup": "Age group",
    "ctrl.subject": "Subject",
    "ctrl.topic": "Curriculum topic",
    "ctrl.chooseTopic": "Choose topic",
    "view.impulses": "impulses",
    "view.sampleData": "Sample data",
    "view.live": "Live",
    "view.empty":
      "No impulses for this selection yet — they’ll be added via the pipeline or sample data.",

    /* Teacher */
    "teacher.title": "Teachers",
    "teacher.subtitle":
      "From a curriculum topic to timely starters & ready-made material",
    "teacher.coreConcept": "Core concept:",
    "teacher.openMaterialFor": "📄 Open learning material for “{topic}”",
    "teacher.inMediaNow": "Currently in the media:",
    "teacher.whyCurriculum": "Why this fits the curriculum:",
    "teacher.starterQuestion": "Opening question:",
    "teacher.lessonIdea": "Lesson idea:",
    "teacher.openFullMaterial": "📄 Open full material",
    "teacher.fits": "Fits",
    "teacher.discard": "Discard",
    "teacher.confirmed": "✅ Confirmed",
    "teacher.discarded": "Discarded",
    "teacher.appearsInMedia": "Appears in the media: {hook}",

    /* Student */
    "student.title": "Students",
    "student.subtitle":
      "Your everyday life is full of school content — discover & practise",
    "student.tab.discover": "🔎 Discover",
    "student.tab.practice": "✏️ Practise",
    "student.points": "⭐ {n} points",
    "student.challenge": "🎯 Your challenge",
    "student.done": "✅ Done",
    "student.markDone": "Mark as done",
    "student.noExercises":
      "There are no automatic exercises for this subject yet.",

    /* Parent */
    "parent.title": "Parents",
    "parent.subtitle":
      "What your child watches — and the school content behind it",
    "parent.consumeSummary": "📱 What is your child watching or listening to right now?",
    "parent.consumePlaceholderName": "e.g. gaming streams, podcasts, news",
    "parent.consumePlaceholderWhy": "Why? (optional)",
    "parent.add": "Add",
    "parent.heading": "Here’s the school content in typical everyday situations:",
    "parent.isSchoolStuff": "This is school content:",
    "parent.talkWithChild": "Talk with your child:",
    "parent.tip": "Tip:",

    /* Exercise */
    "ex.noTaskFor":
      "There’s no automatic exercise for “{topic}” yet — use the tasks from the material.",
    "ex.yes": "Yes",
    "ex.no": "No",
    "ex.answerPlaceholder": "Your answer",
    "ex.check": "Check",
    "ex.showSolution": "Show solution",
    "ex.newTask": "New task",
    "ex.correct": "✅ Correct! {solution}",
    "ex.wrong": "Not yet — try again or show the solution.",
    "ex.revealed": "💡 {solution}",

    /* Material modal */
    "mat.materialMeta": "Learning material · {meta}",
    "mat.print": "🖨️ Print",
    "mat.download": "⬇️ Download",
    "mat.share": "🔗 Share",
    "mat.close": "Close",
    "mat.copied": "Copied to clipboard ✓",
    "mat.shareUnavailable": "Sharing not available",
    "mat.shareText":
      "Teaching material “{title}” ({meta}) — Lernassistent, non-profit & free.",
    "mat.tab.full": "📄 Full material",
    "mat.tab.whiteboard": "🖥️ Whiteboard task",
    "mat.mediaCurriculum": "Media content ↔ curriculum",
    "mat.inMediaNow": "Currently in the media:",
    "mat.curriculumLink": "Curriculum link:",
    "mat.whyFits": "Why it fits:",
    "mat.goal": "Learning goal:",
    "mat.starterQuestion": "Opening question:",
    "mat.sequence": "Lesson flow",
    "mat.worksheet": "Worksheet",
    "mat.showSolutions": "Show solutions",
    "mat.hideSolutions": "Hide solutions",
    "mat.differentiation": "Differentiation",
    "mat.easier": "Easier",
    "mat.harder": "Harder",
    "mat.whiteboardHint":
      "Solve it with the class on the digital whiteboard — “Show solution” reveals the answer.",
    "mat.minShort": "min",

    /* MaterialBlock (inline details) */
    "matblock.showLesson": "📄 Show ready-made lesson — {title}",
    "matblock.goal": "Learning goal:",
    "matblock.sequence": "Lesson flow",
    "matblock.worksheet": "Worksheet",
    "matblock.solutions": "Solutions",
    "matblock.easier": "Easier",
    "matblock.harder": "Harder",

    /* Pitch deck */
    "pitch.nav.prev": "← Back",
    "pitch.nav.next": "Next →",
    "pitch.nav.prevAria": "Previous slide",
    "pitch.nav.nextAria": "Next slide",
    "pitch.nav.toSlide": "Go to slide {n}",

    "pitch.title.chip": "Pitch & concept · non-profit",
    "pitch.title.h.a": "Turning media into ",
    "pitch.title.h.b": "lessons",
    "pitch.title.sub":
      "Teenagers spend hours on YouTube, podcasts and news. In class, the same content often feels dry. We build the curiosity bridge — from real consumption back to the curriculum.",
    "pitch.title.b1": "✅ No creator names",
    "pitch.title.b2": "✅ Human in the loop",
    "pitch.title.b3": "✅ GDPR-compliant, EU hosting",

    "pitch.problem.chip": "The problem",
    "pitch.problem.h": "Curiosity outside, dry content inside.",
    "pitch.problem.students.t": "Students",
    "pitch.problem.students.d":
      "They’re curious on YouTube, podcasts and news — but don’t see that what they consume relates to maths, German & co. In class, the same content feels abstract.",
    "pitch.problem.adults.t": "Teachers & parents",
    "pitch.problem.adults.d":
      "They don’t have time to watch, listen to and read everything themselves. Finding timely, “trending” hooks and turning them into lessons takes too much preparation.",

    "pitch.market.chip": "Market analysis",
    "pitch.market.h": "A large education market — with a clear entry path.",
    "pitch.market.sub.a": "TAM/SAM/SOM for the German education/EdTech market. ",
    "pitch.market.sub.strong": "All figures are rough estimates",
    "pitch.market.sub.b":
      " — teacher/school figures per Destatis (2024/25), market volume derived from EdTech benchmarks.",
    "pitch.market.estimate": "Estimate",
    "pitch.market.tam.label": "Total market",
    "pitch.market.tam.wert": "~€1.5 bn",
    "pitch.market.tam.d":
      "Germany’s education/EdTech market (digital learning offerings). Germany is roughly ~8% of a global EdTech market of ~$190 bn.",
    "pitch.market.sam.label": "Serviceable market",
    "pitch.market.sam.wert": "~800,000 teachers · ~40,000 schools",
    "pitch.market.sam.d":
      "General secondary schools (lower/upper) in Germany plus their teachers — our primary user base (Destatis: ~851,000 teachers in 2024/25).",
    "pitch.market.som.label": "Realistic within 1–3 years",
    "pitch.market.som.wert": "~50–500 pilot schools",
    "pitch.market.som.d":
      "Pilot schools and support circles reachable via school support associations, foundations and public funding during the launch period.",

    "pitch.comp.chip": "Competition",
    "pitch.comp.h": "A material-marketplace market — with an open flank.",
    "pitch.comp.sub":
      "The established platforms are marketplaces for finished worksheets & lesson plans — all top-down and almost exclusively for teachers.",
    "pitch.comp.competitors": "eduki|Marketplace, teachers only;;lehrer-online|Editorial + AI, top-down;;schulportal|Free, teachers only;;4teachers|Community, dated UX;;meinUnterricht|Publisher subscription + AI “Muki”",
    "pitch.comp.whitespaceH": "Our whitespace",
    "pitch.comp.ws1.t": "Bottom-up instead of top-down",
    "pitch.comp.ws1.d":
      "Starting from the age group’s real media consumption, not from an editorial selection. No one else does this.",
    "pitch.comp.ws2.t": "Three audiences instead of just teachers",
    "pitch.comp.ws2.d":
      "Teachers, students and parents on the same data foundation — the market is almost purely teacher-focused.",
    "pitch.comp.ws3.t": "Scenario instead of material",
    "pitch.comp.ws3.d":
      "“A situation from the chat/stream” as the starter — not the finished PDF as the core object.",

    "pitch.sol.chip": "Solution & value proposition",
    "pitch.sol.h": "Contribute — without having to watch everything yourself.",
    "pitch.sol.sub.a": "Teachers ",
    "pitch.sol.sub.strong": "and",
    "pitch.sol.sub.b":
      " parents can contribute to current topics without spending hours watching, listening or reading themselves — confident that the content children are experiencing is meaningfully woven into the curriculum.",
    "pitch.sol.v1.t": "Contribute without upfront effort",
    "pitch.sol.v1.d":
      "Teachers and parents don’t have to watch, listen or read for hours — the AI prepares the link, the human only decides “fits/discard”.",
    "pitch.sol.v2.t": "Confidence about the content",
    "pitch.sol.v2.d":
      "What children are experiencing is meaningfully and reliably woven into the curriculum — no loss of control, but a dependable curriculum link.",
    "pitch.sol.v3.t": "Playful learning",
    "pitch.sol.v3.d":
      "Voluntary media consumption becomes motivation: everyday relevance, a curiosity bridge and interactive practice instead of dry required content.",
    "pitch.sol.exLabel": "Example scenario",
    "pitch.sol.exQuote":
      "“Someone wrote in the chat: ‘He said you’re cool.’ Where’s the mistake in the direct speech?”",
    "pitch.sol.exNote":
      "Bottom-up: scenario + opening question + ready-made material — without creator names, human in the loop. “Just a chat” becomes playful, curriculum-aligned learning.",

    "pitch.prod.chip": "The product",
    "pitch.prod.h": "One data foundation, three audiences.",
    "pitch.prod.aud1.title": "Teacher",
    "pitch.prod.aud1.text":
      "Curriculum topic → timely scenarios, a ready-made opening question and usable material. Fits/discard — the teacher decides.",
    "pitch.prod.aud2.title": "Student",
    "pitch.prod.aud2.text":
      "“You know this — it’s school content too.” A hook without creator names, then practise interactively with instant feedback.",
    "pitch.prod.aud3.title": "Parents",
    "pitch.prod.aud3.text":
      "What is my child watching/listening to — and what school content is behind it? With conversation starters and parinhood safety notes.",
    "pitch.prod.f1.t": "Matchmaking media content ↔ curriculum",
    "pitch.prod.f1.d":
      "AI extracts situations from YouTube, podcasts & news and matches them back to the curriculum.",
    "pitch.prod.f2.t": "Ready-made learning material",
    "pitch.prod.f2.d":
      "Printable and shareable material: scenario, opening question and lesson idea — ready to use immediately.",
    "pitch.prod.f3.t": "Interactive whiteboard tasks",
    "pitch.prod.f3.d":
      "Students practise directly in the app; answers are checked and suitable follow-up tasks suggested.",
    "pitch.prod.f4.t": "parinhood safety for parents",
    "pitch.prod.f4.d":
      "Age recommendation, manipulation radar and source evidence from the parinhood API — “by parents, for parents”.",

    "pitch.biz.chip": "Business model",
    "pitch.biz.h": "Non-profit today — scalable tomorrow.",
    "pitch.biz.todayChip": "Today",
    "pitch.biz.todayH": "Trust & reach",
    "pitch.biz.laterChip": "Later",
    "pitch.biz.laterH": "Scalable & integrated",
    "pitch.biz.today1.t": "Non-profit & free",
    "pitch.biz.today1.d":
      "The core stays free and ad-free — this builds trust with schools, students and parents and grows reach.",
    "pitch.biz.today2.t": "Funding via grant channels",
    "pitch.biz.today2.d":
      "School support associations, foundations and public education funds finance operations — realistic and customary for non-profit education.",
    "pitch.biz.later1.t": "Subscription/licence model for schools",
    "pitch.biz.later1.d":
      "Scalable school & provider licences (B2B/B2G) for value-add features — never a paywall on the core.",
    "pitch.biz.later2.t": "MCP/API integration",
    "pitch.biz.later2.d":
      "Content and analytics can be pulled directly into school/admin systems & LMS — connected instead of siloed.",
    "pitch.biz.later3.t": "Analytics dashboards",
    "pitch.biz.later3.d":
      "Engagement and learning-progress reports in higher pricing tiers — for schools and providers.",
    "pitch.biz.valueH": "Value for the kids: motivation, everyday relevance, playful.",
    "pitch.biz.priceLabel": "Market price comparison:",
    "pitch.biz.prices": "eduki|€0.60–19.99 per item;;lehrer-online|Premium ~€7.99/month;;meinUnterricht|Subscription ~€19.90/month",

    "pitch.road.chip": "Roadmap",
    "pitch.road.h": "From prototype to scale.",
    "pitch.road.p0.phase": "Phase 0",
    "pitch.road.p0.titel": "Prototype",
    "pitch.road.p0.d":
      "Bubble system, teacher/student views, scenario impulses without creators, interactive practice, first live matches (German, maths).",
    "pitch.road.p1.phase": "Phase 1",
    "pitch.road.p1.titel": "Stabilise",
    "pitch.road.p1.d":
      "Run & cache the YouTube pipeline regularly, refine seeds per bubble, podcast RSS and news ingest.",
    "pitch.road.p2.phase": "Phase 2",
    "pitch.road.p2.titel": "Personalisation",
    "pitch.road.p2.d":
      "YouTube OAuth login, personalised feed within the bubble, content safety, save feedback (fits/discard).",
    "pitch.road.p3.phase": "Phase 3",
    "pitch.road.p3.titel": "Pilot class",
    "pitch.road.p3.d":
      "A real pilot class, more subjects and state-level seeds, measuring engagement.",
    "pitch.road.p4.phase": "Phase 4",
    "pitch.road.p4.titel": "Scaling",
    "pitch.road.p4.d": "TikTok/Instagram trends, community, LMS integration.",

    "pitch.team.chip": "Team & sponsorship",
    "pitch.team.h": "A non-profit father-son project.",
    "pitch.team.text":
      "Lernassistent is being built as a non-profit noorder project — by a father and son. The son contributes what teenagers really watch; the father the technical pipeline. Together: the audience views and the demo story.",

    "pitch.cta.h": "Looking for pilot classes & funding partners.",
    "pitch.cta.text":
      "We’re looking for pilot classes to test the curiosity bridge with us — and funding partners who make a free, ad-free Lernassistent possible.",
    "pitch.cta.teacher": "For teachers",
    "pitch.cta.student": "For students",
    "pitch.cta.parent": "For parents",
  },
} as const;

export type DictKey = keyof (typeof dict)["de"];

/* ---- Context ---- */

type Ctx = { lang: Lang; setLang: (l: Lang) => void };

const LanguageContext = createContext<Ctx | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Server + erster Client-Render: immer "de" → keine Hydration-Mismatch.
  const [lang, setLangState] = useState<Lang>("de");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "de" || stored === "en") setLangState(stored);
    } catch {
      /* localStorage nicht verfügbar */
    }
  }, []);

  const setLang = useCallback((l: Lang) => {
    setLangState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(() => ({ lang, setLang }), [lang, setLang]);

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang(): Ctx {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    // Fallback, falls außerhalb des Providers genutzt — kein Crash.
    return { lang: "de", setLang: () => {} };
  }
  return ctx;
}

/** Liefert eine Übersetzungsfunktion t(key, vars?). Fallback: der Key selbst. */
export function useT() {
  const { lang } = useLang();
  return useCallback(
    (key: string, vars?: Record<string, string | number>) => {
      const table = dict[lang] as Record<string, string>;
      let s = table[key] ?? (dict.de as Record<string, string>)[key] ?? key;
      if (vars) {
        for (const [k, v] of Object.entries(vars)) {
          s = s.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
        }
      }
      return s;
    },
    [lang],
  );
}
