## ADDED Requirements

### Requirement: Hero section
The homepage SHALL display a full-viewport hero with: a label (`> signal source`), a large headline in Cormorant Garamond (`Signal, noise, and the things I notice in between` with "noise" in muted italic), a description paragraph, and stats (transmissions count, garden fragments count). All elements SHALL animate in with staggered `slide-up` animations.

#### Scenario: Hero renders on load
- **WHEN** the homepage is visited
- **THEN** the hero section fills the viewport with staggered fade-in animations for label, headline, description, and stats

### Requirement: Octopus SVG illustration
The hero SHALL include a decorative SVG octopus positioned at the bottom-right, with subtle breathing animation on the arms. Two arms SHALL have faint blue and red accent strokes. The octopus SHALL fade in after a delay (0.9s).

#### Scenario: Octopus appears with animation
- **WHEN** the homepage loads
- **THEN** the octopus SVG fades in from below with a slight rotation, and arms gently pulse

#### Scenario: Reduced motion
- **WHEN** user has `prefers-reduced-motion: reduce`
- **THEN** the octopus appears without animation and arms do not pulse

### Requirement: Recent writing section
The homepage SHALL display the most recent writing posts in a grid: one featured post (larger, with excerpt) and 3-4 regular posts. Each post card SHALL show: type label + read time (red), title (Cormorant Garamond, turns blue on hover), excerpt (featured only), and a tag badge. A "view all" link SHALL point to `/writing/`.

#### Scenario: Recent posts from content
- **WHEN** 5 or more writing posts exist
- **THEN** the homepage shows the newest post as featured and the next 3 as regular cards

### Requirement: Garden fragment preview
The homepage SHALL display 3 recent digital garden notes in a grid. Each fragment card SHALL show: status indicator (fresh/spreading/settled with coloured dot), title, and a body preview. A "view all" link SHALL point to `/notes/`.

#### Scenario: Garden fragments from content
- **WHEN** 3 or more notes exist
- **THEN** the homepage shows the 3 most recently modified notes with correct status colours

### Requirement: Scroll reveal animations
Content sections below the hero SHALL fade in as the user scrolls (opacity 0 + translateY 22px, transitioning to visible). The reveal SHALL use IntersectionObserver.

#### Scenario: Sections animate on scroll
- **WHEN** user scrolls past the hero
- **THEN** the writing and garden sections fade in as they enter the viewport

### Requirement: Easter egg
The homepage SHALL include a hidden terminal-style overlay triggered by a keyboard shortcut or interaction. The overlay SHALL display themed ASCII text with staggered line animations.

#### Scenario: Easter egg activation
- **WHEN** the user triggers the easter egg interaction
- **THEN** a full-screen terminal overlay appears with themed content and can be dismissed
