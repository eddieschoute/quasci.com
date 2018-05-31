---
layout:     post
title:      Classical vs Quantum Computation
date:       2018-05-07 16:38:05
summary:    It is believed that quantum computers provide some advantage over classical computers,
    but do they really? We will look at both closing the gap between classical and quantum
    and at solidifying it.
categories: algorithms advantage complexity
---

The IBM ThinkQ conference was held recently in New York with a focus on near-term quantum computing applications.
It seems that businesses have successfully been developing larger quantum computers
---we're at around 50 qubits now!--- but are now looking for the "killer app" of small quantum computers.
There were some variations on the "what to do with your quantum computer" theme
and I will talk about some of the applications that were discussed.

All talks and recordings of them are available at the [online schedule](https://www.research.ibm.com/ibm-q/thinkq/agenda.html).

A _quantum advantage_ refers to some applications where a quantum computer performs some computation
that a classical computer currently cannot perform.
Previously known as _quantum supremacy_, it has now been renamed after an internal discussion
within the community about its political correctness[^supremacydiscussion].

So far we actually do not know unconditionally if quantum computing is actually more powerful than classical
(i.e. $BQP \not\subseteq BPP$).
But through the problems of Boson Sampling[^boson1] and Instantaneous Quantum Polynomial-time (IQP) circuits[^iqp1]
we do know that the polynomial hierarchy ($PH$) must collapse if classical computers can solve them efficiently.

[^supremacydiscussion]: See e.g. one of the most heated [discussions](https://scirate.com/arxiv/1705.06768) I've seen on Scirate, which also touches on the Latin origin of the term _ancilla_ ("housemaid", colloquially: helper qubit). While almost certainly an internet troll, _ancilla the supremacist_ has become somewhat of a joke in my environment so I guess it has served its purpose.


## Simulating Quantum Processes
One side of the discussion looks at determining which quantum processes can be efficiently simulated
by a classical computer.
We recently had Hakop Pashayan vist QuICS,
who revealed to us some of the intricacies involved in this line of research.
In their paper, Hakop et al. explain the concept of ε-simulation[^hakop1].
For any quantum circuit $\mathcal C$ with fixed inputs there exists some probability distribution
$\mathcal P_\mathcal C$ over the outcomes $X=(X_1, X_2, …, X_k)$,
which is just a classical random variable.
Any noiseless circuit $\mathcal C$ can be described as starting with the product state $ρ_1 ⊗ … ⊗ ρ_n$
on $n$ qubits,
followed by some unitary operation $U$, and finally measuring qubits $1$ through $k$.

For example, one could ask the question what is the probability of measuring $(X_0, X_1) = (1,0)$ ignoring $X_2,…X_k$?
Or in other words, what is $\mathcal P(X_0 = 1, X_1 = 0)$?
An algorithm that can produce the answer to this (and similar) questions is called a _strong simulator_.
This is quite a powerful notion since it is more powerful than a theoretical quantum computer
which can only produce a sample from the output distribution.
A slightly weaker notion is that of _weak simulation_:
Instead of the exact probability,
output a sample in accordance with the output distribution $\mathcal P_\mathcal C$.
Even constructing a _weak simulator_ is probably too lofty of a goal,
because no real quantum computer will be completely noiseless
and thus cannot sample exactly from $\mathcal P_\mathcal C$.
It is therefore maybe unreasonable to expect a classical computer to do either of these
(except for simple circuits)
and we will instead define ε-simulation that relaxes the constraints further.

![A general quantum circuit]({{ site.url }}/img/quantum-simulation-circuit.svg)\\
_A general quantum circuit, with $n$ product state inputs, a unitary evolution,
and then measurements on $k$ of the qubits._
{:.center}

### ε-Simulation
Hakop et al. introduce the notion of ε-simulation,
which allows the simulator to make some ε-sized error in the $\ell_1$ distance.

**Definition:** $\ell_1$ norm and distance for vectors 
: For a vector $\mathbf v$ the $\ell_1$ norm is defined as

  $$\norm{\mathbf v}_1 = \sum_{i \in \mathbf v} \abs{\mathbf v(i)}.$$

  The $\ell_1$ distance between two discrete probability distributions $\mathcal P$ and $\mathcal Q$
  (that are just vectors in some respects) is then
  
  $$\norm{\mathcal{P} - \mathcal{Q}}_1 = \sum_{i ∈ P} \abs{\mathcal P(i) - \mathcal Q(i)}$$

  which just takes the absolute vector difference of the two probability distributions.
  (This notion also generalises to other norms, such as the $\ell_2$ norm and $\ell_\infty$ norm.)

**Definition:** ε-sampling [^hakop1]
: Let $\mathcal P$ be a discrete probability distribution.
  We say that an algorithm can ε-sample $\mathcal P$ iff for any $ε>0$
  it can sample from a probability distribution $P^ε$ such that
  $\norm{\mathcal P - \mathcal P^ε}_1 ≤ ε$.
  In addition, its run-time should scale polynomially in $1/ε$.

We say that an algorithm can ε-simulate a quantum circuit $\mathcal C$
if it can ε-sample from the associated probability distribution $\mathcal P_\mathcal C$.
Basically, an ε-simulator is a weak simulator of a probability distribution that is
ε-close to the real probability distribution.
A result of Hakop et al.[^hakop1] is that an ε-simulator of $\mathcal C$ is indistinguishable from
$\mathcal C$ and also is efficient due to the polynomial run-time constraints.
Not only that, but it is also _necessary_ to be an ε-simulator for any kind of simulation scheme
to be efficient and indistinguishable from $\mathcal C$[^hakopscenario].


### Poly-Boxes and Simulations
To be able to ε-simulate a circuit $\mathcal C$ it is first necessary to estimate the probabilities
for some outcomes of its output probability distribution $\mathcal P_\mathcal C$.
A _poly-box_ is a metaphorical device that estimates such probabilities in polynomial time.
It is (presumably) not possible to efficiently estimate probabilities for general quantum circuits using 
a classical computer, but it may be possible to construct poly-boxes for certain restricted circuit
families.

**Definition:** Poly-box
: Given is a finite alphabet $\Sigma$,
let $\Sigma^\*$ be the strings of $0$ or more characters from $\Sigma$.
Then $\Sigma^\*$ defines a family of quantum circuits
$\mathbb S = \set{\mathcal C_a \middle| a ∈ Σ^\*}$.
The associated family of probability distributions is
$\mathbb P = \set{\mathcal P_\mathcal C \middle| \mathcal C ∈ \mathbb S}$.\\
We want to be able to estimate probabilities for output strings $S ∈ \set{0,1,\bullet}^{n+1}$
with a "$\bullet$" meaning "don't care", $0$ or $1$ are both fine.
Then a poly-box is a classical algorithm that can estimate $\mathcal P(S)$
for all $\mathcal P ∈ \mathbb P$
efficiently in the number of samples $s \in \mathbb N$ and the number of qubits $n$.

_![What does a polybox do]({{ site.url }}/img/polybox.svg)_\\
_With a poly-box we are able to estimate the probability of outcomes for a quantum circuit
in polynomial time.
Additionally, we can estimate marginal probabilities for all strings $S ∈ \set{0,1,\bullet}^{n+1}$
where "$\bullet$" can represents a "don't care": It matches both $0$ and $1$.
The number of samples $s∈ℕ$ can be computed from the intended error $ε$._
{:.center}

#### Poly-boxes are not sufficient for ε-simulation. A counter-example.
Circuit families must admit a poly-box to be ε-simulable,
but it is not sufficient.
We will give a fairly simple example of a circuit that does admit a poly-box
but does not admit an ε-simulator (unless $BQP ⊆ BPP$).
Let us define a circuit $\mathcal C_e$ that takes in some quantum circuit description $a ∈ Σ^\*$.
The circuit $\mathcal C_e$ samples a single bit $X$ from the quantum circuit
described by $a$, $\mathcal C_a$.
(Note that for general quantum circuits it
is already hard to efficiently produce this single bit classically!)
Finally, $\mathcal C_e$ samples a uniform string $Y ∈ \set{0,1}^n$ and outputs
$(X ⊕ \text{Parity}(Y), Y) ∈ \set{0,1}^{n+1}$.[^parityandxor]
Basically, we are obfuscating the hard-to-produce $X$ with a uniform $Y$,
but given the entire output it is easy to figure out $X$.
(Compute Parity$(Y)$ and XOR that together with the first output bit.)

[^parityandxor]: $\text{Parity}(Y) = 1$ iff the number of ones in $Y$ is even. $\oplus$ is the exclusive or.

The real kicker, however, is that $C_e$ is not ε-simulable
because if it were then it would be possible to sample $X$ (and that's hard).
But it is actually easy to construct a poly-box for $C_e$ for any given error $0<ε≤1$:

1. If there are $0<k≤n+1$ "don't cares" in the string $S ∈ \set{0,1,\bullet}^{n+1}$
for which we need to estimate the probability $\mathcal P(S)$ then output $1/2^{n+1-k}$ as a guess.
1. Otherwise, if $ε < 1/2^n$, explicitly compute the probability $P(X=1)$ by brute force.
This will take time $O(2^n) ⊆ O(ε^{-1})$ so it is still efficient in $ε^{-1}$.
1. Large ε: if $ε ≥ 1/2^n$ simply output the probability $1/2^{n+1}$ as a guess.

Now, through some straightforward computation, you can show that in all three cases
this does meet the requirements of a poly-box as it is sufficiently close to the real $P(S)$.
The problem here is that we have thinned the probability of any one string occurring so much
that for a sufficiently low error ε it becomes easier to compute the quantum probability explicitly.

#### Poly-boxes + sparsity = ε-simulation
If, instead, the circuit has only a polynomial number of outcomes with significant probability
then we can ε-simulate like we would want to.
We say that such outcome distributions are _poly-sparse_.
More specifically, there must be a polynomially-sized upper bound on the number of relevant outcomes,
$t = O\left(\text{poly}(n/ε)\right)$, with $n$ the size of the input string and $ε$ the error.
Poly-sparsity guarantees us that there exists a parameter $t$,
so that we can construct a distribution $\mathcal P^ε$
with only $t$ outcomes with non-zero probabilty such that

$$\norm{\mathcal P - \mathcal P^ε}_1 \leq ε .$$

![Epsilon-close probability distribution]({{ site.url }}/img/epsilon-close-probability.svg)\\
_On the left is some probability distribution $\mathcal P$.
On the right we have approximated $\mathcal P$ by an ε-close distribution that is sparser:
We have fewer nonzero entries._
{:.center}

We can estimate the $t$ relevant outcomes with a poly-box for $\mathcal C$
and _explicitly_ reconstruct $\mathcal P^ε$.
This distribution $\mathcal P^ε$ is ε-close to the real output distribution $\mathcal P_{\mathcal C}$
and thus suffices for ε-simulation of $\mathcal C$.

**Theorem 1**[^hakop1] : "Let $\mathcal C$ be a family of quantum circuits with corresponding probability
distributions $\mathbb P$.
Supose there exists an efficient  poly-box over $\mathcal C$, and $\mathbb P$ is poly-sparse.
Then, there exists an ε-simulator of $\mathcal C$."

*Proof*: Let $a \in \Sigma^*$ and $ε > 0$.
The poly-box over the circuit family $\mathcal C$
allows us to efficiently estimate probabilities from the probability distribution
$P_a(S)$ for $S \in \set{0,1,\bullet}^n$.
Using the poly-box construction above and some smart searching using "don't care" values ("$\bullet$"),
it is possible to efficiently estimate probabilities from the
ε-close (in $\ell_1$ distance) distribution $P^ε_a(S)$.
And because of poly-sparsity of $\mathcal C$ there exists a $P^ε_a$
with a polynomial upper bound $t = O\left(\text{poly}(ε^{-1})\right)$
on relevant outputs.
So we construct an ε-simulator for $\mathcal C$ by reconstructing the probability distribution over the $t$ possible outcomes in the poly-sparse $P^ε_a$.
We can do this by recursively searching $S$ using "don't cares" for the $t$ relevant outcomes (the rest has probability mass $0$) in polynomial time[^schwarz2013].
With $P^ε_a$ explicitly computed it is straightforward to sample from it.$\square$

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
to perform a diagonal unitary in the $X$-basis ($\ket 0 \pm \ket 1$)
on the all-zero input $\ket{00\dots 0}$.
Alternatively, we could describe a unitary $D$ diagonal in the $Z$-basis
and conjugate with $H^{\otimes n}$.
A string $w \in \Sigma^{\*}$ then describes the diagonal elements of $D_w$ for  the circuit

$$\mathcal C_w = H^{\otimes n} D_w H^{\otimes n}$$

where the language $\Sigma^{\*}$ describes circuits in the family $\set{C_w}$.
This turns out to be difficult to simulate for classical computers under suitable hardness assumptions [^iqpnoise].
We will show the main result from [^iqp1]:
If it is possible to weakly classically simulate IQP circuits to within a constant multiplicative factor,
then the Polynomial Hierarchy would collapse to the third level.

The Polynomial Hierarchy is an infinite hierarchy of complexity classes
of increasing computational power.
Defining it requires the notion of an _oracle_,
a black box that can be queried in one time step for an answer in its complexity class.
For complexity classes $A$ and $B$, we have that $A^B$ is the set of languages
that can be decided by an algorithm in $A$ with access to an oracle for $B$,
i.e. it can decide any language in $B$ by querying the oracle in one time step.
Now let the polynomial hierarchy be defined as
$\Delta_{k+1} = P^{N\Delta_k}$, with $\Delta_1 = P$ and $N\Delta_k$ the nondeterministic class
associated to $\Delta_k$ (like $NP$ is associated to $P$).
We have that

$$Δ_0 \subseteq Δ_1 \subseteq \dots$$

It is known that if $\Delta_i = \Delta_{i+1}$ for some $i$ then $\Delta_i = \Delta_j$ for all $j > i$.[^aurorabarak]
This is referred to as a _collapse of the polynomial hierarchy_ to the $i$-th level.
Such a collapse is not expected to be the case
and is often likened to $P = NP$ (a collapse to the first level)
though less extreme.

Another notion that we need is post-selection.
We can view this as running a classical or quantum circuit and asserting that the outcomes on
the post-selected wires will all be zero before looking at the output wires.
This is of course not a natural assumption since, if you were to run the circuit,
you are in no way guaranteed that the outputs on those wires will be zero.
Nonetheless, it is a useful notion as we will see later.
But first let us define post-selected circuits more formally.

**Definition:** Post-selected Complexity Classes[^iqp1]
: A language $L$ is in $\text{Post-}A$ for complexity class $A$ (either $BPP$, $BQP$, or $IQP$)
if and only if there is an error tolerance $0 < ε < 1/2$
and a family of circuits ${\mathcal C_w}$ of post-selected $A$ circuits
with output $\mathcal O_w$ and post-selection wires $\mathcal P_w$ such that
* if $w \in L$ then $\Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0 \right] \geq 1 - ε$ and
* if $w \not\in L$ then $\Pr\left[\mathcal O_w = 0 \middle\vert \mathcal P_w = 0\ldots 0 \right] \geq 1 - ε$.

It is known that $\text{Post-}BPP \subseteq \Delta_3$.[^han]
And from $P^{P^A} = P^A$ we have

$$P^{\text{Post-}BPP} \subseteq P^{\Delta_3} = P^{P^{NΔ_2}} = P^{NΔ_2} = \Delta_3.$$

Furthermore, by results of Aaronson and by Toda's Theorem we get
that post-selected quantum decision problems contain the entire polynomial hierarchy, i.e

$$PH \subseteq P^{\text{Post-}BQP}.$$

Bremner, Jozsa and Shepherd[^iqp1] showed that $\text{Post-}IQP = \text{Post-}BQP$.
We will show that if $IQP$ circuits could be weakly simulated that this implies
$\text{Post-}IQP \subseteq = \text{Post-}BPP$,
thus resulting in a collapse of the Polynomial Hierarchy to the third level.
Therefore, it is unlikely that $IQP$ circuits will ever be perfectly simulable by a classical algorithm.

**Theorem 2:**[^iqp1] If the output distributions of families of $IQP$ circuits could be weakly simulated
to within multiplicative error $1\leq c < \sqrt{2}$, then $\text{Post-}IQP \subseteq \text{Post-}BPP$.

*Proof:*
Let $L \in \text{Post-}IQP$ be decided by a post-selected circuit family $\set{C_w}$
where $w \in \Sigma^*$.
We can split the output into post-selection wires $\mathcal P_w$ and output wire $\mathcal O_w$.
From our definition of $\text{Post-}IQP$ we have

$$\begin{cases}\Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \geq 1 - ε & \text{if $w\in L$},\\
\Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \leq ε & \text{if $w\not\in L$}.
\end{cases}$$

for some $0 < ε < 1/2$.
Now let $\mathcal Y_w$ be all $m$ output wires of $\mathcal C_w$.
We assumed that there exists a classical randomized weak simulator of $\mathcal C_w$,
called $\widetilde{\mathcal C}_w$,
with associated output wires $\widetilde{\mathcal Y}_w$ such that

$$\frac{1}{c} \Pr\left[\mathcal Y_w = y_1\ldots y_m\right]
\leq \Pr\left[\widetilde{\mathcal Y}_w = y_1\ldots y_m\right]
\leq c \Pr\left[\mathcal Y_w = y_1 \ldots y_m\right].$$

This also holds for any subsets of registers of $\widetilde{\mathcal Y}_w$
such as the output wire $\widetilde{\mathcal O}_w$ and post-selection wires $\widetilde{\mathcal P}_w$.
Now we have for $x \in \set{0,1}$

$$\Pr\left[\widetilde{\mathcal O}_w = x \middle\vert \widetilde{\mathcal P}_w = 0 \ldots 0\right]
= \frac{\Pr\left[\widetilde{\mathcal O}_w = x \land \widetilde{\mathcal P}_w = 0 \ldots 0\right]}{\Pr\left[\widetilde{\mathcal P}_w = 0 \ldots 0\right]}\\
\leq c^2 \Pr\left[\mathcal O_w = x \middle\vert \mathcal P_w = 0\ldots 0\right], $$

and a similar calculation shows

$$\Pr\left[\widetilde{\mathcal O}_w = x \middle\vert \widetilde{\mathcal P}_w = 0 \ldots 0\right] \geq \frac{1}{c^2} \Pr\left[\mathcal O_w = x \middle\vert \mathcal P_w = 0\ldots 0\right].$$

We combine these two results and fill in $x=1$, together with the first equation in the proof, to get

$$\begin{cases}
w\in L: \Pr\left[\widetilde{\mathcal O}_w = 1 \middle\vert \widetilde{\mathcal P}_w = 0 \ldots 0\right] \geq \frac{1}{c^2} \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \geq \frac{1}{c^2}\left(1-ε\right),\\
w\not \in L: \Pr\left[\widetilde{\mathcal O}_w = 1 \middle\vert \widetilde{\mathcal P}_w = 0 \ldots 0\right] \leq {c^2} \Pr\left[\mathcal O_w = 1 \middle\vert \mathcal P_w = 0\ldots 0\right] \leq c^2 ε.\\
\end{cases}$$

We just need to adjust $c$ to make sure that $L$ can be decided in $\text{Post-}BPP$:
It must decide correctly more often than not,
and there needs to be constant-sized gap between $w\in L$ and $w\not \in L$ decisions,
So we get $1/c^2 (1-ε) > 1/2$ for $w \in L$, leading to $c^2/2 < 1-ε$.
Since $0 < ε < 1/2$, we have that $1 \leq c < \sqrt{2}$ meets these constraints
and are sufficient to show that $L \in \text{Post-}BPP$.$\square$

The main result follows directly from the previous Theorem and facts stated directly prior to it.

**Corollary 3:**[^iqp1]
If there is a weak simulator of families of $IQP$ circuits to within
multiplicative error $1 \leq c < \sqrt{2}$ then
the Polynomial Hierarchy would collapse to the third level.

*Proof*:
We have

$$PH \subseteq P^{\text{Post-}BQP} = P^{\text{Post-}IQP} \subseteq P^{\text{Post-}BPP} \subseteq \Delta_3. \square$$

## Conclusion
We have shown that even for such limited quantum circuits as $IQP$ circuits,
it is unlikely that they could be weakly simulated classically.
We can base this on the fact that otherwise the Polynomial Hierarchy
would collapse to the third level.
And we also introduced the notion of ε-simulation and poly-boxes to more precisely capture
the notion of classically simulating quantum circuits.

There are follow-up results[^iqpnoise] that show that $IQP$ circuits with noise
become easy to simulate classically.
But at the same time they introduce new notions of fault-tolerance to correct for this.
It is clear that the research is still looking for new ways to precisely define
what it means to have a _quantum advantage_.


## References / Notes

[^boson1]: Aaronson, Scott, and Alex Arkhipov. "The computational complexity of linear optics." Proceedings of the forty-third annual ACM symposium on Theory of computing. ACM, 2011. {% include doi.html doi='10.1145/1993636.1993682' %}
[^iqp1]: Bremner, Michael J., Richard Jozsa, and Dan J. Shepherd. "Classical simulation of commuting quantum computations implies collapse of the polynomial hierarchy." Proceedings of the Royal Society of London A: Mathematical, Physical and Engineering Sciences. The Royal Society, 2010. {% include doi.html doi='10.1098/rspa.2010.0301' %}
[^iqpnoise]: Bremner, Michael J., Ashley Montanaro, and Dan J. Shepherd. "Achieving quantum supremacy with sparse and noisy commuting quantum computations." Quantum 1 (2017): 8. {% include doi.html doi='10.22331/q-2017-04-25-8' %}
[^aurorabarak]: Arora, Sanjeev, and Boaz Barak. Computational complexity: a modern approach. Cambridge University Press, 2009.
[^han]: Han, Yenjo, Lane A. Hemaspaandra, and Thomas Thierauf. "Threshold computation and cryptographic security." SIAM Journal on Computing 26.1 (1997): 59-78. {% include doi.html doi='10.1137/S0097539792240467' %}
