"""Lernassistant — Medienkonsum ↔ Lehrplan, für jede Altersgruppe (Bubble)."""
import json, os
from collections import defaultdict
import streamlit as st

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
    """Bubble-spezifisch → Fach-default → universeller Fallback."""
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
    """Matches mit bubble_id oder ohne (= alle Bubbles)."""
    out = [m for m in matches if not m.get("bubble_id") or m["bubble_id"] in (bubble_id, "*")]
    return out if out else matches


# --- Config laden ---
config = load_json("bubbles.json")
bubbles = {b["id"]: b for b in config["bubbles"]}
faecher_cfg = config["faecher_config"]

st.set_page_config(page_title="Lernassistant", page_icon="🌉", layout="wide")

if "bestaetigt" not in st.session_state:
    st.session_state.bestaetigt = set()
if "konsum_liste" not in st.session_state:
    st.session_state.konsum_liste = list(DEMO_KONSUM)
if "bubble_id" not in st.session_state:
    st.session_state.bubble_id = "klasse_6"

# --- Sidebar: Bubble + Login ---
with st.sidebar:
    st.header("Bubble")
    bubble_labels = {b["id"]: f'{b["name"]} ({b["alter"]})' for b in config["bubbles"]}
    bubble_id = st.selectbox(
        "Altersgruppe",
        options=list(bubble_labels.keys()),
        format_func=lambda i: bubble_labels[i],
        key="bubble_id",
    )
    bubble = bubbles[bubble_id]
    st.caption(f'{bubble["stufe_label"]} · Niveau: {bubble["sprachniveau"]}')

    st.divider()
    st.multiselect(
        "Medien in dieser Bubble",
        KONSUM_OPTIONEN,
        default=[k for k in bubble["konsum_default"] if k in KONSUM_OPTIONEN],
        key="konsum",
    )

    st.divider()
    st.subheader("Login")
    logged_in = st.toggle("Demo: als eingeloggt", value=False, key="demo_login")
    if logged_in:
        st.success("Feed personalisiert (Demo)")
        st.caption("Später: echter YouTube/Podcast-Login — Inhalte aus **allen** Kanälen, gefiltert nach Bubble.")
    else:
        st.info("Ohne Login: typische Inhalte der Bubble")
        st.caption(
            "Mit Login wird euer persönlicher Feed genutzt — "
            "Impulse bleiben szenario-basiert, ohne Creator-Namen."
        )

st.title("🌉 Lernassistant")
st.caption(
    f'Bubble **{bubble["name"]}** · Medienkonsum → Lehrplan-Impulse · '
    "allgemein für die Altersgruppe, personalisiert mit Login"
)

fach = st.selectbox(
    "Fach",
    [f for f in faecher_cfg if f in bubble.get("faecher", faecher_cfg)],
)
fcfg = faecher_cfg[fach]

seed = load_json(fcfg["seed"])
seed = {**seed, "stufe": f'{bubble["name"]} ({bubble["stufe_label"]})'}
matches_raw, is_sample, match_path = load_matches(bubble_id, fach)
matches = filter_matches(matches_raw, bubble_id)
themen = {t["id"]: t for t in seed["themen"]}

quellen_count = defaultdict(int)
for m in matches:
    quellen_count[m.get("quelle", "youtube")] += 1

c1, c2, c3, c4 = st.columns(4)
c1.metric("Impulse", len(matches))
c2.metric("YouTube", quellen_count.get("youtube", 0))
c3.metric("Podcasts", quellen_count.get("podcast", 0))
c4.metric("News", quellen_count.get("news", 0))

parts = [f'{fcfg["emoji"]} **{seed["fach"]} · {seed["stufe"]}**']
if logged_in:
    parts.append("🔐 personalisierter Feed")
elif is_sample:
    parts.append("Sample-Daten")
else:
    parts.append("Live-Daten")
st.markdown(" · ".join(parts))

tab_lehr, tab_schuel, tab_muster, tab_konsum = st.tabs([
    "👩‍🏫 Lehrkraft", "🎒 Schüler", "🔥 Muster", "🙋 Was läuft?",
])

themen_ids = list(themen)
demo_id = fcfg.get("demo_thema_id", themen_ids[0])
demo_idx = themen_ids.index(demo_id) if demo_id in themen_ids else 0

with tab_lehr:
    st.write(
        f'Fertige **Einstiegsfragen** für {bubble["name"]} — '
        "aus typischen Situationen (Chat, Stream, Podcast), nicht aus einzelnen Kanälen."
    )
    with st.expander("Was ist eine Einstiegsfrage?"):
        st.markdown(
            'Die Frage zum Unterrichtsstart, z.B.: *"Jemand schrieb im Chat: '
            'Er sagte du bist cool. Wo ist der Fehler bei der wörtlichen Rede?"* '
            "Passt zu **jeder Bubble** — mit Login später aus eurem echten Feed."
        )
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
        with st.container(border=True):
            st.caption(quelle_label(m.get("quelle", "")))
            st.markdown(f"**Situation:** {szenario_text(m)}")
            st.markdown(f"💡 **Einstiegsfrage:** {m.get('einstiegsfrage', '')}")
            if m.get("unterrichtsidee"):
                st.markdown(f"📋 **Unterrichtsidee:** {m['unterrichtsidee']}")
            b1, b2 = st.columns(2)
            if b1.button("✅ Passt", key="ok" + key):
                st.session_state.bestaetigt.add(key)
            if b2.button("❌ Verwerfen", key="no" + key):
                st.session_state.bestaetigt.discard(key)
            if key in st.session_state.bestaetigt:
                st.success("Bestätigt")
    if not by_thema.get(sel):
        st.info("Noch keine Impulse — Pipeline oder Sample-Daten für diese Bubble.")

with tab_schuel:
    st.write(f"Bezüge zum Stoff für **{bubble['name']}** — ohne YouTuber-Namen.")
    for m in matches:
        if m.get("schueler_hook"):
            with st.container(border=True):
                st.markdown(f"🏷️ **{themen[m['thema_id']]['thema']}**")
                st.info(m["schueler_hook"])
                if m.get("schueler_challenge"):
                    st.markdown(f"🎯 {m['schueler_challenge']}")

with tab_muster:
    st.write(f"Typische **{bubble['name']}**-Situationen aus YouTube, Podcasts, News:")
    by_szenario = defaultdict(list)
    for m in matches:
        by_szenario[szenario_text(m)].append(m)
    for sz, ms in by_szenario.items():
        with st.container(border=True):
            st.markdown(f"_{sz}_")
            st.markdown("→ " + ", ".join(
                f"**{themen[m['thema_id']]['thema']}**" for m in ms))

with tab_konsum:
    st.write("Was konsumiert **diese Bubble**? (Kategorien, keine Creator-Namen)")
    with st.form("konsum"):
        name = st.text_input("z.B. Gaming-Streams, Podcasts, News")
        warum = st.text_input("Warum? (optional)")
        if st.form_submit_button("Hinzufügen") and name:
            st.session_state.konsum_liste.append({"name": name, "warum": warum})
    for e in st.session_state.konsum_liste:
        st.markdown(f"- **{e['name']}** — {e['warum']}")
    st.caption(
        "Ohne Login: Durchschnitts-Signal der Bubble. "
        "Mit Login: plus euer persönlicher Feed — gleiche Art von Impulsen."
    )
