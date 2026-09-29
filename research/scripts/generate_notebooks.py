"""
Generates the 4 reproducible research Jupyter Notebooks:
  1. 01-data-exploration.ipynb
  2. 02-agent-training.ipynb
  3. 03-ablation-studies.ipynb
  4. 04-analysis.ipynb
"""

import os
import json


def make_notebook(cells):
    return {
        "cells": cells,
        "metadata": {
            "kernelspec": {
                "display_name": "Python 3",
                "language": "python",
                "name": "python3"
            },
            "language_info": {
                "name": "python",
                "version": "3.12"
            }
        },
        "nbformat": 4,
        "nbformat_minor": 2
    }


def md_cell(source):
    return {
        "cell_type": "markdown",
        "metadata": {},
        "source": [line + "\n" for line in source.split("\n")]
    }


def code_cell(source):
    return {
        "cell_type": "code",
        "execution_count": None,
        "metadata": {},
        "outputs": [],
        "source": [line + "\n" for line in source.split("\n")]
    }


def create_all_notebooks(dest_dir):
    os.makedirs(dest_dir, exist_ok=True)

    path_setup_code = """import sys, os
from pathlib import Path

# Add project root and research/ to sys.path
cwd = Path.cwd().resolve()
for p in [cwd, cwd.parent, cwd.parent.parent]:
    if (p / 'research' / 'src').is_dir() and str(p) not in sys.path:
        sys.path.insert(0, str(p))
    if (p / 'src').is_dir() and str(p) not in sys.path:
        sys.path.insert(0, str(p))

try:
    from src.config import CONFIG
    from src.connectome_utils import ConnectomeData, ConnectomeAnalysis, prune_graph_by_weight_threshold
    from src.environment import FlyNavigationEnv
    from src.agent import ConnectomeConstrainedAgent, BaselineAgent, RandomWeightAgent, PPOTrainer
    from src.metrics import MetricsLogger, analyze_neuron_activations, plot_activation_distribution, compute_path_efficiency
except ModuleNotFoundError:
    from research.src.config import CONFIG
    from research.src.connectome_utils import ConnectomeData, ConnectomeAnalysis, prune_graph_by_weight_threshold
    from research.src.environment import FlyNavigationEnv
    from research.src.agent import ConnectomeConstrainedAgent, BaselineAgent, RandomWeightAgent, PPOTrainer
    from research.src.metrics import MetricsLogger, analyze_neuron_activations, plot_activation_distribution, compute_path_efficiency"""

    # 1. 01-data-exploration.ipynb
    nb1 = make_notebook([
        md_cell("# 01 - Connectome Data Exploration\n\nThis notebook queries and analyzes the *Drosophila melanogaster* connectome from HHMI Janelia's `male-cns:v1.0` dataset, focusing on the Central Complex (CX) navigation neuropils."),
        code_cell(path_setup_code + """\nimport pandas as pd\nimport numpy as np\nimport networkx as nx\nimport matplotlib.pyplot as plt"""),
        md_cell("## 1. Connectome Ingestion & Graph Construction\nWe load neuron metadata and synaptic connectivity (filtering for connections with at least 5 synapses)."),
        code_cell("""data = ConnectomeData()
neurons_df = data.fetch_all_neurons()
conn_df = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
graph = data.build_networkx_graph(conn_df)

print(f"Total Neurons in Dataset: {len(neurons_df):,}")
print(f"Total Synaptic Edges: {len(conn_df):,}")"""),
        md_cell("## 2. Central Complex (CX) Subgraph Extraction"),
        code_cell("""analysis = ConnectomeAnalysis(graph, neurons_df)
cx_graph = analysis.get_subgraph_by_roi('CX')
stats = analysis.print_statistics()

for k, v in stats.items():
    print(f"{k}: {v}")"""),
        md_cell("## 3. Degree Distribution & Centrality Analysis\nExamining power-law in/out degree distribution and identifying top hub neurons."),
        code_cell("""centrality_df = analysis.compute_centrality(metric='degree')
print("Top 10 Hub Neurons by Degree:")
print(centrality_df.head(10))

fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(12, 4), dpi=120)
in_degs = [d for _, d in cx_graph.in_degree()]
out_degs = [d for _, d in cx_graph.out_degree()]

ax1.hist(in_degs, bins=30, color='#5B8CFF', alpha=0.8, edgecolor='#2A2A32')
ax1.set_title('In-Degree Distribution')
ax1.set_xlabel('In-Degree')
ax1.set_ylabel('Neuron Count')

ax2.hist(out_degs, bins=30, color='#FFB84D', alpha=0.8, edgecolor='#2A2A32')
ax2.set_title('Out-Degree Distribution')
ax2.set_xlabel('Out-Degree')
ax2.set_ylabel('Neuron Count')

plt.tight_layout()
plt.show()""")
    ])

    # 2. 02-agent-training.ipynb
    nb2 = make_notebook([
        md_cell("# 02 - Connectome-Constrained Agent Training\n\nTrain a reinforcement learning agent whose recurrent hidden state is constrained by the Central Complex connectome topology using Proximal Policy Optimization (PPO)."),
        code_cell(path_setup_code + """\nimport torch\nimport matplotlib.pyplot as plt"""),
        md_cell("## 1. Initialize Connectome & Network\nWe construct the `ConnectomeConstrainedAgent` where synaptic weights are initialized from biological synapse counts and frozen."),
        code_cell("""data = ConnectomeData()
neurons_df = data.fetch_all_neurons()
conn_df = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
graph = data.build_networkx_graph(conn_df)

analysis = ConnectomeAnalysis(graph, neurons_df)
cx_graph = analysis.get_subgraph_by_roi('CX')

agent = ConnectomeConstrainedAgent(
    cx_graph,
    sensory_dim=CONFIG['sensory_dim'],
    action_dim=CONFIG['action_dim'],
    config=CONFIG
)
print(f"Agent initialized with {agent.num_neurons} connectome recurrent neurons.")
print(f"Learnable recurrent weights: {agent.connectome_weight.requires_grad}")"""),
        md_cell("## 2. Interactive PPO Training Loop"),
        code_cell("""env = FlyNavigationEnv(CONFIG)
trainer = PPOTrainer(agent, CONFIG)
logger = MetricsLogger(experiment_name='connectome_interactive')

num_episodes = 50
print(f"Training for {num_episodes} episodes...")
for ep in range(1, num_episodes + 1):
    reward, length = trainer.train_episode(env)
    logger.log_episode(ep, reward, length)
    if ep % 10 == 0 or ep == num_episodes:
        avg_r = logger.get_average_reward(last_n=min(ep, 25))
        print(f"Episode {ep:3d}/{num_episodes} | Avg Reward: {avg_r:6.2f} | Length: {length}")"""),
        md_cell("## 3. Learning Curves"),
        code_cell("""logger.plot_learning_curve(title='Connectome-Constrained Agent Training')""")
    ])

    # 3. 03-ablation-studies.ipynb
    nb3 = make_notebook([
        md_cell("# 03 - Connectome Ablation Studies\n\nComparing 5 experimental conditions to evaluate the inductive bias of biological connectivity:\n1. Full biological connectome\n2. Random weights with identical topology\n3. 50% pruned connectome (top weights)\n4. 90% pruned connectome\n5. Unconstrained MLP baseline"),
        code_cell(path_setup_code + """\nimport pandas as pd\nimport matplotlib.pyplot as plt\nfrom IPython.display import display, Image"""),
        md_cell("## 1. Load or Run Ablation Conditions"),
        code_cell("""data = ConnectomeData()
neurons_df = data.fetch_all_neurons()
conn_df = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
base_graph = data.build_networkx_graph(conn_df)

analysis = ConnectomeAnalysis(base_graph, neurons_df)
cx_graph = analysis.get_subgraph_by_roi('CX')
pruned_50 = prune_graph_by_weight_threshold(cx_graph, percentile=50.0)
pruned_90 = prune_graph_by_weight_threshold(cx_graph, percentile=10.0)

print(f"Full CX Graph: {cx_graph.number_of_nodes()} nodes, {cx_graph.number_of_edges()} edges")
print(f"Pruned 50% Graph: {pruned_50.number_of_edges()} edges")
print(f"Pruned 90% Graph: {pruned_90.number_of_edges()} edges")

# Load existing experiment summary if available
summary_paths = [
    Path('experiments/summary.csv'),
    Path('../experiments/summary.csv'),
    Path('../../research/experiments/summary.csv')
]

summary_file = next((p for p in summary_paths if p.exists()), None)
if summary_file:
    summary_df = pd.read_csv(summary_file, index_col=0)
    print("\\nLoaded existing experiment summary:")
    display(summary_df)
else:
    print("\\nRun `python scripts/run_all_experiments.py` to train all ablation conditions.")"""),
        md_cell("## 2. Comparative Evaluation\nPlotting comparative performance across all experimental conditions."),
        code_cell("""comp_paths = [
    Path('experiments/comparison.png'),
    Path('../experiments/comparison.png'),
    Path('../../research/experiments/comparison.png')
]

comp_img = next((p for p in comp_paths if p.exists()), None)
if comp_img:
    display(Image(filename=str(comp_img)))
else:
    print("Run `python scripts/run_all_experiments.py` to generate the comparison plot.")""")
    ])

    # 4. 04-analysis.ipynb
    nb4 = make_notebook([
        md_cell("# 04 - Circuit Analysis & Emergent Dynamics\n\nInvestigating:\n- Active hub neurons in the Central Complex\n- Path efficiency in 3D navigation\n- Emergent trajectory geometries (direct vs exploratory paths)"),
        code_cell(path_setup_code + """\nimport numpy as np\nimport pandas as pd\nimport matplotlib.pyplot as plt\nimport torch"""),
        md_cell("## 1. Profiling Neural Activations in Navigation"),
        code_cell("""data = ConnectomeData()
neurons_df = data.fetch_all_neurons()
conn_df = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
graph = data.build_networkx_graph(conn_df)

analysis = ConnectomeAnalysis(graph, neurons_df)
cx_graph = analysis.get_subgraph_by_roi('CX')

agent = ConnectomeConstrainedAgent(cx_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG)

# Load pre-trained weights if checkpoint exists
ck_paths = [
    Path('experiments/connectome_constrained/final_agent.pt'),
    Path('../experiments/connectome_constrained/final_agent.pt'),
    Path('../../research/experiments/connectome_constrained/final_agent.pt')
]
ck_file = next((p for p in ck_paths if p.exists()), None)
if ck_file:
    agent.load_state_dict(torch.load(ck_file, map_location='cpu'))
    print(f"Loaded trained checkpoint from {ck_file}")
else:
    print("No checkpoint found; running with initialized weights.")

env = FlyNavigationEnv(CONFIG)
act_probs, efficiencies = analyze_neuron_activations(agent, env, num_episodes=10)

print(f"Mean Path Efficiency: {np.mean(efficiencies):.3f} ± {np.std(efficiencies):.3f}")"""),
        md_cell("## 2. Central Complex Hub Neuron Activation Distribution"),
        code_cell("""plot_activation_distribution(act_probs, neuron_ids=agent.neuron_ids, top_k=15)"""),
        md_cell("## 3. 3D Trajectory Visualization"),
        code_cell("""obs = env.reset(seed=42)
hidden_state = None
done = False

agent.eval()
while not done:
    obs_t = torch.from_numpy(obs).unsqueeze(0).float()
    with torch.no_grad():
        logits, _, hidden_state = agent(obs_t, hidden_state)
        action = int(logits.argmax(dim=-1).item())
    obs, _, done, _ = env.step(action)

positions = np.array(env.trajectory_positions)

fig = plt.figure(figsize=(9, 6), dpi=120)
ax = fig.add_subplot(111, projection='3d')
ax.plot(positions[:, 0], positions[:, 1], positions[:, 2], color='#5B8CFF', linewidth=2.5, label='Agent Path')
ax.scatter(positions[0, 0], positions[0, 1], positions[0, 2], color='#3DDC97', s=100, label='Start')
ax.scatter(positions[-1, 0], positions[-1, 1], positions[-1, 2], color='#FF4D5E', s=100, label='Finish')
ax.scatter(env.goal[0], env.goal[1], env.goal[2], color='#FFC857', s=200, marker='*', label='Goal')

ax.set_title('Emergent 3D Navigation Trajectory', fontsize=14, fontweight='bold')
ax.set_xlabel('X')
ax.set_ylabel('Y')
ax.set_zlabel('Z')
ax.legend()
plt.tight_layout()
plt.show()""")
    ])

    files = [
        ('01-data-exploration.ipynb', nb1),
        ('02-agent-training.ipynb', nb2),
        ('03-ablation-studies.ipynb', nb3),
        ('04-analysis.ipynb', nb4)
    ]

    for fname, nb in files:
        target_path = os.path.join(dest_dir, fname)
        with open(target_path, 'w') as f:
            json.dump(nb, f, indent=2)
        print(f"Created notebook: {target_path}")


if __name__ == '__main__':
    dest = os.path.abspath(os.path.join(os.path.dirname(__file__), '../notebooks'))
    create_all_notebooks(dest)
