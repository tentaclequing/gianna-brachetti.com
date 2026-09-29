#!/bin/bash
# Publish website content from Obsidian vault to Hugo content directory
#
# Usage:
#   bash publish.sh              Sync all vault content to Hugo
#   bash publish.sh writing      Sync writing/ only
#   bash publish.sh notes        Sync notes/ only
#   bash publish.sh pages        Sync standalone pages only
#   bash publish.sh deploy       Sync all, then commit and push
#   bash publish.sh --hierarchydeploy-only   Skip sync, just commit and push current state

VAULT="$HOME/Documents/Obsidian/Website"
HUGO_CONTENT="$HOME/work/gianna-brachetti.com/content"
HUGO_ROOT="$HOME/work/gianna-brachetti.com"

# Convert filename to slug: lowercase, spaces to hyphens, dots to hyphens, strip non-alphanumeric except hyphens
slugify() {
  echo "$1" | sed 's/\.md$//' | tr '[:upper:]' '[:lower:]' | tr ' .' '-' | sed 's/[^a-z0-9-]//g' | sed 's/--*/-/g' | sed 's/^-//;s/-$//'
}

sync_dir() {
  local src="$1"
  local dest="$2"
  local label="$3"
  local count=0

  [ -d "$src" ] || { echo "$label: source not found, skipping"; return; }
  mkdir -p "$dest"

  for f in "$src"/*.md; do
    [ -f "$f" ] || continue
    local name=$(basename "$f")
    [[ "$name" == .~lock.* ]] && continue
    [ "$name" = "_index.md" ] && { cp "$f" "$dest/_index.md"; continue; }
    local slug=$(slugify "$name")
    cp "$f" "$dest/${slug}.md"
    count=$((count + 1))
  done
  echo "$label: synced $count file(s)"
}

sync_writing() {
  sync_dir "$VAULT/Writing" "$HUGO_CONTENT/writing" "writing"
}

sync_notes() {
  sync_dir "$VAULT/Notes" "$HUGO_CONTENT/notes" "notes"
}

sync_pages() {
  local count=0

  # Root-level standalone pages
  for f in "$VAULT"/*.md; do
    [ -f "$f" ] || continue
    local name=$(basename "$f")
    [ "$name" = "_index.md" ] && { cp "$f" "$HUGO_CONTENT/_index.md"; continue; }
    cp "$f" "$HUGO_CONTENT/$name"
    count=$((count + 1))
  done

  # Subdirectories (about, de, reads, resources, speaking)
  for dir in about de reads resources speaking; do
    if [ -d "$VAULT/$dir" ]; then
      mkdir -p "$HUGO_CONTENT/$dir"
      for f in "$VAULT/$dir"/*.md; do
        [ -f "$f" ] || continue
        local name=$(basename "$f")
        cp "$f" "$HUGO_CONTENT/$dir/$name"
        count=$((count + 1))
      done
    fi
  done

  echo "pages: synced $count file(s)"
}

sync_all() {
  sync_writing
  sync_notes
  sync_pages
}

deploy() {
  cd "$HUGO_ROOT" || exit 1

  # Check for changes
  local changes=$(git status --porcelain content/)
  if [ -z "$changes" ]; then
    echo "No content changes to deploy."
    return 0
  fi

  echo ""
  echo "Changes to deploy:"
  echo "$changes"
  echo ""
  read -p "Commit and push these changes? [y/N] " confirm
  case "$confirm" in
    [yY]|[yY][eE][sS])
      git add content/
      git commit -m "Update website content"
      git push
      echo "Deployed."
      ;;
    *)
      echo "Skipped. Changes are staged locally - commit manually when ready."
      ;;
  esac
}

case "${1:-all}" in
  writing)     sync_writing ;;
  notes)       sync_notes ;;
  pages)       sync_pages ;;
  all)         sync_all ;;
  deploy)      sync_all; deploy ;;
  deploy-only) deploy ;;
  *)           echo "Usage: bash publish.sh [writing|notes|pages|all|deploy|deploy-only]" ;;
esac

echo ""
echo "Done. Preview: cd $HUGO_ROOT && hugo server"
