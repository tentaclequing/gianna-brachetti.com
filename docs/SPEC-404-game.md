# 404 Octopus Game Spec

**Status:** Scoped, not started
**Location:** Inline in `themes/signal-noise/layouts/404.html`
**Session:** Build in a dedicated session

---

## Concept

Horizontal side-scroller on the 404 page. An octopus crawls and swims through increasingly deep ocean zones. Endless mode with high score and social sharing. Atmospheric and moody with a touch of cuteness. Monkey Island spirit (not copying).

## Movement System

The core differentiator: two locomotion modes based on real octopus behaviour.

- **Crawling** (default): arms ripple along the sea floor, moderate speed, low profile. Avoids water-column threats. Can collect floor-only items (crabs).
- **Swimming/jetting** (spacebar/tap): octopus lifts off the floor via water jet (siphon propulsion). Faster, can go higher, exposed to different threats. Slowly sinks back down (gravity equivalent). Visually distinct from crawling.
- **Ink burst** (defensive, limited charges): creates an ink cloud that blocks/stuns threats behind you. Charges refill by collecting ink sacs.

## Depth Zones

Visual progression, difficulty increases over time:

1. **Shallows**: bright-ish, coral, small fish, gentle current
2. **Mid-water**: dimmer, jellyfish, faster currents
3. **Deep zone**: dark, bioluminescence only, anglerfish lures (fake collectibles that are traps), pressure pulses
4. **Abyss**: near-black, octopus itself glows faintly, everything is silhouette

## Collectibles & Power-ups

- **Plankton clouds**: points (small, frequent)
- **Crabs**: bonus points (floor only, reward for crawling)
- **Bioluminescent shrimp**: temporary light radius in dark zones
- **Giant isopod**: size boost (octopus grows, can smash through small obstacles, temporary)
- **Ink sac**: refills ink burst charge

## Threats

Different per zone, force the player to switch between crawling and swimming:

- **Sea urchins**: floor hazard, avoid by swimming
- **Jellyfish**: water column hazard, avoid by crawling
- **Anglerfish** (deep zones): lure looks like a collectible, punishes greedy collecting
- **Current surges**: push backward, resist or dodge

## Scoring & Social

- Distance-based score plus collectible bonuses
- Depth zone reached shown as flavour text ("you reached the midnight zone")
- Share button generates text: "I crawled 847m into the abyss. 🐙 [url]"
- Target platforms: Mastodon, Bluesky, clipboard (no Twitter/X)
- High score in localStorage (per-browser, no server)

## Visual Style

- Black background, site palette: accent blue (`#00aaff`) for bioluminescence, accent red (`#ff1f3d`) for threats
- Octopus: simple shapes, expressive eyes (react to threats), arms animate differently when crawling vs swimming
- Atmospheric, slight pixel-ish feel, environmental storytelling
- Dry humour in death/restart messages

## Audio

- **All sound off by default.** Mute/unmute toggle always visible and accessible. User controls sound at all times.
- Procedural sounds via Web Audio API: jet whoosh, ink puff, ambient water, collectible chime
- Ambient music: subtle drone/atmosphere, not a melody. Gets darker with depth zones.
- No sound autoplays. Sound activates only after explicit user opt-in (toggle).

## Technical

- Vanilla Canvas, no libraries
- Web Audio API for all sound (procedural, no audio file downloads)
- Keyboard: space to swim, down arrow to crawl back, shift/ctrl for ink burst
- Touch: tap to swim, swipe down to crawl, double-tap for ink burst
- `prefers-reduced-motion`: simplified animations, game still playable
- All inline in the 404 page (no external files beyond what the page already loads)
- Game hidden behind a "play" prompt so the 404 page still functions as a 404 first

## Out of Scope (v1)

- No server-side leaderboard
- No complex particle systems
- No save/resume (session-only)
- No multiplayer
- No achievements system

## Open Questions

- Death messages: curate a list of dry/funny restart lines?
- Should the game trigger automatically or require explicit "press space to play"?
- Canvas size: full viewport or contained within a portion of the 404 page?
- Octopus colour: match the spooky ICO favicon pink, or the site's accent blue?
