# Project Log — MVP2Week

**Date:** 2026-06-29 (update)
**Session summary**

> Adds a new session block beneath the original 2026-06-27 entry. The first session is preserved verbatim below, then today's operations are appended.

---

## Original session — 2026-06-27

## What we did today

### 1. Created issue #1 in `shevchenkoom-pixel/MVP2Week`
- **Title:** "Create README.md file for the repository"
- **Type:** Task
- **Purpose:** Track the need for a project README that documents what MVP2Week is, how to install/run it, and how to contribute.
- **Body:** Listed why a README matters, proposed sections, and acceptance criteria.
- **Status:** Closed as completed after the README was pushed.

### 2. Created and pushed `README.md` to GitHub
- **File:** `MVP2Week/README.md`
- **Branch:** `main` (root commit, SHA `0200ffd`)
- **Sections included:**
  - About, Features, Tech Stack
  - Getting Started (prerequisites, installation, env vars, running)
  - Project Structure
  - Available Scripts
  - Roadmap, Contributing, License, Contact
- **Why it was generic:** The local repo was empty (only `.git` and `.claude/`), so all sections are written as a template to be filled in once the actual framework/feature set is chosen.
- **Pushed via:** local `git push` (GitHub MCP token in this session had read-only access — `create_or_update_file` returned 403).

### 3. Updated the issue to reflect completion
- Closed issue #1 with reason `completed`.

---

## Services / MCPs / tools used

| Tool | Purpose today | Status |
|------|---------------|--------|
| **GitHub MCP** (`mcp__github__*`) | Created issue #1, verified repo, closed issue, read back pushed `README.md` | Existing — already configured |
| **GitHub MCP write access** | Attempted `create_or_update_file` to push README | **Failed** (403 — token has no write scope on this repo) |
| **Local `git`** | Committed `README.md` and pushed to `origin/main` | Existing — used instead of MCP |
| **Local filesystem (`Write` tool)** | Drafted `README.md` before pushing | Existing |
| **`AskUserQuestion`** | Clarified project type (web app frontend) and README scope (generic template) | Existing |

### MCPs / services NOT added
- No new MCP servers were installed or configured today.
- No new external services (hosting, CI, analytics, error tracking, etc.) were wired up.
- No new GitHub integrations (Actions, Apps, webhooks) were added.

---

## Decisions made

- **README scope:** Generic template, not a tailored doc — chosen because the repo is empty and the actual stack isn't decided yet.
- **Tech-stack assumptions in README:** Web app frontend (per user answer), with placeholders for framework (React/Vue/Svelte), styling, and build tool.
- **License placeholder:** MIT referenced in the README — a real `LICENSE` file still needs to be committed.
- **File path:** README lives at `MVP2Week/README.md` (inside the nested `MVP2Week/` folder, which is the actual git repo root).

---

## Outstanding items / next steps

- [ ] Replace placeholder sections in `README.md` once the tech stack and feature set are decided
- [ ] Add a real `LICENSE` file (MIT recommended to match the README badge)
- [ ] Decide whether to grant the Claude GitHub MCP write scope (would let future sessions push directly without `git push`)
- [ ] First actual feature commit
- [ ] Set up CI / hosting when the app has something to deploy

---

## Artifacts produced

| Path | Location |
|------|----------|
| `MVP2Week/README.md` | Local + `origin/main` |
| `MVP2Week/Prject.MD` | Local only (this file) |
| GitHub issue #1 | https://github.com/shevchenkoom-pixel/MVP2Week/issues/1 (closed) |
| Git commit `0200ffd` | `origin/main` |

---

## Session — 2026-06-29

