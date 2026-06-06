"""Interaktive Aufgaben — zufällig generiert, mit Prüfung und Folgeaufgaben."""
import streamlit as st
from aufgaben_generator import generiere, generiere_followups
from pruefer import pruefen


def _mark_done(key):
    if "aufgaben_geloest" not in st.session_state:
        st.session_state.aufgaben_geloest = set()
    st.session_state.aufgaben_geloest.add(key)


def _add_followups(cfg, ergebnis):
    if "dynamic_aufgaben" not in st.session_state:
        st.session_state.dynamic_aufgaben = []
    thema_id = cfg.get("thema_id", 13)
    thema_name = cfg.get("thema_name", "")
    schw = cfg.get("schwierigkeit", 1)
    for task in generiere_followups(thema_id, thema_name, ergebnis["ok"], schw):
        task["quelle"] = "followup"
        task["thema_name"] = thema_name
        st.session_state.dynamic_aufgaben.append(task)


def _task_key(cfg, prefix):
    return f"{prefix}-{cfg['id']}"


def _get_or_create_task(m, prefix, thema_name=""):
    """Zufällige Aufgabe pro Match — bleibt bis „Neue Aufgabe“."""
    store_key = f"task_store_{prefix}_{m.get('video_id','x')}_{m['thema_id']}"
    if store_key not in st.session_state:
        st.session_state[store_key] = generiere(
            m["thema_id"], thema_name, seed=hash(store_key) % 999999
        )
    return st.session_state[store_key]


def _feedback_ergebnis(ergebnis, key, cfg):
    if ergebnis["ok"]:
        st.success(f"✅ {ergebnis['erklaerung']}")
        _mark_done(key)
    else:
        st.error(f"❌ {ergebnis['erklaerung']}")
    with st.expander("📖 Warum? So geht's"):
        st.markdown(ergebnis["detail"])
    _add_followups(cfg, ergebnis)
    neu = len(st.session_state.get("dynamic_aufgaben", []))
    st.info(f"➕ {2 if not ergebnis['ok'] else 1} neue Übungen passend dazu — siehe Tab **🎮 Üben** (insgesamt {neu} extra).")


def render_cfg(cfg, prefix, thema_name=""):
    """Eine generierte Aufgabe rendern und einreichen."""
    key = _task_key(cfg, prefix)
    if cfg.get("szenario"):
        st.caption(f"Situation: {cfg['szenario']}")
    st.markdown(cfg.get("frage", ""))

    typ = cfg["typ"]
    if typ in ("komma_mc", "bruch_mc"):
        wahl = st.radio("Antwort", cfg["optionen"], key=key + "-mc", index=None)
        if st.button("Einreichen & prüfen", key=key + "-btn"):
            if wahl is None:
                st.warning("Bitte eine Antwort wählen.")
            else:
                _feedback_ergebnis(pruefen(cfg, wahl), key, cfg)

    elif typ == "ja_nein":
        wahl = st.radio("Antwort", ["Ja", "Nein"], key=key + "-jn", index=None, horizontal=True)
        if st.button("Einreichen & prüfen", key=key + "-btn"):
            if wahl is None:
                st.warning("Bitte wählen.")
            else:
                _feedback_ergebnis(pruefen(cfg, wahl), key, cfg)

    elif typ == "zahl":
        eingabe = st.number_input("Deine Antwort", step=1, key=key + "-n")
        if st.button("Einreichen & prüfen", key=key + "-btn"):
            _feedback_ergebnis(pruefen(cfg, eingabe), key, cfg)

    elif typ == "bruch":
        c1, c2, c3 = st.columns([1, 1, 2])
        with c1:
            z = st.number_input("Zähler", min_value=0, step=1, key=key + "-z")
        with c2:
            n = st.number_input("Nenner", min_value=1, step=1, key=key + "-n")
        with c3:
            kuerz = st.radio("Kürzbar?", ["Ja", "Nein"], key=key + "-k", horizontal=True)
        if st.button("Einreichen & prüfen", key=key + "-btn"):
            _feedback_ergebnis(pruefen(cfg, {"z": z, "n": n, "kuerzbar": kuerz}), key, cfg)

    elif typ == "freitext":
        text = st.text_area("Deine Antwort", key=key + "-txt", height=100)
        if st.button("Einreichen & prüfen", key=key + "-btn"):
            _feedback_ergebnis(pruefen(cfg, text), key, cfg)

    if key in st.session_state.get("aufgaben_geloest", set()):
        st.caption("✓ Geschafft")


