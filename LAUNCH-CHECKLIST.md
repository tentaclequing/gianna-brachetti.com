# Website Launch Checklist

**Created:** 2026-04-02
**Status:** Pre-launch

---

## Blockers (must do before launch)

### 1. Impressum address
- [ ] Get a c/o Impressum address service (e.g. Clevvermail, virtual office, or lawyer's address)
- Physical home address must NOT be published (safety concern - stalking history)
- c/o address services are accepted under TMG Section 5 (OLG Duesseldorf 2023 [ASSUMED])
- Budget: 5-15 EUR/month typically
- Must be a real physical location (not PO box), must reliably forward mail

### 2. Create Impressum page
- [ ] Add `/impressum/` page with: full name, c/o address, email, MStV Section 18(2) line
- [ ] Link from footer on every page

### 3. Create Privacy Policy page
- [ ] Add `/privacy/` (or `/datenschutz/`) page
- Disclose: GitHub Pages processes visitor IP addresses (Art. 6(1)(f) DSGVO, legitimate interest)
- State: no cookies, no analytics, no tracking, no third-party resources
- Note: Google Fonts self-hosted (no disclosure needed - Munich ruling 2022)
- Note: GSC meta tag is passive (no disclosure needed)
- Note: GitHub participates in EU-US Data Privacy Framework
- Include: DSGVO rights (Art. 15-21), SSL/TLS note, external links disclaimer
- [ ] Link from footer on every page
- No cookie banner needed (no cookies set)

### 4. Enable GitHub Pages + DNS
- [ ] User action: enable GitHub Pages in repo settings
- [ ] User action: configure DNS for gianna-brachetti.com
- [ ] User action: set up email forwarding for hello@gianna-brachetti.com

---

## Should do for launch

### 5. robots.txt - AI training crawler blocks
- [ ] Create robots.txt blocking training crawlers, allowing user-interaction agents
- Block: GPTBot, ClaudeBot, CCBot, Google-Extended, Bytespider, FacebookBot, Meta-ExternalAgent, Applebot-Extended, cohere-ai, Amazonbot, PerplexityBot, Diffbot, Omgili, Timpibot
- Allow: ChatGPT-User (live browsing), OAI-SearchBot (SearchGPT), Googlebot (Search), Applebot (Siri/Spotlight)
- Hugo has `enableRobotsTXT = true` in config already

### 6. TDM Reservation (EU DSM Directive Art. 4)
- [ ] Create `/.well-known/tdmrep.json` with `"tdm": "disallow"`
- Legally binding in the EU for text and data mining opt-out

### 7. AI meta tags
- [ ] Add `<meta name="robots" content="noai, noimageai">` to head partial
- Not universally respected yet but signals intent

### 8. /notes redesign
- [x] Remove status legend (fresh ink / spreading / settled)
- [x] Replace with simple coloured dots, no text labels
- [x] Change layout to vertical feed (inline content, anchor links for shareability)
- [x] Remove filter tabs
- [x] Add anchor links per note (`/notes/#slug`) for direct sharing
- single.html kept as fallback for direct URLs
- Minimal, stacked vertical microblog feed - done

### 9. Speaking page links
- [ ] Find and add URLs for past talks, especially podcasts
- [ ] Links will show as blue accent with underline (CSS already done)

---

## Post-launch (v2)

### 10. JSON-LD schema
- Structured data for: Person, Article, SpeakingEvent, BreadcrumbList
- Not needed for launch but improves AI discoverability

### 11. CV PDF generation
- [ ] Get daily visits/users number from Metabase
- [ ] Add to DeepL entry in CV
- [ ] Run `generate-cv-pdf.py` to create real PDF
- Parked from previous session

### 12. GSC article images
- [ ] Download ~34 images for the GSC article
- [ ] Add alt text
- Separate session task

### 13. Content
- [ ] Write web standards contribution article (first new original content)
- [ ] Check Obsidian drafts for publishable content

---

## Design changes completed (2026-04-02)

- [x] Base font 13px to 15px
- [x] Minimum text size 9px to 11px (floor)
- [x] `--muted` contrast fixed: #565650 to #8A8A82 (4.6:1, passes WCAG AA)
- [x] All bullet markers changed to visible blue dots
- [x] Letter-spacing consolidated: 9 variants to 1 (0.15em)
- [x] ~15 type treatments reduced to ~6
- [x] `--dim` colour replaced with `--muted` for all readable text
- [x] Tags on speaking page made visible
- [x] Year stamps made visible
- [x] Talk title links styled (blue accent + underline)
- [x] /writing filter tabs removed (reintroduce at 5+ articles)
- [x] Homepage intro shortened
- [x] CV: added Claude CLI, Gemini CLI, webmaster tools (Bing, Naver, Yandex)
- [x] CV: languages split into Human Languages and Machine Languages
- [x] CV: SQL and Python (basics) added under Machine Languages

---

## Research completed (2026-04-02)

All research saved here for reference. Implementation details above.

### German legal requirements
- Impressum required (TMG Section 5) - c/o address service is acceptable
- Privacy policy required (DSGVO Art. 13) - minimal for this setup
- No cookie banner needed
- No consent mechanism needed

### AI content protection
- robots.txt blocks training crawlers (list above)
- TDM reservation (EU law, legally binding)
- noai/noimageai meta tags (signals intent)
- Aligns with Gianna's IAB paper on multi-level AI crawler governance
