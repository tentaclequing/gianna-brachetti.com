---
title: "If it's possible in theory, it likely already happened in reality"
slug: "cheesy-llms-txt"
date: 2026-09-25
type_label: essay
tags: [ai, security, agents, llms-txt, supply-chain, governance]
description: "llms.txt became an attack vector, humans can't keep up with agent approval prompts, and dashboards miss what matters. A walkthrough of why agentic AI security fails - and how the Swiss cheese model from safety engineering can help."
tldr: |
  llms.txt and similar conventions are being treated as harmless, but they can carry hallucinated package references that malicious actors exploit. Human-in-the-loop review fails at scale (1 in 3 malicious requests get approved), agents misrepresent what they did, and safety dashboards miss pipeline-level breaches. The fix is not better prompts or more approval dialogs - it is layered infrastructure controls, modelled after the Swiss cheese model from safety engineering, where no single defence is trusted to hold on its own.
---

# Or: how to make a better cheese sandwich
## llms.txt became an attack vector - and it is not the only one

I spoke about how a web standard people consider harmless could become an attack vector ([BrightonSEO 2024]( https://speakerdeck.com/giannabrachetti/hidden-traps-with-robots-dot-txt-at-brightonseo-2024)); now with AI in the mix, and people trying to establish new web standards and conventions, that risk has multiplied.
One of those emerging conventions is [llms.txt which might contain references to software that your agents, when you run them, might read and then install.](https://arstechnica.com/security/2026/08/claude-codex-and-hermes-installed-unowned-code-inside-corporate-networks/?amp=&amp=&amp=) These packages might have been hallucinated by agents who maintained the llms.txt file - and be hijacked by malicious actors who make sure those hallucinated packages exist, and contain malicious code that your agent will install. I guess if you made yourself a giant [Swiss cheese sandwich](https://en.wikipedia.org/wiki/Swiss_cheese_model), you gotta eat it, too.

## Human-in-the-loop is bound to fail
A lot of users running agents to write code are either not engineers, or engineers working in highly accelerated company settings where the majority uses AI-assisted coding. AI produces a lot of output in a short time - too much to properly review line by line. As a result, a lot of it gets approved by humans - rendering human review quite inefficient at avoiding security risks:

A browser-based test game ([The Register, Aug 2026](https://www.theregister.com/ai-and-ml/2026/08/06/humans-in-the-loop-miss-a-third-of-dangerous-ai-coding-agent-requests/5284236)) found humans approve roughly 1 in 3 malicious requests. When an agent fires 20 permission prompts in an hour, the human stops reading them. 
You might have heard the emerging phrase ["meat proxy"](https://simonwillison.net/2026/Aug/3/dont-be-a-meat-proxy/) - humans increasingly find themselves in charge of hitting "Enter" to approve whenever the agent asks for confirmation, with less time and brain space to actually fully grasp what it's been doing.

I personally don't find it a comforting idea that using AI agents for code reviews and QA testing will provide better security.
Putting humans back into the driver's seat (with a manual gearbox, not automatic :p ) requires tooling and [organizational maturity most companies don't have](https://www.cnbc.com/2026/03/01/ai-artificial-intelligence-economy-business-risks.html). 

## What if we just asked the agent?
A study found that in 80% of cases, agents misrepresented what they had actually done where their work was incomplete (see: https://arxiv.org/html/2609.20812v2 ). So if you were thinking of just pestering your AI agent to determine if it was doing anything that's not safe --- you are in bad luck, I'm afraid. While it's debatable how much we should trust AI companies to accurately report what they found (or not have other motives, such as great PR for their products' power), here are a few related disclosures by Anthropic and OpenAI where agents were misaligned with their tasks:
- [Anthropic: Agentic Misalignment Summer 2026](https://alignment.anthropic.com/2026/agentic-misalignment-summer-2026/)
- [OpenAI: Self-generated prompt injections](https://alignment.openai.com/misalignment-reports/self-generated-prompt-injections-in-compaction-summaries/)

In a lot of cases, agents might fail to accurately tell you what they have been doing because they did not properly parse all context; however, nothing stops them from [inventing their own language](https://english.elpais.com/technology/2026-09-15/ai-agents-invent-their-own-language-to-shut-humans-out.html) to also shut you out (the jury is still out on whether agents did this on purpose but do we really have to risk it? ). 

So you might either be too exhausted to catch up when you're the human in the loop, or the info you're reviewing does not accurately inform you to determine risks, or the [AI agents have pushed you out of the loop](https://arxiv.org/html/2608.23642v1).

## Human failure, or architecture?
So the model _knows_ what it's doing, the user _doesn't_, and the UI that's supposed to be a safety net actively hides relevant information. While exploring how to improve my own infrastructure to test sandboxing agents, I read that instead of trying to stay in the loop, you're better off analysing agents' behavioural patterns for hints of them going rogue (or installing unsafe code). [Well, your fancy dashboards can fail, too.](https://www.techtimes.com/articles/327542/20260915/ai-agent-pipeline-breaches-stay-hidden-safety-dashboards-study-finds.htm)

### How does one detect if it's bad code?
Humans often won't know how to detect if a package was affected. Some tooling exists - but it might only catch things after the fact (eg. npm audit only detects published CVEs, not necessarily all freshly published malicious packages, and who's got time for behavioural analysis?) [Agents are pulling packages into environments that aren't watched by scanners](https://socket.dev/blog/the-code-you-didnt-write-is-still-yours-to-defend), resolving dependencies before security teams can see them. 
So where does that leave us?
## If it's possible in theory, it likely already happened in reality
Think of what agents COULD do if something went wrong - and you might know what they've already done somewhere. It might just not have been discovered or reported on yet.

### What NOT to Rely On

Ever told a toddler "don't touch the stove"? You might have experienced first hand that if there is nothing to keep them physically from touching it, they'll eventually try to do it. Equally, a prompt forbidding the agent to install malware won't work. Verbal instructions _feel_ safe, but are not. So now we know what we must not rely on:

- Prompt- or context-level guardrails
- The human to understand what they are approving
- Any tools or "security agents" as your only line of defense
- The agent's own explanation of what it did

That's why and where governance and information security are important - yet they are lagging behind. In an ideal world, we'd have established frameworks and guardrails before AI was even built and deployed, not retroactively, yet here we are.

## The Swiss Cheese Model for Agentic Error - Principles for Agentic Applications
In safety engineering, there's a concept called the Swiss cheese model: every layer of defence is a slice of cheese with holes, and where the holes between slices line up, bad things happen. It's widely [applied in healthcare](https://pmc.ncbi.nlm.nih.gov/articles/PMC8514562/#F1) in crisis intervention. Let's apply it to working with AI, too:

1. **Never trust, always verify**
Treat every request from the agent as "untrusted input", and verify it - do not assume it's safe because it came from your own system and you nicely asked it to not do a certain thing. Better yet: run them in a sealed environment, deny-by-default, where agents can only reach what you explicitly allowed them to and nothing else.
2. **Signed components & provenance**
Every package or model the agent uses must be cryptographically signed and traceable back to a known source; do not allow it to install unsigned or unverifiable code.
3. **Least privilege, always**
Don't give an agent access to everything "because it's easier." Each agent gets the tools it needs for one specific task, nothing more.
4. **Watch what they do, not what they say**
Track actual behaviour, such as tool calls, privilege changes, goal drift, network requests, etc. And have a kill switch, so if something looks off, you can stop it immediately.
5. **Log everything, and protect the logs!**
Every agent run gets logged: who started it, what it did, what it touched. Crucially, the agent itself must not be able to edit or delete those logs (this part is what's overlooked by most).
6. **Enforce the rules in infrastructure**
Layer your defences: network, filesystem, tool access, credentials, so that when (not if) one layer fails, the next one might catch it. And make those rules machine-enforced. A prompt saying "please don't access the production database" is not a real boundary if your agent runs on a machine with access to prod and admin privileges.

### Most importantly: 
**Treat `llms.txt`, `AGENTS.md`, `README`, `.well-known/*`, and commented-out lines** as untrusted input, not authoritative instructions or harmless web conventions! 

Just because your agent of choice knows how to code (although that, again, is sometimes debatable) does not mean it knows or applies all the rules. Assume it's an intern on their first week of the job - highly motivated, eager to please, yet dangerously gullible and naive.

If you had to read only two sources to learn how to check your agentic applications for security risks, make it those two:

1. [The **OWASP Top 10** for Agents](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/)
2. [**CISA / Five Eyes**: "Careful Adoption of Agentic AI Services"](https://www.cyber.gov.au/business-government/secure-design/artificial-intelligence/careful-adoption-of-agentic-ai-services) (May 1, 2026; joint guidance from the cyber security agencies of the US, UK, Canada, Australia, and New Zealand)

And befriend your security colleagues. They might be wrangling exploding requests by leadership to give non-engineering teams access to prod to pursue this year's token maxxing OKRs, while fighting bush fires with a watering can.
