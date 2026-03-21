---
title: "Prompt injection through search snippets"
date: 2025-01-14
lastmod: 2025-02-28
status: spreading
tags: [security, ai]
---

If an AI search engine renders a snippet from a third-party page as part of its answer, and that snippet contains text formatted as an instruction - not to the user but to the model - you have a problem. This isn't theoretical. The attack surface exists today in every retrieval-augmented generation system that ingests web content without adequate input sanitisation.

The mechanism is straightforward. You control a web page. That page ranks for a query. An AI system retrieves your page as context for generating an answer. Your page contains text that looks like a system instruction to the model. If the model doesn't distinguish between its actual system prompt and text that merely resembles one, your injected instruction executes.

What makes this particularly relevant for SEOs is that we already know how to get content into retrieval positions. We've been doing it for decades. The difference is that the downstream consequences of appearing in an AI-generated answer are fundamentally different from appearing in a traditional SERP. In a traditional SERP, the user sees your snippet and decides whether to click. In an AI answer, your text becomes part of the answer itself - attributed or not, filtered or not.

The defences against this are still immature. Model-level instruction hierarchy, input sanitisation, and retrieval filtering all help, but none of them are comprehensive. This note is spreading because every month brings new examples and the fundamental vulnerability remains unpatched.
