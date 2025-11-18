#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-production}"
SCRIPT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
PROJECT_ROOT="$(cd -- "${SCRIPT_DIR}/.." >/dev/null 2>&1 && pwd)"

pushd "${PROJECT_ROOT}" >/dev/null
ARGS=(--mode "${MODE}")
if [[ "${SKIP_INSTALL:-0}" == "1" ]]; then
  ARGS+=(--skip-install)
fi
echo "Running release pipeline in ${MODE} mode"
node ./scripts/run-release.mjs "${ARGS[@]}"
popd >/dev/null
