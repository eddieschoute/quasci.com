---
layout:     post
title:      Quantum simulation at the 2017 ThinkQ Conference
date:       2018-02-12 12:00:00
summary:    
categories: conference
---

Much ink has been spilled regarding the quest to find a flashy application for the 50-qubit quantum computers (QCs) that will be available over the next few years. The goal in researching these problems has always been to find an instance where classical computers struggle, but where a quantum computer would excel. Such a vaunted demonstration of a "quantum computational advantage" would cement the public image of quantum computing as ["Star Wars technology,"](https://www.nytimes.com/2018/01/16/opinion/while-you-were-sleeping.html) and certainly merits further investigation. 

But while some researchers are searching for problems for which near-term QCs have an advantage, others are focusing their attention on a longer-term goal - one that's been around since the very beginning of the field: the simulation of quantum chemistry and quantum materials. The idea of quantum simulation can be traced all the way back to the late (and great) physicist, Richard P. Feynman. 

Feynman was one of the #GreatMinds of 20th-century physics. He shared the Nobel prize in 1965 for co-discovering quantum electrodynamics; gave his name to a half-dozen fundamental concepts in particle physics, and authored a trilogy of famous freshman physics textbooks (as well as a pair of rambunctious, semi-autobiographical works). More relevantly to this blog post, he also anticipated the power of quantum computing in a 1982 talk titled “Simulating Physics with Computers.”

In classical physics, one can simulate the dynamics of systems by solving the equations of motion. These systems of differential equations can be solved numerically for all but the most complicated of systems - such as turbulent fluids. While quantum computers won’t necessarily be able to help with intractable problems in fluid dynamics, they will be useful in situations where the _laws of classical mechanics_ themselves break down. In Feynman’s own words, “Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical, and by golly it's a wonderful problem, because it doesn't look so easy.” Feynman foresaw that the challenge of simulating quantum mechanics would stump the world’s most powerful computers - including modern-day supercomputers. Thirty years after his death, Feynman’s words still feature in the motivating slides for many talks on quantum simulation [^1]. 

So why is simulating quantum chemistry so hard for classical computers? Well, it goes back to the curse of dimensionality: the more particles you have in a system, the more parameters you need to describe its quantum state. In the worst case, the number of parameters can grow exponentially in the number of electrons! In practice, this makes it impractical to simulate molecular systems with more than a few atoms. And while such exacting quantum mechanical descriptions aren't typically required to model most reactions [^2], as with most rules in chemistry, there are exceptions! 

One example of a chemical phenomenon where quantum mechanics cannot be avoided is in the mechanism of catalysts - molecular agents used to speed up chemical reactions without themselves being consumed. The heart of a catalyst’s reactive power is in its active site, which in many heterogeneous catalysts - think enzymes - contains a geometric arrangement of molecules centered around one or more transition metal atoms. The metal atoms’ d-orbital electrons are quite strongly-correlated, and play an important role in stabilizing transition states. Such systems cannot be simulated without appeal to quantum mechanics!  

One such system that researchers have focused on recently is that of nitrogenase, the enzyme responsible for nitrogen-fixation in bacteria. While nitrogen is ubiquitous in nature - comprising 78% by volume of the air we breathe and featuring in each of the twenty amino acids that make up our proteins - most of the nitrogen on earth takes the form of inert dinitrogen gas. The nitrogenase enzyme can chemically activate nitrogen at standard temperature and pressure, thereby ``fixing'' it. 
	
The industrial analogue known as the Haber-Bosch process is used to fix nitrogen, specifically in the form of ammonia. The ammonia can be used to make fertilizer (and also nitro-based explosives, which probably helped extend the duration of WWI by a few years.) The reaction consumes one nitrogen molecule and three hydrogen molecules to form two ammonia molecules:
\begin{align}
\text{N}_2 + 3 \text{H}_2 \rightarrow 2 \text{NH}_3 \quad (\Delta H^\circ = -45.8 \text{ kJ/mol})
\end{align}
Although this reaction is exothermic, the process requires temperatures of 400 $^\circ$C and pressures of 200 atm to proceed. So even though nitrogen fixation is thermodynamically favorable at room temperature, it proceeds slowly due to the immense activation energy required to break the triple bond. The extreme temperatures and pressures required to activate the metallic catalyst use up 1-2% of the world's annual energy budget. Thus, developing a better nitrogen fixation catalyst would reduce global energy expenditures. 

In order to find a better catalyst, we need to first understand the catalytic reaction mechanism, including all of the reaction intermediates and transition structures that may occur between the reactant and product stages. Phrased in physical terms, we must map out the potential energy surface that the system explores throughout the reaction. In this model, the transition structures and reaction intermediates are located at points of local maximum and minimum respectively. Here, quantum simulation can come in handy. By determining the ground-state energies of the chemical structures, quantum computers can help determine the optimal pathway through the reaction space. 

## Hybrid quantum-classical algorithms

How do we go about mapping the potential energy surface of a chemical reaction? According to Ryan Babbush, we would need to map the potential energy surfaces to the chemical accuracy of 1 kcal/mol in order to get reaction coefficients (using the Arrhenius equation: $k \propto e^{-\Delta E/RT}$) on the correct order of magnitude. For comparison, the activation energy for the un-catalyzed nitrogen-fixation reaction is a little less than 100 kcal/mol [^3]. So if we could find the ground state energies for all of the transition states and reaction intermediates with an error of at most one part in a hundred, we could make non-trivial head-way in finding new reaction pathways!

Unfortunately, finding ground state energies is a hard task in general - even for quantum computers [^4]! It could be a decade or more before quantum computers are robust and powerful enough to improve over current simulation methods, such as density functional theory. But even though the asymptotic complexity of the problem is daunting, people have developed some heuristic algorithms that - while not performing exact quantum simulation - might work well in practice. 

One way to find the ground state energy of a Hamiltonian is by preparing a system in its ground state and measuring the expectation value of its energy: $\bra{\psi}H\ket{\psi}$. But this exact state preparation is still hard (QMA-hard, in fact). So, the next best thing would be to prepare a trial state that is close in energy to the ground state. Let’s say we use a quantum computer that takes a fixed (small) number of input parameters and applies a procedure to prepare a specific quantum state. By measuring the expectation value of the energy of that state, we may obtain an upper bound to the true ground state energy. Then, using classical optimization techniques, we minimize the energy as a function of the input parameters. If we’re smart about this, then we’ll end up getting close to the ground-state energy.

This proposal for finding ground state energies goes by the name of a variational quantum eigensolver (VQE), and is an example of a so-called _hybrid quantum-classical algorithm_. Here, the classical part consists of a souped-up, descent-based optimizer, whereas the quantum part is responsible for the state preparation and measurement. Another way to think about VQE is that the measurement of the state’s energy produces data on which we can train the state preparation protocol. This may sound familiar to those of you with a machine learning background; indeed, Ryan Babbush has said that the idea of VQE and other hybrid algorithms is to “train shallow quantum circuits like a neural network.” Since these low-depth quantum circuits do not require error-correction, these algorithms are prime candidates for harnessing the power of near-term QCs. 

Conclusion:

This has been just a brief taste of the field of quantum simulation, a problem for which a quantum computer can perform exponentially faster than a classical computer. And there's numerous other practical implications; in addition to catalysts, future simulations by quantum computers could be used to study the reactivity of chemical structures like proteins and crystals, or even probe exotic materials like high-temperature superconductors [^5]. It's no small wonder that this topic occupied most of the talks during Day 2 of the ThinkQ conference. 

It’s important, though, to not to get ahead of ourselves and start thinking that quantum computing is the only revolutionary technology capable of transforming quantum chemistry. Artificial intelligence and machine learning in particular are poised to make significant impacts on a much shorter timescale than a universal QC [^6], which might not be available for a few decades. Our challenge in the meantime is to find expert collaborators who can help identify interesting materials and chemicals that we can simulate with a near-term QC, but who also have the patience to play the long game. As with most other Star Wars technology, QC’s will get their day in a spacetime far, far away. 

Special thanks to Leigh Martin and Stephen Ting for helpful discussions. 

---

[^1]: See, for example, the talks by Andrew Childs and Garnet Chan. Richard P. Feynman passed away thirty years ago on February 15, 1988. Fun fact: the 100th anniversary of Feynman’s birthday will take place on May 11, 2018. 

[^2]: In most systems relevant to organic chemistry and biochemistry, for example, it suffices to model the structures of atoms using classical methods like molecular mechanics. For simulating solid-state and quantum chemistry, mean-field methods such as density functional theory have had many successes, but strongly-correlated systems still stump them.

[^3]: http://www.ias.ac.in/article/fulltext/reso/007/09/0069-0077

[^4]: Specifically, it has been shown to be QMA-complete for k-local Hamiltonians, $k \ge 2$. Kempe, Julia; Kitaev, Alexei; Regev, Oded (2006). "The complexity of the local Hamiltonian problem". SIAM Journal on Computing. 35 (5): 1070–1097. arXiv:quant-ph/0406180v2 Freely accessible. doi:10.1137/S0097539704445226..

[^5]: See, for example, Garnet Chan’s talk.

[^6]: For a comprehensive outlook on disruptive forces in the field of chemical simulation, see for example a recent paper published by Alán Aspuru-Guzik et al. in the ACS Central Science Journal. DOI: 10.1021/acscentsci.7b00550


