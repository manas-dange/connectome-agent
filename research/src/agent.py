"""
Reinforcement Learning Agents and PPO Training Engine.
Implements:
  1. ConnectomeConstrainedAgent: Recurrent policy network topologically constrained by fruit fly connectome.
  2. BaselineAgent: Unconstrained MLP baseline.
  3. RandomWeightAgent: Connectome topology with randomized synaptic weights.
  4. PPOTrainer: Proximal Policy Optimization with GAE advantage estimation and actor-critic updates.
"""

import math
import numpy as np
import networkx as nx
import torch
import torch.nn as nn
import torch.optim as optim
from torch.distributions import Categorical
from typing import Dict, Any, Tuple, Optional, List


class ConnectomeConstrainedAgent(nn.Module):
    """
    Policy and Value network where:
      - Recurrent internal layer mirrors the connectome graph.
      - Synaptic weights are initialized from biological synapse counts (log-normalized).
      - Recurrent connectome weights are frozen by default, testing biological inductive bias.
    """

    def __init__(
        self,
        connectome_graph: nx.DiGraph,
        sensory_dim: int = 10,
        action_dim: int = 4,
        config: Optional[Dict[str, Any]] = None
    ):
        super().__init__()
        self.config = config or {}
        self.G = connectome_graph
        self.sensory_dim = sensory_dim
        self.action_dim = action_dim

        # Index mapping for graph nodes
        self.neuron_ids = sorted(list(self.G.nodes()))
        self.neuron_to_idx = {nid: i for i, nid in enumerate(self.neuron_ids)}
        self.num_neurons = max(len(self.neuron_ids), 1)

        # Adjacency matrix construction
        self.adj_matrix = self._build_adjacency_matrix()

        # Sensory input projection: sensory → neurons
        self.input_layer = nn.Linear(self.sensory_dim, self.num_neurons)

        # Connectome recurrent layer
        self.connectome_weight = nn.Parameter(
            torch.from_numpy(self.adj_matrix).float(),
            requires_grad=bool(self.config.get('learnable_connectome', False))
        )

        # Action head: neurons → action logits
        self.actor_head = nn.Linear(self.num_neurons, self.action_dim)

        # Critic value head: neurons → state value
        self.critic_head = nn.Linear(self.num_neurons, 1)

        # Biological rate-coding activation
        self.activation = nn.ReLU()

    def _build_adjacency_matrix(self) -> np.ndarray:
        """Constructs log-normalized adjacency matrix from connectome edges."""
        adj = np.zeros((self.num_neurons, self.num_neurons), dtype=np.float32)
        for u, v, data in self.G.edges(data=True):
            if u in self.neuron_to_idx and v in self.neuron_to_idx:
                i = self.neuron_to_idx[u]
                j = self.neuron_to_idx[v]
                raw_weight = float(data.get('weight', 1.0))
                # Log-scaled biological synapse weight for numerical stability
                adj[i, j] = math.log1p(raw_weight)

        # Normalize spectral radius / max row sum to prevent exploding recurrence
        row_sums = adj.sum(axis=1, keepdims=True)
        max_sum = np.max(row_sums)
        if max_sum > 0:
            adj = adj / (max_sum + 1e-6)
        return adj

    def forward(
        self, sensory_input: torch.Tensor, hidden_state: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        """
        Forward step through sensory layer and connectome recurrence.
        Returns: (action_logits, state_value, new_hidden_state)
        """
        batch_size = sensory_input.size(0)
        if hidden_state is None:
            hidden_state = torch.zeros(batch_size, self.num_neurons, device=sensory_input.device)

        # Sensory projections
        neuron_input = self.input_layer(sensory_input)

        # Recurrent synaptic propagation through connectome topology
        connectome_signal = torch.matmul(hidden_state, self.connectome_weight.t())

        # Integrated neural activation state
        new_hidden_state = self.activation(connectome_signal + neuron_input)

        # Action logits & baseline state value
        action_logits = self.actor_head(new_hidden_state)
        value = self.critic_head(new_hidden_state).squeeze(-1)

        return action_logits, value, new_hidden_state


class BaselineAgent(nn.Module):
    """
    Standard unconstrained neural network baseline.
    Serves as an upper bound / control without topological connectome restrictions.
    """

    def __init__(
        self,
        sensory_dim: int = 10,
        hidden_dim: int = 64,
        action_dim: int = 4,
        config: Optional[Dict[str, Any]] = None
    ):
        super().__init__()
        self.config = config or {}
        self.sensory_dim = sensory_dim
        self.hidden_dim = hidden_dim
        self.action_dim = action_dim

        self.fc1 = nn.Linear(sensory_dim, hidden_dim)
        self.recurrent_fc = nn.Linear(hidden_dim, hidden_dim)
        self.actor_head = nn.Linear(hidden_dim, action_dim)
        self.critic_head = nn.Linear(hidden_dim, 1)
        self.activation = nn.ReLU()

    def forward(
        self, sensory_input: torch.Tensor, hidden_state: Optional[torch.Tensor] = None
    ) -> Tuple[torch.Tensor, torch.Tensor, torch.Tensor]:
        batch_size = sensory_input.size(0)
        if hidden_state is None:
            hidden_state = torch.zeros(batch_size, self.hidden_dim, device=sensory_input.device)

        x1 = self.fc1(sensory_input)
        rec = self.recurrent_fc(hidden_state)
        new_hidden_state = self.activation(x1 + rec)

        action_logits = self.actor_head(new_hidden_state)
        value = self.critic_head(new_hidden_state).squeeze(-1)

        return action_logits, value, new_hidden_state


class RandomWeightAgent(ConnectomeConstrainedAgent):
    """
    Ablation control: identical connectome sparsity graph,
    but synapse weights are randomly sampled.
    Tests whether the exact biological weights encode useful priors.
    """

    def __init__(
        self,
        connectome_graph: nx.DiGraph,
        sensory_dim: int = 10,
        action_dim: int = 4,
        config: Optional[Dict[str, Any]] = None
    ):
        super().__init__(connectome_graph, sensory_dim, action_dim, config)
        # Randomize non-zero entries while preserving exact topological graph sparsity
        with torch.no_grad():
            mask = (self.connectome_weight != 0.0)
            random_weights = torch.empty_like(self.connectome_weight).uniform_(0.0, 1.0)
            self.connectome_weight.copy_(random_weights * mask.float())
            # Normalize to match stable spectral radius
            row_sums = self.connectome_weight.sum(dim=1, keepdim=True)
            max_sum = torch.max(row_sums)
            if max_sum > 0:
                self.connectome_weight.div_(max_sum + 1e-6)


class PPOTrainer:
    """
    Proximal Policy Optimization (PPO) trainer with Generalized Advantage Estimation (GAE).
    Optimizes actor and critic with clipped surrogate objective and entropy bonus.
    """

    def __init__(self, agent: nn.Module, config: Optional[Dict[str, Any]] = None):
        self.agent = agent
        self.config = config or {}
        self.lr = float(self.config.get('learning_rate', 3e-4))
        self.gamma = float(self.config.get('gamma', 0.99))
        self.lambda_ = float(self.config.get('lambda_', 0.95))
        self.clip_ratio = float(self.config.get('clip_ratio', 0.2))
        self.entropy_coef = float(self.config.get('entropy_coef', 0.01))
        self.value_loss_coef = float(self.config.get('value_loss_coef', 0.5))
        self.max_grad_norm = float(self.config.get('max_grad_norm', 0.5))

        self.optimizer = optim.Adam(self.agent.parameters(), lr=self.lr)

    def train_episode(self, env: Any) -> Tuple[float, int]:
        """
        Executes an episode rollout, computes GAE advantages, and updates network parameters.
        Returns: (total_episode_reward, total_steps)
        """
        observation = env.reset()
        hidden_state = None

        trajectory = []
        episode_reward = 0.0
        episode_length = 0
        done = False

        self.agent.train()

        while not done:
            obs_tensor = torch.from_numpy(observation).unsqueeze(0).float()

            with torch.no_grad():
                action_logits, value, new_hidden_state = self.agent(obs_tensor, hidden_state)
                dist = Categorical(logits=action_logits)
                action = dist.sample()
                log_prob = dist.log_prob(action)

            action_idx = int(action.item())
            next_obs, reward, done, _ = env.step(action_idx)

            trajectory.append({
                'obs': obs_tensor,
                'hidden_state': hidden_state.clone() if hidden_state is not None else None,
                'action': action,
                'log_prob': log_prob,
                'value': value.item(),
                'reward': float(reward),
                'done': done
            })

            hidden_state = new_hidden_state
            observation = next_obs
            episode_reward += reward
            episode_length += 1

        # Final bootstrap value if truncated
        last_val = 0.0
        if not trajectory[-1]['done']:
            with torch.no_grad():
                obs_t = torch.from_numpy(observation).unsqueeze(0).float()
                _, val, _ = self.agent(obs_t, hidden_state)
                last_val = float(val.item())

        # Generalized Advantage Estimation (GAE)
        returns = []
        advantages = []
        gae = 0.0
        next_value = last_val

        for step in reversed(trajectory):
            delta = step['reward'] + (self.gamma * next_value * (1.0 - float(step['done']))) - step['value']
            gae = delta + (self.gamma * self.lambda_ * (1.0 - float(step['done'])) * gae)
            ret = gae + step['value']
            returns.insert(0, ret)
            advantages.insert(0, gae)
            next_value = step['value']

        adv_tensor = torch.tensor(advantages, dtype=torch.float32)
        if len(adv_tensor) > 1:
            adv_tensor = (adv_tensor - adv_tensor.mean()) / (adv_tensor.std() + 1e-8)
        ret_tensor = torch.tensor(returns, dtype=torch.float32)

        # Policy & Value update step
        self._update(trajectory, adv_tensor, ret_tensor)

        return episode_reward, episode_length

    def _update(self, trajectory: List[Dict[str, Any]], advantages: torch.Tensor, returns: torch.Tensor):
        """Performs PPO policy gradient and value function optimization."""
        self.optimizer.zero_grad()
        total_loss = torch.tensor(0.0)

        for i, step in enumerate(trajectory):
            obs = step['obs']
            action = step['action']
            old_log_prob = step['log_prob']
            adv = advantages[i]
            target_return = returns[i]

            action_logits, value, _ = self.agent(obs, step['hidden_state'])
            dist = Categorical(logits=action_logits)
            new_log_prob = dist.log_prob(action)
            entropy = dist.entropy().mean()

            # Ratio and clipped surrogate loss
            ratio = torch.exp(new_log_prob - old_log_prob)
            surr1 = ratio * adv
            surr2 = torch.clamp(ratio, 1.0 - self.clip_ratio, 1.0 + self.clip_ratio) * adv
            policy_loss = -torch.min(surr1, surr2).mean()

            # Value loss (MSE)
            value_loss = 0.5 * (value - target_return).pow(2).mean()

            # Combined objective
            loss = policy_loss + (self.value_loss_coef * value_loss) - (self.entropy_coef * entropy)
            total_loss = total_loss + loss

        avg_loss = total_loss / max(len(trajectory), 1)
        avg_loss.backward()
        nn.utils.clip_grad_norm_(self.agent.parameters(), self.max_grad_norm)
        self.optimizer.step()
