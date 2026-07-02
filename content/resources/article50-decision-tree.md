---
title: "Disclosure Label or Editorial Responsibility?"
description: "A four-question decision guide for content teams navigating EU AI Act Article 50(4). Know when you need a disclosure label and when the editorial responsibility exemption applies."
layout: raw
date: 2026-06-16
---

<style>
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=Fira+Code:wght@400&display=swap');

  :root {
    --black: #000000;
    --white: #e4e4dc;
    --accent: #00aaff;
    --accent-red: #ff1f3d;
    --dim: #0e0e0c;
    --muted: #8a8a82;
    --border: #1e1e1c;
    --fresh: #4dccff;
  }

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'Fira Code', monospace;
    padding: 48px 40px 0;
    max-width: 780px;
    margin: 0 auto;
  }

  h2.sr-only {
    position: absolute; width: 1px; height: 1px;
    overflow: hidden; clip: rect(0,0,0,0);
  }

  a.ref {
    color: inherit;
    text-decoration: none;
    border-bottom: 1px solid rgba(0,170,255,0.3);
    padding-bottom: 1px;
    transition: border-color 0.2s, color 0.2s;
  }
  a.ref:hover { color: var(--accent); border-bottom-color: var(--accent); }

  .header { margin-bottom: 48px; }
  .header-eyebrow {
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--accent-red);
    margin-bottom: 14px;
  }
  .header-eyebrow::before { content: '> '; opacity: 0.4; }
  .header-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(28px, 4vw, 44px);
    font-weight: 300;
    color: var(--white);
    line-height: 1.1;
    letter-spacing: -0.02em;
    margin-bottom: 16px;
  }
  .header-title em { font-style: italic; color: var(--muted); }
  .header-rule {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-top: 20px;
  }
  .header-rule-line { flex: 1; height: 1px; background: var(--border); }
  .header-rule-text {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
  }

  .flow {
    display: grid;
    grid-template-columns: 1fr 196px;
    gap: 0;
  }

  .col-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border);
  }
  .col-label.main-label { color: var(--accent); }
  .col-label.exit-label { color: var(--accent-red); padding-left: 20px; }

  .q-card {
    display: flex;
    align-items: flex-start;
    border-top: 1px solid var(--border);
    padding: 28px 0 0;
  }
  .q-num {
    font-family: 'Cormorant Garamond', serif;
    font-size: 56px;
    font-weight: 300;
    color: var(--border);
    line-height: 1;
    flex-shrink: 0;
    width: 56px;
    margin-right: 20px;
    margin-top: -8px;
    user-select: none;
  }
  .q-inner { flex: 1; }
  .q-text {
    font-family: 'Cormorant Garamond', serif;
    font-size: 22px;
    font-weight: 300;
    color: var(--white);
    line-height: 1.35;
    margin-bottom: 10px;
  }
  .q-note {
    font-size: 10px;
    color: var(--muted);
    line-height: 1.7;
  }

  .yes-strip {
    display: flex;
    align-items: center;
    padding: 14px 0 14px 76px;
  }
  .yes-badge {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent);
    border: 1px solid var(--accent);
    padding: 4px 12px;
    white-space: nowrap;
  }

  .exit-spacer { padding-left: 20px; }

  .exit-cell {
    border-top: 1px solid var(--border);
    padding: 28px 0 0 20px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .no-badge {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--accent-red);
    border: 1px solid rgba(255,31,61,0.35);
    padding: 4px 12px;
    align-self: flex-start;
  }
  .exit-card {
    border-left: 2px solid rgba(255,31,61,0.25);
    padding-left: 12px;
  }
  .exit-verdict {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.5;
    margin-bottom: 4px;
  }
  .exit-note {
    font-size: 10px;
    color: rgba(138,138,130,0.55);
    line-height: 1.6;
  }

  .outcomes-wrap {
    grid-column: 1 / -1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
    border-top: 1px solid var(--border);
    margin-top: 8px;
  }
  .outcome { padding: 28px 28px 32px; background: var(--black); }
  .outcome.o-label { border-top: 3px solid var(--muted); }
  .outcome.o-resp  { border-top: 3px solid var(--accent); }
  .outcome-tag {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    margin-bottom: 12px;
  }
  .outcome.o-label .outcome-tag { color: var(--muted); }
  .outcome.o-resp  .outcome-tag { color: var(--accent); }
  .outcome-name {
    font-family: 'Cormorant Garamond', serif;
    font-size: 26px;
    font-weight: 300;
    line-height: 1.15;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--border);
  }
  .outcome.o-label .outcome-name { color: var(--white); }
  .outcome.o-resp  .outcome-name { color: var(--fresh); }
  .outcome-list { list-style: none; }
  .outcome-list li {
    font-size: 11px;
    color: var(--muted);
    line-height: 1.9;
    padding-left: 16px;
    position: relative;
  }
  .outcome-list li::before { content: '-'; position: absolute; left: 0; }
  .outcome.o-resp .outcome-list li::before { color: var(--accent); }
  .outcome-warning {
    margin-top: 16px;
    padding: 12px 14px;
    border-left: 2px solid var(--accent-red);
    font-size: 10px;
    color: rgba(138,138,130,0.8);
    line-height: 1.7;
  }
  .outcome-warning strong {
    display: block;
    color: var(--accent-red);
    font-weight: 400;
    font-family: 'Cormorant Garamond', serif;
    font-size: 13px;
    margin-bottom: 4px;
  }

  .further-reading {
    margin-top: 36px;
    padding-top: 24px;
    border-top: 1px solid var(--border);
  }
  .further-reading-label {
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 16px;
  }
  .reading-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 1px;
    background: var(--border);
  }
  .reading-item {
    background: var(--black);
    padding: 14px 18px;
    display: flex;
    align-items: baseline;
    gap: 14px;
  }
  .reading-tag {
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--muted);
    white-space: nowrap;
    flex-shrink: 0;
    width: 110px;
  }
  .reading-link {
    font-size: 11px;
    color: var(--white);
    text-decoration: none;
    border-bottom: 1px solid var(--border);
    padding-bottom: 1px;
    line-height: 1.5;
    transition: color 0.2s, border-color 0.2s;
  }
  .reading-link:hover { color: var(--accent); border-bottom-color: var(--accent); }

  .source-note {
    margin-top: 28px;
    font-size: 10px;
    color: rgba(138,138,130,0.6);
    line-height: 1.8;
  }
  .source-note strong { color: var(--muted); font-weight: 400; }
  .source-note a.ref { color: rgba(138,138,130,0.6); }
  .source-note a.ref:hover { color: var(--accent); }

  footer {
    margin-top: 20px;
    padding: 20px 0 44px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 10px;
    color: var(--muted);
  }
  footer .name { font-size: 11px; color: var(--white); }
  footer a {
    color: var(--muted); text-decoration: none;
    border-bottom: 1px solid var(--border); padding-bottom: 1px;
    transition: color 0.2s, border-color 0.2s;
  }
  footer a:hover { color: var(--accent); border-color: var(--accent); }
  .footer-sep { color: var(--dim); margin: 0 4px; }
