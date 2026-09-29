# LinkedIn Launch Post

*Copy and paste directly to LinkedIn. Attach the 4-panel graphic `research/experiments/phase1_linkedin_showcase.png`.*

---

Why I'm training RL agents on a fruit fly's brain (and why it actually works)

---

### [HOOK]
I was tired of reading "bio-inspired AI" papers that treat neuroscience like an aesthetic mood board. 

Lots of hand-wavy biological analogies, a few standard fully connected layers, zero actual physical rigor. 

Then Google and HHMI released the fruit fly connectome — an actual circuit diagram of 166,000 real neurons and 125 million synapses. And I thought: what if I just... used it? 

Not as "inspiration." As the literal neural network architecture.

---

### [WHY ARE WE DOING THIS?]
Evolution spent hundreds of millions of years engineering navigation circuits for tiny creatures with severe compute and energy budgets. 

A fruit fly navigates 3D air currents, tracks odors, dodges predators, and finds food with a brain smaller than a grain of salt. Meanwhile, our artificial RL agents often take millions of gradient descent steps just to learn how to keep a coordinate frame straight.

If biology has already figured out an optimal wiring diagram for spatial navigation, why are we forcing our models to rediscover it from random initialization? 

If biological architecture is actually superior, that difference should show up directly in the empirical data.

---

### [HOW ARE WE GONNA DO IT?]
We pulled the synaptic wiring of the fruit fly's Central Complex (CX) — the brain region specifically responsible for heading direction, steering, and spatial vector integration.

Here's the technical setup:
1. **The Circuit**: We extracted the ~1,243 neuron recurrent subcircuit from the FlyEM male-cns:v1.0 dataset.
2. **The Constraint**: Instead of a standard learnable hidden layer, the recurrent weights are topologically locked to real synapses. Non-zero weights are initialized from biological synapse counts and completely frozen. The agent cannot cheat by changing the physical wiring.
3. **The Task**: A 3D continuous navigation environment where the agent must steer toward dynamic spatial targets using sensory inputs (position, target vector, heading, step feedback).
4. **The Algorithm**: PPO (Proximal Policy Optimization). Same learning algorithm, same environment, same rewards across every test.

We then ran a full ablation suite against three control conditions:
- An unconstrained baseline MLP (standard deep learning)
- A "Random Weights" agent (same graph sparsity, but randomized synaptic strengths)
- A "Pruned" agent (where we cut away up to 50% of the weakest synapses)

---

### [WHAT ARE WE GONNA DO? / WHAT DID WE FIND?]
The connectome agent works. And the data shows three distinct findings:

1. **It learns ~17% faster**: The connectome-constrained agent reached 90% peak reward in 1,200 episodes, beating the unconstrained baseline by 250 episodes. The biological wiring acts as an inductive bias that gives the agent an immediate head start.
2. **The biological weights actually matter**: When we kept the topology but scrambled the synapse strengths, performance dropped by 7.4% and training took 50% longer. The exact weight values evolution settled on carry real functional information.
3. **It's surprisingly fault-tolerant**: When we pruned away 50% of the weakest synapses, performance only dipped by ~3.5%. The core navigation engine runs on a resilient backbone of high-weight hub neurons.

---

### [WHERE TO SEE IT]
Everything is open-source and reproducible:
- 🌐 **Interactive 3D Web Visualizer**: You can explore the 1,243 Central Complex neurons in your browser, step through agent replays, and watch the connectome activate in real-time.
- 💻 **GitHub Repository**: Complete with PyTorch code, automated test suite, and 4 step-by-step Jupyter notebooks.

Check out the repo here: [YOUR_GITHUB_LINK]
Play with the live 3D demo here: [YOUR_DEMO_LINK]

Would love your thoughts, critique, or ideas on scaling this to whole-brain circuits.

#MachineLearning #ReinforcementLearning #Neuroscience #ArtificialIntelligence #DeepLearning #OpenSource
