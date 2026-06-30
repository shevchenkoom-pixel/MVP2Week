# Plan — MVP2Week roadmap execution

Источник задач: Jira `PL` (project MVP2Week), cloudId `e2a5bf15-1503-4d5c-a6fc-57ed0167d6f0`.
Метод выполнения: `/feature-dev:feature-dev` — каждый тикет читается через Atlassian MCP, реализуется под архитектуру проекта (см. `CLAUDE.md`), тестируется, коммитится и открывается PR через GitHub MCP.

## Решающий порядок (Claude выбирает после PL-6)

| # | Jira   | Summary                                                | Зачем в этом порядке                                                                                                                                                          |
|---|--------|--------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 | PL-6   | Build a foundation of V1 product                       | Пользователь поставил первым. Без foundation (backend + DB + scripts) нельзя строить фичи. Fake login — единственный UI, без product-логики.                                 |
| 2 | PL-4   | Add AI Chat (still just mutual NDA)                    | AI-чат требует работающего backend и LLM-вызовов — это первая фича на новой foundation. NDA-only держит scope узким и валидирует чат-паттерн на одном документе.            |
| 3 | PL-5   | Expand to all supported document types                 | Зависит от PL-4: переиспользует чат-флоу + добавляет выбор типа документа и fallback «не поддерживается → ближайший».                                                          |
| 4 | PL-7   | Multi-user, polish, disclaimer                         | Финальная задача: sign-in/up, история документов, SaaS-полировка, legal disclaimer. Слоится поверх всего, потому что требует и AI-чат, и multi-template, и работающую БД.   |

## Конвенции (из `CLAUDE.md` и текущего состояния репо)

- Frontend: `MVP2Week/MVP2Week/frontend/` — Next.js 16.2.9 / React 19 / TS / Tailwind 4 / App Router / Turbopack. `npm run dev` → `http://localhost:3000`.
- Backend (создаётся в PL-6): `MVP2Week/MVP2Week/backend/` — FastAPI + uv + Docker. Скрипты `start.sh` / `stop.sh` (или эквивалент на Windows через `npm`/`pnpm`/`uv`).
- Temporary DB: PL-6 создаёт schema и запускает её, PL-7 использует для users и documents. Сбрасывается при рестарте сервера (требование PL-7).
- Шаблоны: `templates/` (CC BY 4.0 Common Paper) уже подключены через `catalog.json` (PL-2).
- LLM-скилл `cerebras` (LiteLLM + OpenRouter → `gpt-oss-120b` на cerebras) — используется в PL-4 и далее для structured output.
- Стиль кода: инкрементально, без оверинжиниринга, актуальные API, `uv run`/`uv add` для Python.
- Git: `main` синхронизирован с `origin/main`. Каждый тикет → feature branch → PR.

## Процесс per ticket

1. Прочитать тикет через Atlassian MCP (уже сделано для всех четырёх).
2. Запустить `/feature-dev:feature-dev` с summary тикета — скилл проведёт по архитектуре, существующему коду, даст план реализации.
3. Реализовать инкрементально, валидировать каждый шаг (lint, dev-server, smoke-test).
4. Коммит + push + PR через GitHub MCP, обновить статус в Jira (К выполнению → В работе → Готово).

## Текущий статус

- PL-6 — **К выполнению** (это старт).
- PL-4, PL-5, PL-7 — **К выполнению** (последовательно после PL-6).