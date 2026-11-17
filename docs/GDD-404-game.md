# Game Design Document: Octopus 404

**Status:** Locked v1.0
**Date:** 2026-11-17
**Location:** Inline in `themes/signal-noise/layouts/404.html`
**Prototype:** `docs/404-game-prototype.html`

---

## 1. The Pitch

A horizontal endless side-scroller hidden on the 404 page. You play an overwhelmed little octopus crawling and swimming through increasingly deep, increasingly hostile ocean. The world is monochrome and moody. The octopus is the only warm thing in it. You clutch pearls, dodge dark shapes, and try not to die. When you do die, the game is dry about it.

The tone is dark British humour meets Studio Ghibli's ocean scenes: spooky, beautiful, and a little absurd. The octopus is cute and slightly chaotic. The ocean is not.

---

## 2. Visual Identity

### Colour Rules

The world is monochrome. Colour is a privilege, not a default.

| Element | Colour | Rationale |
|---------|--------|-----------|
| Background, floor, scenery | Grays (3-30) | The ocean is dark and indifferent |
| Enemies | Dark silhouettes with **subtle lighter edge/outline** | Must be visible against dark background; no colour, but readable |
| Octopus | Warm reddish-orange (classic octopus, close to the emoji) | The only warm thing in a cold world |
| Collectibles, power-ups | Accent blue (`#00aaff`) glow | Colour = "pick me up" |
| Pearls (ammo) | Soft white/cream with subtle iridescent shimmer | Precious, distinct from blue collectibles |
| Death/damage | Brief red flash (`#ff1f3d`) | The only time red appears |
| UI/HUD | Gray (`#444`-`#888`) | Unobtrusive |

### Enemy Visibility

Dark silhouettes against a dark background need contrast work:
- Enemies get a **thin lighter outline** (gray 40-50) so they read as shapes
- Moving enemies get subtle **motion trails** (faint gray wake)
- Some enemies have a single distinguishing feature (urchin spines catch faint light, plastic bag edges shimmer cold-white, pufferfish spines extend when inflating)
- The player learns to read the shapes, not the colours

### Atmosphere by Zone

Each zone darkens the background gradient and changes the scenery palette. The ocean gets colder and emptier as you go deeper.

---

## 3. The Octopus

### Appearance

Classic octopus colours: warm reddish-orange body, slightly lighter underside, expressive white eyes with dark pupils. Close to the octopus emoji but rendered in the game's style (simple shapes, not pixel art). Small enough to feel vulnerable in the ocean.

### Personality

- Dry, overwhelmed, slightly chaotic
- Expressed through: death messages, eye reactions (pupils track threats, widen near danger), arm movements (panicky when swimming, determined when crawling)
- Never speaks during gameplay; personality comes through animation and the text around the game

### Animations

**Crawling (default, on the ocean floor):**
- Real octopus walking: arms reach forward and pull the body along in an alternating gait
- Two or three arms visibly "step" ahead while others push from behind
- Body bobs slightly with each step cycle
- Funny, deliberate, a little clumsy
- Reference: real octopus walking videos (the tippy-toe look)

**Sprinting (floor, fast):**
- Arms turn into a frantic scramble, almost cartoonish speed
- Body wobbles side to side, slightly bouncing
- If clutching a pearl: one arm is wrapped tight around the pearl while the others do all the work, visibly struggling. The asymmetry makes it hilarious.
- If wearing a shell: tiny arms poking out of the shell, scrambling madly. The shell bounces.
- If clutching a pearl AND wearing a shell: maximum chaos. Peak visual comedy.
- Small dust/sand clouds kick up behind

**Swimming (jet propulsion, in the water column):**
- Body squishes into a streamlined shape (squish animation)
- Arms trail behind in a loose bundle
- Siphon jet: small burst of bubbles behind
- Gravity pulls the octopus down slowly; must keep pressing to stay up
- Feels urgent, like the octopus would rather be on the floor

**Carrying a pearl:**
- One arm curls around the pearl visibly
- Slightly slower movement (weight)
- Pearl glows faintly (white/cream shimmer)

**Throwing a pearl:**
- Quick arm whip forward
- Pearl flies in a slight arc
- Satisfying release animation

