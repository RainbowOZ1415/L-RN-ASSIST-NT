"""Sound-Effekte — engine.js im Hauptdokument + Fallback-Audio nach Button-Klicks.

Streamlit rendert `components.html` in einem same-origin srcdoc-Iframe. Von dort aus
injizieren wir die Engine ins Eltern-Dokument (window.parent), damit sie die echten
Klicks der Streamlit-Oberfläche hört. `st.html` scheidet aus: es filtert <script> heraus.
"""
import streamlit as st
import streamlit.components.v1 as components

VOL = {"click": 0.22, "entry": 0.25, "delete": 0.23, "swipe": 0.18}


def queue_sound(name: str):
    q = st.session_state.setdefault("_sound_queue", [])
    if isinstance(q, str):
        q = [q]
    q.append(name)
    st.session_state["_sound_queue"] = q


def inject_sounds():
    """engine.js einmalig ins Hauptdokument laden (idempotent über die ID)."""
    components.html(
        """
        <script>
        (function () {
          try {
            var d = window.parent.document;
            if (d.getElementById("la-sound-engine")) return;
            var s = d.createElement("script");
            s.id = "la-sound-engine";
            s.src = "/app/static/sounds/engine.js?v=5";
            d.body.appendChild(s);
          } catch (e) {}
        })();
        </script>
        """,
        height=0,
    )


def render_sound_queue():
    """Vom Server angestoßene Sounds (nach Rerun) im Hauptfenster abspielen."""
    q = st.session_state.pop("_sound_queue", [])
    if isinstance(q, str):
        q = [q]
    if not q:
        return
    plays = "".join(f'play("{n}", {VOL.get(n, 0.2)});' for n in q)
    components.html(
        f"""
        <script>
        (function () {{
          var w = window.parent || window;
          function play(name, vol) {{
            try {{
              var a = new w.Audio("/app/static/sounds/" + name + ".wav");
              a.volume = vol;
              a.play().catch(function () {{}});
            }} catch (e) {{}}
          }}
          {plays}
        }})();
        </script>
        """,
        height=0,
    )
