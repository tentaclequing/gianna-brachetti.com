## ADDED Requirements

### Requirement: 404 page
The 404 page SHALL display: a ghost "404" number (large, outlined, positioned right), a lost octopus SVG (rotated, faded), status line (`> signal lost · page not found`), headline (`Wrong depth. Surface exists.`), terminal-style error block showing the current path, and navigation buttons (go back, home, writing, notes). All elements SHALL animate in with staggered slide-up animations.

#### Scenario: 404 shows current path
- **WHEN** a user visits a non-existent URL `/writing/nonexistent/`
- **THEN** the terminal block displays `> GET /writing/nonexistent/` and the 404 content renders

#### Scenario: Go back button works
- **WHEN** user clicks "go back" on the 404 page
- **THEN** the browser navigates to the previous page in history

### Requirement: RSS feed
The site SHALL generate an RSS/Atom feed at `/index.xml` containing writing posts (not notes). The feed SHALL include: site title, description, and full post content.

#### Scenario: Feed contains posts
- **WHEN** the site is built with 5 writing posts
- **THEN** `/index.xml` contains entries for all 5 posts with titles, dates, and content

### Requirement: Sitemap
Hugo SHALL generate a sitemap at `/sitemap.xml` including all indexable pages. Pages with `noindex: true` in front matter SHALL be excluded.

#### Scenario: Sitemap excludes noindex pages
- **WHEN** the site is built with notes that have `noindex: true`
- **THEN** those notes do not appear in `sitemap.xml`

### Requirement: robots.txt
The site SHALL include a `robots.txt` at the root with: `User-agent: *`, `Allow: /`, `Sitemap: https://gianna-brachetti.com/sitemap.xml`, and disallow patterns for any admin or draft paths.

#### Scenario: robots.txt is accessible
- **WHEN** a crawler requests `/robots.txt`
- **THEN** a valid robots.txt is returned with sitemap reference

### Requirement: Open Graph meta tags
Every page SHALL include Open Graph meta tags in the HTML head: `og:title`, `og:description`, `og:url`, `og:site_name`. Post pages SHALL additionally include `og:type=article` and `article:published_time`.

#### Scenario: Homepage has OG tags
- **WHEN** the homepage is rendered
- **THEN** OG meta tags are present with site-level title and description

### Requirement: Canonical URLs
Every indexable page SHALL include a `<link rel="canonical">` tag pointing to its canonical URL.

#### Scenario: Post has canonical
- **WHEN** a post at `/writing/my-post/` is rendered
- **THEN** the head contains `<link rel="canonical" href="https://gianna-brachetti.com/writing/my-post/">`

### Requirement: Tag taxonomy pages
Hugo SHALL generate tag archive pages at `/tags/<tag>/` listing all posts and notes with that tag.

#### Scenario: Tag page lists tagged content
- **WHEN** 3 posts and 2 notes have the tag "seo"
- **THEN** `/tags/seo/` lists all 5 items

### Requirement: Scrollbar styling
The site SHALL style the scrollbar: 3px width, black track, dim thumb.

#### Scenario: Custom scrollbar renders
- **WHEN** a page has scrollable content on a WebKit browser
- **THEN** the scrollbar appears as a thin 3px bar with dark styling
