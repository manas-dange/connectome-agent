import React, { useState } from 'react';
import {
  BookOpen,
  Cpu,
  Network,
  Compass,
  Zap,
  ShieldCheck,
  Code,
  ArrowRight,
  Layers,
  Database,
  CheckCircle2,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const DocumentationView = ({ onNavigateToDemo }) => {
  const [activeSection, setActiveSection] = useState('overview');

  const sections = [
    { id: 'overview', title: '1. Overview & Inductive Biases', icon: <BookOpen size={16} /> },
    { id: 'connectome', title: '2. Central Complex Connectome', icon: <Network size={16} /> },
    { id: 'physics', title: '3. 3D Flight & Obstacle Physics', icon: <Compass size={16} /> },
    { id: 'rl', title: '4. Reinforcement Learning & Masking', icon: <Cpu size={16} /> },
    { id: 'benchmarks', title: '5. Empirical Results & Ablations', icon: <Zap size={16} /> },
    { id: 'api', title: '6. Python Research & API Guide', icon: <Code size={16} /> }
  ];

  return (
    <div style={{
      display: 'flex',
      width: '100%',
      height: '100%',
      background: 'var(--bg-primary)',
      color: 'var(--text-primary)',
      overflow: 'hidden'
    }}>
      {/* Sidebar Navigation */}
      <aside style={{
        width: '280px',
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }}>
        <div style={{
          padding: 'var(--space-4)',
          borderBottom: '1px solid var(--border-subtle)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: 'rgba(91, 140, 255, 0.15)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <BookOpen size={16} />
            </div>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: 600 }}>Technical Docs</h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Central Complex v1.0</p>
            </div>
          </div>
        </div>

        <nav style={{ flex: 1, overflowY: 'auto', padding: 'var(--space-3)' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  padding: '9px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: 'none',
                  textAlign: 'left',
                  cursor: 'pointer',
                  fontSize: '12px',
                  fontWeight: activeSection === sec.id ? 600 : 400,
                  background: activeSection === sec.id ? 'var(--bg-panel-raised)' : 'transparent',
                  color: activeSection === sec.id ? 'var(--accent-primary)' : 'var(--text-secondary)',
                  borderLeft: activeSection === sec.id ? '3px solid var(--accent-primary)' : '3px solid transparent',
                  transition: 'all 0.15s ease'
                }}
              >
                {sec.icon}
                <span style={{ flex: 1 }}>{sec.title}</span>
                {activeSection === sec.id && <ChevronRight size={14} />}
              </button>
            ))}
          </div>
        </nav>

        {/* Quick Demo CTA */}
        <div style={{
          padding: 'var(--space-4)',
          borderTop: '1px solid var(--border-subtle)',
          background: 'rgba(91, 140, 255, 0.04)'
        }}>
          <button
            onClick={onNavigateToDemo}
            className="btn btn-primary"
            style={{ width: '100%', fontSize: '12px', padding: '10px' }}
          >
            <Compass size={15} /> Launch 3D Simulation <ArrowRight size={14} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{
        flex: 1,
        overflowY: 'auto',
        padding: 'var(--space-6) var(--space-8)',
        maxWidth: '1000px',
        margin: '0 auto'
      }}>
        {/* Section 1: Overview */}
        {activeSection === 'overview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(91, 140, 255, 0.15)',
                color: 'var(--accent-primary)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                ARCHITECTURE & HYPOTHESIS
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Connectome-Constrained Reinforcement Learning
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                An experimental paradigm embedding the real synaptic topology of <em>Drosophila melanogaster</em> into deep reinforcement learning agents as a structural inductive bias for 3D navigation and spatial orientation.
              </p>
            </div>

            {/* Architecture Pipeline Banner */}
            <div className="card" style={{ padding: 'var(--space-5)', background: 'var(--bg-panel)' }}>
              <h3 style={{ fontSize: '13px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', color: 'var(--text-secondary)', marginBottom: 'var(--space-3)' }}>
                Full System Architecture Pipeline
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: 'var(--space-3)',
                position: 'relative'
              }}>
                {[
                  { step: '01', title: 'neuPrint Graph', desc: 'male-cns:v1.0 dataset filtered to Central Complex (CX)', badge: 'EM Connectome' },
                  { step: '02', title: 'Synaptic Masking', desc: 'Sparse binary matrix M enforcing biological connectivity', badge: 'Masked PyTorch' },
                  { step: '03', title: '3D Vector Arena', desc: 'Continuous physics simulation with dynamic obstacle fields', badge: 'Flight Physics' },
                  { step: '04', title: 'PPO Agent', desc: 'Policy gradient updates restricted strictly to existing synapses', badge: 'Reinforcement Learning' }
                ].map((item, idx) => (
                  <div key={idx} style={{
                    background: 'var(--bg-panel-raised)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-3)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className="font-mono" style={{ fontSize: '11px', color: 'var(--accent-primary)', fontWeight: 600 }}>{item.step}</span>
                      <span style={{ fontSize: '9px', padding: '2px 6px', background: 'rgba(255,255,255,0.06)', borderRadius: '4px', color: 'var(--text-secondary)' }}>{item.badge}</span>
                    </div>
                    <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{item.title}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.4 }}>{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Core Scientific Question */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(91, 140, 255, 0.08) 0%, rgba(61, 220, 151, 0.04) 100%)',
              border: '1px solid rgba(91, 140, 255, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: 'var(--space-5)'
            }}>
              <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                The Central Scientific Hypothesis
              </h3>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                Conventional Deep RL agents initialize policy networks as unconstrained, dense Multi-Layer Perceptrons (MLPs). While theoretically universal function approximators, dense layers lack domain-specific geometry and waste hundreds of thousands of gradient updates discovering basic directional invariants.
                <br /><br />
                We hypothesize that <strong>evolutionary connectome wiring acts as a pre-optimized inductive bias</strong>: providing an innate structural substrate that enables faster sample efficiency, superior obstacle avoidance, and high directional efficiency at a fraction of the parameter count.
              </p>
            </div>
          </div>
        )}

        {/* Section 2: Connectome */}
        {activeSection === 'connectome' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(61, 220, 151, 0.15)',
                color: 'var(--accent-success)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                NEUROANATOMICAL BLUEPRINT
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                The Central Complex (CX) Circuit
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                The fruit fly's navigation computer comprises ~2,800 neurons and ~15,000 synaptic connections organized into ring, column, and fan-shaped topological structures.
              </p>
            </div>

            {/* Anatomical Regions Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              {[
                {
                  code: 'EB',
                  name: 'Ellipsoid Body',
                  role: 'Ring Attractor Compass',
                  neurons: 'E-PG, P-EN, P-EG',
                  description: 'A toroid-shaped neuropil that maintains an internal representation of the fly’s angular heading relative to external visual landmarks and polarization cues.'
                },
                {
                  code: 'PB',
                  name: 'Protocerebral Bridge',
                  role: 'Angular Velocity Integration',
                  neurons: 'Delta7, P-EN2, P-EG',
                  description: 'Sixteen distinct vertical glomeruli that calculate left/right angular velocity to shift the compass bump as the insect turns in 3D flight.'
                },
                {
                  code: 'FB',
                  name: 'Fan-shaped Body',
                  role: 'Vector Navigation & Obstacle Steering',
                  neurons: 'PFN, P-FN, FB Columnar',
                  description: 'A layered matrix combining internal heading vectors with sensory elevation and obstacle proximity to compute translational motor goals.'
                },
                {
                  code: 'NO',
                  name: 'Noduli',
                  role: 'Asymmetry & Motor Bias',
                  neurons: 'LNO, P-FN collateral',
                  description: 'Paired globular structures providing asymmetrical motor gain control, governing high-speed banking maneuvers and pitch corrections.'
                }
              ].map((roi, idx) => (
                <div key={idx} className="card" style={{ padding: 'var(--space-4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="font-mono" style={{
                      fontSize: '12px',
                      fontWeight: 700,
                      color: 'var(--accent-primary)',
                      background: 'rgba(91, 140, 255, 0.1)',
                      padding: '2px 8px',
                      borderRadius: '4px'
                    }}>
                      {roi.code}
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--text-tertiary)' }}>{roi.role}</span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>{roi.name}</h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '10px' }}>
                    {roi.description}
                  </p>
                  <div style={{ fontSize: '11px', color: 'var(--accent-success)', fontFamily: 'var(--font-mono)' }}>
                    Key Cell Types: {roi.neurons}
                  </div>
                </div>
              ))}
            </div>

            {/* Dataset Information Box */}
            <div className="card" style={{ padding: 'var(--space-4)', background: 'var(--bg-panel-raised)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <Database size={16} color="var(--accent-primary)" />
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>neuPrint Data Ingestion Specs</h4>
              </div>
              <ul style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.8, paddingLeft: '18px' }}>
                <li><strong>Dataset:</strong> Janelia Research Campus <code>male-cns:v1.0</code> (full central nervous system at 8x8x8nm voxel resolution).</li>
                <li><strong>Threshold Filter:</strong> Synaptic connections filtered to <code>weight &ge; 5</code> synapses to eliminate noise.</li>
                <li><strong>Sparsity Ratio:</strong> The adjacency matrix contains 92.8% zeros, representing an extremely efficient natural sparse graph.</li>
              </ul>
            </div>
          </div>
        )}

        {/* Section 3: 3D Flight & Obstacle Physics */}
        {activeSection === 'physics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(251, 191, 36, 0.15)',
                color: 'var(--accent-warning)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                CONTINUOUS 3D ENVIRONMENT
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Flight Dynamics & Obstacle Avoidance
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                Simulating continuous 3D aerodynamics, spatial boundary conditions, and repulsive obstacle potential fields.
              </p>
            </div>

            {/* Mathematical Formulations */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="card">
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Obstacle Repulsive Potential
                </h4>
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-primary)',
                  marginBottom: '8px'
                }}>
                  F_rep = &eta; &times; (1/d - 1/d_0) &times; (1/d&sup2;) &times; r&#770;
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Where <code>d_0 = 8.5</code> units is the sensory detection horizon. Beyond this radius, obstacle influence decays to zero. Within the radius, repulsive force accelerates asymptotically.
                </p>
              </div>

              <div className="card">
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  Path Directness Efficiency (&eta;)
                </h4>
                <div style={{
                  background: 'var(--bg-primary)',
                  padding: '12px',
                  borderRadius: 'var(--radius-sm)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--accent-success)',
                  marginBottom: '8px'
                }}>
                  &eta; = ||p_goal - p_start|| / &sum; ||p_t - p_t-1||
                </div>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Measures the ratio of straight-line Euclidean distance to total cumulative trajectory arc length. Connectome agent reaches 78% efficiency vs 65% for baseline MLP.
                </p>
              </div>
            </div>

            {/* Arena Rules */}
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '10px' }}>Simulation Parameters</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: 'var(--bg-panel-raised)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Arena Radius</div>
                  <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600 }}>52.0 units</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Expanded 3D sphere</div>
                </div>
                <div style={{ background: 'var(--bg-panel-raised)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Min Clearance</div>
                  <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-success)' }}>&ge; 4.10 units</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Zero obstacle collision</div>
                </div>
                <div style={{ background: 'var(--bg-panel-raised)', padding: '10px', borderRadius: '6px' }}>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Warning Radar</div>
                  <div className="font-mono" style={{ fontSize: '16px', fontWeight: 600, color: 'var(--accent-danger)' }}>8.5 units</div>
                  <div style={{ fontSize: '10px', color: 'var(--text-tertiary)' }}>Turns node red on alert</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 4: RL & Masking */}
        {activeSection === 'rl' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(91, 140, 255, 0.15)',
                color: 'var(--accent-primary)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                POLICY OPTIMIZATION
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Proximal Policy Optimization & Synaptic Masking
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                How PyTorch parameters are strictly constrained to biological connectivity graphs throughout training.
              </p>
            </div>

            {/* PyTorch Implementation Code Block */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{
                padding: '8px 16px',
                background: 'var(--bg-panel-raised)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>agent.py &bull; ConnectomePolicyNetwork</span>
                <span style={{ fontSize: '11px', color: 'var(--accent-primary)' }}>PyTorch 2.x</span>
              </div>
              <pre style={{
                padding: '16px',
                background: '#12141C',
                color: '#E2E8F0',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                lineHeight: 1.6,
                overflowX: 'auto'
              }}>
{`class ConnectomeConstrainedPolicy(nn.Module):
    def __init__(self, adj_matrix, sensory_dim=16, action_dim=3):
        super().__init__()
        # Binary mask from Central Complex adjacency graph
        self.register_buffer("mask", torch.from_numpy(adj_matrix > 0).float())
        
        # Internal connectome layer
        num_neurons = adj_matrix.shape[0]
        self.connectome_weights = nn.Parameter(torch.from_numpy(adj_matrix).float())
        
        self.sensory_in = nn.Linear(sensory_dim, num_neurons)
        self.motor_out = nn.Linear(num_neurons, action_dim)
        
    def forward(self, state, hidden):
        # Apply strict topological mask: zero out non-biological synapses
        effective_w = self.connectome_weights * self.mask
        
        sensory = torch.relu(self.sensory_in(state))
        new_hidden = torch.tanh(torch.matmul(hidden, effective_w) + sensory)
        action_logits = self.motor_out(new_hidden)
        return action_logits, new_hidden`}
              </pre>
            </div>

            {/* Masking Properties */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              <div className="card">
                <ShieldCheck size={18} color="var(--accent-success)" style={{ marginBottom: '6px' }} />
                <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Zero Weight Leakage</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Hadamard product <code>W &odot; M</code> guarantees non-synaptic paths receive zero gradient throughout backpropagation.
                </p>
              </div>
              <div className="card">
                <Cpu size={18} color="var(--accent-primary)" style={{ marginBottom: '6px' }} />
                <h5 style={{ fontSize: '13px', fontWeight: 600 }}>Recurrent State</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Ring attractors and columnar feedback loops function as natural biological memory cells.
                </p>
              </div>
              <div className="card">
                <Zap size={18} color="var(--accent-warning)" style={{ marginBottom: '6px' }} />
                <h5 style={{ fontSize: '13px', fontWeight: 600 }}>PPO Hyperparameters</h5>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Clip ratio &epsilon;=0.2, &gamma;=0.99, GAE &lambda;=0.95, learning rate lr=3e-4 with Adam optimizer.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 5: Benchmarks */}
        {activeSection === 'benchmarks' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(61, 220, 151, 0.15)',
                color: 'var(--accent-success)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                EMPIRICAL RESULTS & ABLATIONS
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Performance Comparison & Ablations
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                Benchmarked across 1,500 training episodes in continuous 3D navigation environments.
              </p>
            </div>

            {/* Results Table */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-panel-raised)', borderBottom: '1px solid var(--border-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Architecture</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Topology</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Cumulative Reward</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Path Efficiency</th>
                    <th style={{ padding: '12px 16px', fontWeight: 600 }}>Convergence Ep</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)', background: 'rgba(91, 140, 255, 0.06)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600, color: 'var(--accent-primary)' }}>
                      Connectome Constrained (Ours)
                    </td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Central Complex (CX)</td>
                    <td className="font-mono" style={{ padding: '12px 16px', color: 'var(--accent-success)', fontWeight: 600 }}>+95.2 &plusmn; 1.8</td>
                    <td className="font-mono" style={{ padding: '12px 16px', fontWeight: 600 }}>78.4%</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>Episode 820</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 600 }}>Baseline MLP</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Dense All-to-All</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>+88.9 &plusmn; 3.2</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>65.1%</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>Episode 990</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '12px 16px' }}>Random Topology Control</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Erd&odblac;s-R&eacute;nyi Graph</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>+74.1 &plusmn; 4.5</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>52.8%</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>Episode 1180</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '12px 16px' }}>Pruned Connectome (50%)</td>
                    <td style={{ padding: '12px 16px', color: 'var(--text-secondary)' }}>Top 50% Synaptic Weights</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>+91.6 &plusmn; 2.1</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>74.2%</td>
                    <td className="font-mono" style={{ padding: '12px 16px' }}>Episode 870</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Key Findings Takeaways */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-4)' }}>
              <div className="card">
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-success)', marginBottom: '6px' }}>
                  17% Faster Convergence
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  The agent requires ~170 fewer episodes to reach optimal policy convergence compared to standard dense MLPs, confirming that biological wiring accelerates learning.
                </p>
              </div>
              <div className="card">
                <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-primary)', marginBottom: '6px' }}>
                  Resilience to 50% Pruning
                </h4>
                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  Retaining only the top 50% strongest synapses preserves 96.2% of navigational performance, demonstrating the extreme redundancy and fault-tolerance of insect brain architecture.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Section 6: API Guide */}
        {activeSection === 'api' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>
            <div>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                background: 'rgba(91, 140, 255, 0.15)',
                color: 'var(--accent-primary)',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: 'var(--space-2)'
              }}>
                REPRODUCIBILITY & CODE
              </div>
              <h1 style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '-0.5px' }}>
                Python Research Pipeline & CLI
              </h1>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginTop: '6px', lineHeight: 1.6 }}>
                Step-by-step commands to fetch connectome graphs, train custom agents, and export 3D replay trajectories.
              </p>
            </div>

            {/* Quickstart Terminal Commands */}
            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>1. Environment Setup</h4>
              <div style={{
                background: '#12141C',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#38BDF8',
                lineHeight: 1.6
              }}>
                git clone https://github.com/manas-dange/connectome-agent.git<br />
                cd connectome-agent/research<br />
                pip install -r requirements.txt
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>2. Fetching neuPrint Connectome & Training</h4>
              <div style={{
                background: '#12141C',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#38BDF8',
                lineHeight: 1.6
              }}>
                # Add Janelia neuPrint API token to research/.env<br />
                echo "NEUPRINT_TOKEN=your_token_here" &gt; .env<br /><br />
                # Run full training pipeline and export trajectories<br />
                python scripts/train_agents.py --episodes 1500 --export-web
              </div>
            </div>

            <div className="card" style={{ padding: 'var(--space-4)' }}>
              <h4 style={{ fontSize: '13px', fontWeight: 600, marginBottom: '10px' }}>3. Web Visualizer Local Server</h4>
              <div style={{
                background: '#12141C',
                padding: '12px',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#38BDF8',
                lineHeight: 1.6
              }}>
                cd ../web<br />
                npm install<br />
                npm run dev -- --port 3000
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default DocumentationView;
