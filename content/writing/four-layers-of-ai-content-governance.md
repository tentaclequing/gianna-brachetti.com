---
status: draft
date: 2026-05-22
tags:
  - AI
  - SEO
  - content-governance
  - llms-txt
  - TDMRep
  - EU-AI-Act
  - article-draft
---

# To llms.txt or not to llms.txt: We're asking the wrong question

**What llms.txt Actually Is, What It Is Not, and What You Actually Need for AI Governance**

---

In May 2026, Google told website owners three contradictory things within the same week.

Google Search Central [published guidance](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) stating that llms.txt files are unnecessary for appearing in AI search. Google Chrome [released Lighthouse 13.3.0](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt) with a new "Agentic Browsing" audit that checks whether your site *has* an llms.txt file. And Google's web.dev [published a guide](https://web.dev/articles/ai-agent-site-ux) recommending llms.txt as part of building agent-friendly websites.

So which is it, Google?
They are actually all different questions, while our industry treats them as the same.

---

## The four questions

It feels like we're conflating separate questions. You need to think about which parts of your web content you might want to protect from which acts of AI - do you want it to be crawlable so it can be surfaced to users while they use AI for search? Or also available for training AI systems so it's in their training data without web search? Or do you want to protect some of it and only make it available via a licence?

What we're talking about is actually more than just llms.txt. It's about AI governance. So let's separate these questions from one another:

1. "How do I rank in AI search?" (answer: traditional SEO - llms.txt is irrelevant)
2. "How do I make my site agent-friendly?" (answer: llms.txt + semantic HTML + Cloudflare Markdown for Agents)
3. "How do I control who trains on my content?" (answer: TDMRep + Cloudflare 402)
4. "How do I govern agent access with licensing?" (answer: TDMRep for rights, Cloudflare 402 for commercial, WebMCP for interaction)

Each of these has different tools and legal frameworks, and different implementation. Treating them as one question leads to wrong answers.

| Layer | The question | What you are deciding |
|-------|-------------|---------------------|
| **1. Visibility** | How do I appear in AI search? | Whether AI search surfaces your content to users |
| **2. Efficiency** | How do I make my site agent-friendly? | Token cost and parsing quality when agents interact with your content |
| **3. Protection** | Who can train on my content? | Whether your content enters AI training datasets |
| **4. Licensing** | On what terms can AI access my content? | Commercial terms for agent interaction and content use |

Layers 1 and 2 are about making your content work *with* AI, while Layers 3 and 4 are about controlling how AI *uses* your content.

llms.txt lives in Layer 2 only. Most industry discussion wrongly places it in Layers 1, 3, or 4. llms.txt is not a tool to manage if, and how, AI can access your content. But it can help make token usage more efficient when AI agents access your web. I can imagine use cases where that can be practical.

