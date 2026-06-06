"""Live-Matches in die kuratierten Daten mergen — ergänzen statt ersetzen.

Aufruf: python merge_matches.py <basis.sample.json> <neu.json> <out.json>
Übernimmt alle Basis-Einträge und hängt neue Live-Treffer an (dedupliziert per
thema_id+video_id und per Szenario-Text). Neue Treffer werden mit "live": true
markiert.
"""
import json
import sys


def load(path):
    try:
        with open(path) as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return []


def main():
    base_f, new_f, out_f = sys.argv[1], sys.argv[2], sys.argv[3]
    base = load(base_f)
    new = load(new_f)
    seen_key = {(m.get("thema_id"), m.get("video_id")) for m in base}
    seen_sz = {m.get("szenario") for m in base}
    added = 0
    for m in new:
        key = (m.get("thema_id"), m.get("video_id"))
        if key in seen_key or m.get("szenario") in seen_sz:
            continue
        seen_key.add(key)
        seen_sz.add(m.get("szenario"))
        m["live"] = True
        base.append(m)
        added += 1
    with open(out_f, "w") as f:
        json.dump(base, f, ensure_ascii=False, indent=2)
    print(f"   merge: +{added} live (gesamt {len(base)}) -> {out_f}")


if __name__ == "__main__":
    main()
