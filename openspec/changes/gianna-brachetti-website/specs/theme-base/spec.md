## ADDED Requirements

### Requirement: Design tokens as CSS custom properties
The theme SHALL define all design tokens as CSS custom properties on `:root`: `--black: #000000`, `--white: #E4E4DC`, `--accent: #00AAFF`, `--accent-red: #FF1F3D`, `--dim: #1E1E1C`, `--muted: #565650`, `--border: #161614`, `--fresh: #4DCCFF`, `--spreading: #FF1F3D`, `--settled: #565650`, `--safe-bottom: env(safe-area-inset-bottom, 0px)`.

#### Scenario: Tokens available globally
- **WHEN** any page is rendered
- **THEN** all CSS custom properties are defined and available to all elements

### Requirement: Typography system
The theme SHALL self-host Cormorant Garamond (weights 300, 400, 600; italic 300, 400) and Fira Code (weights 300, 400, 500) as variable WOFF2 files served from `/fonts/` (3 files total). @font-face declarations SHALL use `font-weight` ranges for variable font support. No Google Fonts dependency. `font-display: swap` SHALL be set. Body text SHALL use Fira Code monospace at 13px/1.75. Headlines SHALL use Cormorant Garamond serif.

#### Scenario: Fonts render correctly
- **WHEN** a page loads
- **THEN** body text renders in Fira Code monospace and headings render in Cormorant Garamond serif

### Requirement: Film grain overlay
The theme SHALL render a full-viewport SVG noise overlay with `opacity: 0.028`, `pointer-events: none`, `z-index: 9998`, using a `fractalNoise` filter animated with a `grain` keyframe animation at `steps(2)` over 8 seconds.

#### Scenario: Grain visible but non-interactive
- **WHEN** any page is viewed
- **THEN** a subtle film grain texture is visible over the entire viewport and does not interfere with clicks or scrolling

#### Scenario: Reduced motion preference
- **WHEN** the user has `prefers-reduced-motion: reduce` enabled
- **THEN** the grain animation SHALL be paused

### Requirement: Custom cursor
On devices matching `(hover: hover) and (pointer: fine)`, the theme SHALL hide the system cursor and display a custom crosshair cursor (20px, thin lines) with an accent-coloured dot (4px, blue glow). When hovering over links, the crosshair SHALL turn blue and the dot SHALL turn red.

#### Scenario: Desktop cursor replacement
- **WHEN** a user with a mouse visits any page
- **THEN** the system cursor is hidden and a crosshair cursor follows the mouse position

#### Scenario: Mobile devices unaffected
- **WHEN** a user on a touch device visits any page
- **THEN** no custom cursor elements are rendered and the system cursor behaves normally

### Requirement: Top navigation (desktop)
The theme SHALL render a fixed top navigation bar with: site name `~/gianna` (with blue `~/` prompt), and navigation links (writing, notes, about) in uppercase monospace. Links SHALL have an underline animation on hover. The current section SHALL be highlighted via `aria-current`.

#### Scenario: Navigation renders on desktop
- **WHEN** viewport width is 900px or wider
- **THEN** the top navigation is visible with all links

#### Scenario: Current page indication
- **WHEN** viewing the writing archive
- **THEN** the "writing" nav link has `aria-current="page"` and appears highlighted

### Requirement: Bottom navigation (mobile)
The theme SHALL render a fixed bottom navigation bar (visible below 900px) with icon+label items for: home, writing, notes, about. Each item SHALL have a minimum touch target of 44x44px. The active item SHALL be highlighted in accent blue.

#### Scenario: Mobile navigation renders
- **WHEN** viewport width is below 900px
- **THEN** the bottom navigation is visible and the top navigation links are hidden

### Requirement: Footer with uptime counter
The theme SHALL render a footer with: site name (`~/gianna`), build attribution (`built with hugo · obsidian · patience`), and a live uptime counter showing time since page load in `HH:MM:SS` format, coloured in accent blue.

#### Scenario: Uptime counter increments
- **WHEN** a page has been open for 65 seconds
- **THEN** the uptime counter displays `00:01:05`

### Requirement: Skip to content link
Every page SHALL include a visually hidden "Skip to content" link as the first focusable element, which becomes visible on focus and jumps to `#main-content`.

#### Scenario: Keyboard navigation
- **WHEN** a keyboard user presses Tab on page load
- **THEN** the skip link becomes visible and, when activated, moves focus to the main content area

### Requirement: Base layout
The theme SHALL have a `baseof.html` layout that includes: HTML5 doctype, lang="en", meta viewport, theme-color meta, skip link, grain overlay, custom cursor elements, top nav, bottom nav, main content block, footer, cursor JS, and uptime JS.

#### Scenario: All pages inherit base layout
- **WHEN** any page is rendered
- **THEN** it includes the navigation, grain overlay, cursor, and footer from the base layout

### Requirement: Self-hosted fonts
All fonts SHALL be served as variable WOFF2 files from the `/fonts/` directory (3 files: Cormorant Garamond variable, Cormorant Garamond italic variable, Fira Code variable). The site SHALL have zero dependency on Google Fonts or any external font CDN. @font-face declarations SHALL specify `font-weight` ranges matching the variable font axes.

#### Scenario: No external font requests
- **WHEN** a page is loaded and network requests are inspected
- **THEN** no requests are made to `fonts.googleapis.com` or `fonts.gstatic.com`, and all font files are served from `/fonts/`

#### Scenario: Variable font weight ranges
- **WHEN** @font-face rules are inspected in the CSS
- **THEN** each declaration includes a `font-weight` range (e.g. `300 600`) rather than a single weight value

### Requirement: Reduced motion global rule
When the user has `prefers-reduced-motion: reduce` enabled, ALL animations and transitions across the entire site SHALL be disabled. This SHALL be implemented as a global rule in `_reset.css` that sets `animation: none`, `transition: none`, and `scroll-behavior: auto` on all elements.

#### Scenario: All motion disabled
- **WHEN** a user with `prefers-reduced-motion: reduce` visits any page
- **THEN** no CSS animations play, no CSS transitions occur, and scroll behaviour is instant (not smooth)
