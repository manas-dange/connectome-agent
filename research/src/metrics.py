"""
Metrics tracking, statistical evaluation, path efficiency,
neuron activation profiling, and publication-quality visualization.
"""

import json
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import torch
from typing import Dict, Any, List, Optional, Tuple


class MetricsLogger:
    """Logs and computes running statistics across training episodes."""

    def __init__(self, experiment_name: str = 'experiment'):
        self.experiment_name = experiment_name
        self.episodes: List[int] = []
        self.rewards: List[float] = []
        self.lengths: List[int] = []

    def log_episode(self, episode: int, reward: float, length: int):
        """Records a completed training episode."""
        self.episodes.append(int(episode))
        self.rewards.append(float(reward))
        self.lengths.append(int(length))

    def get_average_reward(self, last_n: int = 100) -> float:
        """Computes mean reward over the last N episodes."""
        if not self.rewards:
            return 0.0
        return float(np.mean(self.rewards[-last_n:]))

    def get_summary(self, last_n: int = 100) -> Dict[str, float]:
        """Calculates standard summary statistics."""
        if not self.rewards:
            return {}
        tail_rewards = self.rewards[-last_n:]
        tail_lengths = self.lengths[-last_n:]

        # Episodes to reach 50% and 90% of max reward
        max_r = max(self.rewards)
        thresh_50 = 0.5 * max_r
        thresh_90 = 0.9 * max_r
        eps_50 = next((ep for ep, r in zip(self.episodes, self.rewards) if r >= thresh_50), len(self.episodes))
        eps_90 = next((ep for ep, r in zip(self.episodes, self.rewards) if r >= thresh_90), len(self.episodes))

        return {
            'final_reward': float(self.rewards[-1]),
            'max_reward': float(max_r),
            'mean_reward_last_n': float(np.mean(tail_rewards)),
            'std_reward_last_n': float(np.std(tail_rewards)),
            'mean_length_last_n': float(np.mean(tail_lengths)),
            'episodes_to_50_pct': int(eps_50),
            'episodes_to_90_pct': int(eps_90),
            'total_episodes': len(self.episodes)
        }

    def save_to_csv(self, filepath: str):
        """Exports episode history to CSV."""
        df = pd.DataFrame({
            'episode': self.episodes,
            'reward': self.rewards,
            'length': self.lengths
        })
        df.to_csv(filepath, index=False)

    def save_to_json(self, filepath: str):
        """Exports summary to JSON."""
        summary = self.get_summary()
        summary['experiment_name'] = self.experiment_name
        with open(filepath, 'w') as f:
            json.dump(summary, f, indent=2)

    def plot_learning_curve(
        self,
        save_path: Optional[str] = None,
        title: Optional[str] = None,
        window: int = 50
    ):
        """Generates smoothed learning curve plot."""
        if len(self.rewards) == 0:
            return

        fig, ax = plt.subplots(figsize=(9, 5), dpi=120)
        ax.plot(self.episodes, self.rewards, color='#5B8CFF', alpha=0.25, label='Raw Episode Reward')

        if len(self.rewards) >= window:
            smoothed = pd.Series(self.rewards).rolling(window, min_periods=1).mean()
            ax.plot(self.episodes, smoothed, color='#5B8CFF', linewidth=2.2, label=f'{window}-Episode Moving Avg')

        ax.set_xlabel('Episode', fontsize=12)
        ax.set_ylabel('Cumulative Reward', fontsize=12)
        ax.set_title(title or f'Learning Curve: {self.experiment_name}', fontsize=14, fontweight='bold')
        ax.grid(True, linestyle='--', alpha=0.4)
        ax.legend(loc='lower right')
        plt.tight_layout()

        if save_path:
            plt.savefig(save_path, bbox_inches='tight')
            plt.close(fig)
        else:
            plt.show()


def compute_path_efficiency(positions: List[np.ndarray], step_size: float = 1.0) -> float:
    """
    Computes straight-line path efficiency:
    Efficiency = (Euclidean distance from start to end) / (Total distance traveled).
    Efficiency = 1.0 represents a straight, optimal path.
    """
    if len(positions) < 2:
        return 0.0
    start = positions[0]
    end = positions[-1]
    straight_line = float(np.linalg.norm(end - start))
    total_steps = len(positions) - 1
    total_path = total_steps * step_size
    return (straight_line / total_path) if total_path > 0 else 0.0


def analyze_neuron_activations(
    agent: Any, env: Any, num_episodes: int = 10, threshold: float = 0.2
) -> Tuple[np.ndarray, List[float]]:
    """
    Simulates agent navigation episodes and records per-neuron activation rates.
    Returns:
      - activation_probability: 1D array of probabilities [0.0, 1.0] for each neuron
      - episode_efficiencies: list of path efficiencies for each episode
    """
    agent.eval()
    all_step_activations = []
    episode_efficiencies = []

    for _ in range(num_episodes):
        obs = env.reset()
        hidden_state = None
        done = False
        positions = [env.position.copy()]

        while not done:
            obs_tensor = torch.from_numpy(obs).unsqueeze(0).float()
            with torch.no_grad():
                action_logits, _, hidden_state = agent(obs_tensor, hidden_state)
                action = int(action_logits.argmax(dim=-1).item())

            obs, _, done, _ = env.step(action)
            positions.append(env.position.copy())

            # Binary activation check: neuron rate > threshold
            if hidden_state is not None:
                step_act = (hidden_state[0] > threshold).cpu().numpy().astype(np.float32)
                all_step_activations.append(step_act)

        eff = compute_path_efficiency(positions, env.step_size)
        episode_efficiencies.append(eff)

    if all_step_activations:
        activation_prob = np.mean(all_step_activations, axis=0)
    else:
        activation_prob = np.zeros(getattr(agent, 'num_neurons', 64))

    return activation_prob, episode_efficiencies


def plot_activation_distribution(
    activation_probs: np.ndarray,
    neuron_ids: Optional[List[Any]] = None,
    top_k: int = 20,
    save_path: Optional[str] = None
):
    """Plots horizontal bar chart ranking the top-k most active hub neurons."""
    num_neurons = len(activation_probs)
    top_k = min(top_k, num_neurons)

    if neuron_ids is None:
        labels = [f"Neuron {i}" for i in range(num_neurons)]
    else:
        labels = [str(nid) for nid in neuron_ids]

    top_indices = np.argsort(activation_probs)[::-1][:top_k]
    top_values = activation_probs[top_indices]
    top_labels = [labels[i] for i in top_indices]

    fig, ax = plt.subplots(figsize=(8, 6), dpi=120)
    y_pos = np.arange(top_k)
    ax.barh(y_pos, top_values, color='#FF4D5E', alpha=0.85, edgecolor='#2A2A32')
    ax.set_yticks(y_pos)
    ax.set_yticklabels(top_labels, fontsize=10)
    ax.invert_yaxis()  # Highest at top
    ax.set_xlabel('Activation Probability', fontsize=12)
    ax.set_title(f'Top {top_k} Active Neurons in Central Complex', fontsize=14, fontweight='bold')
    ax.grid(True, axis='x', linestyle='--', alpha=0.4)
    plt.tight_layout()

    if save_path:
        plt.savefig(save_path, bbox_inches='tight')
        plt.close(fig)
    else:
        plt.show()