</style>

<h2 class="sr-only">Decision tree: disclosure label or editorial responsibility under EU AI Act Article 50(4)?</h2>

<div class="header">
  <div class="header-eyebrow">EU AI Act · <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a> · AI-generated text</div>
  <div class="header-title">Does your team need a disclosure label<br>— or can you claim <em>editorial responsibility</em>?</div>
  <div class="header-rule">
    <div class="header-rule-line"></div>
    <div class="header-rule-text">Answer each question in order</div>
    <div class="header-rule-line"></div>
  </div>
</div>

<div class="flow">
  <div class="col-label main-label">The path</div>
  <div class="col-label exit-label">Exit here if No</div>

  <div class="q-card">
    <div class="q-num">1</div>
    <div class="q-inner">
      <div class="q-text">Could any of your AI-generated content touch a "matter of public interest"?</div>
      <div class="q-note">Current affairs, public health, environment, politics (Recital 133). Consumer protection, economic policy, and science are also in scope. Pure product marketing sits outside this obligation.</div>
    </div>
  </div>
  <div class="exit-cell">
    <div class="no-badge">No</div>
    <div class="exit-card">
      <div class="exit-verdict"><a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a> does not apply.</div>
      <div class="exit-note">Still check <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(1)</a> and <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">50(2)</a> for other obligations.</div>
    </div>
  </div>
  <div class="yes-strip"><span class="yes-badge">Yes / Unsure</span></div>
  <div class="exit-spacer"></div>

  <div class="q-card">
    <div class="q-num">2</div>
    <div class="q-inner">
      <div class="q-text">Do you have a reviewer with genuine expertise in this content domain?</div>
      <div class="q-note">Not just a general editor - someone who can independently catch factual errors and hallucinations in this specific field.</div>
    </div>
  </div>
  <div class="exit-cell">
    <div class="no-badge">No</div>
    <div class="exit-card">
      <div class="exit-verdict">Exemption not available.</div>
      <div class="exit-note">A disclosure label is required under <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a>.</div>
    </div>
  </div>
  <div class="yes-strip"><span class="yes-badge">Yes</span></div>
  <div class="exit-spacer"></div>

  <div class="q-card">
    <div class="q-num">3</div>
    <div class="q-inner">
      <div class="q-text">Does that reviewer read for accuracy - not just style?</div>
      <div class="q-note">Substantive review means independently verifying claims. If they cannot tell whether a fact is wrong, that is proofreading, not editorial responsibility. Under <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a>, the exemption requires the real thing.</div>
    </div>
  </div>
  <div class="exit-cell">
    <div class="no-badge">No / Partially</div>
    <div class="exit-card">
      <div class="exit-verdict">Review not substantive.</div>
      <div class="exit-note">A disclosure label is the safer and more defensible path.</div>
    </div>
  </div>
  <div class="yes-strip"><span class="yes-badge">Yes</span></div>
  <div class="exit-spacer"></div>

  <div class="q-card">
    <div class="q-num">4</div>
    <div class="q-inner">
      <div class="q-text">Is your organisation ready to own full liability if an error slips through?</div>
      <div class="q-note">"The AI hallucinated" is not a valid defence once you claim editorial responsibility under <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a>. All errors become yours.</div>
    </div>
  </div>
  <div class="exit-cell">
    <div class="no-badge">No</div>
    <div class="exit-card">
      <div class="exit-verdict">Risk too high.</div>
      <div class="exit-note">A disclosure label keeps liability with the AI system.</div>
    </div>
  </div>
  <div class="yes-strip"><span class="yes-badge">Yes - all four conditions met</span></div>
  <div class="exit-spacer"></div>

  <div class="outcomes-wrap">
    <div class="outcome o-label">
      <div class="outcome-tag">Default path</div>
      <div class="outcome-name">Disclosure Label</div>
      <ul class="outcome-list">
        <li>Add the <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">Art. 50(4)</a> label to AI-generated public-interest content</li>
        <li>Errors remain attributed to the AI system</li>
        <li>No review process documentation required</li>
        <li>Official EU AI label icons published 10 June 2026 - <a class="ref" href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content" target="_blank" rel="noopener">download free</a></li>
        <li>Sign the Code of Practice by 22 July 2026 for presumption of compliance - <a class="ref" href="https://digital-strategy.ec.europa.eu/en/library/how-sign-code-practice-transparency-ai-generated-content" target="_blank" rel="noopener">how to sign</a></li>
      </ul>
    </div>
    <div class="outcome o-resp">
      <div class="outcome-tag">Exemption path</div>
      <div class="outcome-name">Editorial Responsibility</div>
      <ul class="outcome-list">
        <li>No disclosure label required</li>
        <li>Requires substantive review by a named, competent person</li>
        <li>Editorial responsibility must be assigned and accountable</li>
        <li>Full publisher liability for any error that passes review</li>
      </ul>
      <div class="outcome-warning">
        <strong>Document before you publish</strong>
        Who reviewed it, when, and why they were qualified. This is your defence if a dispute arises.
      </div>
    </div>
  </div>
