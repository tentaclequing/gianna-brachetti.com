---
title: "How This Site Handles AI"
date: 2026-05-27
description: "What this site implements to govern AI access, what it does not yet do, and why robots.txt is not enough."
---

## Why this page exists

I believe AI governance should be transparent, specific, and honest about its limitations. Most websites either ignore the question entirely or bury their position in terms of service that nobody reads.

This page explains what I have implemented, what I have not yet implemented, what standards I follow, and where I think the industry needs to go. It is modelled on the accessibility statement pattern as a living reference.

This site also serves as a testing ground for AI governance approaches that I can iterate on faster than on a corporate website. What works here informs what I recommend to publishers and organisations.

For the formal rights reservation, see the [Text & Data Mining Policy](/tdm-policy/).

---

## Legal and technical framework

### Legislation
- [EU DSM Directive](https://eur-lex.europa.eu/eli/dir/2019/790/oj), Article 4(3): formal reservation of text and data mining rights. This is the legal mechanism that allows rightsholders to opt out of TDM in the EU.
- [EU AI Act](https://eur-lex.europa.eu/eli/reg/2024/1689/oj), Article 53(1)(c): requires general-purpose AI model providers to comply with TDM reservations. This places obligations on AI providers, not on this site. Enforcement begins 2 August 2026.

### Protocols
- [Robots Exclusion Protocol](https://www.rfc-editor.org/rfc/rfc9309) (IETF RFC 9309): differential directives for AI crawlers. Training crawlers (GPTBot, CCBot, ClaudeBot, Google-Extended, and others) are blocked. Search and citation agents (ChatGPT-User, PerplexityBot, Claude-SearchBot) are permitted. Compliance is voluntary.
- [TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/) (W3C Community Group specification): machine-readable TDM opt-out via `/.well-known/tdmrep.json` and HTML meta tags on every page.
- [A2WF](https://a2wf.org/) (W3C Community Group specification): structured AI agent access policy via `/siteai.json`, discoverable through `robots.txt` and HTML `<link>` tags.

---

## What is implemented

**Crawl directives** - The site's `robots.txt` distinguishes between training crawlers and retrieval agents. Training crawlers are blocked; search and citation bots are allowed. The idea is to have AI search surface my content with attribution but not use my content to train models without a license. We all know this is insufficient, hence I am planning to add stricter layers to enforce this distinction.

**TDM reservation** - Every page carries a `<meta name="tdm-reservation" content="1">` tag, supported by `/.well-known/tdmrep.json` and a human-readable [TDM policy](/tdm-policy/). This is the EU-standard mechanism for reserving text and data mining rights.

**Agent access policy** - The site publishes a `/siteai.json` file following the [A2WF specification](https://a2wf.org/). It declares what AI agents may read (articles, about info, contact details, speaking history), what actions require human verification (contact requests), and what is not permitted (personal data access, analytics data). The file is discoverable via both `robots.txt` and an HTML `<link rel="siteai">` tag in the page head.

**Content licence** - All content is licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/). You may share and adapt the material with attribution. This licence covers human use and conventional republication. It does not grant permission for AI training, which is governed separately by the TDM reservation above.

---

## Why robots.txt is not enough

I want to be explicit about this: `robots.txt` is a request, not enforcement.

There is no technical mechanism that compels a crawler to honour `robots.txt` directives. Crawlers can ignore them, spoof their user-agent string, or might not even check the instructions. The protocol has real agent verification, and bears no consequences for non-compliance beyond potential legal liability where it might exist. And we're still at the very early stages of the latter.

I do not recommend that publishers rely on `robots.txt` as their primary AI governance mechanism. It is a useful signal, but it needs to be part of a layered approach that includes machine-readable rights reservations (TDMRep in the EU, DMCCA in the UK, or corresponding regulations in your country of residence), server-side enforcement where possible, and clear legal terms.

I proposed a [multi-level approach to managing AI crawler behaviour and content protection](https://datatracker.ietf.org/doc/slides-aicontrolws-proposal-multi-level-approach-to-managing-ai-crawler-behavior-and-content-protection/) at the IETF AI-CONTROL workshop in September 2024. That work informed the layered approach this site now follows.

---

## What is not yet implemented

Transparency means being honest about gaps.

**No bot tracking or verification.** This site is hosted on GitHub Pages, which provides no server access logs. I cannot see which crawlers visit, how often, or whether they respect the `robots.txt` directives. I have no way to detect non-compliant crawlers in real time.

**No server-side enforcement.** Without a CDN or application layer (such as Cloudflare), there is no mechanism to block requests at the infrastructure level, serve HTTP 402 responses to AI crawlers, or implement rate limiting.

**No content fingerprinting.** I do not currently track whether my content appears in AI training datasets or model outputs.

Migration to infrastructure with logging and enforcement capabilities is planned. This page will be updated when that happens.

---

## For publishers

If you run a website and want to implement similar governance, here are starting points:

- [Multi-Level Approach to Managing AI Crawler Behaviour and Content Protection](https://datatracker.ietf.org/doc/slides-aicontrolws-proposal-multi-level-approach-to-managing-ai-crawler-behavior-and-content-protection/) - my IETF proposal outlining layered protection beyond robots.txt
- [TDMRep specification](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/) (W3C Community Group) - machine-readable TDM reservation
- [A2WF specification](https://a2wf.org/) (W3C Community Group) - structured agent access policies
- [EU AI Act Article 53](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-53) - obligations on AI model providers regarding TDM reservations

---

## Contact

For licensing enquiries or questions about this policy: {{< email-link email="workwith@gianna-brachetti.com" label="licensing enquiries" >}}

If you believe an AI system is using my content in violation of the TDM reservation, I would like to hear about it.

---

*Last updated: May 2026*
