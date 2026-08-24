#!/usr/bin/env bash
set -euo pipefail

# Convenience dev-server launcher — kills anything stale on port 3000 and
# clears .next before starting, so a crashed/killed previous run (e.g. .next
# deleted while the server was still using it) never leaves a broken cache
# behind for the next `npm run dev`.

PORT="${PORT:-3000}"

EXISTING_PID="$(lsof -ti ":$PORT" 2>/dev/null || true)"
if [ -n "$EXISTING_PID" ]; then
  echo "Port $PORT in use (pid $EXISTING_PID) — stopping it first."
  kill "$EXISTING_PID" 2>/dev/null || true
  sleep 1
fi

rm -rf .next

echo "Starting dev server on http://localhost:$PORT"
exec npm run dev -- --port "$PORT"
