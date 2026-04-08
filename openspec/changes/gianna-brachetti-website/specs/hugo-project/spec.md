## ADDED Requirements

### Requirement: Hugo project structure
The project SHALL use Hugo's standard directory structure with a custom theme at `themes/signal-noise/`. The content directory SHALL serve as an Obsidian vault (standard Markdown with YAML front matter, no wikilinks).

#### Scenario: Project initialisation
- **WHEN** `hugo new site` is run or equivalent structure is created
- **THEN** the project contains: `hugo.toml`, `content/`, `themes/signal-noise/`, `static/`, `.github/workflows/`

#### Scenario: Hugo builds successfully
- **WHEN** `hugo --minify` is run from the project root
- **THEN** the site builds with zero errors and outputs to `public/`

### Requirement: Hugo configuration
The project SHALL have a `hugo.toml` configuration file with: site title (`~/gianna`), base URL (`https://gianna-brachetti.com/`), theme (`signal-noise`), taxonomies (tags), output formats (HTML, RSS, sitemap), and markup settings (Goldmark with unsafe HTML enabled for shortcodes).

#### Scenario: Configuration defines all content sections
- **WHEN** Hugo reads `hugo.toml`
- **THEN** sections for `writing`, `notes`, `about`, and `speaking` are configured with correct permalink patterns

### Requirement: Content directory structure
The content directory SHALL contain sections matching the site map: `writing/`, `notes/`, `about/` (with `cv.md`), `speaking/`, and a root `_index.md` for the homepage.

#### Scenario: Writing content with front matter
- **WHEN** a Markdown file exists at `content/writing/my-post.md` with front matter fields `title`, `date`, `type_label`, `tags`, `description`
- **THEN** Hugo renders it using the writing single layout

#### Scenario: Note content with status
- **WHEN** a Markdown file exists at `content/notes/my-note.md` with front matter fields `title`, `date`, `lastmod`, `status`, `tags`
- **THEN** Hugo renders it using the notes single layout with the correct status badge

### Requirement: Placeholder content
The project SHALL include illustrative placeholder content for all content types: at least 3 writing posts (one essay, one observation, one guide), at least 4 notes (covering all three statuses plus one link note), an about page, a CV page, and a speaking page with sample talks.

#### Scenario: All page types render with placeholder content
- **WHEN** Hugo builds the site
- **THEN** every page type defined in the site map has at least one rendered page with realistic placeholder content

### Requirement: Content directory as Obsidian vault symlink
The content directory SHALL be a symlink to an external Obsidian vault. Hugo SHALL use `module.mounts` configuration with `excludeFiles` to skip non-content directories within the vault (e.g. `Archive/`).

#### Scenario: Symlinked content builds
- **WHEN** `hugo --minify` is run and `content/` is a symlink to an Obsidian vault
- **THEN** Hugo builds successfully using the vault's Markdown files as content

#### Scenario: Excluded directories ignored
- **WHEN** the Obsidian vault contains an `Archive/` directory
- **THEN** Hugo does not process files from `Archive/` during build

### Requirement: ignoreFiles for non-publishable content
The Hugo configuration SHALL include `ignoreFiles` patterns to skip non-publishable vault content (e.g. templates, daily notes, private files).

#### Scenario: Ignored files not rendered
- **WHEN** the vault contains files matching ignoreFiles patterns
- **THEN** those files do not produce output pages in the built site

### Requirement: Shorter URL slugs
Content files with long titles SHALL have an explicit `slug:` field in front matter to produce shorter, more readable URLs.

#### Scenario: Custom slug overrides filename
- **WHEN** a post file is named `why-i-stopped-chasing-seo-perfection-and-started-building-things.md` with `slug: stop-chasing-perfection`
- **THEN** the rendered URL is `/writing/stop-chasing-perfection/` (not the filename)
