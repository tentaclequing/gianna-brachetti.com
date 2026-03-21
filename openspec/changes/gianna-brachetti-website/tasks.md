## 1. Project Scaffolding

- [ ] 1.1 Initialise Hugo project structure (`hugo.toml`, content dirs, theme dir `themes/signal-noise/`)
- [ ] 1.2 Create `hugo.toml` with site config (title, baseURL, theme, taxonomies, permalink patterns, Goldmark settings)
- [ ] 1.3 Create `.gitignore` (public/, resources/, .hugo_build.lock, .obsidian workspace files)
- [ ] 1.4 Create `static/CNAME` with `gianna-brachetti.com`

## 2. Theme Base - Design System

- [ ] 2.1 Create CSS custom properties file (`assets/css/_variables.css`) with all design tokens
- [ ] 2.2 Create reset and typography CSS (`_reset.css`, `_typography.css`) with font imports
- [ ] 2.3 Create grain overlay CSS and partial (`_grain.css`, `partials/grain.html`)
- [ ] 2.4 Create custom cursor CSS and partial (`_cursor.css`, `partials/cursor.html`)
- [ ] 2.5 Create top navigation partial (`partials/nav-top.html`, `_nav.css`) with active state logic
- [ ] 2.6 Create bottom navigation partial (`partials/nav-bottom.html`) with SVG icons
- [ ] 2.7 Create footer partial (`partials/footer.html`, `_footer.css`) with uptime counter JS
- [ ] 2.8 Create `baseof.html` layout assembling all partials (head, skip link, grain, cursor, nav, content block, footer, JS)
- [ ] 2.9 Create `partials/head.html` with meta tags, OG tags, canonical URL, CSS bundle via Hugo Pipes
- [ ] 2.10 Create responsive CSS (`_responsive.css`) with 900px and 640px breakpoints
- [ ] 2.11 Verify: `hugo server` runs with base layout rendering correctly

## 3. Homepage Layout

- [ ] 3.1 Create homepage layout (`layouts/index.html`) with hero section (label, headline, description, stats)
- [ ] 3.2 Add octopus SVG partial (`partials/octopus.html`) with breathing animation
- [ ] 3.3 Add recent writing section querying latest posts from `content/writing/`
- [ ] 3.4 Create post card partial (`partials/post-card.html`) for homepage grid
- [ ] 3.5 Add garden fragment preview section querying latest notes from `content/notes/`
- [ ] 3.6 Create note card partial (`partials/note-card.html`) for homepage and garden index
- [ ] 3.7 Add scroll reveal JS (IntersectionObserver)
- [ ] 3.8 Add easter egg overlay and trigger
- [ ] 3.9 Create homepage CSS (`_home.css`)

## 4. Writing Layouts

- [ ] 4.1 Create writing list layout (`layouts/writing/list.html`) with year-grouped archive and type filter
- [ ] 4.2 Create writing single layout (`layouts/writing/single.html`) with post header, meta bar, body
- [ ] 4.3 Add reading progress bar JS to single post layout
- [ ] 4.4 Add post tags section and prev/next navigation
- [ ] 4.5 Create writing CSS (`_post.css`) covering archive rows and single post typography
- [ ] 4.6 Add client-side type filter JS (all/essay/observation/guide with count update)

## 5. Notes Layouts

- [ ] 5.1 Create notes list layout (`layouts/notes/list.html`) with 3-column grid and status legend
- [ ] 5.2 Create notes single layout (`layouts/notes/single.html`) with status badge, meta, body
- [ ] 5.3 Add source block conditional (renders when `source_url` is set in front matter)
- [ ] 5.4 Add backlinks section (Hugo template scanning all notes for links to current page)
- [ ] 5.5 Create `wip` shortcode for working note callouts
- [ ] 5.6 Create `open-question` shortcode for inline open questions
- [ ] 5.7 Add client-side status filter JS (all/fresh/spreading/settled)
- [ ] 5.8 Create notes CSS (`_note.css`) covering garden grid and single note styles
- [ ] 5.9 Add `noindex` meta tag logic for notes pages

## 6. Static Page Layouts

- [ ] 6.1 Create about page layout (`layouts/about/list.html` or section template) with identity block, fact grid, currently, work-with-me, contact
- [ ] 6.2 Create CV layout (`layouts/about/cv.html` or `layouts/_default/cv.html`) with breadcrumb, sticky download bar, all CV sections
- [ ] 6.3 Create speaking page layout with upcoming/past talk sections, year grouping, empty state
- [ ] 6.4 Create page CSS (`_page.css`) covering about, CV, and speaking styles

## 7. Infrastructure

- [ ] 7.1 Create 404 layout (`layouts/404.html`) with ghost number, lost octopus SVG, terminal block, nav buttons
- [ ] 7.2 Create 404 CSS (`_404.css`)
- [ ] 7.3 Configure RSS feed (writing posts only, full content)
- [ ] 7.4 Configure sitemap to exclude `noindex` pages
- [ ] 7.5 Create `robots.txt` template at `layouts/robots.txt`
- [ ] 7.6 Create tag list layout (`layouts/taxonomy/tag.html` or equivalent) for `/tags/<tag>/` pages

## 8. Placeholder Content

- [ ] 8.1 Create `content/_index.md` (homepage)
- [ ] 8.2 Create 3+ writing posts (`content/writing/`) covering essay, observation, guide types
- [ ] 8.3 Create 4+ notes (`content/notes/`) covering fresh, spreading, settled statuses plus one link note
- [ ] 8.4 Create about page (`content/about/_index.md`)
- [ ] 8.5 Create CV page (`content/about/cv.md`) with structured front matter for all CV sections
- [ ] 8.6 Create speaking page (`content/speaking/_index.md`) with talks YAML array in front matter
- [ ] 8.7 Add placeholder CV PDF to `static/cv/`

## 9. GitHub Deployment

- [ ] 9.1 Initialise git repository and create initial commit
- [ ] 9.2 Create `.github/workflows/deploy.yml` with Hugo build and GitHub Pages deploy
- [ ] 9.3 Verify: full `hugo --minify` build completes with zero errors
- [ ] 9.4 Create GitHub repository and push

## 10. Verification

- [ ] 10.1 Test all page types render correctly with `hugo server`
- [ ] 10.2 Test responsive layouts at mobile (375px), tablet (768px), and desktop (1440px) widths
- [ ] 10.3 Test client-side filters (writing type, note status)
- [ ] 10.4 Test custom cursor on desktop, verify it's absent on mobile
- [ ] 10.5 Test 404 page by visiting a non-existent URL
- [ ] 10.6 Verify OG meta tags, canonical URLs, and noindex directives in HTML source
- [ ] 10.7 Verify RSS feed at `/index.xml` contains writing posts