def render_aufgabe(m, prefix="sch", thema_name=""):
    """Interaktive Zufalls-Aufgabe zu einem Match."""
    store_key = f"task_store_{prefix}_{m.get('video_id','x')}_{m['thema_id']}"
    if m.get("schueler_challenge"):
        st.markdown(f"🎯 {m['schueler_challenge']}")

    cfg = _get_or_create_task(m, prefix, thema_name)
    cfg["thema_name"] = thema_name
    render_cfg(cfg, prefix, thema_name)

    if st.button("🔄 Neue Zufalls-Aufgabe", key=f"new-{prefix}-{m['thema_id']}-{m.get('video_id','x')}"):
        import random
        st.session_state[store_key] = generiere(m["thema_id"], thema_name, seed=random.randint(0, 999999))
        st.rerun()


def render_dynamic_aufgabe(cfg, prefix="dyn"):
    """Folgeaufgabe aus Session rendern."""
    cfg = dict(cfg)
    cfg.setdefault("thema_name", "")
    with st.container(border=True):
        st.markdown(f"🏷️ **{cfg.get('thema_name', 'Übung')}** · extra")
        render_cfg(cfg, f"{prefix}-{cfg['id']}", cfg.get("thema_name", ""))


def render_lehr_quiz(m, prefix="lehr", thema_name=""):
    cfg = _get_or_create_task(m, prefix + "-q", thema_name)
    key = _task_key(cfg, prefix)
    if cfg["typ"] not in ("komma_mc", "bruch_mc", "ja_nein"):
        return
    st.markdown("**🎮 Klasse rates mit:**")
    if cfg["typ"] == "ja_nein":
        wahl = st.radio("Antwort", ["Ja", "Nein"], key=key + "-lq", horizontal=True, index=None)
        if st.button("Auflösen", key=key + "-lbtn") and wahl:
            ergebnis = pruefen(cfg, wahl)
            if ergebnis["ok"]:
                st.success(ergebnis["erklaerung"])
            else:
                st.info(ergebnis["erklaerung"] + " — " + ergebnis["detail"][:120])
    else:
        wahl = st.radio("Antwort", cfg["optionen"], key=key + "-lq", index=None)
        if st.button("Auflösen", key=key + "-lbtn") and wahl:
            ergebnis = pruefen(cfg, wahl)
            if ergebnis["ok"]:
                st.success("✅ Genau!")
            else:
                st.info(ergebnis["erklaerung"])


def punkte_anzeigen(total):
    geloest = len(st.session_state.get("aufgaben_geloest", set()))
    extra = len(st.session_state.get("dynamic_aufgaben", []))
    if total or extra:
        label = f"{geloest} geschafft"
        if extra:
            label += f" · {extra} Extra-Übungen offen"
        st.progress(min(geloest / max(total + extra, 1), 1.0), text=label)


def render_zufalls_uebung(thema_id, thema_name, prefix="rand"):
    """Komplett zufällige Übung ohne Match."""
    store_key = f"rand_task_{thema_id}_{prefix}"
    if store_key not in st.session_state:
        st.session_state[store_key] = generiere(thema_id, thema_name)
    cfg = st.session_state[store_key]
    cfg["thema_name"] = thema_name
    render_cfg(cfg, prefix)
    if st.button("🔄 Neue Aufgabe", key=f"new-{store_key}"):
        import random
        st.session_state[store_key] = generiere(thema_id, thema_name, seed=random.randint(0, 999999))
        st.rerun()


__all__ = [
    "render_aufgabe", "render_lehr_quiz", "render_dynamic_aufgabe",
    "render_zufalls_uebung", "punkte_anzeigen",
]
