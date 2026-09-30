---
title: "Why I chose not to implement llms.txt"
date: 2026-09-25
draft: true
type_label: observation
tags: [ai, web-standards, search, seo, llms-txt]
description: "llms.txt adoption is growing but nobody is reading the files. I haven't implemented it, and here's why."
---

Around 193,000 sites currently have llms.txt according to [BuiltWith](https://trends.builtwith.com/robots/LLMS-Text), and adoption among the top 1,000 sites sits at about 8.7% ([Rankability, June 2026](https://www.rankability.com/data/llms-txt-adoption/)). Anthropic, Cloudflare, and Stripe use it. Jeremy Howard's proposal is simple: a Markdown file at `/llms.txt` that describes your site's content for LLM consumption.

I chose not to implement it. Here's why.

## Nobody is reading it

Not a single LLM provider has officially confirmed they use llms.txt in their search or answer systems. Access log studies keep confirming this:

- [OtterlyAI](https://otterly.ai/blog/the-llms-txt-experiment/) measured 62,100 AI bot requests over 90 days and found exactly 84 went to llms.txt - 0.1%.
- [Limy](https://limy.ai/blog/llms-txt-in-2026-the-full-guide) (500M+ AI bot visits over 90 days) found only 408 targeting it.
- [Ahrefs](https://nohacks.co/episode/229-does-llmstxt-work-what-137000-domains-server-logs-show) analysed 137,000 domains in May 2026: 97% of llms.txt files received zero requests.
- [Wislr](https://www.wislr.com/articles/ai-bot-behavior-log-analysis/) tracked 12,099 bot requests over 48 days: zero llms.txt hits.
- [Saaslinks](https://saaslinks.net/blog/llms-txt-server-log-study) recorded 151 AI crawls in 14 days: zero llms.txt requests.

ClaudeBot and PerplexityBot show almost zero activity requesting the file. The one exception is Perplexity, which says it retrieves llms.txt to prioritise pages, but no independent study has verified any citation lift from it.

Google representatives have publicly dismissed it. Gary Illyes confirmed at Google Search Central Live that Google does not support llms.txt and has no plans to. John Mueller [compared it to the discredited keywords meta tag](https://www.searchenginejournal.com/google-says-llms-txt-comparable-to-keywords-meta-tag/544804/). Google then promoted llms.txt to a default audit in [Lighthouse 13.3.0](https://www.debugbear.com/blog/lighthouse-agentic-browsing) (May 2026), creating an internally inconsistent position. In June 2026, Google Search Central [added a dedicated clarification](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) confirming that llms.txt does not influence Search rankings, AI Overviews, or AI Mode.

The adoption is one-directional: site owners publishing files that bots overwhelmingly skip.

## It is not a standard

llms.txt is a proposal, not a standard. No standards body has adopted it. No browser vendor recognises it. No search engine uses it. Compare this with what actually exists and is used: robots.txt (RFC 9309), XML sitemaps (sitemaps.org protocol), structured data (schema.org), and the emerging [IETF AIPREF working group](https://www.ietf.org/blog/ai-pref-progress/) specification.

Creating an llms.txt is also not a one-hour task. It requires ongoing maintenance, and every page it references still needs to be machine-readable in the first place. If your HTML is broken, a Markdown summary pointing to it doesn't fix the problem.

## It solves the wrong problem

The question most site owners should be asking is not "how do I make my content easier for LLMs to ingest?" but "how do I control what LLMs do with my content?"

Cloudflare's launch of Markdown for Agents is about token efficiency for AI content consumption. That is a real engineering concern. But making it cheaper for someone else to consume your content is not the same as making your content more visible. No AI provider has confirmed that serving Markdown improves visibility or citations.

There are even concerns that serving different content to bots than to users could be interpreted as cloaking - a practice search engines have penalised for decades.

## Fix the foundations, don't invent new formats

Here's what frustrates me about the llms.txt conversation: as an industry, we are looking in the wrong direction. Instead of fixing the underlying issues, we're blasting new supposed standards into the web.

If a website is not well structured, crawlers can't parse it. If internal links are broken, bots can't follow them. If a site doesn't rank in the search engines that AI agents and chatbots rely on, no llms.txt file will fix that. If a page can't be parsed by AI because the HTML is a mess, a Markdown summary sitting at the root of your domain doesn't solve anything.

And now the same crowd pushing llms.txt is putting `.md` files into `/.well-known/` folders. More Markdown for bots that aren't reading the Markdown you already gave them.

Meanwhile, technical SEO gets less buy-in than ever, despite being more important than it has ever been. The foundations are crumbling, and instead of fixing them, agencies and lazy SEOs are selling "GEO services" that amount to implementing llms.txt and dropping Markdown files into well-known directories. It's the AMP story all over again: a shiny new format that lets you skip the hard work, until it doesn't.

## What actually moves the needle

LLMs retrieve information via search engine APIs. They rely on traditional search rankings to find pages. If a page doesn't rank, LLMs won't cite it either.

What is proven - across years of data - is that search engines and AI systems read HTML. Specifically: server-rendered HTML, clean semantic markup, structured data (JSON-LD), and fast page delivery. The BBC found they [lost 10% of users for every additional second of load time](https://wpostats.com/2017/03/03/bbc-load-abandonment/). Google observed a [20% reduction in abandonment rate](https://developers.google.com/search/blog/2019/04/user-experience-improvements-with-page) after speed improvements in Search.

Any time spent on an unproven trend is time not spent on fixing known problems. I have seen teams jump on format trends before. Anyone still remember when AMP was a thing?

## What I do instead

On this site, I use three layers that are grounded in actual standards.

My robots.txt has a three-tier policy: search engines get full access, AI search and citation bots (ChatGPT-User, Claude-User, PerplexityBot) are allowed, and AI training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot, and others) are blocked.

Every page carries `noai` and `noimageai` meta tags, signalling that content should not be used for AI training. And I set `TDM-Reservation` as defined by the W3C TDMRep specification and referenced by the EU DSM Directive, expressing that text and data mining rights are reserved.

These have legal backing. llms.txt does not.

## I am not opposed to testing it

I would be curious to test if and when LLM bots start requesting llms.txt files. That is not proof they do anything with the content, but it would be an interesting starting point. The prerequisite is access logs that show bot behaviour - something most site owners don't have readily available.

If a major AI provider confirms they use llms.txt, or if a standards body adopts it, I will reconsider. Until then, I prefer to spend my time on the things I know work, and to control what machines do with my writing rather than making it easier for them to take it.

## The standards-track alternative

The reason I am comfortable waiting is that the actual standards process is moving - slowly, but moving. The IETF chartered the [AIPREF working group](https://www.ietf.org/blog/ai-pref-progress/) in January 2025, co-chaired by Mark Nottingham and Suresh Krishnan, to develop a standardised vocabulary for AI usage preferences. The vocabulary draft is now at [version 06](https://datatracker.ietf.org/doc/draft-ietf-aipref-vocab/) and still under active revision; the attachment mechanism draft (how to bind preferences to HTTP and robots.txt) has expired and is being reworked.

The key shift: AIPREF moves from "which bot can crawl" to "what can be done with this content" - search indexing, training, inference, attribution-required. This is the question that actually matters. robots.txt was never designed for AI consent ([Longpre et al., NeurIPS 2024](https://arxiv.org/abs/2407.14933) documented this at scale), and llms.txt does not address it at all.

In May 2026, the [IAB Tech Lab released a complementary framework](https://thedesk.net/2026/05/iab-tech-lab-releases-guidelines-to-address-ai-crawlers-bots/) for AI crawler governance, outlining business strategies for controlling automated access to content. And the W3C's TDMRep specification - which I already use via `TDM-Reservation` headers - now has enforcement backing through the EU AI Act, which requires general-purpose AI model providers to comply with TDM rights reservations.

llms.txt solves the wrong problem at the wrong layer. The standards track is solving the right one.

## One exception: developer tooling

There is one context where llms.txt genuinely works: IDE agents. Cursor, Claude Code, Windsurf, GitHub Copilot, Cline, and Aider all actively request `/llms.txt` and `/llms-full.txt` when pointed at documentation sites. Mintlify reports that nearly half of traffic to hosted docs sites now comes from AI agents. Documentation platforms (Mintlify, Fern, GitBook, Vercel Docs) ship llms.txt by default.

That is a real use case - but it is developer tooling, not search visibility. If you maintain developer-facing docs, llms.txt may save your users tokens and improve their coding assistant experience. For everyone else, it is a distraction from the work that actually matters.
