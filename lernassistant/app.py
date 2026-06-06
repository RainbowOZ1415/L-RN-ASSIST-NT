"""Lernassistant — Medienkonsum ↔ Lehrplan, für jede Altersgruppe (Bubble)."""
import json, os
from collections import defaultdict
import streamlit as st
from interaktiv import (
    render_aufgabe, render_lehr_quiz, render_dynamic_aufgabe,
    render_zufalls_uebung, punkte_anzeigen,
)
from theme import inject_theme, NAV_SEITEN, NAV_ICONS, page_header, meta_chips

QUELLE_BADGE = {
    "youtube": "YouTube / Stream",
    "podcast": "Podcast",
    "news": "News",
}

KONSUM_OPTIONEN = [
    "YouTube-Videos", "Live-Streams", "Chats & Kommentare",
    "Podcasts", "News", "Gaming", "Kurzclips", "Social Media",
]

DEMO_KONSUM = [
    {"name": "Gaming-Streams", "warum": "Challenges und Chats"},
    {"name": "YouTube-Kommentare", "warum": "Sprache im Alltag"},
    {"name": "Podcasts", "warum": "Gespräche und Dialoge"},
]


def load_json(path):
    with open(path) as f:
        return json.load(f)


def load_matches(bubble_id, fach_key):
    fach_slug = fach_key.lower()
    candidates = [
        f"data/bubbles/{bubble_id}/matches_{fach_slug}.json",
        f"data/bubbles/{bubble_id}/matches_{fach_slug}.sample.json",
        f"data/matches_{fach_slug}.json",
        f"data/matches_{fach_slug}.sample.json",
    ]
    for path in candidates:
        if os.path.exists(path):
            is_sample = "sample" in path or path.endswith(".sample.json")
            return load_json(path), is_sample, path
    return [], True, None


def szenario_text(m):
    return m.get("szenario") or m.get("video_titel", "")


def quelle_label(q):
    return QUELLE_BADGE.get(q, q)


def filter_matches(matches, bubble_id):
    out = [m for m in matches if not m.get("bubble_id") or m["bubble_id"] in (bubble_id, "*")]
    return out if out else matches


config = load_json("bubbles.json")
bubbles = {b["id"]: b for b in config["bubbles"]}
faecher_cfg = config["faecher_config"]

ASSETS = os.path.join(os.path.dirname(__file__), "assets")
LOGO_HEADER = os.path.join(ASSETS, "logo-header.png")
FAVICON = os.path.join(ASSETS, "favicon.png")


def render_topbar():
    inject_theme()
    if "main_nav" not in st.session_state:
        st.session_state.main_nav = NAV_SEITEN[0]

    widths = [1.4] + [1] * len(NAV_SEITEN)
    cols = st.columns(widths)
    with cols[0]:
        st.image(LOGO_HEADER, use_container_width=True)
    for i, label in enumerate(NAV_SEITEN):
        with cols[i + 1]:
            icon = NAV_ICONS.get(label, "")
            aktiv = st.session_state.main_nav == label
            if st.button(
                f"{icon} {label}",
                key=f"nav_btn_{i}",
                use_container_width=True,
                type="primary" if aktiv else "secondary",
            ):
                st.session_state.main_nav = label
                st.rerun()
    return st.session_state.main_nav


