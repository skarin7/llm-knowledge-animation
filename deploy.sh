#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

npm run build

git add docs/
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo ""
echo "Deployed → https://skarin7.github.io/llm-knowledge-animation/"
echo "Live in ~30 seconds."
