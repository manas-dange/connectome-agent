"""
Integration and smoke tests for the PPO training loop, metrics logger, and path efficiency.
"""

import pytest
import numpy as np
import networkx as nx
import torch
from research.src.environment import FlyNavigationEnv
from research.src.agent import ConnectomeConstrainedAgent, BaselineAgent, PPOTrainer
from research.src.metrics import MetricsLogger, compute_path_efficiency, analyze_neuron_activations
from research.src.config import CONFIG


def test_ppo_training_smoke():
    # Build small connectome graph
    G = nx.DiGraph()
    for i in range(1, 15):
        G.add_edge(i, (i % 14) + 1, weight=6.0)

    cfg = CONFIG.copy()
    cfg['max_steps'] = 30
    cfg['learning_rate'] = 1e-3

    env = FlyNavigationEnv(cfg)
    agent = ConnectomeConstrainedAgent(G, sensory_dim=10, action_dim=4, config=cfg)
    trainer = PPOTrainer(agent, cfg)
    logger = MetricsLogger(experiment_name='smoke_test')

    # Run 3 training episodes
    for ep in range(3):
        reward, length = trainer.train_episode(env)
        logger.log_episode(ep, reward, length)
        assert isinstance(reward, float)
        assert length > 0

    summary = logger.get_summary()
    assert summary['total_episodes'] == 3
    assert 'final_reward' in summary
    assert 'mean_reward_last_n' in summary


def test_path_efficiency():
    # Straight line: 10 steps along X axis of length 1.0 each
    positions = [np.array([float(i), 0.0, 0.0]) for i in range(11)]
    eff = compute_path_efficiency(positions, step_size=1.0)
    assert abs(eff - 1.0) < 1e-5

    # Curved path: returns to origin
    positions_loop = [np.array([0.0, 0.0, 0.0]), np.array([5.0, 0.0, 0.0]), np.array([0.0, 0.0, 0.0])]
    eff_loop = compute_path_efficiency(positions_loop, step_size=5.0)
    assert eff_loop == 0.0


def test_analyze_neuron_activations():
    import numpy as np
    G = nx.DiGraph()
    for i in range(1, 10):
        G.add_edge(i, (i % 9) + 1, weight=5.0)

    cfg = CONFIG.copy()
    cfg['max_steps'] = 15
    env = FlyNavigationEnv(cfg)
    agent = ConnectomeConstrainedAgent(G, sensory_dim=10, action_dim=4, config=cfg)

    act_probs, effs = analyze_neuron_activations(agent, env, num_episodes=2)
    assert len(act_probs) == 9
    assert (act_probs >= 0.0).all() and (act_probs <= 1.0).all()
    assert len(effs) == 2