</div>

<div class="further-reading">
  <div class="further-reading-label">Further reading</div>
  <ul class="reading-list">
    <li class="reading-item">
      <span class="reading-tag">Official source</span>
      <a class="reading-link" href="https://digital-strategy.ec.europa.eu/en/policies/code-practice-ai-generated-content" target="_blank" rel="noopener">European Commission - Code of Practice on marking and labelling of AI-generated content (June 2026)</a>
    </li>
    <li class="reading-item">
      <span class="reading-tag">Official - icons</span>
      <a class="reading-link" href="https://digital-strategy.ec.europa.eu/en/policies/eu-icons-labelling-ai-generated-content" target="_blank" rel="noopener">European Commission - Official EU AI label icons (free download)</a>
    </li>
    <li class="reading-item">
      <span class="reading-tag">For legal teams</span>
      <a class="reading-link" href="https://www.twobirds.com/en/insights/2026/taking-the-eu-ai-act-to-practice-the-final-transparency-code-of-practice" target="_blank" rel="noopener">Bird & Bird - The final Transparency Code of Practice</a>
    </li>
    <li class="reading-item">
      <span class="reading-tag">For marketers</span>
      <a class="reading-link" href="https://www.twobirds.com/en/insights/2026/uk/when-marketing-meets-genai-update--the-eu-ai-acts-draft-deep-fake-guidelines-and-what-they-mean-for" target="_blank" rel="noopener">Bird & Bird - When marketing meets GenAI: what the draft guidelines mean for you</a>
    </li>
    <li class="reading-item">
      <span class="reading-tag">For editors</span>
      <a class="reading-link" href="https://www.hsfkramer.com/notes/ip/2026-03/transparency-obligations-for-ai-generated-content-under-the-eu-ai-act-from-principle-to-practice" target="_blank" rel="noopener">Herbert Smith Freehills Kramer - AI-generated content transparency: from principle to practice</a>
    </li>
  </ul>
</div>

<div class="source-note">
  <strong>Source:</strong> <a class="ref" href="https://eur-lex.europa.eu/legal-content/EN/TXT/HTML/?uri=CELEX:32024R1689" target="_blank" rel="noopener">EU AI Act, Regulation (EU) 2024/1689, Article 50(4)</a>. Code of Practice and official EU label icons published 10 June 2026. Commission guidelines: draft May 2026, final expected before 2 Aug 2026. Visualisation for illustrative purposes only - not legal advice.
</div>

<footer>
  <span class="name">🐙 ~/gianna-brachetti.com</span>
  <span class="footer-sep">&middot;</span>
  <span>&copy; Gianna Brachetti-Truskawa 2026.</span>
  <span class="footer-sep">&middot;</span>
  <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>
  <span class="footer-sep">&middot;</span>
  <span>June 2026</span>
</footer>
