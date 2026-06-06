# parinhood-Integration — Podcast-Signal & Eltern-Safety

**Stand:** 2026-06-06 · Quelle: live evaluierte parinhood/PodGuard-API
**Status:** gestartet — lauffähiger Ingester `lernassistant/ingest_parinhood.py` (Dry-Run gegen Live-API verifiziert).

---

## Warum parinhood

parinhood (intern „PodGuard", Thriends) analysiert Kinder-/Jugend-Podcasts und bietet eine
**öffentliche, maschinenlesbare API**. Das liefert uns zwei Dinge, die wir sonst selbst bauen müssten:

1. **Echtes Podcast-Inhaltssignal** (Lerneffekte, Inhalte, Werte je Folge) → Input fürs Lehrplan-Matching.
2. **Fertigen Safety-/Eignungs-Layer** (Altersempfehlung, Manipulationsradar, Eltern-Zusammenfassung) → genau das, was der **Eltern-View** braucht.

## API (öffentlich, Rate-Limit 100/h/IP)

Basis: `https://parinhood.com`

| Endpoint | Zweck |
|---|---|
| `GET /api/recent?limit=N` | Zuletzt analysierte Folgen (Liste) |
| `GET /api/podcasts` | Alle Podcasts |
| `GET /api/podcast/{slug}` | Podcast + Episodenliste |
| `GET /api/podcast/{podcast}/{episode}` | **Detailanalyse** je Folge |
| `GET /api/stats` · `/api/search` | Statistik · Suche |
| `POST /api/feedback` · `/api/youth-feedback` · `/api/newsletter` | Rückkanäle |
| `…/api/macher/*` | Auth (JWT) — für Podcast-Macher, für uns irrelevant |

### Relevante Felder (Detailanalyse)
- `episode_title`, `podcast_name`, `recommended_age` (z.B. „ab 14"), `target_age_group`, `overall_score` (1–10)
- `lerneffekte: string[]` — **stärkster Matching-Input** (lehrplannahe Lerninhalte)
- `categories.{sprache,inhalt,werte}` → `{score, flags, examples[]}`; `faktencheck`
- `eltern_zusammenfassung`, `empfehlung`
- `manipulations_radar` (emotionale/fakten/politische Beeinflussung, versteckte Werbung, sexualisierte Inhalte, grenzueberschreitungen, psychische_gewalt, lockin_effekte) — Stufen KEINE/NIEDRIG/MITTEL/HOCH
- `kritische_stellen[]` (`timestamp`, `beschreibung`, `kategorie`, `schweregrad`), `entitaeten[]` (optional je Folge)

## Use Case 1 — Inhaltssignal → Lehrplan-Matching (umgesetzt)

`ingest_parinhood.py` holt `/api/recent` (+ Detail) und schreibt **Pipeline-kompatible** Einträge nach
`data/transcripts.json` (`{id, titel, kanal, quelle:"podcast", transkript}`). Der `transkript`-Text
wird aus `eltern_zusammenfassung` + `lerneffekte` + `categories.examples` + `empfehlung` gebaut.
Danach läuft die bestehende Pipeline unverändert:

```bash
cd lernassistant
python ingest_parinhood.py            # echte Folgen -> data/transcripts.json
python extract.py                     # Themen/Entitäten je Folge
BUBBLE_ID=klasse_10_plus SEED_FILE=seed_mathe.json MATCHES_OUT=data/matches_mathe.json python match.py
```

Beispiel (live): „Billionen – Die Wahrheit über Deutschlands Superreiche" (ab 14) →
Lerneffekte zu Einkommen/Vermögen, Kapitalanlagen, Steuerarten → matcht u.a. **Prozentrechnung,
Daten/Diagramme** (Mathe) und **Medien & Sprache** (Deutsch).

## Use Case 2 — Safety-Layer für den Eltern-View (vorbereitet)

Jeder Ingest-Eintrag trägt einen `parinhood`-Block:
`{recommended_age, target_age_group, overall_score, manipulations_radar, empfehlung, quelle_url}`.
Im Eltern-View ersetzt/ergänzt das unsere handgeschriebenen `safety`-Hinweise durch **echte,
quellenbelegte** Einschätzungen („von Eltern für Eltern").

**Mapping ins Match-Schema** (siehe [[07_Wettbewerbsanalyse]], SCHEMA): aus `manipulations_radar`
≥ MITTEL bzw. `recommended_age` wird `eltern.safety` befüllt; `empfehlung`/`quelle_url` als Beleg.

## Datenfluss

```
parinhood API ──ingest_parinhood.py──> transcripts.json ──extract──> extracted ──match──> matches_*.json
       │                                                                                      │
       └──(parinhood-Block: Safety/Alter)───────────────────────────────────────────────────┘
                                                                       └─> Eltern-View (web/) Safety
```

## Datenschutz / Betrieb
- Nur **öffentliche** Endpunkte, kein Login, keine personenbezogenen Daten.
- Rate-Limit 100/h/IP → Ingest gebatcht/gecacht laufen lassen, nicht live im Request-Pfad.
- Quelle immer verlinken (`quelle_url`) — Transparenz, parinhood-Attribution.

## Nächste Schritte
1. `eltern.safety` im Match-Output aus dem `parinhood`-Block automatisch befüllen (kleine Pipeline-Erweiterung in `match.py`/Post-Step).
2. Eltern-View (`web/`) zeigt Altersempfehlung + Manipulationsradar als Badge + „Quelle: parinhood".
3. `entitaeten` (wenn vorhanden) zusätzlich als Matching-Hinweis nutzen.
4. Optional: gemeinsame Bubbles ↔ `target_age_group` mappen (ab 5/6/14 → klasse_4_5/6/10_plus).
