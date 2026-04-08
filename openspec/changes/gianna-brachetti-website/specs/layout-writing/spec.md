## ADDED Requirements

### Requirement: Writing archive list page
The writing list page (`/writing/`) SHALL display: a page header with label (`> all transmissions`), title (`Writing & thinking`), and post count. Posts SHALL be grouped by year with year dividers. Each post row SHALL show: date, title (Cormorant Garamond), tag, type badge (essay/observation/guide), and a hover arrow.

#### Scenario: Posts grouped by year
- **WHEN** posts exist from 2024 and 2025
- **THEN** the archive shows two year groups with posts in reverse chronological order within each

### Requirement: Writing type filter
The writing archive SHALL include a filter bar with buttons: all, essays, observations, guides. Filtering SHALL be client-side (toggling `hidden` class). The visible post count SHALL update when filtering.

#### Scenario: Filter by type
- **WHEN** user clicks "essays"
- **THEN** only posts with `type_label: essay` are visible and the count updates

#### Scenario: Default state
- **WHEN** the writing archive loads
- **THEN** the "all" filter is active and all posts are visible

### Requirement: Single post layout
A single writing post SHALL display: back link to `/writing/`, post type + read time label (red), title (large Cormorant Garamond), meta bar (published date, read time, type), and the post body. The body SHALL style: paragraphs, h2, h3, strong, em (Cormorant Garamond italic), links (blue with underline), code (inline with dim background), pre blocks (border-left accent), blockquotes (border-left red, Cormorant Garamond italic), sidenotes (`// ` prefix), and horizontal rules.

#### Scenario: Post renders with all typography
- **WHEN** a post containing headings, code blocks, blockquotes, and links is viewed
- **THEN** all elements render according to the design system typography

### Requirement: Reading progress bar
Single posts SHALL display a 2px accent-blue progress bar fixed to the top of the viewport. The bar width SHALL represent scroll progress through the post body (0% at top, 100% at bottom).

#### Scenario: Progress tracks scroll
- **WHEN** user scrolls to the middle of a post
- **THEN** the progress bar is approximately 50% width

### Requirement: Post tags
Single posts SHALL display tags below the post body as clickable badges linking to `/tags/<tag>/`.

#### Scenario: Tags render and link
- **WHEN** a post has tags `[seo, search-intent]`
- **THEN** two tag badges appear linking to `/tags/seo/` and `/tags/search-intent/`

### Requirement: Previous/next navigation
Single posts SHALL display prev/next navigation below the tags, showing the title of each adjacent post (by date). The navigation SHALL use a two-column grid with 1px border gap.

#### Scenario: Middle post has both neighbours
- **WHEN** viewing a post that is neither the first nor last
- **THEN** both "previous" and "next" links appear with the adjacent post titles

#### Scenario: First post has no previous
- **WHEN** viewing the oldest post
- **THEN** only the "next" link appears

### Requirement: Meta description and Open Graph
Each post SHALL generate: `<meta name="description">` from the `description` front matter field, and Open Graph tags (`og:title`, `og:description`, `og:type=article`, `article:published_time`).

#### Scenario: Post has OG meta
- **WHEN** a post page is rendered
- **THEN** the HTML head contains correct Open Graph meta tags

### Requirement: Author bio partial
Every writing post SHALL include an "about the author" section rendered below the post body and above the tags. The section SHALL display: the author's name, a short biographical description, and a link to the about page (`/about/`).

#### Scenario: Author bio renders on post
- **WHEN** a writing post is viewed
- **THEN** an "about the author" block appears between the post body and the tag badges, showing the author name, bio text, and a link to `/about/`

### Requirement: Article JSON-LD structured data
Every writing post SHALL include a `<script type="application/ld+json">` block in the HTML head containing schema.org Article structured data with fields: `headline`, `description`, `datePublished`, `dateModified`, `wordCount`, and `author` as a `Person` type with `url` linking to the about page.

#### Scenario: JSON-LD present on post
- **WHEN** a writing post is rendered
- **THEN** the HTML contains a JSON-LD script block with `@type: Article`, the post's headline, dates, word count, and author as a Person with `url` pointing to `/about/`

#### Scenario: dateModified reflects lastmod
- **WHEN** a post has `lastmod` in front matter
- **THEN** the JSON-LD `dateModified` field uses the lastmod value

### Requirement: article:author Open Graph tag
All writing pages SHALL include an `<meta property="article:author">` Open Graph tag in the HTML head.

#### Scenario: OG author tag present
- **WHEN** a writing post is rendered
- **THEN** the HTML head contains `<meta property="article:author">` with the author's name or URL
