## Why

Personal website for gianna-brachetti.com - a blog, digital garden, CV, and speaking page that reflects personality and professional identity. The design is complete (10 HTML prototypes in `Design/`). The site needs to be built as a Hugo theme with an Obsidian-compatible content pipeline, hosted on GitHub Pages.

## What Changes

- Create a custom Hugo theme (`signal-noise`) implementing all 10 design prototypes pixel-for-pixel
- Set up Hugo project structure with content types for writing (essays, observations, guides), notes (digital garden with status tracking), speaking (talks by year), about, and CV
- Implement shared design system: custom cursor, film grain overlay, responsive nav (top desktop / bottom mobile), uptime counter, colour tokens, typography (Cormorant Garamond + Fira Code)
- Build Obsidian-compatible content pipeline: standard Markdown with YAML front matter, no wikilinks, content/ directory as Obsidian vault
- Configure GitHub Actions for automated Hugo build and deploy to GitHub Pages
- Generate CV as both web page and downloadable PDF
- Implement client-side filtering (writing by type, notes by status)
- Build backlinks system for digital garden notes (computed at Hugo build time)

## Capabilities

### New Capabilities
- `hugo-project`: Hugo project scaffolding, configuration, directory structure, and build pipeline
- `theme-base`: Shared design system - CSS custom properties, typography, grain overlay, custom cursor, responsive nav, footer with uptime counter
- `layout-homepage`: Homepage layout with hero section (octopus SVG), recent posts grid, garden fragment preview, easter egg
- `layout-writing`: Writing archive list page (year-grouped, type-filterable) and single post layout (progress bar, meta bar, tags, prev/next nav)
- `layout-notes`: Digital garden index (3-column grid, status filter) and single note layout (status badge, backlinks, source block for link notes)
- `layout-pages`: Static page layouts for about (identity block, fact grid, work-with-me, contact), CV (breadcrumb, sticky download bar, structured sections), and speaking (talks by year, upcoming/past)
- `layout-infrastructure`: 404 page, RSS feed, sitemap, robots.txt, Open Graph meta tags, SEO infrastructure
- `github-deployment`: GitHub Actions workflow for Hugo build and GitHub Pages deployment, repository setup

### Modified Capabilities

## Impact

- New repository: `gianna-brachetti-website` (or renamed from current directory)
- Dependencies: Hugo (already installed), GitHub CLI (already installed)
- External: GitHub Pages configuration, DNS for gianna-brachetti.com
- Content: Illustrative/placeholder content for theme development, replaced with real content later from Obsidian
