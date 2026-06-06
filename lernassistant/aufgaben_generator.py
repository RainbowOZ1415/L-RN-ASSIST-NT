"""Zufällige Aufgaben generieren — ohne API."""
import random
import uuid
from math import gcd

NAMES = ["Mia", "Jan", "Ben", "Leo", "Emma", "Noah", "Lina", "Finn", "Sara", "Tim"]
CHAT_VERBEN = ["sagte", "meinte", "schrieb", "fragte"]
CHAT_INHALT = [
    "du bist cool", "ich schaff das nicht", "das war krass",
    "morgen geht nicht", "ich bin der Beste", "komm in den Stream",
]
EINSCHUEBE = ["finde ich", "meiner Meinung nach", "ehrlich gesagt", "glaube ich"]
KONTEXT = ["Pack-Opening", "Challenge", "Stream", "Chat", "Podcast", "Kommentar"]


def _rng(seed=None):
    return random.Random(seed if seed is not None else random.randint(0, 999999))


def _id():
    return uuid.uuid4().hex[:8]


def _shuffle_options(rng, richtig, falsch_liste):
    optionen = [richtig] + falsch_liste
    rng.shuffle(optionen)
    return optionen, optionen.index(richtig)


def gen_komma_indirekt(rng, schwierigkeit=1):
    subj = rng.choice(["Er", "Sie", "Jemand", "Ein User"])
    verb = rng.choice(CHAT_VERBEN)
    inh = rng.choice(CHAT_INHALT)
    falsch = f"{subj} {verb} {inh}."
    richtig = f"{subj} {verb}, {inh}."
    falsch_opts = [
        f"{subj}, {verb} {inh}.",
        f"{subj} {verb} {inh},.",
        f"{subj} {verb} {inh}.",
        f"Kein Komma nötig.",
    ]
    optionen, idx = _shuffle_options(rng, richtig, falsch_opts[:3])
    return {
        "id": _id(), "thema_id": 13, "typ": "komma_mc", "schwierigkeit": schwierigkeit,
        "frage": f"Wo gehört das Komma? *{falsch}*",
        "optionen": optionen, "richtig": idx,
        "loesung": f"Richtig: **{richtig}** — Komma nach „{verb}“ trennt Begleitsatz und Inhalt.",
        "szenario": f"Im {rng.choice(KONTEXT)} steht: {falsch}",
    }


def gen_komma_aufzaehlung(rng, schwierigkeit=1):
    names = rng.sample(NAMES, 3)
    falsch = f"{names[0]} {names[1]} und {names[2]} starten die Runde."
    richtig = f"{names[0]}, {names[1]} und {names[2]} starten die Runde."
    falsch_opts = [
        f"{names[0]} {names[1]}, und {names[2]} starten die Runde.",
        f"{names[0]} {names[1]} und, {names[2]} starten die Runde.",
        "Kein Komma nötig.",
    ]
    optionen, idx = _shuffle_options(rng, richtig, falsch_opts)
    return {
        "id": _id(), "thema_id": 13, "typ": "komma_mc", "schwierigkeit": schwierigkeit,
        "frage": f"Wo fehlt ein Komma? *{falsch}*",
        "optionen": optionen, "richtig": idx,
        "loesung": f"**{richtig}** — Komma zwischen Aufzählungsgliedern.",
        "szenario": f"Video-Titel: {falsch}",
    }


def gen_komma_einschub(rng, schwierigkeit=2):
    einschub = rng.choice(EINSCHUEBE)
    kern = rng.choice(["wichtig", "langweilig", "fair", "schwer", "cool"])
    falsch = f"Das ist {einschub} {kern}."
    richtig = f"Das ist, {einschub}, {kern}."
    falsch_opts = [
        f"Das, ist {einschub} {kern}.",
        f"Das ist {einschub}, {kern}.",
        "Kein Komma nötig.",
    ]
    optionen, idx = _shuffle_options(rng, richtig, falsch_opts)
    return {
        "id": _id(), "thema_id": 13, "typ": "komma_mc", "schwierigkeit": schwierigkeit,
        "frage": f"Welche Kommas sind richtig? *{falsch}*",
        "optionen": optionen, "richtig": idx,
        "loesung": f"**{richtig}** — Einschub „{einschub}“ wird von zwei Kommas eingeschlossen.",
        "szenario": f"Im Podcast: „{falsch}“",
    }


def gen_bruch_von(rng, schwierigkeit=1):
    total = rng.choice([10, 20, 24, 50, 60, 100])
    z = rng.randint(1, total - 1)
    g = gcd(z, total)
    return {
        "id": _id(), "thema_id": 2, "typ": "bruch", "schwierigkeit": schwierigkeit,
        "frage": f"**{z} von {total}** — als Bruch schreiben. Kürzbar?",
        "zaehler": z, "nenner": total, "kuerzbar": g > 1,
        "loesung": f"{z}/{total}" + (f" = {z//g}/{total//g} kürzbar" if g > 1 else " — nicht kürzbar"),
        "szenario": f"Bei einem {rng.choice(KONTEXT)}: {z} von {total} Treffer.",
    }


def gen_bruch_kuerzen_mc(rng, schwierigkeit=2):
    z = rng.randint(2, 40)
    f = rng.choice([2, 3, 4, 5, 6])
    n = z * f
    total = n * rng.choice([1, 2])
    if total <= z:
        total = n * 2
    # z* f / n*f style - use 45/60 style
    z2, n2 = z * f, n * f
    while z2 > 60:
        z2, n2 = z2 // 2, n2 // 2
    g = gcd(z2, n2)
    gek = f"{z2 // g}/{n2 // g}"
    optionen, idx = _shuffle_options(rng, gek, [f"{z2}/{n2}", f"{z2//2}/{n2}", f"{z2}/{n2//2}", "1/2"])
    return {
        "id": _id(), "thema_id": 2, "typ": "bruch_mc", "schwierigkeit": schwierigkeit,
        "frage": f"**{z2} von {n2}** — welcher gekürzte Bruch?",
        "optionen": optionen, "richtig": idx,
        "loesung": f"{z2}/{n2} = **{gek}**",
        "szenario": f"Timer: {z2} von {n2} Minuten rum.",
    }


