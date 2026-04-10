# gianna-brachetti.com - Architecture

**Last updated:** 2026-04-02

## Overview

Personal website and kelp forest (digital garden). Hugo static site, GitHub Pages hosting, Obsidian as CMS.

## Stack

| Layer | Tool | Notes |
|-------|------|-------|
| Static site generator | Hugo | Config: `hugo.toml` |
| Theme | signal-noise (custom) | Dark theme, Cormorant Garamond + Fira Code |
| CMS | Obsidian | Vault: `~/Documents/Obsidian Vault/WEBSITE/` |
| Hosting | GitHub Pages | Repo: tentaclequing/tentaclequing.github.io [not yet configured] |
| Domain | gianna-brachetti.com | DNS not yet configured |
| Fonts | Self-hosted woff2 | Cormorant Garamond (serif) + Fira Code (monospace) |
| Search | None (static) | |

## Directory structure

```
gianna-brachetti.com/
├── .claude/
│   └── commands/
│       └── publish.md          # /publish slash command
├── content/                    # Hugo content (Obsidian-compatible markdown)
│   ├── _index.md               # Homepage config
│   ├── about/
│   │   ├── _index.md           # About page (structured front matter)
│   │   └── cv.md               # CV page (structured front matter)
│   ├── writing/
│   │   ├── _index.md           # Section config
│   │   └── *.md                # Articles (individual files)
│   ├── notes/
│   │   ├── _index.md           # Section config
│   │   └── *.md                # Notes (rendered inline on /notes/)
│   ├── speaking/
│   │   └── _index.md           # All talks + publications in front matter
│   ├── reads/
│   │   └── _index.md           # Blogroll in front matter
│   └── Archive/                # Ignored by Hugo
│       └── templates/          # Obsidian templates (also in vault)
├── themes/signal-noise/
│   ├── assets/css/
│   │   ├── _variables.css      # Colour palette, column width
│   │   ├── _reset.css          # Base styles, body font
│   │   ├── _fonts.css          # @font-face declarations
│   │   ├── _typography.css     # Link styles, selection
│   │   ├── _nav.css            # Top nav (desktop) + bottom nav (mobile)
│   │   ├── _home.css           # Homepage hero, post grid, fragments
│   │   ├── _page.css           # About, CV, speaking, reads pages
│   │   ├── _post.css           # Writing archive + single article
│   │   ├── _note.css           # Notes feed + single note fallback
│   │   ├── _footer.css         # Footer
│   │   └── _grain.css          # Film grain overlay
│   ├── layouts/
│   │   ├── index.html          # Homepage (hero, recent writing, fragments)
│   │   ├── _default/
│   │   │   ├── cv.html         # CV layout (structured data grid)
│   │   │   └── single.html     # Default single page
│   │   ├── writing/
│   │   │   ├── list.html       # Writing archive (no filter tabs)
│   │   │   └── single.html     # Article page (JSON-LD, progress bar)
│   │   ├── notes/
│   │   │   ├── list.html       # Notes feed (inline content, anchor links)
│   │   │   └── single.html     # Single note fallback
│   │   ├── speaking/
│   │   │   └── list.html       # Speaking + publications
│   │   ├── reads/
│   │   │   └── list.html       # Blogroll
│   │   └── partials/
│   │       ├── head.html       # <head> with meta, fonts, CSS
│   │       ├── nav-top.html    # Desktop navigation
│   │       ├── nav-bottom.html # Mobile bottom nav
│   │       ├── footer.html     # Footer with uptime counter
│   │       ├── octopus.html    # SVG octopus illustration
│   │       ├── post-card.html  # Homepage post preview card
│   │       ├── note-card.html  # Homepage note preview (dot only)
│   │       ├── tldr.html       # TL;DR summary box
│   │       └── author-bio.html # Author bio on articles
│   └── static/
│       └── fonts/              # Self-hosted woff2 files
├── static/
│   └── cv/                     # Generated CV PDF
├── hugo.toml                   # Hugo configuration
├── publish.sh                  # Obsidian to Hugo sync script
├── generate-cv-pdf.py          # CV PDF generator
├── LAUNCH-CHECKLIST.md         # Pre-launch tasks and research
└── ARCHITECTURE.md             # This file
```

## Content authoring flow

```
Obsidian vault                    Hugo content dir              Live site
~/Documents/Obsidian Vault/       ~/ops/personal/gianna-        gianna-brachetti.com
  WEBSITE/writing/*.md    ──┐       brachetti.com/content/
  WEBSITE/notes/*.md      ──┤         writing/*.md      ──┐
                            │         notes/*.md         ──┤
                     publish.sh       speaking/_index.md ──┤    GitHub Pages
                     (or /publish)    reads/_index.md    ──┤──→ (hugo build)
                                      about/_index.md   ──┤
                                      about/cv.md       ──┘
```

- **Writing and notes**: authored in Obsidian, synced via `publish.sh` or `/publish` command
- **Speaking, reads, about, CV**: edited directly in content files (structured front matter)
- **Templates**: in Obsidian vault at `templates/Website - *.md`

## Design system

### Colours

| Variable | Value | Use |
|----------|-------|-----|
| `--black` | #000000 | Background |
| `--white` | #e4e4dc | Primary text |
| `--accent` | #00aaff | Links, highlights, interactive elements |
| `--accent-red` | #ff1f3d | Labels, status indicators |
| `--muted` | #8a8a82 | Secondary text (passes WCAG AA at 4.6:1) |
| `--dim` | #1e1e1c | Borders, decorative elements only (NOT for text) |
| `--border` | #161614 | Divider lines |
| `--fresh` | #4dccff | Note status: new |
| `--spreading` | #ff1f3d | Note status: growing |
| `--settled` | #565650 | Note status: stable |

### Typography (6 treatments)

| Treatment | Font | Size | Use |
|-----------|------|------|-----|
| Display | Cormorant Garamond 300 | clamp (varies) | Headlines, page titles |
| Subhead | Cormorant Garamond 400 | 18-22px | Entry titles, talk titles |
| Body | Fira Code 300 | 14-15px | Main reading text |
| Small | Fira Code 300 | 13px | Descriptions, meta values |
| Label | Fira Code 300 | 11px uppercase, 0.15em spacing | All labels, tags, dates, nav |
| Accent | inherits | inherits | Links (blue, underline on hover) |

### Accessibility

- Minimum text size: 11px
- `--muted` passes WCAG AA (4.6:1 on black)
- `--dim` used for borders/decoration only, never readable text
- Skip link present
- `prefers-reduced-motion` respected
- Touch targets minimum 44px
- All content accessible without JavaScript
- Self-hosted fonts (no Google CDN, compliant with LG Muenchen I 2022)

## Content types

| Type | Location | Individual pages? | Front matter template |
|------|----------|-------------------|----------------------|
| Writing | `writing/*.md` | Yes | `Website - Writing.md` |
| Notes | `notes/*.md` | Inline on /notes/ (single.html as fallback) | `Website - Note.md` |
| Speaking | `speaking/_index.md` | No (all in one file) | Edit directly |
| Reads | `reads/_index.md` | No (all in one file) | Edit directly |
| About | `about/_index.md` | Single page | Edit directly |
| CV | `about/cv.md` | Single page | Edit directly |

## Easter eggs

- Konami code on homepage triggers octopus terminal overlay
- Mouse trail particles (desktop only, respects reduced motion)
- Click burst animation
- Footer uptime counter