def render_filter_panel():
    st.markdown('<p class="la-panel-title">Altersgruppe</p>', unsafe_allow_html=True)
    bubble_labels = {b["id"]: f'{b["name"]} ({b["alter"]})' for b in config["bubbles"]}
    bubble_id = st.selectbox(
        "Bubble",
        options=list(bubble_labels.keys()),
        format_func=lambda i: bubble_labels[i],
        key="bubble_id",
        label_visibility="collapsed",
    )
    bubble = bubbles[bubble_id]
    st.caption(f'{bubble["stufe_label"]} · {bubble["sprachniveau"]}')

    st.markdown('<p class="la-panel-title">Fach</p>', unsafe_allow_html=True)
    fach = st.selectbox(
        "Fach",
        [f for f in faecher_cfg if f in bubble.get("faecher", faecher_cfg)],
        label_visibility="collapsed",
    )

    st.markdown('<p class="la-panel-title">Medien</p>', unsafe_allow_html=True)
    st.multiselect(
        "Medien in dieser Bubble",
        KONSUM_OPTIONEN,
        default=[k for k in bubble["konsum_default"] if k in KONSUM_OPTIONEN],
        key="konsum",
        label_visibility="collapsed",
    )

    st.markdown('<p class="la-panel-title">Konto</p>', unsafe_allow_html=True)
    logged_in = st.toggle("Als eingeloggt (Demo)", value=False, key="demo_login")
    if logged_in:
        st.success("Feed personalisiert", icon="✓")
    else:
        st.caption("Typische Inhalte der Bubble")

    return bubble_id, bubble, fach, logged_in


st.set_page_config(
    page_title="LERN-ASSISTENT",
    page_icon=FAVICON,
    layout="wide",
    initial_sidebar_state="collapsed",
)

if "bestaetigt" not in st.session_state:
    st.session_state.bestaetigt = set()
if "konsum_liste" not in st.session_state:
    st.session_state.konsum_liste = list(DEMO_KONSUM)
if "bubble_id" not in st.session_state:
    st.session_state.bubble_id = "klasse_6"
if "aufgaben_geloest" not in st.session_state:
    st.session_state.aufgaben_geloest = set()
if "dynamic_aufgaben" not in st.session_state:
    st.session_state.dynamic_aufgaben = []

seite = render_topbar()

col_panel, col_main = st.columns([1, 2.6], gap="large")

with col_panel:
    st.markdown('<div class="la-settings"></div>', unsafe_allow_html=True)
    bubble_id, bubble, fach, logged_in = render_filter_panel()

