# syntax=docker/dockerfile:1.7

# Backend builder
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS backend-builder
WORKDIR /src
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-install-project
COPY backend/ ./
RUN uv sync --frozen --no-dev

# Frontend builder
FROM node:22-bookworm-slim AS frontend-builder
WORKDIR /src
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Backend runtime
FROM ghcr.io/astral-sh/uv:python3.12-bookworm-slim AS backend
WORKDIR /app
COPY --from=backend-builder /src/.venv /app/.venv
COPY backend/ /app/backend/
COPY catalog.json /app/catalog.json
ENV PATH="/app/.venv/bin:$PATH" \
    MVP2WEEK_HOST=0.0.0.0 \
    MVP2WEEK_PORT=8000 \
    MVP2WEEK_CATALOG_PATH=/app/catalog.json \
    MVP2WEEK_DATA_DIR=/app/data
EXPOSE 8000
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD ["python", "-c", "import urllib.request,sys; r=urllib.request.urlopen('http://127.0.0.1:8000/health',timeout=3); sys.exit(0 if r.status==200 else 1)"]
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

# Frontend runtime
FROM node:22-bookworm-slim AS frontend
WORKDIR /app
ENV NODE_ENV=production \
    NEXT_PUBLIC_API_URL=http://backend:8000
COPY --from=frontend-builder /src/.next /app/.next
COPY --from=frontend-builder /src/public /app/public
COPY frontend/package.json frontend/package-lock.json /app/
COPY frontend/next.config.ts /app/
WORKDIR /app
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.status<500?0:1)).catch(()=>process.exit(1))"]
CMD ["npx", "next", "start", "--port", "3000", "--hostname", "0.0.0.0"]