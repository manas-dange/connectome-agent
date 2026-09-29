# Twitter / X Launch Thread

1/ Most "bio-inspired AI" is hand-wavy marketing: lots of biological buzzwords, zero real physical rigor.

When @GoogleAI + @JaneliaScience released the fruit fly connectome (166k neurons, 125M synapses), I wondered: 

What happens if we use the literal wiring diagram as our network architecture? 🧵👇

2/ The fruit fly's Central Complex (CX) is a navigation marvel: heading compass, vector steering, and distance tracking in ~1,200 neurons.

I extracted this subcircuit and constrained an RL agent's recurrent layer to match it. No learned wiring. Real synapses, frozen.

3/ We trained the agent on a 3D navigation task using PPO and ran an ablation suite:
• Connectome-Constrained (real topology + weights)
• Random Weights (same graph, randomized synapses)
• Pruned (top 50% synapses)
• Baseline (unconstrained MLP)

4/ Finding 1: Connectome agents learn ~17% faster.
They reach 90% peak reward in 1,200 episodes vs. 1,450 for the baseline. 
The physical circuit acts as an inductive bias, skipping the trial-and-error of discovering spatial coordinate frames.

5/ Finding 2: Weights matter, not just sparsity.
Scrambling synapse values on the exact same graph dropped reward by 7.4% and slowed training by 50%. The biological weights carry real functional value.

6/ Finding 3: Biological circuits are remarkably resilient.
Pruning away 50% of the weakest synapses resulted in only a 3.5% performance drop. The circuit relies on a robust backbone of hub neurons.

7/ I also built an interactive 3D web visualizer (React + Three.js) where you can fly through all 1,243 neurons and watch the agent navigate in real time.

All code, data, and notebooks are open-source:
🌐 Demo: [LINK]
💻 GitHub: [LINK]
