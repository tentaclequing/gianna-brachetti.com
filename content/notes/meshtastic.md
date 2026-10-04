---
title: Procrastination by MeshTastic - a post-Google web?
date: 2026-10-04
status: fresh
tags:
  - seo
  - meshtastic
  - decentralisation
  - ai-search
draft: false
description: I started playing with Meshtastic and the parallels to AI search hit me harder than expected.
---

I recently got myself into a new rabbit hole - [Meshtastic](https://meshtastic.org/). It's cheap, talks to other radios over LoRa, and does not require internet or cell towers, consuming very little energy. Okay, the amount of information it can transmit is limited, too - but it's a fun exercise in resilience and decentralised networks that I find extremely fascinating-

And the more I set it up, the more it reminded me of something else ...

<!--more-->

Here's roughly how this works: You send a message to the mesh network, and it's going to be distributed over other people's devices (nodes), sometimes via repeaters to improve the distances, since it's range is limited especially in urban environments. A broadcast into a web that sits along other networks we might be more familiar with (the internet, for example).

It feels a bit like AI search at present - putting content out there, having little transparency into how and by whom it was received, and what happened afterwards.

Now, contrary to AI search in mesh networking, messages do not degrade over hops - each hop retransmits the exact same message that was originally sent, but what can degrade is the reliability. The more hops your message does through the mesh, the higher the likelihood for more delays, or it not arriving at all.
If we think of how AI agents treat content they consume off the web and consider those "hops", we can see a worrying contrast: An AI agent retrieves your content, summarises it, someone might use that agent to publish the summary, just for another AI agent to pick that summary up ... and the original meaning and intent might change or degrade over every single hop, a bit like that old telephone game.
And what about caching? Nodes don't cache per default, they flood the network with the exact messages they received. AI does cache what it retrieved - but I'm not aware of us knowing when, for how long, and how granular AI agents cache the fragments they pulled out off our web content.

Where search engines might be the central index of what's out there in the web, ranking content by authority, you don't have an equivalent of that in the mesh network. You find other nodes by broadcast (though you can ping them to receive data), and I wonder if that's the direction we're going into with the web, too (or should; LLMs are still in the run for who'll win the race in market share, all while assigning incredibly intransparent authority signals to whatever they parse, and I am not quite comfortable with that direction).

Don't buy a LoRa radio (you'll lose a few weekends to it, though those are good weekends in my book), I just found this fascinating, and think it can be useful to pay more attention to how information travels through a system without a central index or authority signals. What happens if we moved towards that angle? How much value does the information you transmit through the web hold? Is it enough to get others to speak about it, and relay it to other... nodes, with as little degradation as possible?