"""Sound-Effekte — externe engine.js + Python-Fallback nach Button-Klicks."""
import streamlit as st

VOL = {"click": 0.22, "entry": 0.25, "delete": 0.23, "swipe": 0.18}


def queue_sound(name: str):
    q = st.session_state.setdefault("_sound_queue", [])
    if isinstance(q, str):
        q = [q]
    q.append(name)
    st.session_state["_sound_queue"] = q


def inject_sounds():
    st.html(
        '<script src="/app/static/sounds/engine.js?v=5"></script>',
        unsafe_allow_javascript=True,
    )


def render_sound_queue():
    q = st.session_state.pop("_sound_queue", [])
    if isinstance(q, str):
        q = [q]
    if not q:
        return
    tags = "".join(
        f'<audio autoplay playsinline onloadeddata="this.volume={VOL.get(n, 0.2)}" '
        f'src="/app/static/sounds/{n}.wav"></audio>'
        for n in q
    )
    st.html(tags, unsafe_allow_javascript=True)
