"""Globales Design — ruhig, klar, bildungsorientiert (angelehnt an moderne Card-Layouts)."""

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
            --la-primary: #00B4D8;
            --la-primary-soft: #E8F7FC;
            --la-primary-dark: #0090AD;
            --la-accent: #6366F1;
            --la-bg: #F4F6F9;
            --la-surface: #FFFFFF;
            --la-surface-2: #EEF2F7;
            --la-text: #1E293B;
            --la-muted: #64748B;
            --la-border: #E2E8F0;
            --la-radius: 14px;
            --la-radius-sm: 8px;
            --la-shadow: 0 1px 2px rgba(15,23,42,.06), 0 8px 24px rgba(15,23,42,.06);
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
            max-width: 1280px !important;
        }

        /* ── Top-Leiste (Logo + Navigation) ── */
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
            background: var(--la-surface) !important;
            border-bottom: 1px solid var(--la-border) !important;
            box-shadow: var(--la-shadow) !important;
            z-index: 999999 !important;
            display: flex !important;
            align-items: center !important;
            padding: 0 1.25rem !important;
            gap: 0.35rem !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child {
            flex: 0 0 auto !important;
            min-width: 170px !important;
            max-width: 200px !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"]:first-child img {
            max-height: 44px !important;
            width: auto !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] [data-testid="column"] {
            padding-top: 0 !important;
            display: flex !important;
            align-items: center !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button {
            font-size: 0.82rem !important;
            font-weight: 600 !important;
            white-space: nowrap !important;
            border-radius: 999px !important;
            min-height: 2.15rem !important;
            height: 2.15rem !important;
            padding: 0.2rem 0.85rem !important;
            border: 1px solid var(--la-border) !important;
            transition: all .15s ease !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="primary"] {
            background: var(--la-primary) !important;
            border-color: var(--la-primary) !important;
            color: #fff !important;
            box-shadow: 0 2px 8px rgba(0,180,216,.35) !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="secondary"] {
            background: var(--la-surface) !important;
            color: var(--la-text) !important;
        }
        section.main .block-container > div > div:first-child
            > div[data-testid="stHorizontalBlock"] button[kind="secondary"]:hover {
            background: var(--la-primary-soft) !important;
            border-color: var(--la-primary) !important;
            color: var(--la-primary-dark) !important;
        }

        /* ── Layout: Einstellungs-Panel links ── */
        section.main div[data-testid="stHorizontalBlock"]:has(.la-settings) {
            align-items: flex-start !important;
            gap: 1.25rem !important;
        }
        section.main div[data-testid="column"]:has(.la-settings) {
            background: var(--la-surface) !important;
            border: 1px solid var(--la-border) !important;
            border-radius: var(--la-radius) !important;
            box-shadow: var(--la-shadow) !important;
            padding: 1.1rem 1rem 1.25rem !important;
            position: sticky !important;
            top: calc(var(--la-topbar-h) + 0.75rem) !important;
            max-height: calc(100vh - var(--la-topbar-h) - 1.5rem) !important;
            overflow-y: auto !important;
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
            line-height: 1.25;
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
            border: 1px solid rgba(0,180,216,.25);
        }
        .la-chip-muted {
            background: var(--la-surface-2);
            color: var(--la-muted);
            border-color: var(--la-border);
        }

        /* ── Karten & Inhalte ── */
        div[data-testid="stVerticalBlockBorderWrapper"] {
            border-radius: var(--la-radius) !important;
            border-color: var(--la-border) !important;
            box-shadow: var(--la-shadow) !important;
            background: var(--la-surface) !important;
        }
        div[data-testid="stTabs"] button {
            font-weight: 600 !important;
            border-radius: var(--la-radius-sm) var(--la-radius-sm) 0 0 !important;
        }
        .stButton > button[kind="primary"]:not(section.main .block-container > div > div:first-child button) {
            background: var(--la-primary) !important;
            border-color: var(--la-primary) !important;
            border-radius: var(--la-radius-sm) !important;
            font-weight: 600 !important;
        }
        .stButton > button[kind="secondary"] {
            border-radius: var(--la-radius-sm) !important;
        }
        div[data-testid="stMetric"] {
            background: var(--la-surface);
            border: 1px solid var(--la-border);
            border-radius: var(--la-radius-sm);
            padding: 0.5rem;
        }
        hr {
            border-color: var(--la-border) !important;
            margin: 0.85rem 0 !important;
        }
        label[data-testid="stWidgetLabel"] p,
        .stMarkdown p, .stMarkdown li {
            color: var(--la-text);
        }

        @media (max-width: 900px) {
            section.main .block-container > div > div:first-child
                > div[data-testid="stHorizontalBlock"] button {
                font-size: 0.68rem !important;
                padding: 0.15rem 0.45rem !important;
            }
            section.main div[data-testid="column"]:has(.la-settings) {
                position: relative !important;
                top: 0 !important;
                max-height: none !important;
                width: 100% !important;
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
