---
title: "LLM Poisoning as an Attack Vector: What SEOs Got Wrong First"
date: 2025-02-22
type_label: essay
tags: [ai, security, seo]
description: "The SEO community was among the first to notice LLM poisoning as a practical attack vector, and among the first to misunderstand what it actually threatens."
reading_time: 12
---

The SEO community was among the first to notice LLM poisoning as a practical attack vector, and among the first to misunderstand what it actually threatens. The initial framing was predictable: "How do we get our content into AI answers?" That question contains the entire problem, but not in the way most people meant it.

When you optimise content so that a language model will surface it in a generated response, you are not doing SEO in any meaningful sense. You are teaching a statistical system to treat your text as authoritative. The difference matters because the feedback loops are entirely different, the verification mechanisms are weaker, and the potential for adversarial exploitation is significantly higher.

## The Poisoning Surface

Traditional search poisoning requires you to manipulate a ranking algorithm. LLM poisoning requires you to manipulate a training set, a retrieval corpus, or a prompt context. The third option is the one that should concern us most, because it's the one that operates at inference time and requires no special access.

If a model retrieves web content as part of its response pipeline, and that content contains carefully structured text that influences the model's output, you have a poisoning vector that looks exactly like SEO. The techniques are the same. The intent is different. And the defences are almost entirely absent.

## What the SEO Community Got Wrong

The first mistake was treating this as an opportunity rather than a threat. The second was assuming that the same trust signals that work in traditional search - domain authority, backlink profiles, brand recognition - would transfer cleanly to LLM retrieval contexts. They don't, or at least not in the ways we assumed.

A language model doesn't evaluate authority the way a search engine does. It evaluates coherence, specificity, and pattern-match to the query context. Content that reads with authority to a model is not necessarily content that *is* authoritative. That gap is the attack surface.

The responsible path forward requires the SEO community to think about this as a security problem first and a visibility problem second. We have the technical vocabulary. We understand how crawling, indexing, and retrieval work at a systems level. The question is whether we're willing to use that understanding defensively rather than opportunistically.
