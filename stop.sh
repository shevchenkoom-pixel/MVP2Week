#!/usr/bin/env bash
# Stop backend and frontend started by start.sh.

set -u

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

stop_one() {
  local name="$1"
  local pidfile=".run/${name}.pid"
  if [ ! -f "$pidfile" ]; then
    echo "[$name] not running (no pid file)"
    return
  fi
  local pid
  pid="$(cat "$pidfile")"
  if kill -0 "$pid" 2>/dev/null; then
    kill "$pid" 2>/dev/null || true
    echo "[$name] stopped (pid $pid)"
  else
    echo "[$name] pid $pid not alive"
  fi
  rm -f "$pidfile"
}

stop_one backend
stop_one frontend