Here is a rough framework that I will likely work on more in the near future (so you might want to come back to my content). It builds on a [multi-level approach to managing AI crawler behaviour and content protection](https://datatracker.ietf.org/doc/slides-aicontrolws-proposal-multi-level-approach-to-managing-ai-crawler-behavior-and-content-protection/) that I proposed at the IETF AI-CONTROL workshop in September 2024. That paper focused on the protection and licensing side - combining crawling directives, machine-readable licensing information, copyright monitoring, and access request management into a layered strategy. The framework presented here extends that work by adding two layers the original paper did not address: how to make your content *visible* in AI search (Layer 1) and how to make it *efficient* for agents to consume (Layer 2).

---

## Layer 1: Visibility - "How do I appear in AI search?"

The answer is surprisingly boring: traditional SEO.

AI search systems - Google AI Overviews, ChatGPT Search, Perplexity, Bing Copilot - retrieve pages via search engine APIs and indexes - If a page does not rank in traditional search, or if it has not been part of the dataset they have been trained with, LLMs will not cite it. This makes traditional SEO the *prerequisite* for AI visibility.

What works:

- **Server-rendered HTML.** AI retrieval needs content in the initial HTML response. If your content is rendered entirely by client-side JavaScript, retrieval systems may not see it at all.
- **JSON-LD structured data.** Machine-readable entity information helps AI systems understand what your page is about and how it relates to other entities.
- **Page speed.** Retrieval systems have timeouts. If your page takes too long to respond, it may be skipped entirely.
- **Semantic HTML.** Clean heading hierarchy and landmark regions improve parsability.
- **robots.txt and XML sitemaps.** The established standards that all crawlers already use. Verify that AI bot access is not accidentally blocked.

What does *not* work for this layer: llms.txt. It just simply doesn't handle discoverability, and is not informing ranking signals as far as we know. It's really just markdown for AI agents - it could help them read it, but it was not the reason they found it in the first place.

[Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) was explicit about this: you do not need new machine-readable files or AI text files to appear in generative AI search. John Mueller has been consistent on multiple platforms: llms.txt is irrelevant for *discovery* (finding pages via search) but may help *functionality* (agents completing tasks once on a page). In our model, this means llms.txt belongs in Layer 2, not Layer 1.

It is not a web standard on its own yet, however, and we should not confuse it with those (such as robots.txt).

---

## Layer 2: Efficiency - "How do I make my site agent-friendly?"

This is where llms.txt actually lives:
Once an AI agent has already found your page - eg. a coding assistant indexing your documentation or a browser agent helping a user complete a task - the question becomes: how efficiently can it parse your content? How many tokens does it waste on navigation chrome, cookie banners, and boilerplate?

### llms.txt: what it is

[llms.txt](https://llmstxt.org/) (Jeremy Howard, Answer.AI, September 2024) is a Markdown file at the domain root listing key pages with descriptions. The spec is explicit: it is for "inference time" use - helping LLMs use a website, not find it or decide whether to train on it.

Validated use cases:

- **AI coding assistants** ([Cursor](https://docs.cursor.com/llms.txt), Claude Code, Windsurf) consume it when indexing documentation. This is the primary real-world use case.
- **Documentation platforms** (Mintlify, MkDocs via `mkdocs-llmstxt` plugin) have built native generators.
- **Token efficiency.** A structured entry point reduces the tokens an agent needs to understand a site's content map.

Empirically disproven use cases:

- **AI search ranking.** [OtterlyAI's 90-day study](https://otterly.ai/blog/the-llms-txt-experiment/) found that 0.1% of AI crawler traffic requests llms.txt. [Ahrefs' analysis of 137,210 domains](https://ahrefs.com/blog/llmstxt-study/) (Louise Linehan, June 2026) confirmed this at scale: 97% of published llms.txt files received zero requests in May 2026, and AI retrieval bots accounted for just 1.1% of the requests that did occur. AI search crawlers do not use it.
- **Training data opt-in or opt-out.** There is no enforcement layer, no legal basis. llms.txt cannot reserve or grant TDM rights.
- **Content licensing.** There are no digital signatures, no audit trail, no commercial terms. llms.txt is not a licensing mechanism.

### Other Layer 2 tools

llms.txt is not the only mechanism for making content agent-friendly. It is not even the most significant one.

[Cloudflare Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/) converts HTML to clean Markdown at the edge when agents request `text/markdown` via content negotiation. Cloudflare reports an 80% token reduction (roughly 5x) in their benchmark. It requires zero effort from the site owner.

[NLWeb](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/) (Microsoft) turns a website into a natural-language query endpoint. Every NLWeb instance is also an MCP server. Early adopters include Shopify, Snowflake, and TripAdvisor.

[WebMCP](https://www.marktechpost.com/2026/02/14/google-ai-introduces-the-webmcp-to-enable-direct-and-structured-website-interactions-for-new-ai-agents/) (Google and Microsoft, W3C Community Group) is a browser-native API (`navigator.modelContext`) exposing structured tools to in-browser agents. It is in Chrome Early Preview since February 2026.

### The practical recommendation

llms.txt is low-cost and does no harm. I can imagine use cases where it can be practical - particularly for documentation sites consumed by coding assistants. Create it if your audience includes developers using AI tools. But know that AI agents do not fetch llms.txt speculatively - [Ahrefs found](https://ahrefs.com/blog/llmstxt-study/) that agents only request it when directed by a link, an index, or a user instruction. Building it and hoping AI will come is not how the standard works.

Do not invest in it ahead of Layer 1 foundations (server-side rendering, structured data, page speed). And do not confuse it with a web standard - it is a community proposal, not a ratified specification. It is not robots.txt.

---

## Layer 3: Protection - "Who can train on my content?"

This is where it gets serious. Layer 3 is a copyright question with real legal force in the EU - and enforcement begins in August 2026.

### The legal framework

The [EU DSM Directive](https://eur-lex.europa.eu/eli/dir/2019/790/oj) Article 4 grants a TDM (Text and Data Mining) exception: anyone with lawful access may mine content *unless the rightholder has reserved their rights via machine-readable means*.

The [EU AI Act](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-53) (Regulation 2024/1689) Article 53(1)(c) requires GPAI model providers to *comply* with these TDM reservations - regardless of where training occurs. Enforcement begins **2 August 2026**. Fines of up to 3% of global turnover.

In **Germany**, the standard is high. [UrhG Section 44b](https://www.gesetze-im-internet.de/urhg/__44b.html) permits TDM unless the rightholder opts out via machine-readable means. The [OLG Hamburg ruling (December 2025)](https://www.insidetechlaw.com/blog/2025/12/machine-readable-opt-outs-and-ai-training-hamburg-court-clarifies-copyright-exceptions) set the bar: "machine-readable" means machine-*actionable* - the opt-out must be technically parseable by automated systems, not merely stated in human-readable text.

The [GEMA v. OpenAI ruling (LG Munich I, November 2025)](https://www.nortonrosefulbright.com/en/knowledge/publications/656613b2/germany-delivers-landmark-copyright-ruling-against-openai-what-it-means-for-ai-and-ip) went further: the TDM exception does *not* cover memorisation and reproduction of creative works in AI outputs. The TDM exception lets you analyse content - it does not let you reproduce it. Appeal is pending.

In **France**, [CPI Art. L.122-5-3](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/LEGISCTA000045960671/2023-01-01) uses the formulation "by appropriate means" rather than strictly requiring machine-readable format - potentially a lower bar than Germany. [CNIL guidance (February/June 2025)](https://www.cnil.fr/en/ai-cnil-finalises-its-recommendations-development-artificial-intelligence-systems) adds that GDPR applies to AI models that memorise personal data.

### Differential bot access

Not all AI crawlers serve the same purpose. User-agent-specific serving of different access rules - blocking training crawlers while permitting retrieval agents - can be implemented via differential robots.txt, Cloudflare Workers, or server-side IP/UA routing. I detailed these mechanisms with implementation examples in my [IETF AIControlWS proposal (September 2024)](https://datatracker.ietf.org/doc/slides-aicontrolws-proposal-multi-level-approach-to-managing-ai-crawler-behavior-and-content-protection/). [Myriam Jessier](https://searchengineland.com/the-rise-of-technical-branding-in-the-age-of-ai-search-462818) (Search Engine Land, October 2025) later framed this as "differential bot access" for brands: set different access policies for **training crawlers** (GPTBot, CCBot) versus **real-time retrieval agents** that bring users to your content.

In July 2026, [Cloudflare productised this concept](https://blog.cloudflare.com/content-independence-day-ai-options/) with a three-category taxonomy available on all plans, including Free:

- **Search** - content indexing for search results, with expectation of referral traffic
- **Agent** - real-time automated behaviour acting on behalf of users
- **Training** - content crawling specifically for model training or fine-tuning

Site owners can toggle each category independently via their dashboard. Cloudflare also extended its Content Signals standard with a `use` parameter expressing how bots may reshare content: `use=immediate` (interact, store nothing), `use=reference` (index, excerpt, and link back), or `use=full` (summarise and reproduce). Managed robots.txt files now include `use=reference` by default.

This is a real step forward - but it comes with a catch.

### The multi-purpose crawler trap

You may want to block training ingestion while allowing retrieval. In theory, these are independent decisions. In practice, they are not - because the same crawler often does both.

Googlebot indexes pages for search *and* feeds Google's training pipelines. Applebot and BingBot serve similar dual roles. Cloudflare applies the **most restrictive applicable rule**: if you block Training, multi-purpose crawlers like Googlebot are blocked entirely, regardless of your Search setting.

For smaller publishers who depend on Google for most of their search traffic, this creates a coerced consent dynamic. You can block training - but only if you are willing to risk losing search indexing from that crawler. The "independent dials" framing works at the category level, but collapses when a single crawler sits in multiple categories.

There is also a visibility asymmetry: Cloudflare's [BotBase](https://blog.cloudflare.com/content-independence-day-ai-options/) - the searchable database showing which specific bots are hitting your site - is available only to Enterprise Bot Management customers. Free, Pro, and Business plan users toggle the three categories without knowing their actual traffic composition. They are making Layer 3 decisions blind.

### Practical opt-out mechanisms

| Mechanism | How it works | Legal standing |
|-----------|-------------|----------------|
| **[TDMRep](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)** (W3C) | HTTP headers or `/.well-known/tdmrep.json` signalling TDM reservation, with optional licence URL | Emerging standard; referenced in EU AI Office consultations |
| **robots.txt** | Disallow directives for specific AI crawlers (GPTBot, CCBot, etc.) | Recognised by DE, HU courts; not required by DK court |
| **[Cloudflare AI Bot Controls](https://blog.cloudflare.com/content-independence-day-ai-options/)** | Three-category toggles (Search/Agent/Training) with WAF enforcement; Content Use Signals in managed robots.txt | CDN-level enforcement on all plans including Free; 20%+ of web domains behind Cloudflare |
| **[Cloudflare HTTP 402](https://blog.cloudflare.com/introducing-ai-crawl-control/)** | "Payment Required" response to AI crawlers with licensing path | Most deployed signal (1B+ responses/day) |
| **HTTP headers** | X-Robots-Tag, custom `X-Legal-Notice` and `X-License-Info` headers | Valid if machine-actionable (DE standard) |
| **Terms of Service alone** | ToS prohibiting scraping/TDM | Insufficient under German law; potentially sufficient under French "appropriate means" |

**What llms.txt does NOT do here:** llms.txt has no enforcement layer, no legal backing, no digital signatures. It cannot reserve TDM rights. Using llms.txt for content protection is like using a welcome mat as a lock.

---

## Layer 4: Licensing - "On what terms can AI access my content?"

Layer 4 goes beyond blocking (Layer 3) toward negotiated access. This is the least mature layer - the standards landscape is fragmented, and the market is still forming.

### Current mechanisms

**[TDMRep policy URLs](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/)** link a TDM reservation to a machine-readable licence describing permitted uses and commercial terms. This is the W3C Community Group standard.

**[Cloudflare 402 responses](https://blog.cloudflare.com/introducing-ai-crawl-control/)** send a machine-readable "payment required" signal to AI crawlers, with a licensing endpoint for commercial negotiation. This is the most deployed mechanism - over 1 billion responses per day. It is worth noting that my IETF proposal in September 2024 proposed a similar approach using HTTP status codes (including suggesting a dedicated 452 "LLM access denied" code). Cloudflare went with repurposing the existing 402. The trade-off I identified then still holds: a dedicated code tells crawlers *why* they are blocked, which could encourage evasion via IP or user-agent spoofing, while a generic status code keeps the reason opaque.

**[Cloudflare Monetisation Gateway](https://blog.cloudflare.com/content-independence-day-ai-options/)** (July 2026, waitlist) enables charging for web pages, datasets, APIs, or MCP tools via the x402 open protocol, settling payments in stablecoins. This connects directly to Content Use Signals: a publisher could set `use=reference` for free access and gate `use=full` behind x402 payment. It is the first infrastructure-level attempt at content licensing built into the CDN layer - available to any site behind Cloudflare, not just large publishers with the resources to negotiate individual deals.

**Contractual licensing** - direct deals between publishers and AI companies (AP/OpenAI, News Corp/Google) - remains the standard commercial pathway for large publishers.

**[WebMCP](https://www.marktechpost.com/2026/02/14/google-ai-introduces-the-webmcp-to-enable-direct-and-structured-website-interactions-for-new-ai-agents/)** provides a structured browser-native API where the site controls exactly which tools and data are exposed to agents. This is the strongest emerging standard, backed by both Google and Microsoft in a W3C Community Group.

### The honest state of play

There are [11 competing IETF Internet-Drafts](https://global-chat.io/experiments/ietf-expiry) for AI agent protocols. None are interoperable. Several are set to expire between June and September 2026 without renewal. No IETF or W3C standard for agent access governance is close to formal adoption. Full disclosure: I contributed a proposal to this process (AIControlWS), so I have a direct stake in seeing it converge.

---

## Deciding what goes where

Not all content on your site needs the same governance posture. The question is the same one publishers have faced with Google Search and paywalls for years: what do you show to get discovered, and what do you gate to retain value?

### Why gating decisions matter now

[Dan Petrovic / DEJAN AI](https://dejanseo.com.au/) (December 2025) measured how much content AI search systems actually extract per source across 7,060 queries and 2,275 tokenised pages. The results: a median of roughly 377 words per source, with pages under 5,000 characters seeing extraction rates around 66%. Longer pages (20,000+ characters) drop to roughly 12%.

This means: if your premium content is short and information-dense, AI systems will extract *most of it* in a single query. The gating decision is most urgent for exactly the content you invested most in producing.

### The parallel to flexible sampling

Google's guidance for paywalled content has always been: show enough to demonstrate quality and earn a ranking, then gate the rest. The same logic applies to AI:

- **If you gate everything**, AI systems cannot reference you at all. You become invisible.
- **If you gate nothing**, AI systems may summarise your premium content in full, removing the reason for users to visit.
- **The strategic question is the same**: which content earns you visibility, and which content earns you revenue?

### Content governance by type

Here is how the four layers apply to different types of content. This is not prescriptive - your situation may differ. But it provides a starting point for content-type-level decisions rather than an all-or-nothing approach.

**Brand and product pages** - Maximum visibility across all AI systems. Add to llms.txt, use clean semantic HTML. No TDM reservation - you *want* AI to recommend these. No licensing needed.

**Help centre and documentation** - Maximum visibility and maximum agent-friendliness. Add to llms.txt, consider AGENTS.md and NLWeb. Keep open for training. AI intermediation reduces your support burden - this is a feature, not a threat.

**API documentation** - Maximum agent-friendliness. This is the primary validated use case for llms.txt (and its extended version llms-full.txt). Add Markdown for Agents. Keep open. Coding assistants consuming your API docs is exactly the behaviour you want.

**In-depth guides and how-to content** - Full visibility, but consider partial TDM reservation. You want these referenced and cited, not fully reproduced without attribution. Optional licensing for full reproduction.

**Original research and analysis** - This is where the gating decision matters most. Make the abstract visible and fully crawlable. Gate the full content behind authentication or paywall. Implement TDM reservation on the full content. Require a licence for access beyond the abstract. The production cost of original research is high, and the value is in the analysis, not in the topic itself.

**Licensed or third-party content** - You may have contractual obligations to protect this content. Minimal or no AI visibility. Full TDM reservation. Pass-through licensing terms, or block entirely.

**Premium and subscription content** - Same flexible sampling logic as Google Search paywalls. Teaser visible and crawlable. Full content gated. TDM reservation. Commercial licensing via Cloudflare 402 or TDMRep policy URL.

### The decision flowchart

For each content type on your site, ask these four questions in order:

**1. Do I want AI to recommend this content?**
If yes: ensure it is crawlable, fast, and well-structured (Layer 1). If no: consider blocking AI crawlers via robots.txt.

**2. Do I want agents to parse this efficiently?**
If yes: add it to llms.txt, ensure semantic HTML, consider Markdown for Agents (Layer 2). If no: standard HTML is fine.

**3. Do I want to prevent AI from training on this?**
If yes: implement a TDM reservation via TDMRep, robots.txt for training bots, or both (Layer 3). If no: leave it open. The default in the EU is that TDM is permitted unless you opt out.

**4. Do I want to offer licensed access?**
If yes: add a TDMRep policy URL or Cloudflare 402 with a licensing endpoint (Layer 4). If no: either block entirely or leave open.

**The key insight:** these four questions are independent. You can answer "yes" to Layer 1 and "yes" to Layer 3 at the same time. You can make content visible in AI search while reserving training rights. You can make content agent-friendly while requiring a licence for commercial reproduction. The layers are independent dials, not a single switch.

**The practical caveat:** the dials are independent at the *layer* level, but multi-purpose crawlers create coupling at the *implementation* level. Blocking Training may also block Search from the same crawler (see the [multi-purpose crawler trap](#the-multi-purpose-crawler-trap) above). The framework holds - the tooling does not yet enforce it cleanly.

---

## Where llms.txt fits: the summary

| Claim | Status | Evidence |
|-------|--------|----------|
| "llms.txt improves AI search ranking" | **False** | [Google Search Central](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide) explicitly says no; [OtterlyAI](https://otterly.ai/blog/the-llms-txt-experiment/) 90-day study shows 0.1% of AI crawler traffic requests it; [Ahrefs](https://ahrefs.com/blog/llmstxt-study/) (137K domains): 97% of llms.txt files never requested, AI retrieval bots at 1.1% |
| "llms.txt is a web standard" | **False** | Community proposal, not adopted by any standards body |
| "llms.txt helps AI agents understand a site" | **True (Layer 2)** | Validated by [Cursor](https://docs.cursor.com/llms.txt), Claude Code, Windsurf; documentation platforms have built native generators |
| "llms.txt reduces tokens for agent interaction" | **Plausible (Layer 2)** | Consistent with spec intent; Cloudflare reports 80% token reduction in their benchmark. But [Ahrefs](https://ahrefs.com/blog/llmstxt-study/) shows agents only fetch llms.txt when directed, not speculatively |
| "llms.txt protects content from AI training" | **False** | No enforcement layer, no legal basis. Use TDMRep or robots.txt for Layer 3 |
| "llms.txt enables content licensing" | **False** | No digital signatures, no audit trail. Use TDMRep policy URLs or Cloudflare 402 for Layer 4 |

---

## What comes next

Layer 1 is solved. It is traditional SEO. Nothing new required.

Layer 2 is maturing. llms.txt, Cloudflare Markdown for Agents, NLWeb, and WebMCP are all functional. The question is which standards consolidate.

Layer 3 is where the most happened in 2026. It has legal teeth in the EU (EU AI Act enforcement begins 2 August 2026), and the tooling is catching up. TDMRep provides the legal signal. Cloudflare's three-category controls provide infrastructure-level enforcement on all plans including Free - the first time any CDN has offered granular AI bot blocking at zero cost. Content Use Signals add a new dimension: not just *whether* bots can access content, but *how* they may reshare it. The main gap is the multi-purpose crawler problem, which forces publishers into all-or-nothing decisions for crawlers that serve both search and training.

Layer 4 is accelerating faster than the standards process. While the IETF still has 11 competing drafts with no interoperability, Cloudflare shipped the Monetisation Gateway with x402 stablecoin settlement - a working Layer 4 mechanism that any site behind Cloudflare can use. TDMRep policy URLs and WebMCP round out the picture. The commercial need is clear, and the early mechanisms are no longer theoretical.

The Google contradiction that started this article is not a bug. It is the symptom of an industry that has not yet separated these four questions. Google Search is answering the Layer 1 question (llms.txt does not help you rank). Google Chrome is answering the Layer 2 question (llms.txt helps agents work with your site). Both are correct. They are just answering different questions.

Start by separating the questions. Then decide, content type by content type, which layers you need.

---

*Gianna Brachetti-Truskawa is a product manager specialising in organic growth (SEO / GEO), AI governance, and security. Previously at DeepL, and a member of the AI Governance Collective. They have published on AI crawler governance with the IAB and write about how machines read the web, agentic security, and the evolution of SEO and GEO. [More about Gianna](https://gianna-brachetti.com/about)*

---

**Sources and further reading:**

- Google Search Central, [AI Optimization Guide](https://developers.google.com/search/docs/fundamentals/ai-optimization-guide), 15 May 2026
- Chrome for Developers, [Lighthouse llms.txt audit](https://developer.chrome.com/docs/lighthouse/agentic-browsing/llms-txt), 7 May 2026
- Google web.dev, [Build agent-friendly websites](https://web.dev/articles/ai-agent-site-ux), 2026
- Jeremy Howard, [llms.txt specification](https://llmstxt.org/), Sep 2024
- W3C TDMRep Community Group, [Final Report](https://www.w3.org/community/reports/tdmrep/CG-FINAL-tdmrep-20240202/), Feb 2024
- [EU AI Act Art. 53](https://ai-act-service-desk.ec.europa.eu/en/ai-act/article-53), in force Aug 2024
- EU AI Office, [Training content summary template](https://digital-strategy.ec.europa.eu/en/faqs/template-general-purpose-ai-model-providers-summarise-their-training-content), Jul 2025
- Norton Rose Fulbright, [GEMA v. OpenAI ruling analysis](https://www.nortonrosefulbright.com/en/knowledge/publications/656613b2/germany-delivers-landmark-copyright-ruling-against-openai-what-it-means-for-ai-and-ip), Nov 2025
- Norton Rose Fulbright, [Hamburg Court machine-readable opt-outs](https://www.insidetechlaw.com/blog/2025/12/machine-readable-opt-outs-and-ai-training-hamburg-court-clarifies-copyright-expectations), Dec 2025
- CNIL, [AI recommendations](https://www.cnil.fr/en/ai-cnil-finalises-its-recommendations-development-artificial-intelligence-systems), Feb/Jun 2025
- Cloudflare, [AI Crawl Control](https://blog.cloudflare.com/introducing-ai-crawl-control/), 2025
- Cloudflare, [Content Independence Day: AI Options](https://blog.cloudflare.com/content-independence-day-ai-options/), Jul 2026
- Cloudflare, [Markdown for Agents](https://blog.cloudflare.com/markdown-for-agents/), 2026
- Microsoft, [NLWeb](https://news.microsoft.com/source/features/company-news/introducing-nlweb-bringing-conversational-interfaces-directly-to-the-web/), 2025-2026
- Google+Microsoft, [WebMCP](https://www.marktechpost.com/2026/02/14/google-ai-introduces-the-webmcp-to-enable-direct-and-structured-website-interactions-for-new-ai-agents/), Feb 2026
- OtterlyAI, [90-day llms.txt experiment](https://otterly.ai/blog/the-llms-txt-experiment/), 2025-2026
- Addy Osmani, [Agentic Engine Optimization](https://addyosmani.com/blog/agentic-engine-optimization/), Apr 2026
- Myriam Jessier, [The rise of technical branding in the age of AI search](https://searchengineland.com/technical-branding-ai-search-451827), Search Engine Land, Oct 2025
- Dan Petrovic / DEJAN AI, [Grounding budget data](https://dejanseo.com.au/), Dec 2025
- Gianna Brachetti, [Multi-Level Approach to Managing AI Crawler Behavior and Content Protection](https://datatracker.ietf.org/doc/slides-aicontrolws-proposal-multi-level-approach-to-managing-ai-crawler-behavior-and-content-protection/), IETF AIControlWS, Sep 2024
- The Query Post, [Google's llms.txt messaging](https://thequerypost.com/googles-llms-txt-messaging-gets-messy-as-chrome-adds-it-to-agentic-browsing-audits/), May 2026
- Presenc AI, [State of llms.txt 2026](https://presenc.ai/research/state-of-llms-txt-2026), 2026
- Louise Linehan, [We Analyzed 137K Sites: 97% of llms.txt Files Never Get Read](https://ahrefs.com/blog/llmstxt-study/), Ahrefs Blog, Jun 2026
- Cursor, [llms.txt documentation](https://docs.cursor.com/llms.txt), 2026
