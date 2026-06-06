"""Antworten prüfen und erklären — ohne API."""
import re
from math import gcd


def _norm(s):
    return re.sub(r"\s+", " ", s.strip().lower().replace("…", "").replace("...", ""))


def pruefen(cfg, antwort):
    """
    Prüft eine Einreichung.
    Returns: {ok, punkte, erklaerung, detail}
    """
    typ = cfg["typ"]

    if typ in ("komma_mc", "bruch_mc"):
        if antwort is None:
            return _ergebnis(False, "Du hast noch nichts gewählt.", "Wähle eine Antwort aus.")
        idx = cfg["optionen"].index(antwort) if antwort in cfg["optionen"] else -1
        ok = idx == cfg["richtig"]
        richtig_text = cfg["optionen"][cfg["richtig"]]
        if ok:
            return _ergebnis(True, "Stimmt — gut gemacht!", cfg["loesung"])
        return _ergebnis(
            False,
            f"Leider falsch. Richtig wäre: **{richtig_text}**",
            cfg["loesung"] + "\n\n**So erkennst du es:** " + _komma_tipp(cfg),
        )

    if typ == "ja_nein":
        if antwort is None:
            return _ergebnis(False, "Bitte Ja oder Nein wählen.", "")
        erwart = "Ja" if cfg["richtig"] else "Nein"
        ok = antwort == erwart
        if ok:
            return _ergebnis(True, f"Richtig — Antwort: **{erwart}**", cfg["loesung"])
        return _ergebnis(False, f"Nein, die Antwort ist **{erwart}**.", cfg["loesung"])

    if typ == "zahl":
        try:
            val = float(str(antwort).replace(",", ".").replace("%", "").strip())
        except (TypeError, ValueError):
            return _ergebnis(False, "Das ist keine gültige Zahl.", cfg["loesung"])
        ok = abs(val - cfg["richtig"]) <= cfg.get("toleranz", 0)
        if ok:
            return _ergebnis(True, f"Richtig — **{cfg['richtig']}**!", cfg["loesung"])
        return _ergebnis(
            False,
            f"Nicht ganz — richtig ist **{cfg['richtig']}** (du: {val}).",
            cfg["loesung"],
        )

    if typ == "bruch":
        z, n = antwort.get("z"), antwort.get("n")
        kuerz = antwort.get("kuerzbar")
        if z is None or n is None:
            return _ergebnis(False, "Zähler und Nenner ausfüllen.", cfg["loesung"])
        ok = z == cfg["zaehler"] and n == cfg["nenner"]
        if ok:
            erwart = "Ja" if cfg["kuerzbar"] else "Nein"
            if kuerz != erwart:
                ok = False
                return _ergebnis(
                    False,
                    f"Bruch stimmt, aber Kürzbarkeit: **{erwart}**.",
                    cfg["loesung"],
                )
            return _ergebnis(True, "Bruch und Kürzbarkeit — alles richtig!", cfg["loesung"])
        # Teilpunkt: gleicher Wert?
        if n and n != 0 and z * cfg["nenner"] == cfg["zaehler"] * n:
            return _ergebnis(
                False,
                "Wert stimmt, aber Zähler/Nenner passen nicht zur Aufgabe.",
                cfg["loesung"],
            )
        return _ergebnis(
            False,
            f"Erwartet: **{cfg['zaehler']}/{cfg['nenner']}**.",
            cfg["loesung"],
        )

    if typ == "freitext":
        text = (antwort or "").strip()
        min_l = cfg.get("min_laenge", 10)
        if len(text) < min_l:
            return _ergebnis(
                False,
                f"Mindestens {min_l} Zeichen — erkläre etwas genauer.",
                cfg["loesung"],
            )
        keywords = cfg.get("keywords", [])
        if keywords:
            found = sum(1 for k in keywords if k.lower() in text.lower())
            ok = found >= max(1, len(keywords) // 2)
        else:
            ok = len(text.split()) >= 3
        if ok:
            return _ergebnis(
                True,
                "Abgegeben — sieht gut aus! Vergleiche mit der Musterlösung.",
                cfg["loesung"],
            )
        return _ergebnis(
            False,
            "Versuch es ausführlicher — mehr Details helfen.",
            cfg["loesung"],
        )

    return _ergebnis(False, "Unbekannter Aufgabentyp.", "")


def _ergebnis(ok, erklaerung, detail):
    return {
        "ok": ok,
        "punkte": 1 if ok else 0,
        "erklaerung": erklaerung,
        "detail": detail,
    }


def _komma_tipp(cfg):
    if cfg.get("thema_id") != 13:
        return ""
    if "sagte" in cfg.get("frage", "").lower() or "meinte" in cfg.get("frage", "").lower():
        return "Nach Verben wie „sagte/meinte/schrieb“ kommt oft ein Komma."
    if "aufl" in cfg.get("frage", "").lower() or "namen" in cfg.get("szenario", "").lower():
        return "Bei Aufzählungen steht zwischen gleichrangigen Teilen ein Komma."
    return "Einschübe werden von zwei Kommas abgetrennt."
