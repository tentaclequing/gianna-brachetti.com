# Session Memory

**Last Checkpoint:** 2026-04-02

## Current Task

Rebuild personal website for launch, with real CV for Revolut application (Head of Organic Growth).

**Workflow State:** EXECUTION

## Key Findings

- Hugo builds ~21 pages, zero errors, theme is `signal-noise`
- Content authored in Obsidian vault (`~/Documents/Obsidian Vault/WEBSITE/`), synced via `publish.sh`
- Old CV at gianna-brachetti.com/resume.html + LinkedIn are the only real sources
- GSC article from WiTSEO has ~34 images that need downloading and positioning
- Revolut Business: 750K+ customers, 33% growth, $365B transaction volume [source: 2025 annual report]
- Revolut contacts: Antoine Le Nel (CGO), Nidhi Dudeja (Recruiter) - saved in `memory/project_revolut_application.md`
- Speaking page now has 18 real entries + 3 publications from verified sources
- Reads page has 10 people

## Decisions Made

- CV positioning: "Organic Growth Leader / Search & AI Product Manager / Multilingual Strategist"
- Real DeepL title: Senior Product Manager, Search & CMS (since 2022)
- Octopus metaphor in CV profile - team leadership differentiator
- No italic/cursive in any page headlines - user finds it hard to read
- TL;DR: blue text, accent left border, no background, `// TL;DR` label as partial
- Republished articles: `original_date` for datePublished, `date` for dateModified, `canonical` for rel link
- Speaking page: "On the record" with separate "published" section
- `/reads/` page: "People I read" blogroll, in main nav
- Homepage: removed "at the intersection of" (AI pattern), replaced with "on"
- About page: "search experience optimisation" - user first, algorithm second
- Footer: "here for" replaces "UPTIME"
- French language: intermediate (not fluent)
- Myriam Jessier URL: myriamjessier.com (not pragm.co)
- Mark Williams-Cook series: "Unsolicited SEO Tips" (not TWIS)

## Corrections Received

- **CV dummy data must be discarded entirely** - never mix placeholder with real biographical data
- **DeepL start date is 2022** not 2020
- **Job title: Senior Product Manager, Search & CMS** - not "SEO Strategist"
- **No "Freelance" role** - dummy data
- **Polish is NOT a language** - dummy data leak
- **arvato location: Cologne** not Guetersloh
- **Aufeminin location: Cologne/Paris**
- **French: intermediate** not fluent
- **Remove Looker Studio, Databricks, Python** from tools
- **17 years SEO experience** (since 2009)
- **"Engagement and conversion"** not "activation and conversion"
- **hreflang doesn't need explicit mention**
- **Project Discovery name is internal** - describe function not name
- **Don't say "for C-suite"**
- **Deep Squid name not meaningful** - describe what it is
- **Don't remove bullet points** when removing a heading
- **KaFe Rocks: VP of SEO, Malta Remote, 2019-2022**
- **bold ventures ends 2019**
- **No cursive/italic in headlines** - hard to read
- **Myriam Jessier URL: myriamjessier.com** not pragm.co

## Blockers

- Daily visits/users from Metabase needed for CV
- GSC article images (~34) - separate session
- GitHub Pages not enabled, DNS not configured, email forwarding not created
- Impressum address service needed before launch (legal requirement)
- Privacy policy page not yet created

## Next Steps

1. **Get Metabase daily visits number** - add to CV, regenerate PDF
2. **Submit Revolut application** - upload CV PDF, link LinkedIn + GitHub
3. **After submission: send Antoine Le Nel connection request**
4. **Update LinkedIn headline** to include "Senior"
5. **GSC article images** - download ~34, position, add alt text
6. **Check Obsidian drafts** for publishable content
7. **Enable GitHub Pages** + DNS + email forwarding (user action)
8. **Regenerate CV PDF** after Metabase number (use generate-cv-pdf.py)
9. **Create Impressum + Privacy Policy pages** (blockers for launch)
10. **robots.txt + TDM reservation + AI meta tags** (should-do for launch)
11. **Speaking page links** - find URLs for past talks

## Files Modified This Session

