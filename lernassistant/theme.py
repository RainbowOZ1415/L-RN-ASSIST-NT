"""Globales Design — blau, klar, bildungsorientiert."""
import streamlit as st

NAV_SEITEN = [
    "Lehrkraft",
    "Schüler",
    "Üben",
    "Muster",
    "Was läuft?",
]

NAV_ICONS = {
    "Lehrkraft": "📋",
    "Schüler": "🎒",
    "Üben": "✏️",
    "Muster": "💡",
    "Was läuft?": "📱",
}


def inject_theme():
    st.markdown(
        """
        <style>
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400&display=swap');

        :root {
            --la-primary: #1565C0;
            --la-primary-soft: #E3F2FD;
            --la-primary-dark: #0D47A1;
            --la-primary-light: #42A5F5;
            --la-topbar: linear-gradient(135deg, #0D47A1 0%, #1565C0 55%, #1976D2 100%);
            --la-bg: #E8EEF7;
            --la-surface: #FFFFFF;
            --la-surface-2: #EEF4FC;
            --la-text: #0F172A;
            --la-muted: #64748B;
            --la-border: #CBD5E1;
            --la-radius: 14px;
            --la-radius-sm: 8px;
            --la-shadow: 0 1px 2px rgba(13,71,161,.08), 0 8px 24px rgba(13,71,161,.1);
            --la-topbar-h: 72px;
        }

        html, body, [class*="css"] {
            font-family: "DM Sans", system-ui, -apple-system, sans-serif !important;
        }

        .stApp {
            background: var(--la-bg) !important;
        }

        header[data-testid="stHeader"],
        footer,
        section[data-testid="stSidebar"],
        [data-testid="stSidebarCollapsedControl"],
        [data-testid="collapsedControl"] {
            display: none !important;
        }

        section.main .block-container {
            padding-top: calc(var(--la-topbar-h) + 1.25rem) !important;
            padding-left: 1.5rem !important;
            padding-right: 1.5rem !important;
            max-width: 1100px !important;
        }

        /* ── Top-Leiste blau ── */
        section.main .block-container > div > div:first-child {
            height: var(--la-topbar-h) !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            right: 0 !important;
            height: var(--la-topbar-h) !important;
            background: var(--la-topbar) !important;
            border-bottom: none !important;
            box-shadow: 0 4px 20px rgba(13,71,161,.35) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            padding: 0 1rem 0 1.25rem !important;
            gap: 0.35rem !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child {
            flex: 0 0 auto !important;
            min-width: 150px !important;
            max-width: 190px !important;
            background: transparent !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child
            [data-testid="stImage"],
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child
            [data-testid="stImage"] img {
            background: transparent !important;
            background-color: transparent !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child img {
            max-height: 46px !important;
            width: auto !important;
            filter: drop-shadow(0 1px 2px rgba(0,0,0,.15));
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"] {
            padding-top: 0 !important;
            display: flex !important;
            align-items: center !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button {
            font-size: 0.8rem !important;
            font-weight: 600 !important;
            white-space: nowrap !important;
            border-radius: 999px !important;
            min-height: 2.1rem !important;
            height: 2.1rem !important;
            padding: 0.2rem 0.75rem !important;
            transition: all .15s ease !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="primary"] {
            background: #fff !important;
            border-color: #fff !important;
            color: var(--la-primary-dark) !important;
            box-shadow: 0 2px 8px rgba(0,0,0,.15) !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="secondary"] {
            background: rgba(255,255,255,.12) !important;
            border: 1px solid rgba(255,255,255,.35) !important;
            color: #fff !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="secondary"]:hover {
            background: rgba(255,255,255,.22) !important;
            border-color: rgba(255,255,255,.55) !important;
        }
        /* Einstellungen-Button ganz rechts */
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:last-child button {
            min-width: 2.5rem !important;
            font-size: 1.1rem !important;
            padding: 0.2rem 0.55rem !important;
            background: rgba(255,255,255,.18) !important;
            border: 1px solid rgba(255,255,255,.45) !important;
            color: #fff !important;
        }

        .la-panel-title {
            font-size: 0.7rem;
            font-weight: 700;
            letter-spacing: .08em;
            text-transform: uppercase;
            color: var(--la-muted);
            margin: 0 0 0.35rem 0;
        }
        .la-page-head {
            margin: 0 0 1rem 0;
            padding-bottom: 0.75rem;
            border-bottom: 1px solid var(--la-border);
        }
        .la-page-head h1 {
            font-size: 1.45rem;
            font-weight: 700;
            color: var(--la-text);
            margin: 0 0 0.25rem 0;
        }
        .la-page-head p {
            font-size: 0.95rem;
            color: var(--la-muted);
            margin: 0;
        }
        .la-meta {
            display: inline-flex;
            flex-wrap: wrap;
            gap: 0.4rem;
            margin-bottom: 1rem;
        }
        .la-chip {
            display: inline-block;
            font-size: 0.75rem;
            font-weight: 600;
            padding: 0.2rem 0.65rem;
            border-radius: 999px;
            background: var(--la-primary-soft);
            color: var(--la-primary-dark);
            border: 1px solid rgba(21,101,192,.2);
        }
        .la-chip-muted {
            background: var(--la-surface-2);
            color: var(--la-muted);
            border-color: var(--la-border);
        }

        div[data-testid="stVerticalBlockBorderWrapper"] {
            border-radius: var(--la-radius) !important;
            border-color: var(--la-border) !important;
            box-shadow: var(--la-shadow) !important;
            background: var(--la-surface) !important;
        }
        div[data-testid="stTabs"] button {
            font-weight: 600 !important;
        }
        div[data-testid="stTabs"] button[aria-selected="true"] {
            color: var(--la-primary) !important;
            border-bottom-color: var(--la-primary) !important;
        }
        .stButton > button[kind="primary"]:not(section.main .block-container > div > div:first-child button) {
            background: var(--la-primary) !important;
            border-color: var(--la-primary) !important;
            border-radius: var(--la-radius-sm) !important;
            font-weight: 600 !important;
        }
        hr {
            border-color: var(--la-border) !important;
        }

        @media (max-width: 900px) {
            section.main .block-container > div > div:first-child
                > div[data-testid="stHorizontalBlock"] button {
                font-size: 0.65rem !important;
                padding: 0.12rem 0.4rem !important;
            }
        }
        </style>
        """,
        unsafe_allow_html=True,
    )


def page_header(title, subtitle=""):
    sub = f"<p>{subtitle}</p>" if subtitle else ""
    return f'<div class="la-page-head"><h1>{title}</h1>{sub}</div>'


def meta_chips(*chips):
    parts = []
    for text, muted in chips:
        cls = "la-chip la-chip-muted" if muted else "la-chip"
        parts.append(f'<span class="{cls}">{text}</span>')
    return f'<div class="la-meta">{"".join(parts)}</div>'
