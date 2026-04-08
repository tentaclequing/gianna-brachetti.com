#!/bin/bash
# Publish website content from Obsidian vault to Hugo content directory
# Usage: bash publish.sh [writing|notes|all]

VAULT="$HOME/Documents/Obsidian Vault"
HUGO_CONTENT="$HOME/ops/personal/gianna-brachetti.com/content"

# Vault source folders (create these in your Obsidian vault)
VAULT_WRITING="$VAULT/WEBSITE/writing"
VAULT_NOTES="$VAULT/WEBSITE/notes"

# Ensure vault source folders exist
mkdir -p "$VAULT_WRITING" "$VAULT_NOTES"

sync_writing() {
  local count=0
  for f in "$VAULT_WRITING"/*.md; do
    [ -f "$f" ] || continue
    local name=$(basename "$f")
    [ "$name" = "_index.md" ] && continue
    cp "$f" "$HUGO_CONTENT/writing/$name"
    count=$((count + 1))
  done
  echo "writing: synced $count file(s)"
}

sync_notes() {
  local count=0
  for f in "$VAULT_NOTES"/*.md; do
    [ -f "$f" ] || continue
    local name=$(basename "$f")
    [ "$name" = "_index.md" ] && continue
    cp "$f" "$HUGO_CONTENT/notes/$name"
    count=$((count + 1))
  done
  echo "notes: synced $count file(s)"
}

case "${1:-all}" in
  writing) sync_writing ;;
  notes)   sync_notes ;;
  all)     sync_writing; sync_notes ;;
  *)       echo "Usage: bash publish.sh [writing|notes|all]" ;;
esac

echo "done. run 'hugo server' to preview."
