# KerfOS

AI-powered cabinet design tool with cut list generation and hardware sourcing. Makes professional cabinet fabrication accessible to DIYers and small shops.

> **Kerf** *(noun)* — the width of material removed by a cutting tool; a woodworker's most fundamental measurement.

## Tech Stack

- **HTML5** — semantic markup, no templating
- **CSS3** — custom properties, Grid/Flexbox layout, responsive media queries
- **Vanilla JavaScript** — form enhancement, smooth scroll, mobile nav
- **No build step** — pure static files, zero dependencies

## Project Structure

```
KerfOs/
├── index.html          # Main landing page
├── CNAME               # GitHub Pages custom domain (kerfos.com)
├── css/
│   └── style.css       # Layout, typography, colors, responsive design
├── js/
│   └── main.js         # Form validation, smooth scroll, mobile nav
├── assets/
│   ├── favicon.svg     # Browser tab icon
│   └── og-image.svg    # Social share image (1200×630)
├── README.md           # This file
└── LICENSE             # Project license
```

## Local Development

No build tools required. Serve the files with any static server:

```bash
python3 -m http.server 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

Alternatively, open `index.html` directly in a browser (note: form submission requires a server).

## Deployment — GitHub Pages

1. **Enable GitHub Pages** in the repository: Settings → Pages → Source → Deploy from branch `main`, root (`/`).
2. The `CNAME` file in the repo root contains `kerfos.com`, which tells GitHub Pages to serve the site on the custom domain.
3. GitHub will automatically provision an SSL certificate for the custom domain.

### Cloudflare DNS Configuration

To point `kerfos.com` at GitHub Pages via Cloudflare:

1. Add a **CNAME record**: `kerfos.com` → `<github-username>.github.io` (or use A records for the apex domain pointing to GitHub's IPs).
2. Set Cloudflare **SSL/TLS mode** to **Full** — this ensures end-to-end encryption works correctly with GitHub Pages' own HTTPS.
3. Optionally enable "Always Use HTTPS" under SSL/TLS → Edge Certificates.

## Formspree Setup (Email Capture)

The sign-up form uses [Formspree](https://formspree.io) as a backend — no server required.

1. Create an account at [formspree.io](https://formspree.io).
2. Create a new form in the dashboard.
3. Copy the **form ID** (e.g., `xpznqkdl`).
4. In `index.html`, find the form action URL and replace `{FORM_ID}` with your actual form ID:
   ```html
   <form action="https://formspree.io/f/{FORM_ID}" method="POST">
   ```
5. Formspree's free tier allows 50 submissions/month, which is sufficient for pre-launch.

## Brand Guidelines

### Colors

| Token              | Value     | Description          |
|--------------------|-----------|-----------------------|
| `--color-primary`  | `#2C1810` | Dark walnut           |
| `--color-secondary`| `#8B5E3C` | Medium oak            |
| `--color-accent`   | `#D4A574` | Light maple / sawdust |
| `--color-bg`       | `#FAF6F1` | Off-white parchment   |
| `--color-cta`      | `#C45D2C` | Burnt orange CTA      |
| `--color-success`  | `#4A7C59` | Forest green          |

### Typography

- **Headings & Body:** Inter (with `system-ui, sans-serif` fallback)
- **Monospace:** JetBrains Mono / Fira Code

### Tone

Warm, precise, and craft-oriented. The brand leans into the language and ethos of woodworking — precision, quality materials, and the satisfaction of building something with your hands. Avoid generic SaaS jargon; speak to makers.
