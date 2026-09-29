# Changelog

All notable changes to the Connectome-Powered Navigation Agent project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-09-29

### Added
- **Core Connectome Research Engine (`research/src/`)**:
  - `ConnectomeData`: Data ingestion pipeline connecting to HHMI Janelia / Google FlyEM `male-cns:v1.0` neuPrint dataset with offline synthetic CX generator fallback.
  - `ConnectomeAnalysis`: Graph-theoretic analysis tools calculating degree distributions, network density, betweenness/closeness/eigenvector centrality, hub identification, and anatomical subgraph extraction.
  - `prune_graph_by_weight_threshold`: Synaptic weight percentile ablation pruning tool.
  - `FlyNavigationEnv`: 3D continuous-space navigation environment adhering to standard Gym API with realistic physics, heading steering, distance metrics, and collision boundaries.
  - `ConnectomeConstrainedAgent`: PyTorch reinforcement learning policy where recurrent hidden dynamics are constrained to real synaptic connectivity and weights initialized from synapse counts.
  - `BaselineAgent`: Unconstrained MLP baseline with identical capacity.
  - `RandomWeightAgent`: Topology control preserving graph sparsity while randomizing synaptic strengths.
  - `PPOTrainer`: Clipped surrogate Proximal Policy Optimization training loop with generalized advantage estimation and entropy regularization.
  - `MetricsLogger`: Real-time trajectory tracking, learning curve serialization, path efficiency calculation, and activation inspection.
- **Reproducible Jupyter Notebooks (`research/notebooks/`)**:
  - `01-data-exploration.ipynb`: Central Complex graph statistics, degree distribution plots, and hub neuron identification.
  - `02-agent-training.ipynb`: Interactive PPO training loop with live reward tracking and checkpointing.
  - `03-ablation-studies.ipynb`: Systematic comparison of all 5 experimental conditions.
  - `04-analysis.ipynb`: Hub activation analysis, path efficiency distribution, and comparative visualizations.
- **Interactive 3D Web Visualizer (`web/`)**:
  - React 18 + Vite + Three.js application with high-performance `InstancedMesh` rendering for 1,243 Central Complex nodes.
  - Dynamic edge pulsing (`LineSegments`) reflecting biological synapse strengths.
  - Real-time agent trajectory replay with glowing breadcrumb trail and target goal rendering.
  - Head-to-head comparison view juxtaposing connectome-constrained vs. baseline agents.
  - Interactive Metrics Panel with Recharts showing cumulative rewards, path efficiency, and neuron activation sparklines.
  - Tooltips with anatomical metadata (Body ID, cell type, neuropil, degree, 3D coordinates).
- **FastAPI Inference Server (`backend/`)**:
  - Live single-step policy inference endpoint (`/api/step`).
  - Full-episode 3D simulation endpoint (`/api/simulate`).
  - Graph analytics summary endpoint (`/api/connectome`).
- **Comprehensive Documentation Suite (`docs/`)**:
  - `docs/METHODOLOGY.md`: Mathematical formulation, biological data sources, and network constraints.
  - `docs/RESULTS.md`: Quantitative findings, learning speed gains, ablation analyses, and neuroscience interpretation.
  - `docs/INSTALLATION.md`: Step-by-step setup for Python research, Node web app, and FastAPI server.
  - `docs/ARCHITECTURE.md`: End-to-end data flow diagrams, module interfaces, and JSON schema specs.
- **CI/CD Automation (`.github/workflows/ci.yml`)**:
  - Automated GitHub Actions workflow testing Python 3.9–3.12 with pytest & flake8, and verifying Vite frontend production builds.
