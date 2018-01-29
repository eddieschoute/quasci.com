---
layout:     post
title:      ThinkQ 2017
date:       2018-01-17 12:00:00
summary:    Quantum Simulation at the 2017 ThinkQ Conference
categories: conference
---

# Introduction

Much ink has been spilled regarding the quest to find a flashy application for the 50-qubit quantum computers (QCs) that will be available over the next few years. The goal in researching these problems has always been to find an instance where classical computers struggle, but where quantum computers will excel. This vaunted demonstration of a "quantum computational advantage" would cement the public image of quantum computing as ["Star Wars technology,"](https://www.nytimes.com/2018/01/16/opinion/while-you-were-sleeping.html), and certainly merits further investigation. But while some of us search for problems for which near-term QCs have an advantage, others are focusing their attention on a more long-term goal: the simulation of quantum chemistry and quantum materials. It's no small wonder that this topic occupied most of the talks during Day 2 of the conference; one of the oldest known applications for QC, quantum simulation takes us all the way back to the late and great physicist, Richard Feynman. 

Richard P. Feynman was one of the #GreatMinds of 20th-century physics. He shared the Nobel prize in 1965 for co-discovering quantum electrodynamics; he lends his name to a half-dozen fundamental concepts in particle physics, and he authored a trilogy of famous freshman physics textbooks (as well as a couple hilarious semi-autobiographical memoirs). More relevantly to this blog post, he also predicted the rise of quantum computing in a 1982 talk titled “Simulating Physics with Computers.”

In Feynman’s own words, “Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical, and by golly it's a wonderful problem, because it doesn't look so easy.” Feynman foresaw that the challenge of simulating quantum mechanics in materials science and chemistry would stump even modern-day supercomputers. Now, thirty years after his death, his words still feature in the motivation slides for many quantum simulation talks [^1]. 

So why is simulating quantum chemistry so hard for classical computers? Well, it goes back to the curse of dimensionality: the more electrons you have in a system, the more parameters you need to describe its quantum state. In fact, the number of parameters will grow exponentially in the number of electrons! In practice, this makes it hard to simulate molecular systems with more than a few atoms. While such exacting quantum mechanical descriptions aren't usually required to understand most chemical phenomena [^1.5], there are many instances where quantum behavior plays an important role in reactions! In particular, the mechanism of catalysts - agents used to speed up chemical reactions without themselves being consumed - makes use of strongly-correlated electrons mostly from d-orbital electrons of transition metals. Simulating such systems certainly requires the use of quantum mechanics!  

One such system that researchers have focused on recently is that of nitrogenase, the enzyme responsible for nitrogen-fixation in bacteria. While nitrogen is ubiquitous in nature - comprising 78% by volume of the air we breathe and featuring in each of the twenty amino acids that make up our proteins - most of the nitrogen on earth takes the form of inert dinitrogen gas. The nitrogenase enzyme can chemically activate nitrogen at standard temperature and pressure, thereby ``fixing'' it. 
	
The industrial analogue known as the Haber-Bosch process is used to fix nitrogen, specifically in the form of ammonia. The ammonia can be used to make fertilizer (and also nitro-based explosives, which probably helped extend the duration of WWI by a few years.) The reaction consumes one nitrogen molecule and three hydrogen molecules to form two ammonia molecules:
\begin{align}
\text{N}_2 + 3 \text{H}_2 \rightarrow 2 \text{NH}_3 \quad (\Delta H^\circ = -45.8 \text{ kJ/mol})
\end{align}
Although this reaction is exothermic, the process requires temperatures of 400 $^\circ$C and pressures of 200 atm to proceed. So even though nitrogen fixation is thermodynamically favorable at room temperature, it proceeds slowly due to the immense activation energy required to break the triple bond. The extreme temperatures and pressures required to activate the metallic catalyst use up 1-2% of the world's annual energy budget. Thus, developing a better nitrogen fixation catalyst would reduce global energy expenditures. 

In order to find a better catalyst, we need to first understand the catalytic reaction mechanism, including all of the reaction intermediates and transition structures that may occur between the reactant and product stages. Phrased in physical terms, we must map out the potential energy surface that the system explores throughout the reaction. In this model, the transition structures and intermediates are located at local (and global) maxima and local minima respectively. Here, quantum simulation can come in handy. By determining the ground-state energies of the chemical structures, quantum computers can help determine the optimal pathway through the reaction space. 

## Hybrid quantum-classical algorithms

How do we go about mapping the potential energy surface of a chemical reaction? According to Ryan Babbush, we would need to map the potential energy surfaces to the chemical accuracy of 1 kcal/mol in order to get reaction coefficients (using the Arrhenius equation: $k \propto e^{-\Delta E/RT}$) on the correct order of magnitude. For comparison, the activation energy for the un-catalyzed nitrogen-fixation reaction is a little less than 100 kcal/mol [^2]. So if we could find the ground state energies for all of the transition states and reaction intermediates with an error of at most one part in a hundred, we could make non-trivial head-way in finding new reaction pathways!

Unfortunately, finding ground state energies is a hard task - even for quantum computers! (Specifically, it has been shown to be QMA-complete for k-local Hamiltonians, $k \ge 2$) [^3]. But even though this asymptotic complexity is daunting, there have been some heuristic algorithms known to work well in practice.

One way to find the ground state energy of a Hamiltonian is by preparing a system in its ground state and measuring the expectation value of its energy: $\bra{\psi}H\ket{\psi}$. But this exact state preparation is still hard (QMA-hard, in fact). So, the next best thing would be to prepare a trial state that is close in energy to the ground state. Let’s say we use a quantum computer that takes a fixed (small) number of input parameters and outputs a specific quantum state. By measuring the expectation value of the energy of that state, we obtain an upper bound to the true ground state energy. Then, using classical optimization techniques to minimize the energy as a function of the input parameters. If we’re smart about this, then we’ll end up getting close to the ground-state energy.

This proposal for finding ground state energies goes by the name of a variational quantum eigensolver (VQE), and is a prime example of a hybrid quantum-classical algorithm. One of the proposals during the conference was to use machine learning to perform state preparation. The idea is to train shallow circuits (“quantum neurons”) to use VQE to prepare complex states of strongly-interacting electron systems. 

Future simulations by quantum computers could be used to study the behavior of chemical structures like proteins and crystals, or even probe exotic materials like high-temperature superconductors (Garnet Chan). 

---

[^1]: See, for example, the talks by Andrew Childs and Garnet Chan. Also, Richard P. Feynman passed away thirty years ago on February 15, 1988. Fun fact: the 100th anniversary of Feynman’s birthday will take place on May 11, 2018. 

[^1.5]: In most systems relevant to organic chemistry and biochemistry, for example, the behavior of electrons can be modeled using semi-classical methods (like DFT).

[^2]:  Kempe, Julia; Kitaev, Alexei; Regev, Oded (2006). "The complexity of the local Hamiltonian problem". SIAM Journal on Computing. 35 (5): 1070–1097. arXiv:quant-ph/0406180v2 Freely accessible. doi:10.1137/S0097539704445226..

[^3]: http://www.ias.ac.in/article/fulltext/reso/007/09/0069-0077