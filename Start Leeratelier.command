#!/bin/zsh
cd -- "$(dirname -- "$0")"
if command -v python3 >/dev/null 2>&1; then
  python3 scripts/serve.py
elif [ -x /Users/guillaume/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 ]; then
  /Users/guillaume/.cache/codex-runtimes/codex-primary-runtime/dependencies/python/bin/python3 scripts/serve.py
else
  print 'Python 3 is nodig om deze lokale app te openen. Lees README.md.'
fi
print '\nDruk op Enter om dit venster te sluiten.'
read
