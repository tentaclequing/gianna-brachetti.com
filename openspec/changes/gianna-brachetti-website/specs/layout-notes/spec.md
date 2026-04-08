## ADDED Requirements

### Requirement: Garden index page
The notes list page (`/notes/`) SHALL display: a page header with label (`> digital garden`), title (`Signal fragments`), description, and a status legend (fresh ink = cyan dot, spreading = red dot, settled = grey dot). Notes SHALL render in a 3-column grid (2-col on tablet, 1-col on mobile).

#### Scenario: Notes grid renders
- **WHEN** the garden index is visited with 7 notes
- **THEN** all 7 notes appear as cards in a responsive grid

### Requirement: Note card
Each note card in the grid SHALL display: status badge (coloured dot + label), title (Cormorant Garamond), body preview (3-line clamp), footer with date and tag badges. Link notes SHALL additionally show a source attribution line with `↗` prefix.

#### Scenario: Link note card
- **WHEN** a note has `source_url` and `source_name` in front matter
- **THEN** the card shows the source name below the status badge and the title appears slightly muted

### Requirement: Status filter
The garden index SHALL include a filter bar with buttons: all, fresh ink, spreading, settled. Filtering SHALL be client-side, toggling card visibility based on `data-status` attributes.

#### Scenario: Filter by status
- **WHEN** user clicks "fresh ink"
- **THEN** only notes with `status: fresh` are visible

### Requirement: Single note layout
A single note SHALL display: back link to `/notes/` ("signal fragments"), status badge (coloured border + dot + label text, with pulse animation for "spreading"), title (Cormorant Garamond), meta row (planted date, last tended date, type), and the note body.

#### Scenario: Spreading note pulses
- **WHEN** viewing a note with `status: spreading`
- **THEN** the status badge has a subtle red box-shadow pulse animation

### Requirement: Source block for link notes
When a note has `source_url` defined in front matter, the note SHALL render a source block between the meta row and body. The block SHALL show: "source" label, publication name, article title, and link to the external URL with `↗` arrow. The block SHALL be a clickable link with `target="_blank"` and `rel="noopener noreferrer"`.

#### Scenario: Link note with source
- **WHEN** a note has `source_url: "https://example.com/article"`, `source_name: "The Atlantic"`, `source_title: "Article Title"`
- **THEN** a source block renders linking to the URL with the publication and title displayed

#### Scenario: Regular note without source
- **WHEN** a note has no `source_url` in front matter
- **THEN** no source block is rendered

### Requirement: Working note callout
The note body SHALL support a "working note" callout block (`.wip-block`) with red left border and a label. This SHALL be implemented as a Hugo shortcode.

#### Scenario: WIP callout renders
- **WHEN** the note body contains the wip shortcode
- **THEN** a callout block renders with red left border and "working note" label

### Requirement: Open question marker
The note body SHALL support an inline open question marker (`.open-q`) with `?` prefix in red. This SHALL be implemented as a Hugo shortcode.

#### Scenario: Open question renders
- **WHEN** the note body contains the open-question shortcode
- **THEN** an indented italic block renders with a red `?` prefix

### Requirement: Backlinks section
Each note SHALL display a "referenced by" section listing all other notes that contain a link to the current note. Each backlink item SHALL show: `↩` arrow, title (Cormorant Garamond), and content type label.

#### Scenario: Note with backlinks
- **WHEN** note A contains a Markdown link to note B
- **THEN** note B's backlinks section lists note A with its title and type

#### Scenario: Note without backlinks
- **WHEN** no other notes link to note C
- **THEN** note C's backlinks section is not rendered

### Requirement: Notes are noindex
All note pages SHALL include `<meta name="robots" content="noindex, follow">` in the HTML head.

#### Scenario: Note has noindex meta
- **WHEN** a note page is rendered
- **THEN** the HTML head contains the noindex directive

### Requirement: Note description field mandatory
All notes MUST have a `description` field in their front matter. The description field is not optional - it SHALL be present on every note and used for meta description tags and card previews.

#### Scenario: Note without description fails validation
- **WHEN** a note Markdown file has no `description` field in front matter
- **THEN** the note is considered invalid and should be corrected before publishing

#### Scenario: Description used in meta tag
- **WHEN** a note with a `description` field is rendered
- **THEN** the HTML head contains `<meta name="description">` with the description value
