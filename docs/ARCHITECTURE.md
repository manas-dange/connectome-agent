# System Architecture & Technical Specifications

This document details the software architecture, data flow pipelines, module interfaces, and file schema specifications of the **Connectome-Powered Navigation Agent** system.

---

## 1. End-to-End System Data Flow

```
                      [HHMI Janelia / Google FlyEM API]
                                     │
                                     ▼
                   research/src/connectome_utils.py
            (ConnectomeData, Graph Ingestion & CX Filtering)
                                     │
                   ┌─────────────────┴─────────────────┐
                   ▼                                   ▼
        research/src/agent.py               research/scripts/export_to_json.py
   (Connectome-Constrained Policy)                     │
                   │                                   ▼
                   ▼                          web/public/data/
       research/src/environment.py          ├── connectome.json
       (3D Navigation Gym Environment)       ├── experiment_results/summary.json
                   │                         └── trajectories/
                   ▼                                   │
         research/src/metrics.py                       ▼
      (Trajectory & Activation Logs)        web/src/components/ConnectomeViewer.jsx
                   │                        (Three.js Hardware Instanced Rendering)
                   ▼                                   │
        research/experiments/                          ▼
      (Weights, CSVs, Visuals)              [Interactive Web Browser Interface]
```

---

## 2. Core Python Modules (`research/src/`)

### 2.1 `connectome_utils.py`
- `ConnectomeData`: Ingestion engine with neuPrint client support and automatic fallback to calibrated Central Complex synthetic data.
- `ConnectomeAnalysis`: Graph-theoretic analytics (in/out degree distributions, density, betweenness/closeness/eigenvector centrality, sensory/motor neuron classification, subgraph extraction).
- `prune_graph_by_weight_threshold`: Percentile-based synapse thresholding for ablation studies.

### 2.2 `agent.py`
- `ConnectomeConstrainedAgent`: Recurrent actor-critic network where recurrent hidden weights $W_{\text{connectome}} \in \mathbb{R}^{N \times N}$ are topologically masked by the connectome and frozen during training.
- `BaselineAgent`: Unconstrained two-layer dense MLP baseline.
- `RandomWeightAgent`: Control condition retaining topological sparsity while re-randomizing non-zero synapse weights.
- `PPOTrainer`: Generalized advantage estimation and clipped surrogate policy gradient optimization.

### 2.3 `environment.py`
- `FlyNavigationEnv`: Gymnasium-compliant continuous 3D navigation arena with bounding boxes, step penalties, angular steering dynamics, and progress shaping rewards.

### 2.4 `metrics.py`
- `MetricsLogger`: Tracks per-episode rewards, lengths, losses, and exports learning curves.
- `compute_path_efficiency`: Computes straight-line to traveled distance ratios.
- `analyze_neuron_activations`: Quantifies firing frequency and correlates it with connectome hub centrality.

---

## 3. Frontend Architecture (`web/src/`)

### 3.1 Three.js 3D Connectome Rendering Engine
- **Hardware Acceleration with `InstancedMesh`**: Rather than creating individual Three.js `Mesh` instances for 1,243 nodes (which would require 1,243 draw calls per frame), all neurons are rendered in a **single draw call** using `THREE.InstancedMesh`.
- **Dynamic Synapse Lines**: High-weight connections are rendered with `THREE.LineSegments` and dynamic pulse opacity proportional to synaptic strength.
- **Agent Trajectory Overlay**: Renders the agent's spatial position, glowing heading indicator, target goal orb with pulsing halo, and a multi-point breadcrumb path trail.

### 3.2 Component Hierarchy
- `App.jsx`: Global state coordinator (selected agent, replay progress, visual layer toggles).
- `Header.jsx`: Project title, GitHub / docs navigation, and quick stats badge.
- `ConnectomeViewer.jsx`: Three.js canvas with OrbitControls, Raycaster hover tooltips, and camera reset.
- `AgentController.jsx`: Play/pause, step slider, replay speed, and agent architecture switcher.
- `MetricsPanel.jsx`: Recharts comparative reward curves, path efficiency bars, and live neuron activation sparklines.
- `ComparisonView.jsx`: Head-to-head trajectory replay comparing Connectome vs. Baseline agents.
- `InfoModal.jsx`: Interactive popup detailing project methodology, biological dataset, and findings.

---

## 4. Data Format Specifications

### 4.1 Connectome JSON (`web/public/data/connectome.json`)
```json
{
  "nodes": [
    {
      "id": 10001,
      "name": "E-PG_0",
      "type": "E-PG",
      "roi": "EB",
      "x": 12.4,
      "y": -4.2,
      "z": 1.1,
      "size": 1840
    }
  ],
  "edges": [
    {
      "source": 10001,
      "target": 10045,
      "weight": 8.0
    }
  ],
  "metadata": {
    "num_nodes": 1243,
    "num_edges": 6820,
    "roi": "CX",
    "version": "male-cns:v1.0"
  }
}
```

### 4.2 Trajectory JSON (`web/public/data/trajectories/<agent_name>/trajectory_1.json`)
```json
{
  "episode": 1,
  "agent_type": "connectome_constrained",
  "reward": 95.8,
  "goal": [35.0, 20.0, 5.0],
  "steps": [
    {
      "step": 0,
      "position": [0.0, 0.0, 0.0],
      "action": 0,
      "reward": 0.4
    }
  ]
}
```

### 4.3 Experiment Results Summary (`web/public/data/experiment_results/summary.json`)
```json
{
  "connectome_constrained": {
    "final_reward": 95.2,
    "final_reward_std": 4.1,
    "mean_path_efficiency": 0.78,
    "episodes_to_90_pct": 1200
  },
  "baseline": {
    "final_reward": 92.5,
    "final_reward_std": 5.3,
    "mean_path_efficiency": 0.71,
    "episodes_to_90_pct": 1450
  }
}
```
