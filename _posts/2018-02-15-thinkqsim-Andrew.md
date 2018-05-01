---
layout:     post
title:      Simulating quantum chemistry
date:       2018-02-15 00:00:15
summary:    Andrew Guo presents an overview of quantum Hamiltonian simulation and quantum chemistry, with an eye on both the near-term and long-term applications.
categories: conference
---

_By Andrew Guo_

Day Two of the 2017 IBM ThinkQ Conference featured [talks](https://www.research.ibm.com/ibm-q/thinkq/agenda.html) by an impressive array of experts in both the fields of quantum Hamiltonian simulation (Andrew Childs, Robin Kothari, Ryan Babbush, Nathan Wiebe) and quantum chemistry (Ryan Babbush, Garnet Chan). The following post aims to summarize the intersection of those fields and explain how they provide a “killer application” for a quantum computer.

## Introduction

Much ink has been spilled regarding the quest to find flashy applications for the 50-qubit quantum computers (QCs) that will be available over the next few years. The goal in researching these problems has always been to find a task on which classical computers struggle to make headway, but that quantum computer could do in its sleep[^scott]. Such a vaunted demonstration of a "quantum computational advantage" would cement the public image of quantum computing as “[Star Wars technology](https://www.nytimes.com/2018/01/16/opinion/while-you-were-sleeping.html),” and certainly merits further investigation. 

But while some researchers are searching for problems for which near-term QCs would have a computational advantage, others are focusing their attention on a longer-term goal—one that's been around since the very beginning of the field—the simulation of quantum chemistry and quantum materials. In fact, the idea of quantum simulation can be traced all the way back to the late (and great) physicist, Richard P. Feynman. 

## Simulation of quantum mechanics

Feynman was one of the #GreatMinds of 20th-century physics. He shared the Nobel prize in 1965 for co-discovering quantum electrodynamics, gave his name to a half-dozen fundamental concepts in particle physics, and authored a trilogy of famous physics textbooks (as well as a pair of rambunctious, semi-autobiographical works). More relevantly to this blog post, he also anticipated the power of quantum computing in a 1982 talk titled "Simulating Physics with Computers."[^feynman]

In classical physics, one can simulate the dynamics of systems by solving the equations of motion. These systems of differential equations can be solved numerically for all but the most complicated of systems-such as turbulent fluids. While quantum computers won’t necessarily be able to help with intractable problems in fluid dynamics, they will be useful in situations where the _laws of classical mechanics_ themselves break down. In Feynman’s own words: 

<blockquote>
	<p>
		Nature isn't classical, dammit, and if you want to make a simulation of nature, you'd better make it quantum mechanical, and by golly it's a wonderful problem, because it doesn't look so easy.
	</p>
	<footer><cite title="Richard P. Feynman">Richard P. Feynman</cite></footer>
</blockquote>
Feynman foresaw that the challenge of simulating quantum mechanics would stump the world’s most powerful computers---including modern-day supercomputers. Thirty years after his death[^feynman2], Feynman’s words still feature in the motivating slides for many talks on quantum simulation[^1]. 

So why is simulating quantum chemistry so hard for classical computers? Well, it goes back to the curse of dimensionality: the more particles you have in a system, the more parameters you need to describe its quantum state. In the worst case, the number of parameters can grow exponentially in the number of electrons! In practice, this makes it impractical to simulate molecular systems with more than a few atoms. And while such exacting quantum mechanical descriptions aren't typically required to model most reactions[^2], there are some important exceptions[^except].

One example of a chemical phenomenon that skews more quantum than classical is the mechanism of catalysts---molecular agents used to speed up chemical reactions without themselves being consumed. The heart of a catalyst’s reactive power is in its active site, which in many heterogeneous catalysts---think enzymes---consists of a geometric arrangement of molecules centered around one (or more) transition metal atoms. The electrons of these metal atoms interact strongly with other electrons, and play an important role in stabilizing the transition states of a reaction. It is exactly these strongly-interacting systems that cannot be simulated with classical methods!

One such catalyst that researchers have focused on recently is nitrogenase, the enzyme responsible for nitrogen-fixation in bacteria[^svore]. While nitrogen is ubiquitous in nature—comprising 78% by volume of the air we breathe and featuring in each of the twenty amino acids that make up our proteins---most of the nitrogen on earth takes the form of inert dinitrogen gas. The nitrogenase enzyme can chemically activate nitrogen at standard temperature and pressure, thereby _fixing_ it. 
	
In industry, an analogous reaction known as the Haber-Bosch process is used to fix nitrogen, specifically in the form of ammonia. The ammonia can be then be used to make fertilizer (or nitro-based explosives—a fact which likely helped extend the duration of WWI by a few years). The reaction consumes one nitrogen molecule and three hydrogen molecules to form two ammonia molecules:
\begin{align}
\text{N}_2 + 3 \text{H}_2 \rightarrow 2 \text{NH}_3 \quad (\Delta H^\circ = -45.8 \text{ kJ/mol})
\end{align}
Although this reaction is exothermic, the process requires temperatures of 400 $^\circ$C and pressures of 200 atm to proceed. So even though nitrogen fixation is thermodynamically favorable at room temperature, it proceeds slowly due to the immense activation energy required to break the triple bond. The extreme temperatures and pressures required to activate the metallic catalyst use up 1-2% of the world's annual energy budget---an order magnitude more than is used to mine Bitcoin! The development of a better nitrogen-fixation catalyst would make a sizable impact on reducing the world’s energy consumption. 

In order to find a better catalyst, we need to first understand the catalytic reaction mechanism, including all of the reaction intermediates and transition structures that may occur between the reactant and product stages. Phrased in physical terms, we must map out the potential energy surface that the system explores throughout the reaction. In this model, the transition structures and reaction intermediates are located at points of local maximum and minimum respectively. Here, quantum simulation can come in handy. By determining the ground-state energies of the chemical structures, quantum computers can help determine the optimal pathway through the reaction space. 

## Hybrid quantum-classical algorithms

How do we go about mapping the potential energy surface of a chemical reaction? According to Ryan Babbush, we would need to map the potential energy surfaces to the chemical accuracy of 1 kcal/mol in order to get reaction coefficients  on the correct order of magnitude[^arrhenius]. For comparison, the activation energy for the uncatalyzed nitrogen-fixation reaction is a little less than 100 kcal/mol[^3]. So if we could find the ground state energies for all of the transition states and reaction intermediates with an error of at most one part in a hundred, we could make nontrivial headway in finding new reaction pathways!

Unfortunately, finding ground state energies is a hard task in general---even for a quantum computer[^4]! And it could be a decade or more before QC’s will be powerful and robust enough to improve over current chemical simulation methods.  But there is some hope for the near-term: researchers have developed some heuristic algorithms that can perform approximate quantum simulation using the first generation of quantum devices[^vqe]. While these algorithms do not guarantee any asymptotic quantum speed-up, they might perform suitably well in practice.

A simple way to find the ground state energy of a Hamiltonian $H$ is by preparing a system in its ground state $\ket{\psi}$ and measuring the expectation value of its energy: $\bra{\psi}H\ket{\psi}$. But this exact state preparation is still hard[^qma]. So the next best thing would be to prepare a trial state that is close in energy to the ground state. Let’s say we have a quantum circuit that takes in a set of input parameters and applies a sequence of gates to prepare a specific quantum state. By measuring the expectation value of the energy of that state, we obtain an upper bound to the system’s true ground state energy. Then, we use classical optimization techniques to minimize the energy as a function of the input parameters. After feeding the optimized parameters back into the quantum circuit, we repeat the process all over again. If we’re smart about this, then we’ll end up getting close to the ground-state energy in a reasonable number of iterations.

This proposal for finding ground state energies goes by the name of a variational quantum eigensolver (VQE), and is an example of a so-called _hybrid quantum-classical algorithm_. Here, the classical part consists of a souped-up, descent-based optimizer, whereas the quantum part is responsible for the state preparation and measurement. Another way to think about VQE is that the measurement of the state’s energy produces data on which we can train the state preparation protocol. This may sound familiar to those of you with a machine learning background; indeed, Ryan Babbush has said that the idea of VQE and other hybrid algorithms is to “train shallow quantum circuits like a neural network.” Since these low-depth quantum circuits do not require error-correction, these algorithms are prime candidates for harnessing the power of near-term QCs. 

## Conclusion

This wraps up our brief tour of quantum simulation. I hope that this post has elucidated why some people consider simulating chemistry to be one of _the_ premier applications for a quantum computer. And there are numerous other practical implications; in addition to catalysts, QC’s could be used in the future to study the reactivity of chemical structures like proteins and crystals, or even probe exotic materials like high-temperature superconductors[^5].

It’s important, however, to not to get ahead of ourselves: quantum computing isn’t the only revolutionary technology capable of transforming quantum chemistry. Artificial intelligence and machine learning in particular are poised to make a significant impact on the field — long before universal QCs are expected to take the stage[^6]. One challenge in the meantime is to find expert collaborators who can help identify materials or molecular systems for which quantum simulation befits, but who also have the patience to play the long game. As with other forms of “Star Wars technology,” quantum computers will have their day—in a spacetime far, far away. 

_Thanks to Leigh Martin and Stephen Ting for helpful discussions. Special thanks to Andrew Childs for his course on quantum algorithms at the University of Maryland, which planted the original inspiration for this post._

---

[^scott]: Quote attributed to [Scott Aaronson](www.scottaaronson.com/talks/speedup.ppt) (download warning: 1.3MB PPT file).

[^feynman]: Richard P. Feynman, _Simulating physics with computers_, International Journal of Theoretical Physics __21__ (1982), no. 6-7, 467–488. {% include doi.html doi='10.1007/BF02650179' %}

[^feynman2]: Feynman passed away on February 15, 1988. Fun fact: the 100th anniversary of his birthday will take place on May 11, 2018. 

[^1]: See, for example, the talks by [Andrew Childs](https://www.youtube.com/watch?v=VSTzptzsNp0) and [Garnet Chan](https://www.youtube.com/watch?v=OrRLB-fGS_U).

[^2]: To simulate the dynamics of biochemical systems like proteins, it usually suffices to model them using classical molecular mechanics---already a computationally-intensive task in and of itself. To compute molecular orbitals in solid-state systems and quantum chemistry, the mean-field method of density functional theory (DFT) has had many successes. Unsurprisingly, DFT still struggles to model systems of strongly-correlated electrons efficiently. 

[^except]: As is the case for most “rules” in chemistry. 

[^svore]: Reiher, M., Wiebe, N., Svore, K. M., Wecker, D., & Troyer, M., _Elucidating Reaction Mechanisms on Quantum Computers_. PNAS 2017 July, 114 (29) 7555-7560. {% include doi.html doi='10.1073/pnas.1619152114' %}

[^arrhenius]: Using the Arrhenius equation: $k = Ae^{-\Delta E/RT}$, where $\Delta E$ is the activation energy of the reaction or one of its intermediate steps.

[^3]: Jayant M. Modak, _Haber Process for Ammonia Synthesis,_ General Article, Volume 7, Issue 9, September 2002 pp 69-77. [Fulltext](http://www.ias.ac.in/article/fulltext/reso/007/09/0069-0077)

[^4]: More specifically, the k-local Hamiltonian simulation problem is QMA-complete for $k \ge 2$. See the following paper for details: Kempe, J., Kitaev, A., & Regev, O., _The complexity of the local Hamiltonian problem_, SIAM Journal on Computing, 35 (5): 1070–1097. (2006) {% include doi.html doi='10.1137/S0097539704445226' %}

[^vqe]: Jarrod R McClean, et al., _The theory of variational hybrid quantum-classical algorithms,_ New J. Phys. 18 023023, (2016). {%include doi.html doi='10.1088/1367-2630/18/2/023023' %}

[^qma]: QMA-hard, in fact. 

[^5]: See Garnet Chan’s [talk](https://www.youtube.com/watch?v=OrRLB-fGS_U) for more on these applications. 

[^6]: For a comprehensive outlook on technological forces poised to “disrupt” the field of chemical simulation, check out this recent paper: Aspuru-Guzik, A., Lindh, R., & Reiher, M., _The Matter Simulation (R)evolution,_ ACS Cent. Sci., Article ASAP, (2018). {% include doi.html doi='10.1021/acscentsci.7b00550' %}