with col_main:
    fcfg = faecher_cfg[fach]
    seed = load_json(fcfg["seed"])
    seed = {**seed, "stufe": f'{bubble["name"]} ({bubble["stufe_label"]})'}
    matches_raw, is_sample, match_path = load_matches(bubble_id, fach)
    matches = filter_matches(matches_raw, bubble_id)
    themen = {t["id"]: t for t in seed["themen"]}

    daten_label = "Personalisiert" if logged_in else ("Sample" if is_sample else "Live")
    seite_icon = NAV_ICONS.get(seite, "")
    st.markdown(
        page_header(
            f"{seite_icon} {seite}",
            f'{fcfg["emoji"]} {seed["fach"]} · {bubble["name"]} · {daten_label}',
        ),
        unsafe_allow_html=True,
    )
    if matches:
        st.markdown(
            meta_chips((f"{len(matches)} Impulse", True),),
            unsafe_allow_html=True,
        )

    themen_ids = list(themen)
    demo_id = fcfg.get("demo_thema_id", themen_ids[0])
    demo_idx = themen_ids.index(demo_id) if demo_id in themen_ids else 0

    if seite == "Lehrkraft":
        by_thema = defaultdict(list)
        for m in matches:
            by_thema[m["thema_id"]].append(m)
        sel = st.selectbox(
            "Lehrplan-Thema",
            options=themen_ids,
            index=demo_idx,
            format_func=lambda i: themen[i]["thema"],
        )
        st.markdown(f"**Kernkonzept:** {themen[sel]['kernkonzept']}")
        for m in by_thema.get(sel, []):
            key = f"{bubble_id}-{fach}-{m['thema_id']}-{m['video_id']}"
            tn = themen[m["thema_id"]]["thema"]
            with st.container(border=True):
                st.caption(quelle_label(m.get("quelle", "")))
                st.markdown(f"**Situation:** {szenario_text(m)}")
                st.markdown(f"**Einstiegsfrage:** {m.get('einstiegsfrage', '')}")
                render_lehr_quiz(m, thema_name=tn)
                if m.get("unterrichtsidee"):
                    st.markdown(f"**Unterrichtsidee:** {m['unterrichtsidee']}")
                b1, b2 = st.columns(2)
                if b1.button("Passt", key="ok" + key):
                    st.session_state.bestaetigt.add(key)
                if b2.button("Verwerfen", key="no" + key):
                    st.session_state.bestaetigt.discard(key)
                if key in st.session_state.bestaetigt:
                    st.success("Bestätigt")
        if not by_thema.get(sel):
            st.info("Noch keine Impulse — Pipeline oder Sample-Daten für diese Bubble.")

    elif seite == "Schüler":
        punkte_anzeigen(len([m for m in matches if m.get("schueler_challenge")]))
        for m in matches:
            if m.get("schueler_hook"):
                tn = themen[m["thema_id"]]["thema"]
                with st.container(border=True):
                    st.markdown(f"**{tn}**")
                    st.info(m["schueler_hook"])
                    if m.get("schueler_challenge"):
                        render_aufgabe(m, prefix="sch", thema_name=tn)

    elif seite == "Üben":
        ueb_sub1, ueb_sub2 = st.tabs(["Aus Impulsen", "Zufällig & Extra"])

        with ueb_sub1:
            ueb_matches = [m for m in matches if m.get("schueler_challenge")]
            punkte_anzeigen(len(ueb_matches))
            if ueb_matches:
                sel_ueb = st.selectbox(
                    "Impuls wählen",
                    options=range(len(ueb_matches)),
                    format_func=lambda i: f"{themen[ueb_matches[i]['thema_id']]['thema']}: {szenario_text(ueb_matches[i])[:45]}…",
                    key="ueb_sel",
                )
                m = ueb_matches[sel_ueb]
                tn = themen[m["thema_id"]]["thema"]
                with st.container(border=True):
                    st.markdown(f"**Situation:** _{szenario_text(m)}_")
                    render_aufgabe(m, prefix="ueb", thema_name=tn)
            else:
                st.info("Noch keine Impulse.")

        with ueb_sub2:
            st.markdown("**Zufällige Aufgabe** zu einem Thema:")
            zuf_thema = st.selectbox(
                "Thema",
                options=themen_ids,
                index=demo_idx,
                format_func=lambda i: themen[i]["thema"],
                key="zuf_thema",
            )
            render_zufalls_uebung(zuf_thema, themen[zuf_thema]["thema"], prefix="zuf")

            st.divider()
            st.markdown("**Extra-Übungen** (nach deinen Einreichungen):")
            extras = st.session_state.dynamic_aufgaben
            if not extras:
                st.caption("Reiche eine Aufgabe ein — passende Übungen erscheinen hier.")
            else:
                for i, cfg in enumerate(reversed(extras[-10:])):
                    render_dynamic_aufgabe(cfg, prefix=f"ex{i}")
                if st.button("Extra-Übungen leeren"):
                    st.session_state.dynamic_aufgaben = []
                    st.rerun()

    elif seite == "Muster":
        by_szenario = defaultdict(list)
        for m in matches:
            by_szenario[szenario_text(m)].append(m)
        for sz, ms in by_szenario.items():
            with st.container(border=True):
                st.markdown(f"_{sz}_")
                st.markdown("→ " + ", ".join(
                    f"**{themen[m['thema_id']]['thema']}**" for m in ms))

    elif seite == "Was läuft?":
        with st.form("konsum"):
            name = st.text_input("z.B. Gaming-Streams, Podcasts, News")
            warum = st.text_input("Warum? (optional)")
            if st.form_submit_button("Hinzufügen") and name:
                st.session_state.konsum_liste.append({"name": name, "warum": warum})
        for e in st.session_state.konsum_liste:
            st.markdown(f"- **{e['name']}** — {e['warum']}")
