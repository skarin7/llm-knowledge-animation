#!/usr/bin/env bash
set -e

cd "$(dirname "$0")"

# Sync animation file: index.html is now the landing page,
# animations live as named html files (e.g. llm-how-it-works.html)
CHANGED=$(git diff --name-only HEAD -- '*.html' 2>/dev/null || git diff --name-only -- '*.html')

if [[ -z "$CHANGED" ]]; then
  echo "No HTML changes to deploy."
  exit 0
fi

echo "Changed files:"
echo "$CHANGED"
echo ""

git add *.html
git commit -m "Deploy $(date '+%Y-%m-%d %H:%M')"
git push origin main

echo ""
echo "Deployed → https://skarin7.github.io/llm-knowledge-animation/"
echo "Live in ~30 seconds."
