"""
Unit tests for FlyNavigationEnv and ConnectomeConstrained / Baseline / Random agents.
"""

import pytest
import numpy as np
import torch
import networkx as nx
from research.src.environment import FlyNavigationEnv
from research.src.agent import ConnectomeConstrainedAgent, BaselineAgent, RandomWeightAgent
from research.src.config import CONFIG


def test_fly_navigation_env_lifecycle():
    env = FlyNavigationEnv(CONFIG)
    obs = env.reset(seed=123)
    assert isinstance(obs, np.ndarray)
    assert obs.shape == (10,)
    assert not np.isnan(obs).any()

    # Step 0: move forward
    init_pos = env.position.copy()
    next_obs, reward, done, info = env.step(0)
    assert next_obs.shape == (10,)
    assert isinstance(reward, float)
    assert isinstance(done, bool)
    assert not np.array_equal(env.position, init_pos)

    # Step 1: turn left
    init_angle = env.heading_angle
    env.step(1)
    assert env.heading_angle > init_angle

    # Step 2: turn right
    curr_angle = env.heading_angle
    env.step(2)
    assert env.heading_angle < curr_angle


def test_fly_navigation_env_trajectory_export():
    env = FlyNavigationEnv(CONFIG)
    env.reset(seed=42)
    for _ in range(15):
        _, _, done, _ = env.step(0)
        if done:
            break

    traj = env.get_trajectory_dict(episode_idx=1)
    assert traj['episode'] == 1
    assert 'reward' in traj
    assert 'goal' in traj
    assert 'steps' in traj
    assert len(traj['steps']) >= 1
    assert 'position' in traj['steps'][0]
    assert 'action' in traj['steps'][0]


def test_connectome_constrained_agent():
    # Build a toy directed graph for testing
    G = nx.DiGraph()
    G.add_edge(1, 2, weight=5.0)
    G.add_edge(2, 3, weight=10.0)
    G.add_edge(3, 1, weight=2.0)

    agent = ConnectomeConstrainedAgent(
        connectome_graph=G,
        sensory_dim=10,
        action_dim=4,
        config={'learnable_connectome': False}
    )

    assert agent.connectome_weight.requires_grad is False
    assert agent.num_neurons == 3

    # Forward pass
    sensory = torch.randn(2, 10)  # batch_size=2
    logits, value, hidden = agent(sensory)

    assert logits.shape == (2, 4)
    assert value.shape == (2,)
    assert hidden.shape == (2, 3)
    assert not torch.isnan(logits).any()
    assert not torch.isnan(value).any()


def test_baseline_agent():
    agent = BaselineAgent(sensory_dim=10, hidden_dim=32, action_dim=4)
    sensory = torch.randn(3, 10)
    logits, value, hidden = agent(sensory)

    assert logits.shape == (3, 4)
    assert value.shape == (3,)
    assert hidden.shape == (3, 32)


def test_random_weight_agent():
    G = nx.DiGraph()
    G.add_edge(1, 2, weight=8.0)
    G.add_edge(2, 3, weight=12.0)

    agent = RandomWeightAgent(G, sensory_dim=10, action_dim=4)
    sensory = torch.randn(1, 10)
    logits, value, hidden = agent(sensory)

    assert logits.shape == (1, 4)
    assert value.shape == (1,)
    assert hidden.shape == (1, 3)
