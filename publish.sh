#!/bin/bash
# Publish website content from Obsidian vault to Hugo content directory
# Usage: bash publish.sh [writing|notes|all]

VAULT="$HOME/Documents/Obsidian Vault"
HUGO_CONTENT="$HOME/ops/personal/gianna-brachetti.com/content"

# Vault source folders
VAULT_WRITING="$VAULT/TENTACLE/WEBSITE/writing"
VAULT_NOTES="$VAULT/TENTACLE/WEBSITE/notes"

# Ensure vault source folders exist
mkdir -p "$VAULT_WRITING" "$VAULT_NOTES"

# Convert filename to slug: lowercase, spaces to hyphens, strip non-alphanumeric except hyphens
slugify() {
  echo "$1" | sed 's/\.md$//' | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

sync_writing() {
  local count=0
  for f in "$VAULT_WRITING"/*.md; do
    [ -f "$f" ] || continue
    local name=$(basename "$f")
    [ "$name" = "_index.md" ] && continue
    local slug=$(slugify "$name")
    cp "$f" "$HUGO_CONTENT/writing/${slug}.md"
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
    local slug=$(slugify "$name")
    cp "$f" "$HUGO_CONTENT/notes/${slug}.md"
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
