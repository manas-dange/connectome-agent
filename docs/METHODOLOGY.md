# Technical Methodology: Connectome-Constrained Reinforcement Learning

This document outlines the theoretical, mathematical, and algorithmic foundations of the **Connectome-Powered Navigation Agent**.

---

## 1. Connectome Data Acquisition & Graph Construction

### 1.1 Biological Source
We draw from the *Drosophila melanogaster* connectome published by the **FlyEM Project** at HHMI Janelia in partnership with Google Research (`male-cns:v1.0`). The full dataset contains approximately 166,000 neurons and 125 million chemical synapses digitized using high-resolution serial section transmission electron microscopy (ssTEM) and automated segmentation.

### 1.2 Region of Interest (ROI) Selection: The Central Complex (CX)
Training reinforcement learning policies on a 166,000-dimensional recurrent hidden state is computationally intractable for fast iteration and unnecessary for localized behavior. We isolate the **Central Complex (CX)**, an evolutionary conserved neuropil consisting of:
- **Ellipsoid Body (EB)**: Encodes heading direction (compass ring attractor system).
- **Fan-shaped Body (FB)**: Coordinates goal-directed steering and spatial vector integration.
- **Protocerebral Bridge (PB)**: Distributes sinusoidal activity bumps.
- **Noduli (NO)**: Integrates self-motion cues (speed and acceleration).

The extracted subgraph $G = (V, E)$ contains:
- **Neurons ($|V|$)**: 1,243 to 2,847 nodes depending on degree thresholding.
- **Synapses ($|E|$)**: ~15,234 directed edges with synapse weight $\ge 5$.
- **Adjacency Normalization**:
  $$W_{ij} = \log(1 + \text{Synapses}(i \to j))$$
  Synaptic counts in biological brains follow a heavy-tailed log-normal distribution. Logarithmic scaling prevents numerical overflow and dampens high-degree hub dominance while preserving relative hierarchy.

---

## 2. Neural Architecture: Inductive Biases vs. Learned Representations

### 2.1 The Connectome-Constrained Recurrent Cell
Standard recurrent architectures (RNN, GRU, LSTM) parameterize the recurrent transition matrix $W_{hh} \in \mathbb{R}^{H \times H}$ as a dense, fully learnable matrix initialized randomly.

In our **Connectome-Constrained Agent**:
1. **Topology is Fixed**: $W_{hh}$ is masked by the adjacency matrix of the connectome:
   $$W_{hh} = W_{\text{connectome}} \odot M_{\text{adj}}$$
   where $M_{\text{adj}} \in \{0, 1\}^{N \times N}$ is the binary adjacency mask.
2. **Weights are Initialized Biologically**: Non-zero entries are set to normalized biological synapse counts.
3. **Recurrent Weights are Frozen**: $W_{hh}$ has `requires_grad = False`. The agent cannot rewrite the biological circuit; it must learn to route signals through the fixed structural pathways.

```
                  ┌──────────────────────────────────────────────┐
                  │              Observation (10D)               │
                  │  [Agent Pos (3D), Target (3D), Dist, Angle,  │
                  │   Prev Action, Prev Action One-Hot]          │
                  └──────────────────────┬───────────────────────┘
                                         │ Trainable W_in (Linear)
                                         ▼
                  ┌──────────────────────────────────────────────┐
                  │    Hidden Connectome State h_t (1,243D)      │
                  │                                              │
                  │  h_t = ReLU( W_in * x_t + W_connectome * h_{t-1} )
                  │           (W_connectome is FROZEN)           │
                  └──────────────┬────────────────┬──────────────┘
                                 │                │
             Trainable W_policy  │                │ Trainable W_value
                                 ▼                ▼
                     ┌────────────────┐     ┌──────────────┐
                     │ Action Probs   │     │ State Value  │
                     │ Categorical(4) │     │ V(s) in R    │
                     └────────────────┘     └──────────────┘
```

### 2.2 Ablation Controls
To rigorously verify whether advantages stem from biological topology, specific synaptic strengths, or simple parameter reduction, we implement four distinct agent classes:

