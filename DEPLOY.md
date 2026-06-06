# Deployment — Web-App auf Vercel + eigene Domain

Die Next.js-App liegt im Unterordner **`web/`**. Vercel deployt direkt aus dem GitHub-Repo
und baut bei **jedem `git push`** automatisch neu.

## 1. Projekt bei Vercel anlegen (einmalig, im Browser)

1. Auf <https://vercel.com> mit **GitHub** anmelden.
2. **Add New… → Project** → das Repo **`RainbowOZ1415/L-RN-ASSIST-NT`** importieren
   (ggf. Vercel Zugriff auf das Repo erlauben).
3. **WICHTIG — Root Directory:** auf **`web`** setzen (Edit neben „Root Directory").
   - Framework wird automatisch als **Next.js** erkannt.
   - Build Command / Output: Standard lassen.
   - Falls vorhanden, Option **„Include files outside of the Root Directory"** aktiviert
     lassen (die App liest beim Build die Daten aus `../lernassistant`).
4. **Deploy** klicken. Nach ~1–2 Min ist die Seite unter einer
   `…vercel.app`-Adresse live.

> Auto-Deploy: Ab jetzt löst jeder Push auf `main` automatisch ein neues Deployment aus.

## 2. Eigene Domain verbinden

1. Im Vercel-Projekt → **Settings → Domains** → deine Domain eintragen (z. B. `lern-assistent.de`).
2. Vercel zeigt dir die nötigen **DNS-Einträge**. Standardmäßig:
   - **Apex/Root** (`deine-domain.de`): **A-Record** → `76.76.21.21`
   - **www** (`www.deine-domain.de`): **CNAME** → `cname.vercel-dns.com`
   *(Vercel zeigt die exakten Werte an — immer die aus Vercel verwenden.)*
3. Diese Einträge beim **Domain-Anbieter** (wo die Domain registriert ist) im DNS-Bereich
   eintragen.
4. Warten, bis DNS greift (oft Minuten, max. einige Stunden). **HTTPS macht Vercel automatisch.**

> Hinweis: Eine Domain wird über **DNS-Einträge** verbunden, nicht über eine feste IP-Verlinkung.
> Der A-Record oben *ist* die (anycast) IP von Vercel — der Domain-Anbieter braucht nur diesen Eintrag.

## 3. Daten/Build-Hinweis

- Die Seiten werden beim Build **statisch vorgerendert**; die Inhalte kommen aus den JSON
  in `lernassistant/` (Seeds, Matches). Inhalts-Änderungen werden mit dem nächsten Push live.
- Bilder (`next/image`) optimiert Vercel automatisch — keine Extra-Config nötig.

## Alternative: Vercel CLI (statt Dashboard)

```bash
cd web
npx vercel        # einmal einloggen, dann folgen
npx vercel --prod # Produktions-Deploy
```
