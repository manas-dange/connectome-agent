"""
Automated experimental runner for the full ablation suite:
  1. connectome_constrained (Biological topology + weights)
  2. random_weights (Topology control)
  3. pruned_50 (Top 50% synapses)
  4. pruned_90 (Top 10% synapses)
  5. baseline (Unconstrained MLP)
Generates checkpoints, metrics, learning curves, and comparative summaries.
"""

import os
import sys
import argparse
import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import torch

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../..')))

from research.src.config import CONFIG
from research.src.connectome_utils import ConnectomeData, ConnectomeAnalysis, prune_graph_by_weight_threshold
from research.src.environment import FlyNavigationEnv
from research.src.agent import ConnectomeConstrainedAgent, BaselineAgent, RandomWeightAgent, PPOTrainer
from research.src.metrics import MetricsLogger, compute_path_efficiency


def train_single_experiment(
    exp_name: str,
    agent_factory,
    env_config: dict,
    num_episodes: int,
    output_dir: str
):
    print(f"\n=======================================================")
    print(f"Starting Experiment: [{exp_name}] ({num_episodes} episodes)")
    print(f"=======================================================")

    exp_dir = os.path.join(output_dir, exp_name)
    os.makedirs(exp_dir, exist_ok=True)

    env = FlyNavigationEnv(env_config)
    agent = agent_factory()
    trainer = PPOTrainer(agent, env_config)
    logger = MetricsLogger(experiment_name=exp_name)

    log_freq = max(1, num_episodes // 10)

    for ep in range(1, num_episodes + 1):
        reward, length = trainer.train_episode(env)
        logger.log_episode(ep, reward, length)

        if ep % log_freq == 0 or ep == num_episodes:
            avg_r = logger.get_average_reward(last_n=min(ep, 50))
            print(f"  [{exp_name}] Ep {ep}/{num_episodes} | Avg Reward (last 50): {avg_r:.2f} | Last Ep Length: {length}")

    # Save training metrics and learning curve
    logger.save_to_csv(os.path.join(exp_dir, 'learning_curve.csv'))
    logger.save_to_json(os.path.join(exp_dir, 'metrics.json'))
    logger.plot_learning_curve(
        save_path=os.path.join(exp_dir, 'learning_curve.png'),
        title=f'Learning Curve: {exp_name}'
    )

    # Save agent checkpoint
    model_path = os.path.join(exp_dir, 'final_agent.pt')
    torch.save(agent.state_dict(), model_path)
    print(f"  Checkpoint saved to {model_path}")

    # Evaluate path efficiency and record sample trajectory
    agent.eval()
    sample_trajectory = None
    eval_efficiencies = []

    for eval_ep in range(5):
        obs = env.reset(seed=100 + eval_ep)
        hidden_state = None
        done = False

        while not done:
            obs_tensor = torch.from_numpy(obs).unsqueeze(0).float()
            with torch.no_grad():
                action_logits, _, hidden_state = agent(obs_tensor, hidden_state)
                action = int(action_logits.argmax(dim=-1).item())
            obs, _, done, _ = env.step(action)

        traj_dict = env.get_trajectory_dict(episode_idx=eval_ep + 1)
        eval_efficiencies.append(traj_dict['path_efficiency'])
        if eval_ep == 0:
            sample_trajectory = traj_dict

    mean_efficiency = float(np.mean(eval_efficiencies)) if eval_efficiencies else 0.0

    # Save sample trajectory for web replay
    if sample_trajectory:
        with open(os.path.join(exp_dir, 'trajectory_1.json'), 'w') as f:
            json.dump(sample_trajectory, f, indent=2)

    summary = logger.get_summary(last_n=min(num_episodes, 100))
    summary['path_efficiency'] = mean_efficiency
    with open(os.path.join(exp_dir, 'metrics.json'), 'w') as f:
        json.dump(summary, f, indent=2)

    return logger, summary, sample_trajectory


def main():
    parser = argparse.ArgumentParser(description="Run Connectome-Powered RL Ablation Studies")
    parser.add_argument('--episodes', type=int, default=CONFIG['num_episodes'], help="Number of training episodes per condition")
    parser.add_argument('--smoke-test', action='store_true', help="Run fast 20-episode smoke test across all conditions")
    parser.add_argument('--output-dir', type=str, default='research/experiments', help="Directory for logs and artifacts")
    args = parser.parse_args()

    num_episodes = 20 if args.smoke_test else args.episodes
    output_dir = os.path.abspath(args.output_dir)
    os.makedirs(output_dir, exist_ok=True)

    print(f"[Run All Experiments] Initializing data layer...")
    data = ConnectomeData()
    neurons_df = data.fetch_all_neurons()
    connectivity_df = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
    base_graph = data.build_networkx_graph(connectivity_df)

    analysis = ConnectomeAnalysis(base_graph, neurons_df)
    cx_graph = analysis.get_subgraph_by_roi(CONFIG['connectome_roi'])
    stats = analysis.print_statistics()
    print(f"[Connectome Statistics] Nodes: {stats['nodes']}, Edges: {stats['edges']}, Density: {stats['density']:.4f}")

    # Prepare pruned graphs
    pruned_50_graph = prune_graph_by_weight_threshold(cx_graph, percentile=50.0)
    pruned_90_graph = prune_graph_by_weight_threshold(cx_graph, percentile=10.0)

    # Experiment suites
    experiments = [
        ('connectome_constrained', lambda: ConnectomeConstrainedAgent(cx_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG)),
        ('random_weights', lambda: RandomWeightAgent(cx_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG)),
        ('pruned_50', lambda: ConnectomeConstrainedAgent(pruned_50_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG)),
        ('pruned_90', lambda: ConnectomeConstrainedAgent(pruned_90_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG)),
        ('baseline', lambda: BaselineAgent(CONFIG['sensory_dim'], CONFIG['hidden_dim'], CONFIG['action_dim'], CONFIG)),
    ]

    all_summaries = {}
    all_loggers = {}

    for exp_name, factory in experiments:
        logger, summary, _ = train_single_experiment(
            exp_name=exp_name,
            agent_factory=factory,
            env_config=CONFIG,
            num_episodes=num_episodes,
            output_dir=output_dir
        )
        all_summaries[exp_name] = summary
        all_loggers[exp_name] = logger

    # Comparative Summary Table
    summary_df = pd.DataFrame(all_summaries).T
    summary_csv_path = os.path.join(output_dir, 'summary.csv')
    summary_json_path = os.path.join(output_dir, 'summary.json')
    summary_df.to_csv(summary_csv_path)
    with open(summary_json_path, 'w') as f:
        json.dump(all_summaries, f, indent=2)

    print("\n=======================================================")
    print("Ablation Study Summary:")
    print("=======================================================")
    print(summary_df[['final_reward', 'mean_reward_last_n', 'path_efficiency', 'episodes_to_50_pct']])
    print(f"\nSaved summary table to {summary_csv_path}")

    # Comparative Learning Curves Plot (Okabe-Ito / DESIGN.md colors)
    palette = {
        'connectome_constrained': '#5B8CFF',  # Blue
        'baseline': '#F2A65A',                # Orange
        'random_weights': '#9A9AA5',          # Grey
        'pruned_50': '#3DDC97',               # Green
        'pruned_90': '#FFC857'                # Amber
    }

    fig, ax = plt.subplots(figsize=(11, 6), dpi=140)
    window = max(3, num_episodes // 15)

    for exp_name, logger in all_loggers.items():
        color = palette.get(exp_name, '#5B8CFF')
        smoothed = pd.Series(logger.rewards).rolling(window, min_periods=1).mean()
        ax.plot(logger.episodes, smoothed, label=exp_name.replace('_', ' ').title(), color=color, linewidth=2.4)

    ax.set_xlabel('Episode', fontsize=12)
    ax.set_ylabel('Cumulative Reward', fontsize=12)
    ax.set_title('Ablation Study: Navigation Performance Across Architectures', fontsize=14, fontweight='bold')
    ax.grid(True, linestyle='--', alpha=0.35)
    ax.legend(loc='lower right', frameon=True)
    plt.tight_layout()

    comp_plot_path = os.path.join(output_dir, 'comparison.png')
    plt.savefig(comp_plot_path, bbox_inches='tight')
    plt.close(fig)
    print(f"Saved comparative chart to {comp_plot_path}")


if __name__ == '__main__':
    main()
