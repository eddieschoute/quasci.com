---
layout:     post
title:      Classical vs Quantum Computation
date:       2018-05-12 16:38:05
summary:    ThinkQ conference experience
categories: conference algorithms advantage
---

The IBM ThinkQ conference was held recently in New York with a focus on near-term quantum computing applications.
It seems that businesses that businesses have successfully been developing larger quantum computers
---we're at around 50 qubits now!--- but are now looking for the "killer app" of small quantum computers.
There were some variations on the "what to do with your quantum computer" theme
and I will talk about some of the applications that were discussed.

All talks and recordings of them are available at the [online schedule](https://www.research.ibm.com/ibm-q/thinkq/agenda.html).

A _quantum advantage_ refers to some applications where a quantum computer performs some computation
that a classical computer currently cannot perform.
Previously known as _quantum supremacy_, it has now been renamed after an internal discussion
within the community about its political correctness.
See e.g. one of the most heated [discussions](https://scirate.com/arxiv/1705.06768) I've seen on Scirate,
which also touches on the Latin origin of the term _ancilla_ ("housemaid", colloquially: helper qubit).
While almost certainly an internet troll, _ancilla the supremacist_ has become somewhat of a joke in my environment,
so I guess it has served its purpose.

So far we actually do not know unconditionally if quantum computing is actually more powerful than classical
(i.e. $BQP \not\subseteq BPP$).
But through the problems of Boson Sampling[^boson1] and Instantaneous Quantum Polynomial-time (IQP) circuits[^iqp1]
we do know that the polynomial hierarchy ($PH$) must collapse if classical computers can solve them efficiently.
(Simulation and visitor (Hakop)


## Simulating Quantum Processes
One side of the discussion is determining which quantum processes can be efficiently simulated
by a classical computer.
We recently had Hakop Pashayan vist QuICS, who revealed to us some of the intricacies involved in
this process.
In their paper Hakop et al. explain the concept of ε-simulation[^hakop1].
For any quantum circuit $\mathcal C$ there exists some probability distribution $\mathcal P_\mathcal C$ over the outcomes $X=(X_1, X_2, …, X_k)$,
which is just a classical random variable.
Any noiseless circuit $\mathcal C$ can be described as starting with the product state $ρ_1 ⊗ … ⊗ ρ_n$
on $n$ qubits,
followed by some unitary operation $U$, and finally measuring qubits $1$ through $k$.
For example, one could ask the question what is the probability of measuring $(X_0, X_1) = (1,0)$ ignoring $X_2,…X_k$?
Or in other words, what is $\mathcal P(X_0 = 1, X_1 = 0)$?
An algorithm that can produce the answer to this (and similar) questions is called a _strong simulator_.
This is quite a powerful notion, since it is more powerful than a theoretical quantum computer
which can only produce a sample from the output distribution.
A slightly weaker notions is that of _weak simulation_:
output a sample in accordance with the output distribution $\mathcal P_\mathcal C$.
Even constructing a _weak simulator_ is probably too lofty of a goal,
because no real quantum computer will be completely noiseless
and thus cannot sample exactly from $\mathcal P_\mathcal C$.

![A general quantum circuit]({{ site.url }}/img/quantum-simulation-circuit.svg)\\
_A general quantum circuit, with $n$ product state inputs, a unitary evolution,
and then measurements on $k$ of the qubits._
{:.center}

### ε-Simulation
Hakop et al. introduce the notion of ε-simulation,
which allows the simulator to make some ε-sized error in the $L_1$ distance.

**Definition:** $L_1$ norm of discrete probability distributions
: For a discrete probability distribution $\mathcal P$ the $L_1$ norm is defined as

  $$\norm{\mathcal P}_1 = \sum_{i \in \mathcal P} \mathcal{P}(i).$$


  The $L_1$ distance between two discrete probability distributions $\mathcal P$ and $\mathcal Q$
  is then
  
  $$\norm{\mathcal{P} - \mathcal{Q}}_1 = \sum_{i ∈ P} \mathcal P(i) - \mathcal Q(i)$$

  which just takes the vector difference of the two probability distributions.
  (This notion also generalises to other norms, such as the $L_2$ norm and $L_\infty$ norm.)

**Definition:** ε-sampling [^hakop1]
: Let $\mathcal P$ be a discrete probability distribution.
  We say that a classical device or algorithm can ε-sample $\mathcal P$ iff for any $ε>0$
  it can sample from a probability distribution $P^ε$ such that
  $\norm{\mathcal P - \mathcal P^ε}_1 ≤ ε$.
  In addition, its run-time should scale polynomially in $1/ε$.

With the definition of ε-sampling, we can say that an algorithm can ε-simulate a quantum circuit $\mathcal C$
if it can ε-sample from the associated probability distribution $\mathcal P_\mathcal C$.
A result of Hakop et al.[^hakop1] is that an ε-simulator of $\mathcal C$ is indistinguishable from
$\mathcal C$ and also is efficient due to the polynomial run-time constraints.
Not only that, but it is also _necessary_ to be an ε-simulator for any kind of simulation scheme
to be efficient and indistinguishable from $\mathcal C$[^hakopscenario].


### Poly-Boxes and Simulations
To be able to ε-simulate a circuit $\mathcal C$ it is first necessary to estimate the probabilities
for some outcomes of the its output probability distribution $\mathcal P_\mathcal C$.
A _poly-box_ is a metaphorical device that estimates such probabilities in polynomial time.
It is (presumably) not possible to efficiently estimate probabilities for general quantum circuits using 
a classical computer, but it may be possible to construct poly-boxes for certain restricted circuit
families.

**Definition:** Poly-box
: Given is a family of quantum circuits $\mathbb S = \set{\mathcal C_a \middle| a ∈ Σ^\*}$
with the associated family of probability distributions
$\mathbb P = \set{\mathcal P_\mathcal C \middle| \mathcal C ∈ \mathbb S}$
for $Σ$ some finite alphabet.
Then a poly-box is a classical algorithm that can estimate $\mathcal P(S)$
for all $\mathcal P ∈ \mathbb P$,
output strings $S ∈ \set{0,1,\bullet}^{n+1}$ with "$\bullet$" a "don't care",
number of samples $s ∈ ℕ$ efficiently in $s$ and the number of qubits $n$.

Circuit families must admit a poly-box to be ε-simulable,
but it is not sufficient.
There is a fairly simple example of a circuit that does admit a poly-box
but does not admit an ε-simulator (unless $BQP ⊆ BPP$).
Let us define a circuit $\mathcal C_e$ that takes in some quantum circuit description $a ∈ Σ^\*$.
The circuit $\mathcal C_e$ samples a single bit from the quantum circuit $\mathcal C_a$.
Note that efficiently producing this single bit clasically
is already hard for universal quantum circuits!
Finally, $\mathcal C_e$ samples a uniform string $Y ∈ \set{0,1}^n$ and outputs
$(X ⊕ \text{Parity}(Y), Y) ∈ \set{0,1}^{n+1}$.
Basically, we are obfuscating the hard-to-produce $X$ with a uniform $Y$,
but given the entire output it is easy to figure out $X$.
(Compute Parity$(Y)$ and XOR that together with the first output bit.)

The real kicker, however, is that $C_e$ is not ε-simulable,
because if it were then it would be possible to sample $X$ (and that's hard).
But it is actually easy to construct a poly-box for $C_e$ for any given error $0<ε≤1$:

1. If there are $0<k≤n+1$ "don't cares" in the string $S ∈ \set{0,1,\bullet}^{n+1}$
for which we need to estimate the probability $\mathcal P(S)$ then output $1/2^{n+1-k}$ as a guess.
1. Otherwise, if $ε < 1/2^n$ then explicitly compute the quantum probability $p=P(X=1)$.
This will take time $O(1/2^n) ⊆ O(ε^{-1})$ so it is still efficient in $ε^{-1}$.
1. Large ε: if $ε ≥ 1/2^n$ simply output $p=1/2^{n+1}$ as a guess.

Now through some straightforward computation you can show that in all three cases
this does meet the requirements of a poly-box as it is sufficiently close to the real $P(S)$.
The problem here is that we have thinned the probability of any one string occurring so much
that for a sufficiently low error ε it becomes easier to compute the quantum probability explicitly.

If we have another condition which assures us that there are only a few relevant outputs,
i.e. the outputs are _sparse_,
then if there exists a poly-box we can ε-simulate the circuit family.
The _poly-sparsity_ of discrete probability distributions and families is sufficient,
that is (roughly),
there must be some polynomial upper bound in the error $ε^{-1}$
and size of the string $n$,
$O\left(\text{poly}(n/\epsilon)\right)$, on the number of relevant outputs.
An output is relevant if it has a larger probability mass than ε.

**Theorem 1**[^hakop1] : "Let $\mathcal C$ be a family of quantum circuits with corresponding probability
distributions $\mathbb P$.
Supose there exists an efficient  poly-box over $\mathcal C$, and $\mathbb P$ is poly-sparse.
Then, there exists an $\epsilon$-simulator of $\mathcal C$."

*Proof*: Let $a \in \Sigma^*$ and $\epsilon > 0$.
From the poly-box for all $S \in \set{0,1,\bullet}^n$ over the circuit family $\mathcal C$
we have a polynomial-time algorithm to efficiently estimates probabilities from the probability distribution $P_a(S)$.
Using the poly-box construction above it is also possible to efficiently estimate probabilities from the $\epsilon$-close (in $L_1$ distance) distribution $P^\epsilon_a(S)$.
And because of poly-sparsity of $\mathcal C$ there exists a $P^\epsilon_a$
with a polynomial upper bound $t = O\left(\text{poly}(\epsilon^{-1})\right)$
on relevant outputs.
So we construct an $\epsilon$-simulator for $\mathcal C$ by reconstructing the probability distribution over the $t$ possible outcomes in the poly-sparse $P^\epsilon_a$.
We can do this by recursively searching $S$ using "don't cares" for the $t$ relevant outcomes (the rest has probability mass 0) in polynomial time[^schwarz2013].
With $P^\epsilon_a$ explicitly computed it is straightforward to sample from it. $\square$

*[QuICS]: Joint Center for Quantum Information and Computer Science
*[product state]: Uncorrelated quantum state.
*[alphabet]: A set of characters. For example {0,1} is the binary alphabet. Usually combined with * to indicate zero or more repetitions of characters in the alphabet.
*[parity]: The parity of a bit string is the XOR of all bits together.

[^hakop1]: Pashayan, Hakop, Stephen D. Bartlett, and David Gross. "From estimation of quantum probabilities to simulation of quantum circuits." [arXiv:1712.02806 [quant-ph]](https://arxiv.org/abs/1712.02806) (2017).
[^hakopscenario]: Hakop et al.[^hakop1] describe a specific hypothesis testing scenario for which they show this two-way implication.
[^schwarz2013]: Schwarz, Martin, and Maarten Van den Nest. "Simulating quantum circuits with sparse output distributions." [arXiv:1310.6749 [quant-ph]](https://arxiv.org/abs/1310.6749) (2013).

## Separating Quantum from Classical
A natural question to ask after looking at simulating quantum processes is
what _can't_ we simulate?
Where is there a _quantum advantage_?
Recently there has been a lot of work on trying to come up with such an algorithm that
is believed to be both hard to simulate classically (e.g. by some complexity results)
and also easy to implement on an existing quantum computer.
We will look at _Instantaneous Quantum Polynomial-time_ (IQP)[^iqp1],
but there is multitude of approaches that may be covered in later blog posts.

### Instantaneous Quantum Polynomial-time (IQP)
An approach to showing a quantum advantage referred to as IQP is
to perform a diagonal unitary in the $X$-basis on an input in the Hadamard basis ($\ket +, \ket -$).
Alternatively, we could describe a unitary $D$ diagonal in the $Z$-basis
and conjugate with $H^{\otimes n}$,
thus we get $\mathcal C_w = H^{\otimes n} D_w H^{\otimes n}$ for some string $w \in \Sigma^{\*}$
where the language $\Sigma^{\*}$ describes circuits in the family $\set{C_w}$.
This turns out to be difficult to simulate for classical computers under suitable hardness assumptions [^iqpnoise].
We will show the main result from [^iqp1]: If it is possible weakly classically simulate
IQP circuits to within multiplicative error,
then the Polynomial Hierarchy would collapse to the third level.

The Polynomial Hierarchy is an infinite hierarchy of complexity classes
of increasing computational power.
It uses the notion of an _oracle_,
a black box that can be queried in one time step for an answer in its complexity class.
For complexity classes $A$ and $B$ we have that $A^B$ is an algorithm in $A$
with access to an oracle for $B$,
i.e. it can decide any language in $B$ by querying the oracle in one time step.
Now let the polynomial hierarchy be defined as
$\Delta_{k+1} = P^{N\Delta_k}$, with $\Delta_1 = P$ and $N\Delta_k$ the nondeterministic class
associated to $\Delta_k$ (like $NP$ is associated to $P$).
It is know that if $\Delta_i = \Delta_{i+1}$ for some $i$ then $\Delta_i = \Delta_j$ for all $j > i$.
This is usually referred to as a collapse of the polyomial hierarchy to the $i$-th level.
Such a collapse is not expected to be the case
and is often likened to $P = NP$ (a collapse to the first level)
though less extreme.

Another notion that we need is post-selection.
We can view this as running a probabilistic circuit and asserting that the outcomes on
the post-selected wires will all be zero before looking at the output wires.
This is of course not a natural assumption, since if you were to run the circuit
you are in no way guaranteed that the outputs on those wires will be zero.
Nonetheless, it is a useful notion as we will see later.
But first let us define post-selected circuits more formally.

**Definition:** Post-selected Complexity Classes[^iqp1]
: A language $L$ is in $\text{Post-}A$ for complexity class $A$ (either $BPP$, $BQP$, or $IQP$)
if and only if there is an error tolerance $0 < \epsilon < 1/2$
and a family of circuits ${\mathcal C_w}$ of post-selected $A$ circuits
with outputs $\mathcal O_w$ and post-selection wires $\mathcal P_w$ such that
* if $w \in L$ then $\Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0 \right] \geq 1 - \epsilon$ and
* if $w \not\in L$ then $\Pr\left[\mathcal O_w = 0 \middle\vert \mathcal P_w = 0\ldots 0 \right] \geq 1 - \epsilon$.

It is known that $\text{Post-}BPP \subseteq \Delta_3$.
Because $P^{P^C} = P^C$ we have

$$P^{\text{Post-}BPP} \subseteq P^{\Delta_3} = \Delta_3.$$

Furthermore by results of Aaronson and Toda's Theorem we get

$$PH \subseteq P^{\text{Post-}BQP}.$$

Bremner, Jozsa and Shepherd[^iqp1] showed that $\text{Post-}IQP = \text{Post-}BQP$.
We will then show that if $IQP$ circuits could be weakly simulated we will also show this implies
$\text{Post-}BPP = \text{Post-}BQP$
thus resulting in a collapse of the Polynomial Hierarchy to the third level.

**Theorem 2:** If the output distributions of families of $IQP$ circuits could be weakly simulated
to within multiplicative error $1\leq c < \sqrt{2}$ then $\text{Post-}BPP = \text{Post-}BQP$.

*Proof:*
Let $L \in \text{Post-}IQP$ decided by a post-selected circuit family $\set{C_w}$
with post-selection wires $\mathcal P_w$ and output wire $\mathcal O_w$.
From our definition of $\text{Post-}IQP$ we have

$$\Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \begin{cases}
\geq 1 - \epsilon & \text{if $x\in L$},\\
\leq \epsilon & \text{if $x\not\in L$}.
\end{cases}$$

for some $0 < \epsilon < 1/2$.
Now let $\mathcal Y_w$ be all $m$ output wires of $\mathcal C_w$.
We assumed that there exists a classical randomize weak simulator of $\mathcal C_w$
called $\widetilde{\mathcal C_w}$,
with associated output wires $\widetilde{\mathcal O_w}$ and $\widetilde{\mathcal P_w}$,
such that we can weakly sample from the approximate $\widetilde{\mathcal Y_w}$ with

$$\frac{1}{c} \Pr\left[\mathcal Y_w = y_1\ldots y_m\right]
\leq \Pr\left[\widetilde{\mathcal Y_w} = y_1\ldots y_m\right]
\leq c \Pr\left[\mathcal Y_w = y_1 \ldots y_m\right]$$

for a multiplicative error $c$.
This also holds for any subsets of registers of $\widetilde{\mathcal Y_w}$
such as $\widetilde{\mathcal O_w}$ and $\widetilde{\mathcal P_w}$.
Now we have by Born's rule

$$\Pr\left[\widetilde{\mathcal O_w} = 0 \middle\vert \widetilde{\mathcal P_w} = 0 \ldots 0\right]
= \frac{\Pr\left[\widetilde{\mathcal O_w} = 0 \land \widetilde{\mathcal P_w} = 0 \ldots 0\right]}{\Pr\left[\widetilde{\mathcal P_w} = 0 \ldots 0\right]}\\
\leq c^2 \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right]$$

and a similar calculation shows

$$\frac{1}{c^2} \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right]
\leq \Pr\left[\widetilde{\mathcal O_w} = 0 \middle\vert \widetilde{\mathcal P_w} = 0 \ldots 0\right].$$

We have

$$\begin{cases}
w\in L: \Pr\left[\widetilde{O_w} = 1 \middle\vert \widetilde{P_w} = 0 \ldots 0\right] \geq \frac{1}{c^2} \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \geq \frac{1}{c^2}\left(1-\epsilon\right)\\
w\not \in L: \Pr\left[\widetilde{O_w} = 1 \middle\vert \widetilde{P_w} = 0 \ldots 0\right] \leq {c^2} \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \leq c^2 \epsilon\\
\end{cases}.$$

We just need to adjust $c$ to make sure that $L$ can be decided in $\text{Post-}BPP$:
I.e. there is constant-sized gap between $w\in L$ and $w\not \in L$ decisions
and we decide correctly more often than not.
So we get $1/c^2 (1-\epsilon) > 1/2$ for $w \in L$, leading to $c^2/2 < 1-\epsilon$.
Since $0 < \epsilon < 1/2$ we have that $1 \leq c < \sqrt{2}$ suffices
to show $L \in \text{Post-}BPP$.$\square$

The main result follows directly from the previous Theorem and facts stated directly prior to it.

**Corrolary 3:**
If there is a weak simulator of families of $IQP$ circuits to within
multiplicative error $1 \leq c < \sqrt{2}$ then
the Polynomial Hierarchy would collapse to the third level.

*Proof*:
We have

$$PH \subseteq P^{\text{Post-}BQP} = P^{\text{Post-}IQP} \subseteq P^{\text{Post-}BPP} \subseteq \Delta_3. \square$$

## Conclusion
We have shown that even for extremely limited quantum circuits such as $IQP$ circuits
(they are far from universal)
it is unlikely that these could be weakly simulated classically.
We can base this on the fact that otherwise the Polynomial Hierarchy
would collapse to the third level.

However, we have also shown that when noise enters the system it can become easy to approximate
and we have introduced the notion of $\epsilon$-simulation to more precisely capture
the notion of classically sampling from quantum circuits.
There are follow-up results[^iqpnoise] that do indeed show that $IQP$ circuits with noise
become easy to simulate classically.
But at the same time they introduce new notions of fault-tolerance to correct for this.
It is clear that the research is still looking for new ways to precisely defines
what it means to have a _quantum advantage_.



[^boson1]: Aaronson, Scott, and Alex Arkhipov. "The computational complexity of linear optics." Proceedings of the forty-third annual ACM symposium on Theory of computing. ACM, 2011. {% include doi.html doi='10.1145/1993636.1993682' %}
[^iqp1]: Bremner, Michael J., Richard Jozsa, and Dan J. Shepherd. "Classical simulation of commuting quantum computations implies collapse of the polynomial hierarchy." Proceedings of the Royal Society of London A: Mathematical, Physical and Engineering Sciences. The Royal Society, 2010. {% include doi.html doi='10.1098/rspa.2010.0301' %}
[^iqpnoise]: Bremner, Michael J., Ashley Montanaro, and Dan J. Shepherd. "Achieving quantum supremacy with sparse and noisy commuting quantum computations." Quantum 1 (2017): 8. {% include doi.html doi='10.22331/q-2017-04-25-8' %}


## Conclusion