### 1. Created boilerplate `.gitignore` for Python FastAPI + Next.js stack
- **File:** `MVP2Week/.gitignore` (new file, 191 lines)
- **Purpose:** Standard ignore list for a typical FastAPI backend + Next.js frontend webapp, so the repo stays clean as soon as dependencies / build artifacts start appearing.
- **Sections covered:**
  - OS junk (`.DS_Store`, `Thumbs.db`, `desktop.ini`, `ehthumbs.db`, `$RECYCLE.BIN/`)
  - Editors / IDEs (`.idea/`, `.vscode/*` with whitelisted settings, swap files, Sublime)
  - Secrets / env files (`.env`, `.env.*`, `!.env.example`, `.envrc`, `*.pem`, `*.key`, `*.crt`)
  - Logs (`*.log`, `logs/`, `npm-debug.log*`, `yarn-debug.log*`, `pnpm-debug.log*`, `debugcli.log`)
  - Python / FastAPI (`__pycache__/`, `*.pyc`, `*.egg-info/`, `venv/`, `.venv/`, `.pytest_cache/`, `.coverage`, `.mypy_cache/`, `.ruff_cache/`, `*.pid`, `*.sock`, `uvicorn.pid`)
  - Node / Next.js / React (`node_modules/`, `.next/`, `out/`, `dist/`, `build/`, `next-env.d.ts`, `.eslintcache`, `.stylelintcache`)
  - Package managers (`.yarn/*`, `.pnp.*`, `.pnpm-store/`, `.npm/`)
  - Platforms (`.vercel`, `.turbo`)
  - Databases (`*.db`, `*.sqlite`, `postgres-data/`, `mongo-data/`)
  - Uploaded / generated files (`uploads/`, `storage/`, `tmp/`, `temp/`)
  - Backups / scratch (`*.bak`, `*.tmp`, `*.orig`, `*.rej`)

### 2. Committed and pushed to GitHub
- **Branch:** `main`
- **Local commit:** `55024ef` — `Add .gitignore for Python (FastAPI) + Next.js webapp stack`
- **Push result:** First `git push origin main` was **rejected** — the remote had moved ahead (PR #3 `update-readme-one-week` had been merged, taking `main` to `8d2bb2b`).
- **Resolution:** `git fetch origin` → `git pull --rebase origin main` → `git push origin main`.
- **Final remote SHA:** `7c4a70f` (`8d2bb2b..7c4a70f` on `origin/main`).
- **Resulting tree on `main`:** original `README.md` (from 2026-06-27) → README update via PR #3 → `.gitignore` (this session).

### 3. `Prject.MD` history update
- Inserted a "Session — 2026-06-29" section above the existing 2026-06-27 entry, marked as the update.
- Kept the 2026-06-27 block intact (verbatim) for the historical record.

---

## Services / MCPs / tools used (today)

| Tool | Purpose today | Status |
|------|---------------|--------|
| **Local `git`** | `add`, `commit`, `fetch`, `pull --rebase`, `push` | Existing |
| **Local filesystem (`Write` tool)** | Drafted `.gitignore`; edited `Prject.MD` | Existing |
| **`Bash` tool** | Ran git commands from the embedded terminal | Existing |

### MCPs / services NOT used or added today
- GitHub MCP was **not** invoked this session (write access was 403 anyway, per last session's note).
- No new MCP servers, external services, or GitHub integrations were added.

---

## Decisions made (today)

- **Scope of `.gitignore`:** "Boilerplate for typical Python FastAPI + Next.js webapp" — intentionally broad so it remains useful as the project evolves; easy to trim later.
- **Commit boundary:** `.gitignore` only. `Prject.MD` (the log update) is **staged but committed/pushed separately** in this same working tree (see commit note below).
- **Rebase strategy on conflict:** Used `git pull --rebase` (not merge) to keep the `.gitignore` commit as a single linear commit on top of PR #3 — cleaner history for a one-person repo.

---

## Outstanding items / next steps

- [ ] Decide whether to commit + push today's `Prject.MD` update (currently edited on disk, not yet committed)
- [ ] Replace placeholder sections in `README.md` once the tech stack and feature set are decided (carried over from 2026-06-27)
- [ ] Add a real `LICENSE` file (MIT recommended to match the README badge) (carried over)
- [ ] Decide whether to grant the Claude GitHub MCP write scope (carried over)
- [ ] First actual feature commit (carried over)
- [ ] Set up CI / hosting when the app has something to deploy (carried over)

---

## Artifacts produced (today)

| Path | Location |
|------|----------|
| `MVP2Week/.gitignore` | Local + `origin/main` (commit `7c4a70f`) |
| `MVP2Week/Prject.MD` | Local only (updated in working tree, not yet committed) |
| Git commit `7c4a70f` | `origin/main` |
