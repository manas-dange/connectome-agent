"""
3D Goal-Directed Navigation Environment (FlyNavigationEnv).
Provides continuous 3D spatial navigation with discrete actuation,
reward shaping, and step-by-step trajectory logging.
Compatible with Gym, Gymnasium, or standalone usage without external RL dependencies.
"""

import math
import numpy as np
from typing import Dict, Any, Tuple, Optional, List


class FlyNavigationEnv:
    """
    Continuous 3D navigation task inspired by Drosophila flight and walking kinematics.

    State / Observation (10D):
      [0:3] Agent position (x, y, z)
      [3:6] Goal position (x, y, z)
      [6:10] One-hot vector of previous action taken (4D)

    Action Space (Discrete 4):
      0: Move forward along heading orientation
      1: Yaw turn left by turn_angle_deg (default 45 deg)
      2: Yaw turn right by turn_angle_deg (default -45 deg)
      3: Rest (hover / maintain position)
    """

    def __init__(self, config: Optional[Dict[str, Any]] = None):
        self.config = config or {}
        self.arena_size = float(self.config.get('arena_size', 100.0))
        self.max_steps = int(self.config.get('max_steps', 200))
        self.step_size = float(self.config.get('step_size', 1.0))
        self.turn_angle_rad = math.radians(float(self.config.get('turn_angle_deg', 45.0)))
        self.goal_radius = float(self.config.get('goal_radius', 5.0))
        self.step_penalty = float(self.config.get('step_penalty', -0.1))
        self.goal_reward = float(self.config.get('goal_reward', 100.0))
        self.reward_shaping = bool(self.config.get('reward_shaping', True))

        # Dimensionalities
        self.obs_dim = 10
        self.action_dim = 4

        # Dynamic state variables
        self.position = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        self.goal = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        self.orientation = np.array([1.0, 0.0, 0.0], dtype=np.float32)  # Unit vector heading
        self.heading_angle = 0.0  # Angle in radians in XY plane
        self.step_count = 0
        self.previous_action = np.zeros(self.action_dim, dtype=np.float32)
        self.prev_distance = 0.0

        # Trajectory history for visualization & export
        self.trajectory_positions: List[np.ndarray] = []
        self.trajectory_actions: List[int] = []
        self.trajectory_rewards: List[float] = []

    def reset(self, seed: Optional[int] = None) -> np.ndarray:
        """Resets agent and randomly places goal at a safe distance in the 3D arena."""
        if seed is not None:
            np.random.seed(seed)

        self.position = np.array([0.0, 0.0, 0.0], dtype=np.float32)
        self.heading_angle = float(np.random.uniform(0, 2 * math.pi))
        self.orientation = np.array([
            math.cos(self.heading_angle),
            math.sin(self.heading_angle),
            0.0
        ], dtype=np.float32)

        # Place goal at least 15 units away from origin, within arena bounds
        min_goal_dist = 15.0
        max_bound = self.arena_size * 0.8
        while True:
            candidate = np.random.uniform(-max_bound, max_bound, size=3).astype(np.float32)
            # Confine vertical range moderately
            candidate[2] = np.clip(candidate[2], -self.arena_size * 0.4, self.arena_size * 0.4)
            if np.linalg.norm(candidate) >= min_goal_dist:
                self.goal = candidate
                break

        self.step_count = 0
        self.previous_action = np.zeros(self.action_dim, dtype=np.float32)
        self.prev_distance = float(np.linalg.norm(self.position - self.goal))

        # Reset trajectory history
        self.trajectory_positions = [self.position.copy()]
        self.trajectory_actions = []
        self.trajectory_rewards = []

        return self._get_observation()

    def step(self, action: int) -> Tuple[np.ndarray, float, bool, Dict[str, Any]]:
        """Executes one simulation step."""
        self.step_count += 1
        action = int(action)

        # Action execution
        if action == 0:
            # Move forward along heading vector
            self.position += self.step_size * self.orientation
        elif action == 1:
            # Yaw turn left (counter-clockwise)
            self.heading_angle += self.turn_angle_rad
            self.orientation = np.array([
                math.cos(self.heading_angle),
                math.sin(self.heading_angle),
                0.0
            ], dtype=np.float32)
        elif action == 2:
            # Yaw turn right (clockwise)
            self.heading_angle -= self.turn_angle_rad
            self.orientation = np.array([
                math.cos(self.heading_angle),
                math.sin(self.heading_angle),
                0.0
            ], dtype=np.float32)
        # action == 3: rest / hover

        # Keep agent inside arena bounding box
        self.position = np.clip(self.position, -self.arena_size, self.arena_size)

        # Update previous action representation
        self.previous_action = np.zeros(self.action_dim, dtype=np.float32)
        self.previous_action[action] = 1.0

        current_distance = float(np.linalg.norm(self.position - self.goal))

        # Reward computation
        done = False
        info = {
            'distance_to_goal': current_distance,
            'step_count': self.step_count,
            'reached_goal': False
        }

        if current_distance <= self.goal_radius:
            reward = self.goal_reward
            done = True
            info['reached_goal'] = True
        else:
            reward = self.step_penalty
            if self.reward_shaping:
                # Potential-based shaping: reward progress toward target
                progress = self.prev_distance - current_distance
                reward += float(progress * 1.5)

        if self.step_count >= self.max_steps:
            done = True

        self.prev_distance = current_distance

        # Record trajectory
        self.trajectory_positions.append(self.position.copy())
        self.trajectory_actions.append(action)
        self.trajectory_rewards.append(reward)

        return self._get_observation(), reward, done, info

    def _get_observation(self) -> np.ndarray:
        """Returns the 10D normalized observation vector."""
        obs = np.concatenate([
            self.position / self.arena_size,       # 3D agent pos normalized
            self.goal / self.arena_size,           # 3D goal pos normalized
            self.previous_action                   # 4D one-hot previous action
        ]).astype(np.float32)
        return obs

    def get_trajectory_dict(self, episode_idx: int = 0) -> Dict[str, Any]:
        """Returns structured dictionary of the recorded episode trajectory."""
        total_reward = float(sum(self.trajectory_rewards))
        straight_line = float(np.linalg.norm(self.trajectory_positions[-1] - self.trajectory_positions[0]))
        total_path = float(len(self.trajectory_actions) * self.step_size)
        efficiency = (straight_line / total_path) if total_path > 0 else 0.0

        return {
            'episode': episode_idx,
            'reward': total_reward,
            'steps_taken': len(self.trajectory_actions),
            'path_efficiency': efficiency,
            'goal': [float(c) for c in self.goal],
            'steps': [
                {
                    'step': i,
                    'position': [float(c) for c in pos],
                    'action': act
                }
                for i, (pos, act) in enumerate(zip(self.trajectory_positions[:-1], self.trajectory_actions))
            ]
        }
