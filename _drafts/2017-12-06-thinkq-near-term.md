---
layout:     post
title:      ThinkQ Talks Near-Term Hardware
date:       2017-12-06 16:38:05
summary:    ThinkQ conference experience
categories: conference algorithms advantage
---

The IBM ThinkQ conference was held recently in New York, with a focus on near-term quantum computing applications.
It seems that businesses that businesses have succesfully been developing larger quantum computers
---we're at around 50 qubits now!--- but are now looking for the "killer app" of small quantum computers.
There were some variations on the "what to do with you quantum computer" theme
and I will talk about some of the applications that were discussed.

All talks and recordings of them are available at the [online schedule](https://www.research.ibm.com/ibm-q/thinkq/agenda.html).

## Quantum Advantage
A _quantum advantage_ refers to some applications where a quantum computer performs some computation
that a classical computer currently cannot perform.
Previously known as _quantum supremacy_, it has now been renamed after an internal discussion
within the community about it's political correctness.
See e.g. one of the most heated [discussions](https://scirate.com/arxiv/1705.06768) I've seen on Scirate,
which also touches on the Latin origin of the term _ancilla_ ("housemaid", colloquially: helper qubit).
While almost certainly an internet troll, _ancilla the supremacist_ has become somewhat of a joke in my environment,
so I guess it has served its purpose.


## Applications
On the first day we had a high-level talk by Aram Harrow discussing some of the issues that
we face when finding applications that should exceed classical computers.
Usually computers are used for processing some amount of data, and reading all data will take at least $\Omega(n)$.
Therefore, if you do not have your data stored in some quantum format,
some obvious algorithms, such as Grover search, will actually be bound by this data read-out.
For example, if we wish to find a 1 in a pile of data, it takes $O(\sqrt n)$ after
reading out all bits in $O(n)$, resulting in just an $O(n)$ algorithm.
Obviously, in this use-case we would rather distribute the process over a classical data since that would be much faster.


Ever since its announcement, IBM's ThinkQ conference had been on my mind. As someone with a keen interest in QAOA [CITE] and the like, a conference on "Approximate Quantum Computing", to be held at no place other than the home of our quantum friend the Quantum Experience [CITE], was a hard opportunity to pass up on. It didn't hurt that there was no fee, and the venue wasn't far from my own home in College Park. Still, what with all the coursework and project writing duties of the semester, the upcoming conference slipped to the backburners of my mind. Until Eddie, ten days before ThinkQ, asks me, "Hey Ani! Andrew and I are driving up to IBM for ThinkQ. Andrew's family is hosting us. You coming?". And just like that, without going through almost any effort at all except for clearing my schedule, I found myself in Yorktown Heights for what turned out to be a most excellent conference. 

In its spirit, its representation of topics and people from the quantum community, and in the overall "vibe", ThinkQ felt similar to the 17th conference on Adiabatic Quantum Computing (AQC) held in Tokyo earlier this year. Like the AQC, ThinkQ looked to nearer horizons and brought up questions that would guide the development of the first generation of quantum computers. Here, the constant in front of the polynomial mattered, as did the exponent on the polynomial scaling itself. Moreover, many talks focused on non-asympotics and presented actual estimates of gate counts for algorithms that we're interested in running on near-term hardware.
Secondly, ThinkQ brought together folks from the 
Both conferences were, *ahem* well-financed, (as a student, the importance of free food is never lost on me). Glib though it sounds, this observation is important and I think related to what many in the panel discussion (see the post here) called a "shift in the culture". I won't dwell further on that here. 