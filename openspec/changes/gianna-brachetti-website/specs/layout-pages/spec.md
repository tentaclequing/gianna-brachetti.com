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
