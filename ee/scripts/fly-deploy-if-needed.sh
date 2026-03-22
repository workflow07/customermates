#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-}"
PREV_SHA="${VERCEL_GIT_PREVIOUS_SHA:-}"
CURR_SHA="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

run_deploy() {
  local reason="$1"
  echo "$reason"
  if [ "${FLY_DEPLOY_IF_NEEDED_DRY_RUN:-}" = "true" ]; then
    echo "Dry run enabled. Skipping actual Fly deploy call."
    exit 0
  fi
  exec bash ee/scripts/fly-deploy.sh ${MODE:+$MODE}
}

if [ -z "$PREV_SHA" ]; then
  run_deploy "No previous commit SHA found. Running Fly deploy."
fi

if ! git cat-file -e "${PREV_SHA}^{commit}" 2>/dev/null || ! git cat-file -e "${CURR_SHA}^{commit}" 2>/dev/null; then
  run_deploy "Commit SHA not available in checkout. Running Fly deploy."
fi

CHANGED_FILES="$(git diff --name-only "$PREV_SHA" "$CURR_SHA" -- \
  "ee/agent-runtime/**" \
  "ee/scripts/fly-deploy.sh" \
  "ee/scripts/fly-deploy-if-needed.sh")"

if [ -n "$CHANGED_FILES" ]; then
  run_deploy "Fly runtime changes detected. Running Fly deploy."
fi

echo "No Fly runtime changes detected. Skipping Fly deploy."
