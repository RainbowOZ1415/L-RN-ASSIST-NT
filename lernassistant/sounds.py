"""Sound-Effekte — Entry, Klick, Entfernen, Swipe beim Scrollen in Dropdowns."""
import base64
import os

import streamlit as st

ASSETS = os.path.join(os.path.dirname(__file__), "assets")
_CACHE = {}

DELETE_LABELS = ("verwerfen", "leeren", "entfernen", "löschen", "delete")
SOUND_VOLUMES = {"click": 0.08, "entry": 0.1, "delete": 0.09, "swipe": 0.06}


def _audio_b64(filename):
    if filename not in _CACHE:
        with open(os.path.join(ASSETS, filename), "rb") as f:
            _CACHE[filename] = base64.b64encode(f.read()).decode()
    return _CACHE[filename]


def inject_sounds():
    sounds = {name: _audio_b64(f"{name}.wav") for name in ("click", "entry", "delete", "swipe")}
    delete_pattern = "|".join(DELETE_LABELS)
    init_lines = "\n".join(
        f'{name}: new Audio("data:audio/wav;base64,{b64}"),' for name, b64 in sounds.items()
    )
    volume_lines = "\n".join(
        f"window.__laSounds.{name}.volume = {vol};" for name, vol in SOUND_VOLUMES.items()
    )
    patch_lines = "\n".join(
        f"""if (!window.__laSounds.{name}) {{
                window.__laSounds.{name} = new Audio("data:audio/wav;base64,{sounds[name]}");
                window.__laSounds.{name}.volume = {SOUND_VOLUMES[name]};
            }}"""
        for name in ("delete", "swipe")
    )
    st.html(
        f"""
        <div id="la-sounds-host" style="display:none" aria-hidden="true"></div>
        <script>
        (function() {{
            if (!window.__laSounds) {{
                window.__laSounds = {{ {init_lines} }};
            }} else {{
                {patch_lines}
            }}
            {volume_lines}

            const deleteRe = /({delete_pattern})/i;
            let swipeCooldown = 0;

            function playEntry() {{
                if (sessionStorage.getItem("la_entry_ok") === "1") return;
                window.__laSounds.entry.currentTime = 0;
                window.__laSounds.entry.play().then(function() {{
                    sessionStorage.setItem("la_entry_ok", "1");
                }}).catch(function() {{}});
            }}

            function play(name) {{
                const s = window.__laSounds[name];
                if (!s) return;
                s.currentTime = 0;
                s.play().catch(function() {{}});
            }}

            function playSwipe() {{
                const now = Date.now();
                if (now - swipeCooldown < 100) return;
                swipeCooldown = now;
                play("swipe");
            }}

            function dropdownOpen() {{
                return !!document.querySelector(
                    '[data-baseweb="popover"]:not([hidden]), [role="listbox"]:not([hidden])'
                );
            }}

            function inDropdownList(target) {{
                return !!(target && target.closest &&
                    target.closest('[role="listbox"], [data-baseweb="popover"]'));
            }}

            function isDeleteAction(target) {{
                const btn = target.closest("button, [role='button']");
                if (target.closest('[data-baseweb="tag"]') && btn) return true;
                if (!btn) return false;
                const label = (btn.innerText || btn.textContent || "").trim();
                if (deleteRe.test(label)) return true;
                const hint = (
                    btn.getAttribute("aria-label") ||
                    btn.getAttribute("title") ||
                    ""
                ).toLowerCase();
                return /remove|löschen|entfernen|clear|delete|close/.test(hint);
            }}

            if (!window.__laClickListener_v2) {{
                window.__laClickListener_v2 = true;
                document.addEventListener("click", function(e) {{
                    playEntry();
                    if (e.target.closest('[role="option"]')) {{
                        play("click");
                        return;
                    }}
                    if (isDeleteAction(e.target)) {{
                        play("delete");
                        return;
                    }}
                    const btn = e.target.closest("button");
                    if (!btn) return;
                    play("click");
                }}, true);
            }}

            if (!window.__laScrollListener) {{
                window.__laScrollListener = true;

                document.addEventListener("wheel", function(e) {{
                    if (inDropdownList(e.target)) playSwipe();
                }}, {{ capture: true, passive: true }});

                document.addEventListener("scroll", function(e) {{
                    if (e.target.matches && e.target.matches('[role="listbox"]')) playSwipe();
                }}, true);

                document.addEventListener("keydown", function(e) {{
                    if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
                    if (dropdownOpen() || e.target.closest('[data-baseweb="select"]')) {{
                        playSwipe();
                    }}
                }}, true);

                let lastHighlight = null;
                new MutationObserver(function(mutations) {{
                    for (const m of mutations) {{
                        if (m.type !== "attributes") continue;
                        if (m.attributeName === "aria-selected") {{
                            const el = m.target;
                            if (el.getAttribute("aria-selected") === "true" && el !== lastHighlight) {{
                                lastHighlight = el;
                                playSwipe();
                            }}
                        }}
                        if (m.attributeName === "aria-activedescendant") {{
                            playSwipe();
                        }}
                    }}
                }}).observe(document.body, {{
                    subtree: true,
                    attributes: true,
                    attributeFilter: ["aria-selected", "aria-activedescendant"],
                }});
            }}

            playEntry();
        }})();
        </script>
        """,
        unsafe_allow_javascript=True,
    )
