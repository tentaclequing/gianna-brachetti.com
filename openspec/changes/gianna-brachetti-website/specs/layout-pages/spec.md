## ADDED Requirements

### Requirement: About page layout
The about page (`/about/`) SHALL display: identity block with hair swatch (red + blue colour blocks), label (`> signal source`), name (Gianna Brachetti-Truskawa), role line (SEO strategist / AI researcher / language nerd), body copy, fact grid (2x2 on desktop, 1-col on mobile), "currently" section (accent-blue left border), "work with me" section, and contact links.

#### Scenario: About page renders all sections
- **WHEN** the about page is visited
- **THEN** all sections render: identity, body, fact grid, currently, work with me, contact

### Requirement: Work with me section
The about page SHALL include a "work with me" section with: section label, availability status (dot + text), headline (Cormorant Garamond), body copy, an offer callout (red left border with `//` decoration), and a CV nudge link to `/about/cv/`.

#### Scenario: Availability status displays
- **WHEN** the about page is visited
- **THEN** the work-with-me section shows current availability status

### Requirement: Contact links
The about page SHALL display contact links as bordered button-style links: email (primary style with accent border), LinkedIn, and GitHub.

#### Scenario: Contact links render
- **WHEN** the about page is visited
- **THEN** email, LinkedIn, and GitHub links render as styled buttons

### Requirement: CV web page
The CV page (`/about/cv/`) SHALL display: breadcrumb navigation (~/gianna / about / cv), a sticky download bar with "last updated" date and PDF download button, CV header (name, role, contact chips), and structured sections: profile, experience (grid layout with title/company/bullets on left, period/location on right), skills (2-column grid), education, and elsewhere.

#### Scenario: CV renders all sections
- **WHEN** the CV page is visited
- **THEN** all sections render: breadcrumb, download bar, header, profile, experience, skills, education, elsewhere

### Requirement: CV PDF download
The CV page SHALL include a sticky download bar with a button linking to a pre-generated PDF file. The button SHALL have `download` attribute with filename `Gianna-Brachetti-Truskawa_CV.pdf`.

#### Scenario: PDF download works
- **WHEN** user clicks the download PDF button
- **THEN** the browser downloads the PDF file

### Requirement: CV is noindex
The CV page SHALL include `<meta name="robots" content="noindex, follow">`.

#### Scenario: CV has noindex meta
- **WHEN** the CV page is rendered
- **THEN** the HTML head contains the noindex directive

### Requirement: CV breadcrumb
The CV page SHALL display a breadcrumb: `~/gianna / about / cv` where `~/gianna` links to home, `about` links to `/about/`, and `cv` is the current page (not linked).

#### Scenario: Breadcrumb renders with links
- **WHEN** the CV page is visited
- **THEN** the breadcrumb shows three levels with the first two as links

### Requirement: Speaking page layout
The speaking page (`/speaking/`) SHALL display: page header with label (`> on the record`), title (`Hear me speak`), description. Content SHALL be split into: "transmission pending" section (upcoming talks or empty state) and "past transmissions" section (talks grouped by year, reverse chronological).

#### Scenario: Speaking page with no upcoming talks
- **WHEN** no upcoming talks are defined
- **THEN** the empty state renders with italicised text and an email invite link

#### Scenario: Speaking page with past talks
- **WHEN** past talks are defined
- **THEN** talks render grouped by year, each showing: conference name, location (with pin icon), date, talk title (Cormorant Garamond), description, and tag badges

### Requirement: Speaking data structure
Talks SHALL be defined as YAML arrays in the speaking page's front matter, with fields: `title`, `conference`, `location`, `date`, `description`, `tags`, and `upcoming` (boolean).

#### Scenario: Talk data renders correctly
- **WHEN** a talk entry has all fields populated
- **THEN** the talk card renders with conference, location, date, title, description, and tags

### Requirement: Speaking invite footer
The speaking page SHALL include a footer section with label (`// invite`), description text, and an email link for booking inquiries.

#### Scenario: Invite section renders
- **WHEN** the speaking page is visited
- **THEN** the invite section appears at the bottom with contact information

### Requirement: Person JSON-LD on about page
The about page SHALL include a `<script type="application/ld+json">` block containing schema.org Person structured data with fields: `name`, `jobTitle`, and `sameAs` array linking to LinkedIn and GitHub profiles.

#### Scenario: Person JSON-LD present
- **WHEN** the about page is rendered
- **THEN** the HTML contains a JSON-LD script block with `@type: Person`, the author's name, job title, and `sameAs` array with LinkedIn and GitHub URLs

### Requirement: About page H1 shows full name
The about page H1 heading SHALL display the full name "Gianna Brachetti-Truskawa", regardless of the page `title` field in front matter.

#### Scenario: Full name in H1
- **WHEN** the about page is visited
- **THEN** the H1 element contains "Gianna Brachetti-Truskawa"

### Requirement: About page roles from frontmatter
The about page SHALL render role descriptions from an array field in the page's front matter (e.g. `roles: [SEO strategist, AI researcher, language nerd]`), not hardcoded in the template.

#### Scenario: Roles rendered from data
- **WHEN** the about page front matter contains `roles: [SEO strategist, AI researcher]`
- **THEN** the page displays those roles as listed in the front matter

### Requirement: Work-with-me section anchor
The work-with-me section on the about page SHALL have `id="work-with-me"` for direct linking via `#work-with-me` fragment.

#### Scenario: Direct link to work-with-me
- **WHEN** a user navigates to `/about/#work-with-me`
- **THEN** the browser scrolls to the work-with-me section

### Requirement: Speaking link in work-with-me
The work-with-me section SHALL include a "See me speak" link (or equivalent) pointing to `/speaking/`.

#### Scenario: Speaking link present
- **WHEN** the about page work-with-me section is viewed
- **THEN** a link to `/speaking/` is visible and functional

### Requirement: Email obfuscation
All email addresses displayed on the site SHALL be protected from scraping using a combination of: base64 encoding (decoded by JavaScript on click), CSS reverse display (`direction: rtl` with reversed text in the HTML source), and reversed character order. No plain-text email address SHALL appear in the HTML source.

#### Scenario: Email not in page source
- **WHEN** the HTML source of a page containing an email link is inspected
- **THEN** no plain-text email address (e.g. `user@domain.com`) appears in the source

#### Scenario: Email works on click
- **WHEN** a user clicks an obfuscated email link with JavaScript enabled
- **THEN** the mailto: link is decoded and the user's email client opens with the correct address

#### Scenario: Email readable without JS
- **WHEN** a user views the page without JavaScript
- **THEN** the email text is displayed in reverse via CSS `direction: rtl` and remains human-readable
