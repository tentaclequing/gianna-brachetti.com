## Context

Personal website for Gianna Brachetti-Truskawa at gianna-brachetti.com. The design phase is complete: 10 self-contained HTML prototypes exist in `Design/` covering every page type. The build phase translates these prototypes into a Hugo theme with an Obsidian-compatible content pipeline, deployed via GitHub Pages.

The user already runs Hugo for hadal-zone, so the toolchain is familiar. Hugo is installed locally. The site prioritises fast loading, accessibility (WCAG 2.1 AA), and personality.

## Goals / Non-Goals

**Goals:**
- Pixel-faithful translation of all 10 HTML prototypes into Hugo layouts
- Obsidian vault as Hugo content directory (Option A - no transform step)
- GitHub Pages deployment via GitHub Actions
- CV available as web page and downloadable PDF
- Backlinks computed at Hugo build time for digital garden notes
- Client-side filtering for writing types and note statuses
- All shared elements extracted into reusable partials

**Non-Goals:**
- Search functionality (can add Pagefind later, not in scope)
- Comments or interaction system
- CMS or admin interface
- Wikilink support or Obsidian plugin integration
- Analytics (can add privacy-respecting analytics later)
- Multi-language support (English only)
- Real content (illustrative/placeholder only for this change)

## Decisions

### 1. Hugo theme as in-repo theme (not a module)

The theme lives at `themes/signal-noise/` within the project repo rather than as a separate Hugo module.

**Why over Hugo module:** This is a bespoke theme for one site. Module indirection adds complexity with no reuse benefit. In-repo keeps everything in one place, one commit history.

**Why over root-level layouts:** Theme isolation keeps content and presentation cleanly separated. If the theme ever needs to be extracted or shared, the boundary is already clean.

### 2. CSS architecture: single bundled file from partials

All CSS lives in `themes/signal-noise/assets/css/` as partial files, concatenated by Hugo Pipes at build time. No Sass, no PostCSS, no npm dependencies.

**Why:** The design prototypes use plain CSS with custom properties. No preprocessor features are needed. Hugo Pipes handles concatenation and minification natively. Zero external build dependencies means the site builds with Hugo alone.

Structure:
```
assets/css/
  _variables.css      (custom properties / design tokens)
  _reset.css          (box-sizing, margins)
  _typography.css     (font imports, body, headings, code)
  _nav.css            (top + bottom nav)
  _cursor.css         (custom crosshair, pointer-device only)
  _grain.css          (film noise overlay)
  _footer.css         (footer + uptime)
  _post.css           (post single + archive)
  _note.css           (note single + garden index)
  _page.css           (about, CV, speaking)
  _404.css            (404 page)
  _home.css           (homepage hero + grids)
  _responsive.css     (breakpoints: 900px, 640px)
```

### 3. Content types via Hugo sections

```
content/
  writing/           → type "writing", layout list.html + single.html
    _index.md        → writing archive page
    my-post.md       → individual post
  notes/             → type "notes", layout list.html + single.html
    _index.md        → garden index page
    my-note.md       → individual note
  about/
    _index.md        → about page
    cv.md            → CV page (layout: cv)
  speaking/
    _index.md        → speaking page (data-driven from front matter)
  _index.md          → homepage
```

**Why sections over taxonomies for content types:** Writing types (essay, observation, guide) and note statuses (fresh, spreading, settled) are front matter fields, filtered client-side. Hugo sections provide clean URL structure without over-engineering.

### 4. Front matter conventions (Obsidian-compatible)

Writing:
```yaml
---
title: "The Invisible Architecture of Search Intent"
date: 2025-03-08
type_label: essay          # essay | observation | guide
tags: [seo, search-intent]
description: "When a user types four words..."
reading_time: 9            # manual override, or computed
---
```

Notes:
```yaml
---
title: "Prompt injection through search snippets"
date: 2025-01-14
lastmod: 2025-03-01
status: spreading          # fresh | spreading | settled
tags: [security, ai]
source_url: ""             # if set, renders source block (link note)
source_name: ""
source_title: ""
noindex: true
---
```

**Why manual reading_time:** Hugo can compute word count, but manual override allows author control. Template falls back to computed if not set.

### 5. Backlinks via Hugo scratch pad

At build time, each note page iterates over all other notes, checking if their rendered content contains a link to the current page's permalink. Results are stored and rendered in the "referenced by" section.

**Why over a plugin/external tool:** Pure Hugo templates, no build dependencies. Performance is fine for hundreds of notes (the expected scale).

### 6. CV PDF: pre-generated, not built

The CV PDF is a static file at `static/cv/gianna-brachetti-truskawa-cv.pdf`, manually generated from a print-styled HTML version or a design tool. Not auto-generated from Markdown at build time.

**Why:** PDF generation from HTML requires headless browsers (Puppeteer, wkhtmltopdf) which adds system dependencies. A pre-generated PDF with a print-optimised design is higher quality and simpler to maintain. The web CV page and PDF can diverge intentionally (the web version can be richer).

### 7. GitHub Actions deployment

Single workflow file `.github/workflows/deploy.yml`:
- Trigger: push to `main`
- Steps: checkout, setup Hugo (extended), build with `--minify`, deploy to GitHub Pages
- Uses `peaceiris/actions-gh-pages` or native GitHub Pages action

**Why not Netlify/Vercel:** GitHub Pages is free, already in the GitHub ecosystem, and the user prefers keeping everything in one place. Hugo's build is fast enough that CI speed is not a concern.

### 8. Speaking page: data-driven from single file

Talks are defined as a YAML array in `content/speaking/_index.md` front matter rather than as individual content files.

**Why:** Talks are display-only (no individual pages, no tags, no search). A single data structure keeps them manageable. If individual talk pages are needed later, migration is straightforward.

## Risks / Trade-offs

**[Custom cursor hides system cursor]** The design uses `cursor: none` with a JS-driven crosshair. This can be disorienting and fails if JS is blocked. → Mitigation: Only applied on `(hover: hover) and (pointer: fine)` media query (already in the design). Add a `prefers-reduced-motion` check to disable animation.

**[Film grain overlay performance]** The SVG noise filter with animation runs continuously. → Mitigation: Very low opacity (2.8%), `pointer-events: none`, and `steps(2)` animation minimise GPU cost. Can be disabled via `prefers-reduced-motion`.

**[Google Fonts external dependency]** Cormorant Garamond and Fira Code loaded from Google Fonts adds a DNS lookup and render-blocking request. → Mitigation: `font-display: swap` in the Google Fonts URL (already present). Future optimisation: self-host the fonts for privacy and performance.

**[Backlinks computation at scale]** Scanning all notes for internal links is O(n^2). → Mitigation: Acceptable for hundreds of notes. If it becomes slow, can cache with Hugo's `.Store` or move to a pre-build script.

**[No search]** The site launches without search. → Mitigation: Pagefind can be added later as a post-build step with minimal theme changes. The architecture does not preclude it.
