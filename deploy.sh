#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

if [[ -z $(git diff --cached --name-only) && -z $(git diff --name-only index.html) ]]; then
  echo "No changes to index.html — nothing to deploy."
  exit 0
fi

git add index.html
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo ""
echo "Deployed → https://skarin7.github.io/llm-knowledge-animation/"
echo "Live in ~30 seconds."