1. **Connectome-Constrained Agent**: Biological graph topology + biological synapse weights (frozen).
2. **Random Weights Agent (Topology Control)**: Biological graph topology preserved, but non-zero synaptic weights are randomly shuffled/re-initialized.
3. **Pruned Connectome Agent**: Synapses thresholded by weight percentile (e.g., top 50% or top 10% strongest connections kept).
4. **Baseline Agent (Unconstrained)**: A standard multi-layer perceptron (MLP) with two dense layers (64 units each, ReLU) where all weights are learned without structural constraints.

---

## 3. Environment Formulation: 3D Flight Navigation

The agent is placed in a bounded 3D continuous volume $[-50, 50]^3$ representing a spatial foraging arena.

### 3.1 State Space $\mathcal{S} \in \mathbb{R}^{10}$
At each timestep $t$, the observation vector consists of:
1. Agent position vector: $\mathbf{p}_t = [x_t, y_t, z_t]$
2. Goal position vector: $\mathbf{g} = [x_g, y_g, z_g]$
3. Euclidean distance to goal: $d_t = \|\mathbf{g} - \mathbf{p}_t\|_2$
4. Relative horizontal heading angle to goal: $\theta_t = \text{atan2}(y_g - y_t, x_g - x_t) - \psi_t$
5. Previous discrete action: $a_{t-1} \in \{0, 1, 2, 3\}$
6. Previous action scalar indicator normalized to $[0, 1]$.

### 3.2 Action Space $\mathcal{A} \in \{0, 1, 2, 3\}$
Four discrete motor commands emulate basic fly flight maneuvers:
- `Action 0 (Forward)`: Advance along current heading $\psi_t$ by step size $\Delta s = 2.0$.
- `Action 1 (Turn Left)`: Rotate heading $\psi_t \leftarrow \psi_t + \Delta \theta$ ($\Delta \theta = 0.25\text{ rad}$).
- `Action 2 (Turn Right)`: Rotate heading $\psi_t \leftarrow \psi_t - \Delta \theta$.
- `Action 3 (Rest / Hover)`: Maintain position.

### 3.3 Reward Function
The reward signal combines goal-seeking incentives with efficiency penalties:
$$R_t = R_{\text{arrival}} + R_{\text{progress}} + R_{\text{step}}$$
- **Arrival Bonus**: $+100$ if $d_t \le 3.0$ (success termination).
- **Progress Bonus**: $+1.0 \times (d_{t-1} - d_t)$ (shaping reward encouraging direct approaches).
- **Step Penalty**: $-0.1$ per step to encourage minimum-time trajectories.

---

## 4. Reinforcement Learning: Proximal Policy Optimization (PPO)

Both policy and value heads are trained using PPO with generalized advantage estimation (GAE):

$$\mathcal{L}^{\text{CLIP}}(\theta) = \hat{\mathbb{E}}_t \left[ \min\left( r_t(\theta)\hat{A}_t, \, \text{clip}(r_t(\theta), 1-\epsilon, 1+\epsilon)\hat{A}_t \right) \right]$$

where probability ratio $r_t(\theta) = \frac{\pi_\theta(a_t|s_t)}{\pi_{\theta_{\text{old}}}(a_t|s_t)}$ and clipping parameter $\epsilon = 0.2$.

Total loss incorporates value function squared-error loss and an entropy bonus for exploration:
$$\mathcal{L}_{\text{total}}(\theta) = -\mathcal{L}^{\text{CLIP}}(\theta) + c_1 \mathcal{L}^{\text{VF}}(\theta) - c_2 \mathcal{S}[\pi_\theta](s_t)$$
with $c_1 = 0.5$, $c_2 = 0.01$, and learning rate $\alpha = 3 \times 10^{-4}$ optimized with Adam.

---

## 5. Evaluation Metrics

1. **Learning Speed**: Number of training episodes required to consistently achieve $90\%$ of peak cumulative reward.
2. **Path Efficiency ($\eta$)**:
   $$\eta = \frac{\|\mathbf{p}_{\text{init}} - \mathbf{p}_{\text{final}}\|_2}{\sum_{t=1}^{T} \|\mathbf{p}_t - \mathbf{p}_{t-1}\|_2}$$
   An ideal straight-line path has $\eta = 1.0$. Winding or exploratory paths yield $\eta \ll 1.0$.
3. **Neuron Activation Sparsity & Centrality Correlation**:
   Pearson correlation coefficient between node degree centrality in the connectome and empirical firing frequency during successful episodes.
