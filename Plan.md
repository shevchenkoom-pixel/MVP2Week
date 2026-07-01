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

- PL-6 — **Готово** ✅ (PR #5 слит, smoke 3/3, pytest 5/5, build clean, Jira → «Готово»).
- PL-4 — **К выполнению** (следующий: AI Chat поверх foundation, только Mutual NDA).
- PL-5 — **К выполнению** (после PL-4: расширение на все типы документов).
- PL-7 — **К выполнению** (финальный: multi-user, polish, disclaimer).

---

## PL-6 — фактический прогресс (2026-07-01)

Ветка: `feat/pl-6-v1-foundation` (8 коммитов, 1 остался + smoke + PR).

### Сделанные коммиты

| #  | SHA       | Что                                                                                                              |
|----|-----------|------------------------------------------------------------------------------------------------------------------|
| 1  | `514df07` | Scaffold backend: uv + FastAPI + SQLAlchemy 2.x + Pydantic Settings. `GET /health` (200, `{"status":"ok"}`).    |
| 2  | `98f3ebc` | `POST /auth/fake-login` + `GET /api/catalog` + 5 pytest. `bootstrap.engine.dispose()` перед `unlink()` для Windows. `datetime.utcnow` → `datetime.now(timezone.utc)`. |
| 3  | `83668fe` | Redux Toolkit + Provider в Next.js layout. `lib/store/{authSlice,api,index}.ts`, `app/providers.tsx`.           |
| 4  | `c154de0` | `/login` (LoginScreen, бренд-цвета, cookie + redirect) + `/app` (AppShell + LogoutButton) + перенос NDA → `/prototype/nda` + redirect root. |
| 5  | `2455fdb` | `proxy.ts` (Next 16 переименовал middleware) — guard `/app/*` без cookie.                                         |
| 6  | `3d79f34` | `start.sh`/`stop.sh`/`start.ps1`/`stop.ps1` — PID в `.run/`, логи в `logs/`. Идемпотентно.                       |
| 7  | `90e3079` | `Dockerfile` multi-stage (uv backend, node frontend) + `compose.yml` два сервиса с healthcheck. |
| 8  | `cd1f270` | `backend/README.md`: install, run, tests, endpoints, env (`MVP2WEEK_*`), DB schema, project layout, Docker.       |
| 9  | `fixup`   | `bootstrap.reset_database`: `gc.collect()` + try/except `PermissionError` со свежим filename — Windows-устойчивость к зомби-локам от предыдущих процессов. Smoke-test 3/3 + `npm run build` чистый. |

### Что уже в `main` для PL-6 ещё не попало

- **Не закоммичены:** финальные smoke-test-логи (curl /health, /auth/fake-login, /api/catalog).
- **Не запушено в origin:** ветка `feat/pl-6-v1-foundation` всё ещё локальная.
- **Не открыт PR:** GitHub MCP ещё не использован.
- **Jira:** PL-6 формально остаётся в «К выполнению» (assignee не назначен). Перевод в «В работе» / «Готово» не выполнен.

### Архитектура PL-6 (финальная, согласована)

- **Backend:** `backend/app/{config,db,bootstrap,models,schemas,main}.py`, `backend/app/routers/{health,auth,catalog}.py`. SQLAlchemy 2.x ORM с `User` (int PK), `Document` (int PK, FK, `DocumentStatus` enum + CHECK), content = TEXT (JSON string). Дефолтный SQLite удаляется при старте, пересоздаётся `create_all`, сидится один fake user.
- **Frontend:** Next.js 16.2.9 App Router. `lib/store/{authSlice,api,index}.ts` (RTK + RTK Query). `app/providers.tsx` → `<Provider store={store}>`. Routing: `/` → client-redirect (authed → `/app`, иначе → `/login`); `/login` POST `/auth/fake-login`; `/app` после cookie guard; `/prototype/nda` — старый PL-3. `proxy.ts` (Next 16: middleware → proxy) для `/app/:path*`.
- **Scripts:** POSIX + PowerShell. PIDs `.run/{backend,frontend}.pid`, логи `logs/{backend,frontend}.log`.
- **Docker:** multi-stage (uv backend, node frontend). Compose: `backend:8000`, `frontend:3000`, `NEXT_PUBLIC_API_URL=http://localhost:8000`. Healthchecks на обоих.

### Принятые упрощения (намеренные)

- `Document.id` — `INTEGER AUTOINCREMENT`, не UUID (миграция тривиальна, если понадобится в PL-7).
- `catalog.json` — копия в `backend/catalog.json` (Windows-совместимо; единственный источник истины — `catalog.json` в корне репо).
- Симлинк `backend/catalog.json → ../catalog.json` планировался, на Windows отвергнут.

### Out of scope (PL-6)

Реальная auth (JWT, пароли, sessions), `/api/templates/{filename}` (PL-4), Alembic (PL-7 если нужен), CI/CD, HTTPS, rate-limit, CSRF, frontend-тесты, persistence SQLite, multi-stage production deploy (используется multi-stage dev image).

### Следующие шаги (в этом же сеансе)

1. Smoke-test: поднять `uvicorn`, проверить 3 эндпоинта через `curl`. ✅ 2026-07-01
2. Запустить `npm run build` фронта — удостовериться, что `tsc` + сборка чистые. ✅ 2026-07-01
3. Закоммитить финальный `bootstrap` fix-up (Windows `PermissionError` устойчивость). ← текущий шаг
4. Push `feat/pl-6-v1-foundation` → открыть PR через GitHub MCP.
5. Перевести PL-6 в Jira: «К выполнению» → «В работе» → «Готово».
6. Обновить memory (`project-mvp2week` — статус, ключевые пути, SHA корневого коммита).

### Smoke-test результаты (2026-07-01, локально)

| Endpoint                  | Status | Ответ                                                                                  |
|---------------------------|--------|----------------------------------------------------------------------------------------|
| `GET /health`             | 200    | `{"status":"ok"}`                                                                      |
| `POST /auth/fake-login`   | 200    | `{"token":"fake-…","user":{"id":2,"display_name":"Smoke Tester","email":"smoke.tester@local"}}` |
| `GET /api/catalog`        | 200    | 12 шаблонов из `catalog.json`                                                          |
| `pytest`                  | 5/5 ✅ | StarletteDeprecationWarning по `httpx` (не блокирует)                                  |
| `npm run build`           | OK ✅ | TypeScript чистый, 5 routes: `/`, `/_not-found`, `/app`, `/login`, `/prototype/nda`, Proxy (Middleware) |
| Backend data dir          | OK ✅  | `data/app.db` создаётся при `reset_database()`                                         |

---

## Закрытие сеанса 2026-07-01 (после smoke-test)

### Проведено

1. **Smoke-test 3/3** на свежем старте `uvicorn` — все эндпоинты вернули ожидаемые ответы.
2. **`npm run build`** — TypeScript проходит, 5 маршрутов собраны.
3. **Финальный коммит** `35b9866` — `fix(pl-6): make reset_database resilient to stale Windows file locks`. Добавил `gc.collect()` и fallback на свежее имя файла при `PermissionError` (нашли реальный зомби-лок от упавшего uvicorn PID 35560).
4. **Push** `feat/pl-6-v1-foundation` → origin.
5. **PR #5** открыт через GitHub MCP: https://github.com/shevchenkoom-pixel/MVP2Week/pull/5
6. **Jira PL-6** → «Готово» + comment-10034 со сводкой.
7. **Memory** обновлена: `project-mvp2week.md` отражает PL-6 в Готово, PL-4 следующий, добавлены пути `backend/`, `Dockerfile`, `Plan.md`.

### Демо-сеанс: подняли проект и погасили

- Вручную поднял backend (`uv run uvicorn … :8000`) и frontend (`npm run dev` → :3000) для визуальной проверки.
- Подтвердили: `GET /health` 200, `GET /` 200, маршруты `/login` и `/app` доступны.
- Оба процесса остановлены через `TaskStop` (ID `biw9sgs39`, `bme20vkv0`); порты 8000/3000 свободны, посторонних процессов не осталось.

### Что подтверждено руками

- `http://localhost:3000/` → редирект (authed → `/app`, иначе → `/login`).
- `http://localhost:3000/login` отдаёт `LoginScreen` с бренд-цветами.
- `http://localhost:8000/api/catalog` → 12 шаблонов.
- `http://localhost:8000/docs` → Swagger UI.

### Следующие шаги (в новом сеансе)

1. Поднять `PL-4`: AI Chat поверх foundation, scope — только Mutual NDA.
2. Использовать скилл `cerebras` для LLM-вызовов со structured output.
3. Перед стартом — прочитать тикет PL-4 через Atlassian MCP, выбрать `prompt` для `/feature-dev:feature-dev`.
