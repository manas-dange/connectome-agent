"""
FastAPI backend service for live Connectome Navigation Agent inference.
Serves model evaluations, real-time agent policy steps, and full episode simulations.
"""

import os
import sys
import json
from typing import List, Optional
import numpy as np
import torch
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

# Ensure project root is in sys.path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from research.src.config import CONFIG
from research.src.connectome_utils import ConnectomeData, ConnectomeAnalysis, prune_graph_by_weight_threshold
from research.src.agent import ConnectomeConstrainedAgent, BaselineAgent, RandomWeightAgent
from research.src.environment import FlyNavigationEnv

app = FastAPI(
    title="Connectome Agent Inference API",
    description="Live neural policy inference and connectome graph analytics for Drosophila-inspired navigation agents.",
    version="1.0.0"
)

# Enable CORS for local and web demo access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global models and environment cache
MODELS = {}
BASE_GRAPH = None
CX_GRAPH = None
NEURONS_DF = None


@app.on_event("startup")
def startup_event():
    """Load connectome graphs and pre-instantiate agent policies."""
    global BASE_GRAPH, CX_GRAPH, NEURONS_DF, MODELS

    data = ConnectomeData()
    NEURONS_DF = data.fetch_all_neurons()
    connectivity = data.fetch_connectivity(min_synapses=CONFIG['synapse_threshold'])
    BASE_GRAPH = data.build_networkx_graph(connectivity)

    analysis = ConnectomeAnalysis(BASE_GRAPH, NEURONS_DF)
    CX_GRAPH = analysis.get_subgraph_by_roi(CONFIG['connectome_roi'])

    # Instantiate agents
    pruned_50_graph = prune_graph_by_weight_threshold(CX_GRAPH, percentile=50.0)
    pruned_90_graph = prune_graph_by_weight_threshold(CX_GRAPH, percentile=10.0)

    MODELS['connectome_constrained'] = ConnectomeConstrainedAgent(
        CX_GRAPH, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG
    )
    MODELS['random_weights'] = RandomWeightAgent(
        CX_GRAPH, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG
    )
    MODELS['pruned_50'] = ConnectomeConstrainedAgent(
        pruned_50_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG
    )
    MODELS['pruned_90'] = ConnectomeConstrainedAgent(
        pruned_90_graph, CONFIG['sensory_dim'], CONFIG['action_dim'], CONFIG
    )
    MODELS['baseline'] = BaselineAgent(
        CONFIG['sensory_dim'], CONFIG['hidden_dim'], CONFIG['action_dim'], CONFIG
    )

    # Attempt to load trained weights if available
    exp_dir = os.path.join(os.path.dirname(__file__), '../research/experiments')
    for name, agent in MODELS.items():
        ckpt_path = os.path.join(exp_dir, name, 'final_agent.pt')
        if os.path.exists(ckpt_path):
            try:
                agent.load_state_dict(torch.load(ckpt_path, map_location='cpu'))
                print(f"[Backend] Successfully loaded checkpoint for {name}")
            except Exception as e:
                print(f"[Backend] Checkpoint load note for {name}: {e}")
        agent.eval()


# Pydantic Schemas
class StepRequest(BaseModel):
    agent_type: str = Field(default='connectome_constrained', description="Agent model variant")
    observation: List[float] = Field(..., description="10D observation vector: [pos_x, pos_y, pos_z, goal_x, goal_y, goal_z, dist, angle, prev_act, prev_act_onehot]")


class StepResponse(BaseModel):
    action: int
    action_probabilities: List[float]
    value: float
    active_neuron_count: int
    top_activated_neurons: List[dict]


class SimulateRequest(BaseModel):
    agent_type: str = Field(default='connectome_constrained')
    max_steps: Optional[int] = Field(default=80)
    seed: Optional[int] = Field(default=42)


@app.get("/health")
def health():
    """Health check and model registry status."""
    return {
        "status": "healthy",
        "device": "cpu",
        "num_models_loaded": len(MODELS),
        "available_agents": list(MODELS.keys()),
        "connectome_neurons": CX_GRAPH.number_of_nodes() if CX_GRAPH else 0,
        "connectome_synapses": CX_GRAPH.number_of_edges() if CX_GRAPH else 0
    }


