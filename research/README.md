# Connectome RL Research Pipeline

This directory contains the Python research codebase for ingesting connectome graph data, defining the connectome-constrained policy networks, running PPO training, and evaluating ablation conditions.

---

## Directory Structure

```
research/
├── src/                      # Production Python modules
│   ├── config.py             # Hyperparameters, architecture dimensions, and rewards
│   ├── connectome_utils.py   # neuPrint loader, graph builder, centrality, and pruning
│   ├── environment.py        # FlyNavigationEnv 3D gym environment
│   ├── agent.py              # ConnectomeConstrainedAgent, BaselineAgent, PPOTrainer
│   └── metrics.py            # Path efficiency, activation tracking, CSV/JSON loggers
├── notebooks/                # Reproducible science notebooks
│   ├── 01-data-exploration.ipynb
│   ├── 02-agent-training.ipynb
│   ├── 03-ablation-studies.ipynb
│   └── 04-analysis.ipynb
├── scripts/                  # Command-line execution tools
│   ├── run_all_experiments.py # Runs all 5 ablation conditions end-to-end
│   ├── export_to_json.py     # Exports connectome and trajectories to web/public/data/
│   └── generate_notebooks.py # Programmatic notebook generator and validator
├── tests/                    # Automated unit tests
│   ├── test_connectome.py
│   ├── test_env_and_agent.py
│   └── test_training_pipeline.py
├── experiments/              # Checkpoints, learning curves, summary metrics
└── requirements.txt          # Python dependencies
```

---

## Quickstart

### 1. Installation
```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### 2. Run Automated Test Suite
```bash
PYTHONPATH=. pytest research/tests -v
```

### 3. Run All Ablation Experiments
```bash
python scripts/run_all_experiments.py --episodes 500 --output-dir experiments
```

### 4. Export Web Assets
```bash
python scripts/export_to_json.py --output-dir ../web/public/data
```