**Camouflage:**
- Colour drains from the body over ~0.3s, warm orange fading to background gray
- Arms go still, tucked close to body
- Eyes remain slightly brighter than the rest (the giveaway)
- Occasionally the shade is slightly wrong (trying hard, not quite nailing it)
- When released: colour floods back in a quick warm pulse

**Taking damage (death):**
- Brief red flash over the whole screen
- Octopus ink-clouds (small puff)
- Freeze frame, then death screen

### Saved Design: Pale Gray Octopus

The current prototype's pale gray octopus design is saved as a potential alternate skin or unlockable ("ghost octopus"). File: `docs/404-game-prototype-v2-monochrome.html` [to be saved before overwriting].

---

## 4. World Design

### Ocean Floor

The floor is the anchor of the world. It scrolls left with parallax layers behind it.

**Parallax layers (back to front):**
1. **Far background** (speed 0.1x): distant ridges, underwater mountain silhouettes
2. **Mid-ground** (speed 0.25x): kelp forests (swaying), rock formations, coral shapes
3. **Near background** (speed 0.4x): larger rocks, cave openings, shipwreck fragments
4. **Floor detail** (speed 0.6x): seagrass, small shells, sand ripples
5. **Foreground** (speed 1.2x): occasional close-up elements that pass in front of the octopus (floating debris, a drifting jellyfish tentacle)

### Zone Progression

The world transitions smoothly as the score increases. No hard cuts.

**Zone 1: The Shallows (0-200m)**
- Background: faint light rays from above, light grays (8-15)
- Floor: sandy, shells, small coral, seagrass
- **Above-water intrusions:**
  - Boat hulls visible at the top of the screen (dark silhouettes from below)
  - Anchors dropping down (obstacle? scenery?)
  - Fishing nets trailing through (obstacle)
  - Wellington boots splashing in from above (scenery, funny)
  - Oars dipping in and out
- Ambient: floating sediment, small fish silhouettes in background
- Mood: relatively bright, but already a bit eerie

**Zone 2: The Twilight Zone (200-500m)**
- Background: darker (5-10), light rays fade out
- Floor: rocky, less vegetation, more barren
- Scenery: hydrothermal vent steam (gray wisps), tube worm clusters
- No more above-water intrusions (too deep)
- New scenery: bioluminescent dots in far background (not collectibles, just atmosphere)
- Mood: getting lonely

**Zone 3: The Midnight Zone (500-1000m)**
- Background: near-black (2-5)
- Floor: sparse, mostly rock and sediment
- Scenery: whale bones, sunken objects (a shopping trolley, a tyre, a boot)
- The octopus's warm colour becomes the main light source
- Very occasional bioluminescent flash in the distance
- Mood: oppressive, isolated

**Zone 4: The Abyss (1000m+)**
- Background: pure black (0-2)
- Floor: smooth, featureless sediment
- Scenery: almost nothing. Vast emptiness. Occasional alien-looking deep-sea formation.
- The octopus faintly glows (its own warmth against the void)
- Enemies appear as barely-visible shapes that move
- Mood: existential dread, but the octopus is still cute

---

## 5. Mechanics

### Movement

| Mode | Trigger | Speed | Behaviour |
|------|---------|-------|-----------|
| Crawling | Default (on floor) | Moderate | Arms walk, can collect floor items, avoids water-column threats |
| Sprint | Double-tap direction / hold shift | Fast | Frantic arm scramble on the floor, body wobbles comically. Even funnier while clutching a pearl (one arm wrapped around pearl, others scrambling twice as hard). Drains a stamina bar; can't sprint forever. |
| Swimming | Space/tap | Faster | Jet propulsion upward, gravity pulls down, exposed to water-column threats, avoids floor threats |

Switching between modes is the core skill. Floor threats force you to swim. Water threats force you to crawl. Sprinting lets you outrun floor threats but you can't steer vertically. Good players read ahead and switch early.

### Shell Armour

Shells appear on the ocean floor (more common in shallows, rare in deep zones). The octopus can crawl into one while passing over it.

