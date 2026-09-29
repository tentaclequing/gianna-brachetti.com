---
title: "How to estimate dark AI referral traffic"
date: 2026-09-29
description: "A per-platform model for estimating the AI referral traffic your analytics can't see, cross-checked against bot crawl data."
draft: false
---

_Note: I implemented this in May 2026; Microsoft Clarity have since introduced a built-in dashboard for Scrape-to-referral insights, saving you some of the work (I had to do it myself since my job at the time involved a custom enterprise data warehouse, and it was well worth the exercise!)_

You might have felt the same fate if you work in an agency or inhouse:
The board and everyone around them has an increasing appetite to measure "AI visibility", and keep pushing you to provide them with scores, or asking you to defend fantasy metrics of yet another SEO suite they have been testing.
So you'd like to look into one of the two actual data points you have available - referral traffic. There's just one broad number making the rounds: an estimated 30% of referrers are actually passed through by LLMs. {{< sidenote >}} It's been widely quoted, and people seem to have translated that into "70% of direct traffic must be AI traffic" - [that assumption is wrong](https://buttondown.com/davidrosam/archive/everyone-quotes-60-nobody-measured-it/), and is exactly why you need to weight this per model.{{< /sidenote >}}
However, every LLM handles referrers differently, so which LLM is driving most of the traffic to your site might change that number quite a bit - if you treated them all the same way, your calculations are simpler but you might over- or undercount substantially. This is why, when faced with the same problem, I created a model to have a better estimate, and I'll walk you through the process here so you can build your own.
Fair warning: the numbers I use are rough. Some come from published research, some from brief tests I ran, some from things I read and forgot to bookmark. I am showing you the process of how to get to a workable estimate, not presenting a study. The value is in weighting per platform and cross-checking against your own data, not in copying my numbers. Sometimes you just need a number you can defend in a meeting and update when better data comes along.
While [GA4 is labelling some AI traffic automatically](https://www.searchenginejournal.com/ga4s-ai-assistant-channel-undercounts-your-ai-traffic-how-to-build-one-that-doesnt/580133/) by now, it is undercounting, and not labelling all LLMs. You'd still benefit from making your own data model. 


## Challenges when estimating dark AI traffic

We've got five challenges when estimating dark AI traffic:
1. The different AI referrer pass-through-rates of each AI platform
2. Potentially different pass-through-rates for users on free tiers vs. paid tiers
3. Browsers reducing pass-through-rates with or without their users knowing
4. Practically no pass-through-rates from mobile AI apps to web URLs
5. Fluctuation for all of these


Regarding the second challenge:  At the time of writing, I am not aware of any AI platform other than ChatGPT making a notable difference between referrer pass-through-rates on free tier vs. paid tier users. ChatGPT seems to strip referrers off inline links in paid tiers, keeps them in free tiers, but keeps adding UTM source parameters to links in citations at the end of a response for all tiers.

## Estimating AI referrer pass-through-rates

Here's how I got there: I compiled the currently estimated percentage of referrals passed through by AI platforms: the share of real user clicks that arrive in our web analytics with an identifiable AI referrer; the rest is dark traffic that might be measured as direct or unattributed (depending on how you set it up).

For ChatGPT, Claude, Gemini, and Perplexity, per-surface referrer behaviour is documented in [SearchPilot's AI Platform Click Referrer Reference](https://www.searchpilot.com/hubfs/pdfs/ai-traffic-source-reference.pdf) (April 2026, based on Loamly data). For the remaining platforms, the rates are rough working estimates from May 2026, based on a mix of brief testing, observed patterns in my own analytics, and numbers I read somewhere but failed to note the source for. **Don't take them at face value.** They're here to illustrate the exercise: pick the platforms that matter to your site, find the best estimate you can, run some tests yourself and check if you show up in the server access logs - and build from there. Your numbers will be better than mine if you test against your own data. {{< sidenote >}} Newer observations might change the picture. {{< /sidenote >}}

| Platform | Pass-through rate | Multiplier | Basis |
| --- | --- | --- | --- |
| Microsoft Copilot | 85% | 1.2x | Sends `copilot.microsoft.com` referrer |
| DuckDuckGo AI | 80% | 1.3x | `referrer-policy: origin` passes domain |
| Perplexity | 70% | 1.4x | SearchPilot/Loamly (mobile ~70%, desktop near-perfect) |
| Google Gemini | 60% | 1.7x | SearchPilot/Loamly (desktop passes, mobile ~9%) |
| Poe | 40% | 2.5x | Rough estimate |
| ChatGPT | 35% | 2.9x | SearchPilot/Loamly (desktop passes, mobile/app dark) |
| Doubao / Mistral / Tencent Yuanbao / Qwen | 30% | 3.3x | Default for insufficient data |
| DeepSeek | 20% | 5.0x | Low traffic volume |
| Claude | 10% | 10.0x | SearchPilot/Loamly (desktop inconsistent, mobile dark) |
| Grok | 5% | 20.0x | Most referrals arrive as `x.com` (indistinguishable from social) |

The multiplier is `1 / pass-through rate`. If you observe 100 sessions from Perplexity (70% pass-through), your estimate is `100 / 0.70 = 143` real sessions. For Claude at 10%, those same 100 observed sessions would imply 1,000. (Caveat: low pass-through rates make estimations much less defendable.)

Any estimate I found, I summarised in a table and added that table as an info box on the dashboards I created for our board. {{< sidenote >}}(Documentation in itself is a broader topic and while I am passionate about it, I am by no means an expert; I just find that approach reduces the amount of times I am asked about a certain number, so it saves me time. I tried adding a link to our documentation space instead and that rarely worked. ¯\_(ツ)_/¯ ) {{< /sidenote >}}

### Downsides

Let me be up front about the downsides of this model: 
- This only allows you to measure and extrapolate from platforms that send any referrers at all, not from zero. 
- Where we do see referrers, platforms with very low pass-through rates give us so few data points that the extrapolation is fragile.
- We run calculations based on estimates others made, or our own tests with very few data points - ideally we'd run larger studies to make better estimates. (If any of you wanted to cooperate and run a study - drop me a message on LinkedIn!)


Is a bad guess better than no guess? I think it is, as long as we keep in mind that it's a guess and update our approach as soon as there are more defensible findings. 

### Validating with user research

If you want to improve on these estimates for your own site, there's one thing you can do that doesn't rely on referrer headers at all: ask your users. A short on-site survey ("What brought you here today?" with options for the major AI platforms, search engines, and social) gives you a sample of self-reported attribution you can compare against what your analytics tracked. Only a small percentage of visitors will complete it, so don't treat it as exact numbers. But if 40% of respondents say they came from ChatGPT and your analytics only show 15% ChatGPT referrals, you know the gap is real and roughly how large it is. It's trend data, not precision data, and that's exactly what we need here.

## What about browsers and mobile apps?

When I started building this model, I assumed I'd need a separate correction layer for browsers stripping referrers - but I do not think it's necessary after some research:
Desktop browsers all default to strict-origin-when-cross-origin, which still sends the domain. The referrer disappears on mobile, where AI apps use embedded WebViews that drop the header during the app-to-web handoff. Most AI apps don't opt in to preserving it, so mobile pass-through rates are near-zero for most platforms (Perplexity being the outlier at ~70% as per [SearchPilot (April 2026), "AI Platform Click Referrer Reference"](https://www.searchpilot.com/hubfs/pdfs/ai-traffic-source-reference.pdf) based on Loamly data (446k visits, Feb 2026)). Our data model above already factored that in (it's derived from all observed traffic across all device types).

What _is_ worth watching: if the mobile/desktop split for a platform shifts significantly (say, ChatGPT releases a better mobile web experience that bypasses the app), the blended pass-through rate for that platform might change, too. Take the rates in the table as snapshots and revisit them every now and then.

## Recovering ChatGPT attribution via UTM parameters

Since mid-2025, ChatGPT appends `utm_source=chatgpt.com` to citation links (the ones at the bottom of a response) across both free and paid tiers. Inline links in paid-tier responses carry `noreferrer` and no UTM; inline links in free-tier responses preserve the referrer but also carry no UTM.

This creates a practical recovery opportunity: if your analytics stack captures UTM parameters, you can reclassify sessions where `utm_source = chatgpt.com` but no AI referrer was detected. These are ChatGPT citation clicks that arrived without a Referer header but with attribution intact via the URL.

Two things to watch if you do this:

1. **Adjust your multiplier.** If you're now counting UTM-recovered sessions as observed, your ChatGPT pass-through rate effectively increases. Recalculate: `(referrer-attributed sessions + UTM-recovered sessions) / estimated total = new blended rate`. Don't apply the old 35% multiplier to the expanded observed count, or you'll double-count.
2. **This only recovers citation clicks, not inline clicks.** Paid-tier inline links still vanish entirely. The UTM recovery narrows the gap but doesn't close it.


If your analytics stack doesn't capture UTM parameters at the session level, this approach doesn't apply and the original per-platform rates remain your best estimate.

## Cross-checking with bot crawl data

The referrer model above works bottom-up: it takes the sessions we can see, applies a multiplier per platform, so we can estimate what we are missing. Let's add in a second, independent signal we can cross-check against: **the volume of AI bot requests hitting our site via CDN-level access logs** (Cloudflare, Akamai, etc.; if we have them).

CDNs like [Cloudflare classify AI bot traffic by purpose](https://developers.cloudflare.com/bots/concepts/bot/verified-bots/). Cloudflare separates three categories:
- **Training**: training data collection (not user-facing)
- **Search**: bots collecting or indexing web content
- **Agent**: automated activity acting on a person's behalf, such as chat fetch bots and browser-use agents


(If you don't have a CDN Enterprise plan, you'll need to classify bots yourself via reverse DNS lookups and a mapping table.)

The Search and Agent categories are the ones that matter here, as they are triggered for requests in the context of a user interaction (as opposed to training crawls which are classified differently). Compare their volume against the referral sessions in our analytics platform, and we got ourselves the crawl-to-referral ratio: How many times users could have seen a link to our site versus how many times they clicked it. (_Caveat:_ I say "could have seen", we won't know that just from looking at logfiles. Just because an AI Search or AI Agent bot has retrieved a webpage during its workings for a user query does not have to mean they also surfaced the link to the user. I know you're now going to tell me that this is why we need prompt tracking... well, I have a lot of feelings about that, which I'm writing up separately.)

Now the question is what conclusions will you draw when the crawl-to-referral ratio is changing dramatically?

### What affects the crawl-to-referral ratio?

If we read the crawl-to-referral ratio as a conversion rate in Marketing, we might easily think "oh, if it's dropping, this means AI has consumed our content without surfacing a link to our site to the user more often now". Those zero-click answers everyone talks about... While that could be the case, there are also other possible explanations:

- **Measurement pollution through prompt tracking:** If a lot of people in your organisation ran a specific prompt to understand how your site is displayed in a given LLM, or if someone's running a prompt tracking tool that's sending its batch of prompts to measure your "AI visibility", you've triggered AI bot crawls. And these look identical to user-triggered ones in your access logs - so what you're seeing could just be inflated crawls through prompt tracking, pushing your referral ratio down artificially. 
- **Changes in query fan-outs:** The LLM might decompose one user prompt into multiple different sub-queries, and process these as web searches, which can trigger the AI bot to request URLs to your site more than once. One user interaction can trigger many of those requests but might only lead to maximum one actual user visit to your site. 
- **Changes in referrer suppression:** We already mentioned that gap earlier. Whether referrers are sent with a request depends on the platforms and browsers we don't own - and there is quite some fluctuation. Sometimes new referrers appear, sometimes more are stripped.
- **Agent workflows:** AI agents can do multi-step tasks on a user's behalf, and that could include them researching the web autonomously. These are classified as Agents separately by Cloudflare - and as agent usage grows, so are requests that might never lead to a human visiting your site, since they might not be surfaced to the human in the process. 


You cannot separate these causes from server logs alone - do take them into account when analysing the ratio. It's still worth having that data, though: You can use the changes in ratio to detect trends. If things change sharply from one day to another, poke into whether there's been a prompt tracking batch running (you really should only do these in bursts and then make an annotation in your dashboards accordingly - but you can only control this for your own tracking, not if you showed up in someone else's), or a technical issue (eg. bot requests being blocked on purpose or accidentally, data warehouse issues such as a script importing the logs failing, and so on).

## Overview: Advantages, disadvantages, and use cases for each data model

The referrer model and the bot-crawl comparison answer different questions:

|               | Referrer pass-through rates                                         | Crawl-to-referral ratio                                                    |
| ------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| **Estimates** | Total AI sessions (observed + dark)                                 | Ratio of bot activity to human arrivals                                    |
| **Strength**  | Per-platform granularity, actionable multipliers                    | Trend or tech issue detection, prompt tracking pollution detection         |
| **Weakness**  | Relies on estimated pass-through rates with no authoritative source | Cannot separate user-triggered crawls from synthetic or fan-out crawls |
| **Requires**  | Web analytics with AI referrer classification                       | CDN or server access logs with AI bot classification                       |


### Combining both models

The referrer model tells you how many users might actually come to your site. If you throw this number against the number of page requests by AI agents and AI search bots, you get your own crawl-to-referral ratio per AI platform. (Caveat: The higher the multiplier, the more observed sessions you need before the estimate stabilises statistically.) Focus on the trends while you're observing these numbers - and use these to get hints where a change might have happened. For example: If your corrected sessions stay flat but bot requests spike, the extra crawls are probably prompt tracking or fan-out changes, not new users (find more potential causes in the section "What affects the crawl-to-referral ratio?" above).

They also help identifying gaps in your visibility or accessibility across the AI landscape and prioritise or measure the impact of your campaigns. If Claude shows 500 weekly sessions for a website with 500,000 total weekly sessions, you'd ignore it. But at a 10% pass-through rate, that estimate is 5,000 - suddenly not negligible. Meanwhile, Copilot's high pass-through rate is almost at: what you see is what you get. Without corrections per platform, we risk over-investing in those that are easy to measure and under-investing in those that are harder.


## What's left to figure out: Agentic AI detection

Now we know what we have - but both the referrer correction model and the crawl-to-referral ratio assume that AI agents are easily identifiable or identify themselves clearly whenever they browse the web. But is this true?

In most scenarios, browser-using AI agents will be detectable by IP (eg. because they run through an LLM provider's cloud, or on fixed IP ranges in corporate environments, or because they self identify, just like [Google-Agent](https://knownagents.com/agents/google-agent) and ChatGPT-Operator) - and where they are not, it might be single users self-hosting agents. But that, too, is just an assumption - without actually measuring the portion of AI agents disguised as humans in those cases where they don't run from a well known IP range, we won't be able to detect any trends or know if that is a portion we need to worry about or cater better to.

There's an emerging type of agentic AI which can not be distinguished from real human behaviour easily at present: Agents routed through residential proxy networks, where neither their IP address nor their user agent distinguishes them from a real human visitor. (Residential proxy networks are services routing traffic through IP addresses assigned to real ISP customers' home connections, instead of data centres. This can be used to conceal agentic traffic, for example.)

It's well worth cross-verifying agentic versus meat proxy (ahem: human) hits by analysing their footprint - client-side, not on the server access log level:
- Enterprise environments: Via your **CDN bot management** such as Cloudflare Precursor
- For everyone else: **Client-side JS for AI bot fingerprinting**. Yes, that's not new - but AI agents got dramatically better at mimicking human browsing, so you'd have to do more than just collecting viewport size. Expand into patterns for mouse movement, scroll event intervals, time-to-first-interaction, etc. This is not trivial - there are two papers from 2026 you can use for inspiration on what patterns to look for: 
	- [FP-Agent: Fingerprinting AI Browsing Agents (UC Davis, May 2026)](https://arxiv.org/pdf/2605.01247)
	- [On the Internet, Nobody Knows You’re an LLM Bot: Unmasking Web Agents with Multi-Layer Fingerprinting (CNRS/Inria, June 2026)](https://arxiv.org/pdf/2606.30119)
- [GDPR and ePrivacy alert](https://matomo.org/blog/2026/01/privacy-regulations-changes-2026-analytics/): As with any type of tracking or user profiling, please check with your data protection officer or lawyer what you need to disclose, and how users can consent to or opt out of it.
- **Cryptographic verification:** The major AI providers (OpenAI, Anthropic, Perplexity) sign their bot requests via Web Bot Auth. If you're with a CDN who support cryptographic verification, you get 100% certainty for those bot access requests - if not, you'll have to implement it yourself. [Find the specs here.](https://specification.website/spec/agent-readiness/web-bot-auth/) {{< sidenote >}} How this works: The operator (eg. Anthropic) generates a signing keypair and publishes the public key at a well-known HTTPS location. The agent signs request headers with the private key. The receiving server fetches the public key and verifies the signature. If it checks out, you know with cryptographic certainty which operator sent the request, regardless of what the user-agent string says. [See RFC 9421](https://datatracker.ietf.org/doc/rfc9421/) or [Akamai's highly accessible explanation](https://www.akamai.com/blog/security/2025/nov/redefine-trust-web-bot-authentication).{{< /sidenote >}}



This was a fun exercise to build, and in our case, it gave us a few interesting insights.
If you've got better data for any of these rates, or if you ran the cross-check and found something unexpected, I'd genuinely like to hear about it. You can find me on LinkedIn.
