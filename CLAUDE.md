# MVP2Week — CLAUDE.md

> SaaS that helps users compose legal documents from the templates in `templates/`.
> Users talk through a guided dialogue to pick the right document and fill its fields.

## Project context

This repository contains the MVP2Week product. The current implementation is a **frontend-only prototype**; the full architecture (see *AI Design* and *Technical Design* below) adds a FastAPI backend and a Docker packaging.

The catalog of available documents is declared in the file below — Claude should treat it as the source of truth for which templates exist and how they are referenced.

@catalog.json

## Development process

When asked to implement a Jira feature:

1. Read the feature spec from Jira using the Atlassian MCP tools (search / `getJiraIssue`).
2. Implement the feature end-to-end. Do not skip steps — apply everything already learned about this codebase.
3. Test thoroughly: unit tests, integration tests. Fix anything that fails.
4. Open a PR via the GitHub MCP tools.

## AI Design

- Use the `cerebras` skill for all LLM calls in this project.
- That skill routes through LiteLLM → OpenRouter → model `gpt-oss-120b` with the **Cerebras** inference provider for very low latency.
- Always use **structured output** (Pydantic models / JSON schema) so results can be parsed and used to fill document fields.

## Technical Design

- The whole project ships as a Docker container.
- Backend: `backend/`, **uv**-managed Python project on **FastAPI**.
- Frontend: `frontend/` (Next.js, see `frontend/CLAUDE.md`).
- Shared state lives across frontend and backend; frontend uses **Redux Toolkit** as the canonical state container (server-state via RTK Query; client-state via slices).
- Run / stop scripts at the repo root start the backend and the frontend together.

## Brand colors

Neutral placeholders — **replace with the brand palette before launch**:

| Token   | Hex       | Use                          |
| ------- | --------- | ---------------------------- |
| primary | `#0f172a` | Headlines, primary buttons   |
| accent  | `#4f46e5` | Links, focus rings, CTAs     |
| neutral | `#f4f4f5` | Backgrounds                  |
| text    | `#18181b` | Body text                    |
| muted   | `#71717a` | Secondary text, helper copy  |
| success | `#16a34a` | Confirmation messages        |
| warning | `#d97706` | Non-blocking warnings        |
| danger  | `#dc2626` | Errors, destructive actions  |