"""
Configuration parameters for Connectome-Powered Navigation Agent research.
"""

from typing import Any, Dict

CONFIG: Dict[str, Any] = {
    # Environment Settings
    'arena_size': 100.0,
    'max_steps': 200,
    'step_size': 1.0,
    'turn_angle_deg': 45.0,
    'goal_radius': 5.0,
    'step_penalty': -0.1,
    'goal_reward': 100.0,
    'reward_shaping': True,

    # Connectome Data Settings
    'neuprint_server': 'https://neuprint.janelia.org',
    'connectome_dataset': 'male-cns:v1.0',
    'connectome_roi': 'CX',  # Central Complex navigation circuit
    'synapse_threshold': 5,   # Filter out weak connections < 5 synapses
    'learnable_connectome': False,  # Keep biological topology fixed

    # Agent Network Dimensions
    'sensory_dim': 10,       # 3 agent pos + 3 goal pos + 4 prev_action
    'action_dim': 4,         # 0: forward, 1: left, 2: right, 3: rest
    'hidden_dim': 64,        # Hidden capacity for baseline MLP

    # PPO Hyperparameters
    'algorithm': 'PPO',
    'learning_rate': 3e-4,
    'batch_size': 32,
    'num_episodes': 1500,
    'gamma': 0.99,
    'lambda_': 0.95,
    'clip_ratio': 0.2,
    'entropy_coef': 0.01,
    'max_grad_norm': 0.5,

    # Experimental Conditions for Ablation Suite
    'experiments': [
        'connectome_constrained',
        'random_weights',
        'pruned_50',
        'pruned_90',
        'baseline'
    ]
}
