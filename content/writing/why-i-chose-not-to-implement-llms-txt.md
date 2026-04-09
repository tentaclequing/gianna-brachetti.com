---
title: "Why I chose not to implement llms.txt"
date: 2026-04-09
draft: true
type_label: observation
tags: [ai, web-standards, search]
description: "Over 844,000 sites have adopted llms.txt. I haven't, and here's why."
---

Over 844,000 sites have adopted llms.txt according to BuiltWith (October 2025). Anthropic, Cloudflare, and Stripe use it. Jeremy Howard's proposal is simple: a Markdown file at `/llms.txt` that describes your site's content for LLM consumption.

I chose not to implement it. Here's why.

## Nobody has confirmed they read it

<!-- TODO: verify this is still true at time of publishing -->

Not a single LLM provider has officially confirmed they use llms.txt. Tests across the industry show that LLM bots are mostly not even sending access requests to the file when one exists. Google representatives have publicly dismissed the markdown-for-bots initiative, stating that LLMs have "trained on normal web pages since the beginning."

The adoption is one-directional: site owners publishing files that may not be read by anyone.

## It is not a standard

llms.txt is a proposal, not a standard. No standards body has adopted it. No browser vendor recognises it. No search engine uses it. Compare this with what actually exists and is used: robots.txt (RFC 9309), XML sitemaps (sitemaps.org protocol), structured data (schema.org), and the emerging IETF AIPREF working group specification targeting August 2026.

Creating an llms.txt is also not a one-hour task. It requires ongoing maintenance, and every page it references still needs to be machine-readable in the first place. If your HTML is broken, a Markdown summary pointing to it doesn't fix the problem.

## It solves the wrong problem

The question most site owners should be asking is not "how do I make my content easier for LLMs to ingest?" but "how do I control what LLMs do with my content?"

Cloudflare's recent launch of Markdown for Agents is about token efficiency for AI content consumption. That is a real engineering concern. But making it cheaper for someone else to consume your content is not the same as making your content more visible. No AI provider has confirmed that serving Markdown improves visibility or citations.

There are even concerns that serving different content to bots than to users could be interpreted as cloaking - a practice search engines have penalised for decades.

## What actually moves the needle

LLMs retrieve information via search engine APIs. They rely on traditional search rankings to find pages. If a page doesn't rank, LLMs won't cite it either.

What is proven - across years of data - is that search engines and AI systems read HTML. Specifically: server-rendered HTML, clean semantic markup, structured data (JSON-LD), and fast page delivery. The BBC found they lost 10% of users for every additional second of load time. Google observed a 20% reduction in abandonment rate after speed improvements in Search.

Any time spent on an unproven trend is time not spent on fixing known problems. I have seen teams jump on format trends before. Anyone still remember when AMP was a thing?

## What I do instead

On this site, I use three layers that are grounded in actual standards.

My robots.txt has a three-tier policy: search engines get full access, AI search and citation bots (ChatGPT-User, Claude-User, PerplexityBot) are allowed, and AI training crawlers (GPTBot, Google-Extended, ClaudeBot, CCBot, and others) are blocked.

Every page carries `noai` and `noimageai` meta tags, signalling that content should not be used for AI training. And I set `TDM-Reservation` as defined by the W3C TDMRep specification and referenced by the EU DSM Directive, expressing that text and data mining rights are reserved.

These have legal backing. llms.txt does not.

## I am not opposed to it

I would be curious to test if and when LLM bots start requesting llms.txt files. That is not proof they do anything with the content, but it would be an interesting starting point. The prerequisite is access logs that show bot behaviour - something most site owners don't have readily available.

If a major AI provider confirms they use llms.txt, or if a standards body adopts it, I will reconsider. Until then, I prefer to spend my time on the things I know work, and to control what machines do with my writing rather than making it easier for them to take it.

<!-- TODO: consider linking to IAB paper on multi-level AI crawler governance -->
<!-- TODO: consider adding a note about the IETF AIPREF working group as the proper standards path -->
