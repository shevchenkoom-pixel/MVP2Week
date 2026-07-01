#!/usr/bin/env bash
# Start backend (FastAPI via uv) and frontend (Next.js dev server).
# Writes PIDs to .run/ and logs to logs/.

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

mkdir -p logs .run

start_one() {
  local name="$1"
  local workdir="$2"
  shift 2
  if [ -f ".run/${name}.pid" ] && kill -0 "$(cat ".run/${name}.pid")" 2>/dev/null; then
    echo "[$name] already running (pid $(cat ".run/${name}.pid"))"
    return
  fi
  ( cd "$workdir" && nohup "$@" >> "../logs/${name}.log" 2>&1 & echo $! > "../.run/${name}.pid" )
  echo "[$name] started (pid $(cat ".run/${name}.pid"))"
}

start_one backend backend uv run uvicorn app.main:app --host 127.0.0.1 --port 8000
start_one frontend frontend npm run dev -- --port 3000

echo
echo "Backend  http://127.0.0.1:8000  (logs/.run: backend.log / .run/backend.pid)"
echo "Frontend http://127.0.0.1:3000  (logs/.run: frontend.log / .run/frontend.pid)"