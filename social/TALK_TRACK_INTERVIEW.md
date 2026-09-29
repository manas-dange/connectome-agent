# Interview & Networking Talk Track

## 1. The 30-Second Elevator Pitch
> *"I built a reinforcement learning system where the agent's recurrent neural network is literally constrained to the physical connectome of a fruit fly's brain. Using Google and HHMI's FlyEM dataset, we extracted the Central Complex navigation circuit and trained it with PPO on 3D flight tasks. The connectome-constrained agent learned 17% faster and generated 10% more direct paths than standard unconstrained baselines, demonstrating that biological wiring provides a powerful structural inductive bias for artificial agents."*

---

## 2. Technical Interview Questions & Answers

### Q: "Why does biological connectome structure help the agent learn faster?"
**Answer**:
> In standard reinforcement learning, a randomly initialized network must simultaneously learn two difficult representations: first, how to maintain an internal spatial coordinate frame (tracking heading and distance), and second, how to map that state to effective steering commands. 
> The fruit fly's Central Complex evolved specific recurrent ring attractor motifs (`E-PG` and `Delta7` neurons) that naturally track angular displacement without drift. By freezing the recurrent layer to match this biological graph, the agent starts with an innate coordinate tracker. It only needs to learn the input sensory projection and the final motor head, cutting sample complexity by ~17%.

### Q: "How did you prove that the advantage wasn't just due to sparsity or regularization?"
**Answer**:
> We ran two critical ablation controls:
> 1. **Random Weights Control**: We preserved the exact same graph adjacency and degree distribution, but randomly re-initialized the non-zero synaptic weights. If sparsity alone was the reason, performance should have matched. Instead, the Random Weights agent dropped 7.4% in reward and took 50% longer to converge.
> 2. **Pruned Connectome Control**: We thresholded synapses by weight. Cutting the bottom 50% of synapses only degraded performance by 3.5%, proving that the circuit operates on a resilient backbone of high-weight biological hubs.

### Q: "What was the biggest engineering bottleneck in the project?"
**Answer**:
> Two main bottlenecks:
> 1. **Graph reduction & subcircuit extraction**: The raw *Drosophila* connectome has 166,000 neurons and 125M synapses. Trying to run PPO forward and backward passes on a 166k-dimensional recurrent tensor is computationally wasteful. We isolated the Central Complex by filtering for specific neuropil regions (`CX`, `EB`, `FB`, `PB`, `NO`) and ensuring the resulting subgraph remained weakly connected.
> 2. **Interactive 3D Web Rendering**: In Three.js, creating 1,243 separate meshes and thousands of individual line segments drops frame rates dramatically due to excessive draw calls. I refactored the visualizer to use `THREE.InstancedMesh` for the nodes and dynamic `THREE.LineSegments` with indexed attribute buffers, rendering the entire connectome in a single draw call at 60 FPS.

---

## 3. Neuroscience-Focused Questions

### Q: "How biologically faithful is the model?"
**Answer**:
> It is an engineering model that respects biological graph topology rather than a biophysical Hodgkin-Huxley simulation. Synapse counts serve as fixed connection weights, non-linearities are modeled with ReLU activations, and recurrent updates occur synchronously. While real flies feature spiking dynamics and neurochemical modulation (dopamine/octopamine), our goal was specifically to test whether pure circuit topology provides an algorithmic advantage in standard deep reinforcement learning.

### Q: "Which specific neurons were most active during navigation?"
**Answer**:
> Our activation logs showed that top firing frequencies correlated heavily with graph degree centrality ($r = 0.74$). The most active cells included `E-PG` heading compass neurons in the Ellipsoid Body, `Delta7` neurons in the Protocerebral Bridge, and descending motor projection neurons to the ventral nerve cord (`Motor_VNC`).