- **Pick up:** automatic when crawling over a shell (like collecting an item)
- **Wearing it:** the octopus squeezes into the shell with eyes and a few arms poking out. Looks ridiculous and adorable. Slightly slower movement.
- **Protection:** absorbs one hit. The shell cracks and falls away, octopus tumbles out unharmed. Without the shell, the next hit kills.
- **One shell at a time.** Can't stack armour.
- **Shell + pearl:** the octopus can carry a pearl AND wear a shell simultaneously. This looks absurd: arms everywhere, pearl in one arm, body stuffed in a shell, little eyes peeking out. Peak comedy.
- **Swimming with shell:** possible but slower. The shell adds drag. Skilled players might drop the shell (press down while swimming) to gain speed in an emergency.
- **Shell types are cosmetic:** different shapes (conch, clam, nautilus) but all give one hit of protection.

### Collectibles

All collectibles glow blue. They are the ONLY blue things in the game.

| Item | Location | Points | Zone | Notes |
|------|----------|--------|------|-------|
| Plankton | Water column | 5 | All | Small, pulsing, frequent |
| Crab | Floor only | 15 | 1-2 | Walks sideways, rewards crawling |
| Bioluminescent shrimp | Water column | 25 | 2-4 | Rare, larger glow aura |
| Giant isopod | Floor | 50 | 3-4 | Rare, temporary size boost |
| Ink sac | Either | 0 | All | Refills ink burst charge (defensive) |

### Pearls (Ammo)

- Appear on the ocean floor, soft white/cream glow, iridescent shimmer
- **Clutch:** press and hold [key/button] near a pearl to pick it up. One arm visibly curls around it.
- **Carry:** octopus moves slightly slower. Pearl is visible.
- **Release/throw:** press [key/button] to throw. Pearl arcs forward and hits the first enemy/obstacle it touches.
- **One pearl at a time.** Must throw or lose current pearl before picking up another.
- Pearl destroys one enemy on hit. Some tougher enemies take two hits [LATER].
- "Clutch a pearl" is the in-game instruction text.

### Enemies/Threats

All enemies are dark silhouettes with a lighter edge for visibility.

| Threat | Location | Zone | Behaviour | Avoidance |
|--------|----------|------|-----------|-----------|
| Sea urchin | Floor | 1-4 | Static, spines catch light | Swim over |
| Plastic bag | Water column | 1-4 | Drifts eerily like a jellyfish, wobbles | Crawl under. Environmental commentary: the real killer. |
| Fishing net | Water column to floor | 1 | Drops from above, slow | Swim through gap or crawl under |
| Fishing hook | Water column | 1-2 | Dangles on a line from above, sways | Swim around or crawl under |
| Boat propeller | Above/shallows | 1 | Fast horizontal pass near surface, deadly | Dive or crawl |
| Pufferfish | Water column | 3-4 | Inflates when octopus is near (spiky = dangerous) | Give wide berth, sprint past |
| Moray eel | Floor (crevice) | 2-4 | Lurks in rock, lunges when you crawl past | Swim over, or sprint past |
| Anglerfish | Water column | 3-4 | Lure looks like a collectible (fake blue glow), then lunges | Learn the tell (lure flickers differently) |
| Current surge | Full height | 2-4 | Pushes backward, telegraphed by visual distortion | Brace (slow down) or find shelter behind rock |
| Anchor | Drops from above | 1 | Falls fast, narrow | Move out of path |

### Collectible Creatures

| Creature | Location | Zone | Behaviour | Points |
|----------|----------|------|-----------|--------|
| Plankton | Water column | 1-4 | Drifts, pulsing glow | 5 |
| Crab | Floor | 1-3 | Scuttles sideways | 15 |
| Shrimp | Floor/low water | 1-3 | Darts in bursts | 10 |
| Jellyfish | Water column | 1-4 | Drifts, wobbles vertically, glows faintly | 20 (food, not a threat!) |

### Camouflage

Real octopuses change colour to blend into their surroundings. Ours does it too, badly.