@app.get("/api/connectome")
def get_connectome_summary():
    """Retrieve topological statistics for the Central Complex subgraph."""
    if CX_GRAPH is None or NEURONS_DF is None:
        raise HTTPException(status_code=503, detail="Connectome graph not initialized.")

    analysis = ConnectomeAnalysis(CX_GRAPH, NEURONS_DF)
    stats = analysis.print_statistics()
    hubs = analysis.compute_centrality('degree').head(10).to_dict(orient='records')

    return {
        "roi": CONFIG['connectome_roi'],
        "statistics": stats,
        "top_hub_neurons": hubs
    }


@app.get("/api/experiments")
def get_experiment_results():
    """Retrieve precomputed comparative metrics for all 5 ablation conditions."""
    summary_path = os.path.join(
        os.path.dirname(__file__),
        '../web/public/data/experiment_results/summary.json'
    )
    if os.path.exists(summary_path):
        with open(summary_path, 'r', encoding='utf-8') as f:
            return json.load(f)

    # Fallback to research experiment metrics
    research_summary = os.path.join(
        os.path.dirname(__file__),
        '../research/experiments/summary.csv'
    )
    if os.path.exists(research_summary):
        import pandas as pd
        df = pd.read_csv(research_summary)
        return df.to_dict(orient='records')

    return {"message": "Experiments in progress or precomputed files not found."}


@app.post("/api/step", response_model=StepResponse)
def run_step(request: StepRequest):
    """Executes a single policy inference step with activation inspection."""
    if request.agent_type not in MODELS:
        raise HTTPException(status_code=400, detail=f"Unknown agent type '{request.agent_type}'. Valid: {list(MODELS.keys())}")

    if len(request.observation) != 10:
        raise HTTPException(status_code=400, detail=f"Observation must be 10D, received {len(request.observation)}D.")

    agent = MODELS[request.agent_type]
    obs_tensor = torch.tensor(request.observation, dtype=torch.float32).unsqueeze(0)

    with torch.no_grad():
        dist, value = agent(obs_tensor)
        action = int(dist.sample().item())
        probs = dist.probs.squeeze(0).tolist()
        val = float(value.item())

        top_neurons = []
        active_count = 0
        if hasattr(agent, 'last_hidden') and agent.last_hidden is not None:
            hidden = agent.last_hidden.squeeze(0).cpu().numpy()
            active_mask = hidden > 0.01
            active_count = int(np.sum(active_mask))
            top_indices = np.argsort(hidden)[-5:][::-1]
            top_neurons = [
                {"neuron_index": int(idx), "activation": float(hidden[idx])}
                for idx in top_indices
            ]

    return StepResponse(
        action=action,
        action_probabilities=probs,
        value=val,
        active_neuron_count=active_count,
        top_activated_neurons=top_neurons
    )


@app.post("/api/simulate")
def simulate_episode(request: SimulateRequest):
    """Simulates an entire 3D navigation episode and returns the full trajectory."""
    if request.agent_type not in MODELS:
        raise HTTPException(status_code=400, detail=f"Unknown agent type '{request.agent_type}'")

    agent = MODELS[request.agent_type]
    env_cfg = CONFIG.copy()
    if request.max_steps:
        env_cfg['max_steps'] = request.max_steps

    env = FlyNavigationEnv(env_cfg)
    obs = env.reset(seed=request.seed)

    steps = []
    total_reward = 0.0
    done = False
    step_idx = 0

    while not done and step_idx < env_cfg['max_steps']:
        pos = env.position.copy().tolist()
        obs_tensor = torch.tensor(obs, dtype=torch.float32).unsqueeze(0)

        with torch.no_grad():
            dist, _ = agent(obs_tensor)
            action = int(torch.argmax(dist.probs, dim=-1).item())

        obs, reward, done, _ = env.step(action)
        total_reward += reward

        steps.append({
            "step": step_idx,
            "position": [round(p, 2) for p in pos],
            "action": action,
            "reward": round(reward, 2)
        })
        step_idx += 1

    return {
        "agent_type": request.agent_type,
        "total_reward": round(total_reward, 2),
        "steps_count": len(steps),
        "reached_goal": done and total_reward > 50,
        "goal": [round(g, 2) for g in env.goal_pos.tolist()],
        "steps": steps
    }


if __name__ == '__main__':
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
