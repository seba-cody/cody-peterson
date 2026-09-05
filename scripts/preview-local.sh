#!/usr/bin/env bash
# Serve only the built static pages, on loopback. No Worker or payment handlers run.
set -euo pipefail
website_root="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
if [[ ! -f "$website_root/dist/index.html" ]]; then
  echo 'No local build found. Run npm run build in the website folder first.' >&2
  exit 1
fi
exec python3 -m http.server "${1:-4325}" --bind 127.0.0.1 --directory "$website_root/dist"