- **Trigger:** hold [C] / three-finger tap
- **Effect:** the octopus shifts from warm reddish-orange to gray, roughly matching the background. Not perfect camouflage; still slightly visible (a faint outline, eyes still showing).
- **Enemies ignore the octopus** while camouflaged. They pass through or drift past.
- **Duration:** limited (stamina-like bar, shared with sprint? or separate). Can't hold it forever.
- **Trade-off:** can't collect items, clutch pearls, or sprint while camouflaged. The octopus holds completely still or moves very slowly. It's a defensive freeze, not an invisibility cloak.
- **Visual:** colour drains from the octopus over ~0.3s. The warm orange fades to gray. Eyes stay slightly brighter (the tell that it's still there). When it ends, colour floods back.
- **Comedy:** sometimes the camouflage is a bit off (the octopus turns slightly the wrong shade of gray, like it's trying really hard but not quite nailing it).

### Ink Burst (Defensive)

- Press [key] to release ink cloud behind octopus
- Stuns/blocks pursuing threats for a few seconds
- Limited charges (default: 1, refill by collecting ink sacs)
- Visual: dark cloud that dissipates

### Scoring

- 1 point per unit of distance
- Bonus points from collectibles
- Zone reached shown as flavour text ("you reached the midnight zone")
- High score in localStorage (per browser, no server)
- Share text: "I crawled 847m into the abyss. :octopus: [url]"
- Share targets: Mastodon, Bluesky, clipboard

---

## 6. Discovery & Unlockables

The replay hook. Things the player finds or earns that change subsequent runs.

### Discoveries (Environmental)

Things that appear in the background as the player reaches deeper zones. Not interactive, but reward paying attention.

- Shallows: wellington boots, boat hulls, an anchor chain, a rubber duck
- Twilight: a sunken bicycle, a message in a bottle (just scenery)
- Midnight: whale skeleton, a shopping trolley, a single shoe
- Abyss: ???  (deliberately mysterious, let the player wonder)

Each item appears once per run at a random point within its zone. Players will see different things each run.

### The Chest (End Goal)

At 1500m deep in the abyss, a softly glowing chest appears on the ocean floor. Golden/warm light, the only warm-coloured thing in the game besides the octopus. When the octopus reaches it, it opens. Inside: a rubber duck. The screen lingers on it for a moment. Then the death screen appears, but instead of a death message it says: "Worth it."

The game is still endless after this. The chest appears once per run. If the player dies before reaching it, the chest remains a mystery. If they reach it and keep going past it, the game continues as normal but the duck sits in the octopus's inventory (cosmetic only, no gameplay effect).

### Unlockables [PHASE 2]

Earned by reaching milestones. Persist in localStorage.

| Unlock | Condition | Effect |
|--------|-----------|--------|
| Ghost Octopus skin | Reach the midnight zone | Pale gray octopus (the current prototype design) |
| Ink Trail | Throw 50 pearls (cumulative) | Faint ink trail follows the octopus while swimming |
| Deep Eyes | Reach the abyss | Octopus eyes glow faintly in dark zones |
| Pearl Collector | Clutch 100 pearls (cumulative) | Pearls shimmer more visibly |
| Death Poet | Die 50 times (cumulative) | Unlocks extra death messages |

Unlockables are shown on the death screen: "You unlocked: Ghost Octopus"
A small collection screen accessible from the start screen shows what's been found.

---

## 7. Sound Design

**Everything off by default.** A visible, accessible mute/unmute toggle on screen at all times. Sound activates ONLY after explicit user opt-in.

All sounds are procedural via Web Audio API. No audio file downloads.

| Event | Sound | Character |
|-------|-------|-----------|
| Crawling | Soft rhythmic tapping (arms on floor) | Quiet, like tiny footsteps |
| Sprinting | Rapid tapping, double speed, slight wobble tone | Frantic, comical |
| Shell pick up | Ceramic "clonk" | Satisfying, like putting on a hat |
| Shell break | Crack + scatter | The armour is gone, oh no |
| Camouflage on | Soft fade/hush, like holding breath | Tense, quiet |
| Camouflage off | Quick colour-return whoosh | Relief |
| Jet swim | Whoosh/bubble burst | Quick, watery |
| Collect item | Soft chime, pitch varies by value | Rewarding but not loud |
| Clutch pearl | Satisfying "click" | Tactile, like picking up something smooth |
| Throw pearl | Quick whistle/swoosh | Satisfying release |
| Pearl hit | Soft pop | Enemy disperses |
| Ink burst | Muffled puff | Underwater explosion |
| Take damage | Low thud | Ominous |
| Zone transition | Ambient tone shift (lower, darker) | Gradual, not a jingle |

**Ambient soundtrack:**
- Subtle drone/atmosphere, not a melody
- Shallows: faint water movement, distant boat motor
- Twilight: deep hum, occasional creak
- Midnight: near silence, occasional distant whale call
- Abyss: pressure drone, the player's own movement sounds feel loud

---

## 8. Technical Constraints

- Vanilla Canvas API, no game libraries
- Web Audio API for all sound
- Game code in a separate file: `static/js/404-game.js`, loaded by the 404 page via `<script src="/js/404-game.js">`
- 404 HTML stays minimal: canvas element, start/death screen markup, one script tag
- No size target. Focus on making it fun.
- Keyboard: space to swim, down to crawl, shift to sprint, [E] to clutch/throw pearl, [C] to camouflage, [Q] for ink burst
- Touch: tap to swim, swipe down to crawl, double-tap to sprint, tap pearl to clutch, tap again to throw, three-finger tap to camouflage, long-press for ink
- `prefers-reduced-motion`: simplified animations, game still playable
- Target: 60fps on mid-range hardware
- Game hidden behind a "play" prompt so the 404 page functions as a 404 first

---

## 9. Phasing

### Phase 1 (Ship First)

| # | Feature | User Value | Effort |
|---|---------|------------|--------|
| 1 | Core movement (crawl/sprint/swim) | The fundamental fun; skill expression | 3 |
| 2 | Coloured octopus with expressive walking + sprint animation | Character people want to play as | 4 |
| 3 | 4 depth zones with matching scenery | Sense of journey and discovery | 4 |
| 4 | Above-water intrusions in shallows | Worldbuilding, humour, surprise | 2 |
| 5 | Enemies (urchin, jellyfish, fishing net) | Challenge, reason to switch modes | 3 |
| 6 | Collectibles (plankton, crab, shrimp) | Reward loop, scoring | 2 |
| 7 | Pearl clutch & throw | The signature mechanic, humour | 3 |
| 8 | Shell armour (crawl into, absorbs one hit) | Risk/reward floor gameplay, visual comedy | 3 |
| 9 | Environmental discoveries (scenery objects) | Replay value, delight | 2 |
| 10 | Camouflage (go gray, enemies ignore you) | Defensive skill, real octopus behaviour, visual comedy | 3 |
| 11 | Death messages | Personality, dry humour | 1 |
| 10 | Score + share (Mastodon/Bluesky/clipboard) | Social virality from 404 page | 2 |

### Phase 2 (Later)

- Sound system (Web Audio API, procedural)
- Anglerfish (fake collectible trap)
- Current surges
- Ink burst defensive mechanic
- Unlockable skins and cosmetics
- Collection screen
- Giant isopod size boost
- Cumulative stats tracking
- `prefers-reduced-motion` support

---

## 10. Decisions Already Made

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-11-17 | Horizontal scroller, not vertical | Crawling on the floor is core; vertical doesn't support it |
| 2026-11-17 | Endless mode, no levels | Fits 404 page context (quick play) and social sharing |
| 2026-11-17 | Monochrome world, selective colour | Visual identity; Limbo/Badland inspiration without copying |
| 2026-11-17 | Octopus has colour, enemies don't | Octopus is the warm centre of a cold world |
| 2026-11-17 | No Twitter/X sharing | Values alignment |
| 2026-11-17 | Sound off by default | Accessibility; unexpected sound is hostile |
| 2026-11-17 | Game code in separate `static/js/404-game.js` | Dropped inline constraint and size target; focus on fun, not bytes |
| 2026-11-17 | Pearl = ammo, "clutch a pearl" | Wordplay is the game's personality |
| 2026-11-17 | Discovery + unlockables as replay hook | User's answer to "what makes you play again?" |
| 2026-11-17 | Save pale gray octopus as Ghost skin | Don't throw away work; make it an unlockable |

---

## 11. Open Questions

1. Touch controls for pearl clutch/throw: tap on pearl, or dedicated button area?
2. Should environmental discoveries (wellington boots, etc.) have tiny tooltip text, or just be visual?
3. How prominent should the game be on the 404 page? Hidden behind "press space to play" or more visible?
4. Should the high score screen show zone-specific stats ("shrimp eaten: 3")?
5. Canvas size: full viewport or contained within the 404 page layout?

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2026-11-17 | Initial draft from prototype feedback session |