def gen_bruch_fehlt(rng, schwierigkeit=1):
    teile = rng.choice([3, 4, 5, 6])
    fertig = rng.randint(1, teile - 1)
    fehlt = teile - fertig
    optionen, idx = _shuffle_options(
        rng, f"{fehlt}/{teile}",
        [f"{fertig}/{teile}", f"1/{teile}", f"{teile}/{teile}", "1/2"],
    )
    return {
        "id": _id(), "thema_id": 2, "typ": "bruch_mc", "schwierigkeit": schwierigkeit,
        "frage": f"**{fertig} von {teile}** Teilen fertig — welcher Anteil fehlt?",
        "optionen": optionen, "richtig": idx,
        "loesung": f"Es fehlen **{fehlt}/{teile}**.",
        "szenario": f"Projekt zu {fertig}/{teile} fertig.",
    }


def gen_prozent(rng, schwierigkeit=1):
    bruch = rng.choice([(1, 4), (1, 2), (3, 4), (1, 5), (2, 5), (1, 10)])
    z, n = bruch
    pct = round(100 * z / n)
    return {
        "id": _id(), "thema_id": 5, "typ": "zahl", "schwierigkeit": schwierigkeit,
        "frage": f"Wie viel **Prozent** sind {z}/{n}? (nur Zahl)",
        "richtig": pct, "toleranz": 0,
        "loesung": f"{z}/{n} = **{pct} %**",
        "szenario": f"Fortschritt: {z} von {n} geschafft.",
    }


def gen_wahrscheinlichkeit(rng, schwierigkeit=1):
    n = rng.choice([10, 20, 50, 100])
    return {
        "id": _id(), "thema_id": 12, "typ": "ja_nein", "schwierigkeit": schwierigkeit,
        "frage": f"Chance **1:{n}** — garantiert beim **{n}.‑mal** Treffer?",
        "richtig": False,
        "loesung": f"**Nein** — jeder Versuch ist Zufall; {n}× versuchen garantiert nichts.",
        "szenario": f"Seltenes Item: 1 von {n}.",
    }


def gen_wahrscheinlichkeit_zahl(rng, schwierigkeit=2):
    n = rng.choice([20, 25, 50, 100])
    pct = round(100 / n)
    return {
        "id": _id(), "thema_id": 12, "typ": "zahl", "schwierigkeit": schwierigkeit,
        "frage": f"**1/{n}** als Prozent? (nur Zahl, gerundet)",
        "richtig": pct, "toleranz": 1,
        "loesung": f"1/{n} ≈ **{pct} %**",
        "szenario": f"Drop-Chance: 1 von {n}.",
    }


def gen_natuerlich(rng, schwierigkeit=1):
    a, b = rng.randint(10, 99), rng.randint(10, 99)
    return {
        "id": _id(), "thema_id": 1, "typ": "zahl", "schwierigkeit": schwierigkeit,
        "frage": f"**{a} + {b}** = ?",
        "richtig": a + b, "toleranz": 0,
        "loesung": f"{a} + {b} = **{a + b}**",
        "szenario": f"Rechen-Challenge im Stream.",
    }


def gen_freitext(rng, thema_id, thema_name, schwierigkeit=1):
    prompts = {
        11: "Schreib einen übertriebenen Online-Satz und danach eine sachliche Version.",
        8: "Fasse in 2 Sätzen zusammen, was in einem typischen Stream passieren könnte.",
        4: "Nenne zwei Synonyme für „cool“ — eins umgangssprachlich, eins schriftsprachlich.",
    }
    return {
        "id": _id(), "thema_id": thema_id, "typ": "freitext", "schwierigkeit": schwierigkeit,
        "frage": prompts.get(thema_id, f"Schreib einen kurzen Satz zum Thema **{thema_name}**."),
        "min_laenge": 15,
        "loesung": "Es gibt mehrere gute Antworten — wichtig ist, dass du begründest.",
        "szenario": f"Alltagssituation aus {rng.choice(KONTEXT)}.",
        "keywords": [],
    }


GENERATOREN = {
    13: [gen_komma_indirekt, gen_komma_aufzaehlung, gen_komma_einschub],
    2: [gen_bruch_von, gen_bruch_kuerzen_mc, gen_bruch_fehlt],
    5: [gen_prozent],
    12: [gen_wahrscheinlichkeit, gen_wahrscheinlichkeit_zahl],
    1: [gen_natuerlich],
}


def generiere(thema_id, thema_name="", schwierigkeit=1, seed=None):
    """Eine zufällige Aufgabe für ein Lehrplan-Thema."""
    rng = _rng(seed)
    pool = GENERATOREN.get(thema_id)
    if pool:
        gen_fn = rng.choice(pool)
        return gen_fn(rng, schwierigkeit)
    return gen_freitext(rng, thema_id, thema_name, schwierigkeit)


def generiere_followups(thema_id, thema_name="", ok=False, schwierigkeit=1, anzahl=2):
    """Nach Einreichung passende Zufalls-Aufgaben erzeugen."""
    neue = schwierigkeit + (1 if ok else -1)
    neue = max(1, min(3, neue))
    n = anzahl if ok else anzahl + 1
    return [generiere(thema_id, thema_name, neue) for _ in range(n)]
