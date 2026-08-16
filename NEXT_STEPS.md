# Next steps (parked — not actively worked, 2026-08-16 audit)

Status: not currently a priority project. This is a note for whoever (human or agent)
picks this back up, so the "interior pages broken" symptom doesn't need re-diagnosing.

## Root cause of "interior pages broken"

`backend/main.py` only imports 4 of the 22 routers that exist in `backend/app/routers/`
(`auth`, `billing`, `projects`, `design_doctor`). The other 18 — cabinets, materials,
hardware, cutlists, gcode, price_feeds, advanced_nesting, edge_banding, scrap,
ar_scanner, community_gallery, etc. — are fully written but never imported, so their
routes 404 in production.

On top of that, several frontend components (`CutListExporter.tsx`, `MaterialSelector.tsx`,
and ~9 others) call a hardcoded `http://localhost:8000/...` instead of
`NEXT_PUBLIC_API_URL`, so those calls fail in production even for routes that *are* wired.

To actually fix "broken interior pages": wire up (or deliberately delete) the orphaned
routers in `main.py`, and replace the hardcoded localhost calls with the env var.

There was already uncommitted work in progress wiring up `design_doctor` — check git
history / working tree before starting, in case that effort continues.

## Other things found in the same pass, not yet acted on

- **`DEPLOYMENT.md` is stale** — still describes a Railway deployment. Actual current
  deploy is Vercel (frontend) + Render (backend), per `render.yaml` and repo history.
- **DB may no longer be Neon.** `render.yaml`'s `DATABASE_URL` pointed at a
  Render-native Postgres host (`dpg-...`), not a `.neon.tech` hostname — contradicts
  the `reference_neon.md` memory note that says DB = Neon. Worth confirming which is
  actually live before touching either.
- **kerfos.com is still unpointed** — no domain config found anywhere in the repo.
- Cut-list nesting is a plain greedy rectangular bin-packer (no library, no NFP/genetic
  approach for irregular parts). OpenCutList / Deepnest / SVGnest are real open-source
  comparables if this becomes a priority again.
- A security fix already landed: `render.yaml`'s plaintext DB connection string was
  redacted from git (2026-08-16). **The actual Postgres password was never rotated** —
  needs to happen in the Render dashboard whenever this project is picked back up.

Full original audit: available in the 2026-08-16 session that produced this file.
