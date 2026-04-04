#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"

if ! command -v cloudflared >/dev/null 2>&1; then
  echo "ERROR: cloudflared is not installed. Install it via: brew install cloudflared"
  exit 1
fi

LOG_FILE=$(mktemp)
trap "rm -f $LOG_FILE" EXIT

# Detect running Next.js dev server on common ports
DEV_PORT=""
for port in 3000 4000 3001; do
  if lsof -i :"$port" -sTCP:LISTEN -t >/dev/null 2>&1; then
    DEV_PORT="$port"
    echo "Next.js already running on port $DEV_PORT."
    break
  fi
done

# Start Next.js if not running on any port
if [ -z "$DEV_PORT" ]; then
  DEV_PORT=3000
  echo "Starting Next.js dev server on port $DEV_PORT..."
  cd "$ROOT"
  yarn dev -p "$DEV_PORT" &
  NEXTJS_PID=$!
  trap "kill $NEXTJS_PID 2>/dev/null || true; rm -f $LOG_FILE" EXIT
  echo "Waiting for Next.js to be ready..."
  for i in $(seq 1 30); do
    if curl -s "http://localhost:$DEV_PORT" >/dev/null 2>&1; then
      echo "Next.js is ready."
      break
    fi
    sleep 2
  done
fi

echo "Starting cloudflared tunnel on port $DEV_PORT..."
cloudflared tunnel --url "http://localhost:$DEV_PORT" 2>"$LOG_FILE" &
CLOUDFLARED_PID=$!
trap "kill $CLOUDFLARED_PID 2>/dev/null || true; rm -f $LOG_FILE" EXIT

for i in $(seq 1 15); do
  TUNNEL_URL=$(grep -oE 'https://[a-z0-9-]+\.trycloudflare\.com' "$LOG_FILE" 2>/dev/null | head -1) || true
  if [ -n "${TUNNEL_URL:-}" ]; then
    break
  fi
  sleep 1
done

if [ -z "${TUNNEL_URL:-}" ]; then
  echo "ERROR: Failed to get tunnel URL after 15 seconds"
  cat "$LOG_FILE" >&2
  exit 1
fi

echo ""
echo "TUNNEL_URL=$TUNNEL_URL"
echo ""
echo "Tunnel is live. Press Ctrl+C to stop."
echo "Use this URL for DataForSEO on-page checks:"
echo "  $TUNNEL_URL/en/blog/{slug}"
echo "  $TUNNEL_URL/de/blog/{slug}"
echo ""

# Keep alive until interrupted
wait $CLOUDFLARED_PID
