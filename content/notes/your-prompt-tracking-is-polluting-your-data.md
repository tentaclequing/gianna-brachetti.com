---
title: "Your prompt tracking is polluting your data"
date: 2026-05-22
status: fresh
tags: [seo, ai, data-quality, llm-visibility]
draft: false
description: "How synthetic prompt tracking is contaminating the one reliable signal source we had - and a call to pool what we know."
---

Hey you! Yes, you! I see what you're doing there, trying out that fancy new prompt tracker. Can I ask you to stop for a second?

You might accidentally contribute to polluting your own data. I am currently writing on a longer piece about it - while I have you here, this is your chance for contributions.

### But... why?
Everyone trying to track LLM visibility is sending synthetic prompts into ChatGPT, Perplexity, Gemini, and others. Those prompts hit APIs that are, under the hood, the same infrastructure that serves real users. Which means they show up in the same server-side analytics that we rely on to understand actual user behaviour - you won't be able to distinguish those from one another.

--> We are polluting our own and everyone else's data at scale.

If you cannot distinguish a monitoring bot's prompt-triggered visit from a genuine LLM-cited visit, you are measuring primarily the industry's own echo.
I won't just complain, I promise - I'm also working in some constructive suggestions, and I understand the need for understanding what users might see and how to target them better.

I do not have all the answers yet, and that is partly why I am writing this note instead of the full article, and would like to collect more data points.

**If you have any of the following, I would genuinely love to hear from you:**

- Server or CDN access logs showing traffic patterns you suspect are prompt-tracking tools rather than real users
- Experience with LLM visibility tools and how they generate or schedule their prompts
- Approaches you have tried for filtering synthetic from organic LLM-referred traffic
- **Internal governance policies for how your team runs prompt tracking without contaminating shared data**
- Opinions, rants, or informed scepticism - all welcome

The full article will go deeper into the mechanics and what we might do about it. I want to see the extent of it. For now, consider this an open invitation - you can reach me via [LinkedIn](https://www.linkedin.com/in/gianna-brachetti-truskawa/).
