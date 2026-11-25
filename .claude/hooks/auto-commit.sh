#!/usr/bin/env bash
# Stop hook: commit any pending changes as the repo's git user (no Claude attribution).
cd "${CLAUDE_PROJECT_DIR:-.}" || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0
[ -z "$(git status --porcelain)" ] && exit 0
git add -A
files=$(git diff --cached --name-only | head -5 | tr '\n' ' ')
git commit -q -m "Update ${files% }" && echo '{"systemMessage":"Auto-committed changes"}'