### Session 2 (2026-04-02) - Design overhaul + /notes redesign + CMS setup
- `themes/signal-noise/assets/css/_note.css` - full rewrite: feed layout, coloured dots, inline content, anchor links
- `themes/signal-noise/layouts/notes/list.html` - rewritten as vertical feed (no legend, no tabs, inline content, anchor per note)
- `themes/signal-noise/assets/css/_page.css` - typography overhaul (15px base, 11px floor, --muted contrast fix)
- `themes/signal-noise/assets/css/_post.css` - --dim to --muted, letter-spacing consolidation
- `themes/signal-noise/layouts/writing/list.html` - filter tabs removed
- `themes/signal-noise/layouts/index.html` - homepage intro shortened
- `themes/signal-noise/layouts/_default/cv.html` - tools + languages split
- `themes/signal-noise/layouts/speaking/list.html` - tag/year contrast fix, talk title link styles
- `content/about/cv.md` - tools updated, languages split
- `content/notes/_index.md` - stale body text removed
- `content/Archive/templates/` - 4 Obsidian templates + README (new)
- `~/Documents/Obsidian Vault/templates/Website - *.md` - 4 templates in Obsidian vault (new)
- `~/Documents/Obsidian Vault/.obsidian/templates.json` - configured template folder + date format
- `~/Documents/Obsidian Vault/WEBSITE/writing/` + `notes/` - vault CMS folders (new)
- `publish.sh` - Obsidian to Hugo sync script (new)
- `.claude/commands/publish.md` - /publish slash command (new)
- `ARCHITECTURE.md` - website architecture documentation (new)
- `LAUNCH-CHECKLIST.md` - pre-launch tasks and research (new)
- `~/.claude/TOOLKIT.md` - added /publish command
- Default type_label changed from "essay" to "article" in writing templates

### Session 1 (2026-03-27) - Full rebuild
- `themes/signal-noise/layouts/partials/tldr.html` (new)
- `themes/signal-noise/layouts/writing/single.html`
- `themes/signal-noise/layouts/notes/single.html`
- `themes/signal-noise/layouts/_default/single.html`
- `themes/signal-noise/layouts/_default/cv.html`
- `themes/signal-noise/layouts/writing/list.html`
- `themes/signal-noise/layouts/notes/list.html`
- `themes/signal-noise/layouts/speaking/list.html`
- `themes/signal-noise/layouts/reads/list.html` (new)
- `themes/signal-noise/layouts/partials/head.html`
- `themes/signal-noise/layouts/partials/footer.html`
- `themes/signal-noise/layouts/partials/nav-top.html`
- `themes/signal-noise/layouts/partials/nav-bottom.html`
- `themes/signal-noise/layouts/index.html`
- `themes/signal-noise/assets/css/_post.css`
- `themes/signal-noise/assets/css/_page.css`
- `content/about/cv.md`
- `content/about/_index.md`
- `content/speaking/_index.md`
- `content/reads/_index.md` (new)
- `content/writing/its-not-you-its-google-search-console.md` (new)
- `static/cv/gianna-brachetti-truskawa-cv.pdf` (generated)
- `generate-cv-pdf.py` (new)

## Delivery Status

### Session 2 (2026-04-02)
- Typography overhaul (15px base, 11px floor, --muted contrast): written but untested visually by user
- /writing filter tabs removed: written but untested visually by user
- Homepage intro shortened: written but untested visually by user
- CV tools + languages split: written but untested visually by user
- Speaking page contrast + link styles: written but untested visually by user
- Bullet markers to blue dots: written but untested visually by user
- --dim to --muted for readable text: written but untested visually by user
- /notes redesign (vertical feed, dots, anchors, no legend/tabs): written but untested visually by user
- Obsidian templates (4) + vault CMS folders: done
- /publish command + publish.sh: done
- ARCHITECTURE.md: done
- LAUNCH-CHECKLIST.md: done, /notes items marked complete
- Default type_label "essay" to "article": done

### Session 1 (2026-03-27)
- TL;DR partial: tested and passing
- CV rewrite (web + PDF): tested and passing, pending Metabase number
- CV PDF generator: tested and passing
- Canonical/original_date template logic: tested and passing
- GSC article with links: tested and passing, images pending
- Speaking page (18 entries + 3 publications): tested and passing
- Reads page (10 entries): tested and passing
- Empty state placeholders: tested and passing
- About/homepage text updates: tested and passing
- Italic removed from all headlines: tested and passing
- Dummy content removed: tested and passing
- Revolut prep: CV ready, contacts saved, gap analysis done
- Loose ends: Metabase number, GSC images, LinkedIn headline, infra
