import React, { useState } from 'react';
import {
  Lightbulb,
  Compass,
  ArrowRight,
  Sparkles,
  Zap,
  Cpu,
  Layers,
  Activity,
  ShieldCheck,
  Globe,
  BookOpen,
  Github,
  Award,
  ExternalLink,
  Target,
  BarChart3,
  Network,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';

export const AboutView = ({ onNavigateToDemo, onNavigateToDocs }) => {
  const [activeTab, setActiveTab] = useState('all');

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div style={{
      width: '100%',
      height: '100%',
      background: 'radial-gradient(ellipse at 50% 0%, rgba(91, 140, 255, 0.08) 0%, var(--bg-primary) 60%)',
      color: 'var(--text-primary)',
      overflowY: 'auto',
      padding: 'var(--space-6) var(--space-4)'
    }}>
      <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        
        {/* Hero Section */}
        <div style={{
          textAlign: 'center',
          padding: 'var(--space-6) var(--space-4) var(--space-4)',
          position: 'relative'
        }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(91, 140, 255, 0.12)',
            border: '1px solid rgba(91, 140, 255, 0.3)',
            color: 'var(--accent-primary)',
            fontSize: '12px',
            fontWeight: 600,
            marginBottom: 'var(--space-3)',
            boxShadow: '0 0 16px rgba(91, 140, 255, 0.2)'
          }}>
            <Sparkles size={14} /> FOUNDER'S THESIS &amp; RESEARCH MANIFESTO
          </div>
          
          <h1 style={{
            fontSize: '38px',
            fontWeight: 800,
            lineHeight: 1.2,
            letterSpacing: '-1px',
            marginBottom: 'var(--space-3)',
            background: 'linear-gradient(180deg, #FFFFFF 0%, #A2B6DF 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            The 1-Milliwatt Marvel vs. The Multi-Megawatt Cluster
          </h1>
          
          <p style={{
            fontSize: '16px',
            color: 'var(--text-secondary)',
            maxWidth: '720px',
            margin: '0 auto',
            lineHeight: 1.65
          }}>
            What opportunity I recognized when the world's first complete animal brain wiring diagram was mapped, and why I decided to constrain deep reinforcement learning with evolutionary connectomics.
          </p>

          {/* Quick Jump Bar */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '8px',
            marginTop: 'var(--space-4)',
            marginBottom: 'var(--space-2)'
          }}>
            {[
              { id: 'part1', label: '1. The Compute Paradox' },
              { id: 'part2', label: '2. Biological Inductive Bias' },
              { id: 'pipeline', label: '3. Architectural Pipeline' },
              { id: 'part3', label: '4. Experimental Proof' },
              { id: 'future', label: '5. Neuromorphic Future' }
            ].map((nav) => (
              <button
                key={nav.id}
                onClick={() => scrollToSection(nav.id)}
                style={{
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-full)',
                  padding: '5px 12px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                  e.currentTarget.style.background = 'rgba(91, 140, 255, 0.1)';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.04)';
                }}
              >
                {nav.label}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginTop: 'var(--space-4)' }}>
            <button
              onClick={onNavigateToDemo}
              className="btn btn-primary"
              style={{ padding: '10px 22px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Compass size={16} /> Launch 3D Simulation <ArrowRight size={14} />
            </button>
            <button
              onClick={onNavigateToDocs}
              className="btn btn-ghost"
              style={{ padding: '10px 22px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <BookOpen size={16} /> Read Technical Specs
            </button>
          </div>
        </div>

        {/* Section 1: The Opportunity I Saw */}
        <section id="part1" className="card" style={{ padding: 'var(--space-6)', position: 'relative' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-warning)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)'
          }}>
            <Lightbulb size={18} /> Part 1: The Opportunity I Saw
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            The AI Compute Paradox vs. 500 Million Years of Evolution
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            Modern artificial intelligence is trapped in an unsustainable scaling dogma: train gargantuan models with hundreds of billions of parameters across thousands of GPUs consuming megawatts of energy. Yet, when placed in continuous physical control, aerodynamic maneuvering, or complex spatial navigation, these massive networks remain fragile, sample-inefficient, and prone to catastrophic forgetting.
            <br /><br />
            Meanwhile, buzzing quietly in the air is one of the most sophisticated navigation systems on Earth: <strong><em>Drosophila melanogaster</em></strong> (the common fruit fly).
          </p>

          {/* Side-by-Side Comparison Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'var(--space-4)',
            margin: 'var(--space-4) 0'
          }}>
            {/* Standard AI Box */}
            <div style={{
              background: 'rgba(239, 68, 68, 0.04)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-danger)', textTransform: 'uppercase' }}>
                  Standard Deep RL Agent
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(239, 68, 68, 0.15)', color: '#FF7B7B', padding: '2px 8px', borderRadius: '4px' }}>
                  Brute Force
                </span>
              </div>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Architecture:</strong> Arbitrary dense Multi-Layer Perceptrons (MLPs).</li>
                <li><strong>Initial State:</strong> Random Gaussian noise (blank slate).</li>
                <li><strong>Power Budget:</strong> Kilowatts of GPU power; data-center dependent.</li>
                <li><strong>Sample Efficiency:</strong> Spends millions of iterations rediscovering fundamental geometric symmetries.</li>
                <li><strong>Explainability:</strong> Opaque black-box matrices without biological correlate.</li>
              </ul>
            </div>

            {/* Biological Fruit Fly Box */}
            <div style={{
              background: 'rgba(61, 220, 151, 0.04)',
              border: '1px solid rgba(61, 220, 151, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: 'var(--space-4)',
              display: 'flex',
              flexDirection: 'column',
              gap: '10px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-success)', textTransform: 'uppercase' }}>
                  Drosophila Melanogaster Brain
                </span>
                <span style={{ fontSize: '11px', background: 'rgba(61, 220, 151, 0.15)', color: '#3DDC97', padding: '2px 8px', borderRadius: '4px' }}>
                  Evolutionary Prior
                </span>
              </div>
              <ul style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7, paddingLeft: '16px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <li><strong>Architecture:</strong> Central Complex ring attractors &amp; columnar integrators.</li>
                <li><strong>Initial State:</strong> 500 million years of evolutionary circuit optimization.</li>
                <li><strong>Power Budget:</strong> ~1 milliwatt of biological chemical metabolism.</li>
                <li><strong>Control Prowess:</strong> 200 wingbeats/sec, instantaneous gust compensation, 3D optic tracking.</li>
                <li><strong>Explainability:</strong> 100% mapped, named cell types (E-PG, P-EN, Delta7, FB).</li>
              </ul>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-panel-raised)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-4)',
            borderLeft: '4px solid var(--accent-primary)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            lineHeight: 1.7
          }}>
            <strong>The Historic Catalyst:</strong> When HHMI Janelia Research Campus &amp; Google Research published the complete nanometer-resolution connectome (<code>male-cns:v1.0</code> via neuPrint), the synaptic blueprint of animal intelligence became public data. The research opportunity was immediate: <em>Stop training models tabula rasa on dense matrices. Use the physical connectome as a structural inductive bias.</em>
          </div>
        </section>

        {/* Section 2: What I Decided To Do About It */}
        <section id="part2" className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-primary)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)'
          }}>
            <Cpu size={18} /> Part 2: What I Decided To Do About It
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Engineering a Connectome-Constrained Reinforcement Learning Policy
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            Instead of using neuroscience as a vague conceptual metaphor, I formulated the connectome as an <strong>enforceable architectural constraint</strong> in PyTorch:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)' }}>
            <div style={{
              background: 'var(--bg-panel-raised)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(91, 140, 255, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Network size={20} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>1. Strict Synaptic Masking</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                I isolated the Central Complex (CX) navigation circuit (850 biological neurons, 44,608 confirmed synapses) and compiled it into a hard binary adjacency mask. Zero gradient flows across non-existent biological connections.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-panel-raised)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(61, 220, 151, 0.15)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Activity size={20} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>2. Continuous 3D Aerodynamics</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                I designed a 3D flight environment governed by drag, continuous thrust, yaw heading, and goal attraction, requiring the agent to navigate through dense spatial coordinates toward targets.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-panel-raised)',
              padding: 'var(--space-4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-subtle)'
            }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'rgba(251, 191, 36, 0.15)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '12px' }}>
                <Globe size={20} />
              </div>
              <h4 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>3. Real-Time WebGL Simulator</h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                I built this open-source WebGL platform featuring synchronized agent comparison, an interactive 3D fly with flapping wings, and an immersive Chase Cam so anyone can inspect the fly's brain manifold.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: The 4-Stage Architectural Pipeline */}
        <section id="pipeline" className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-primary)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)'
          }}>
            <Layers size={18} /> Technical Pipeline
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            From Biological Connectome to Deep Reinforcement Learning
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            How we translate nanometer-scale electron microscopy images from HHMI Janelia into real-time reinforcement learning flight controllers:
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: 'var(--space-3)'
          }}>
            {[
              {
                step: '01',
                title: 'EM Connectome Query',
                desc: 'Query neuPrint API for male-cns:v1.0 Central Complex ROIs (EB, PB, FB, NO, LAL).',
                tag: 'Janelia neuPrint'
              },
              {
                step: '02',
                title: 'Graph Extraction',
                desc: '850 identified neurons and 44,608 directed synapses compiled into sparse adjacency matrix A.',
                tag: 'NetworkX / Scipy'
              },
              {
                step: '03',
                title: 'Topological Masking',
                desc: 'PyTorch custom linear layer enforces W = W_learnable ⊙ A on forward and backward passes.',
                tag: 'PyTorch Tensor'
              },
              {
                step: '04',
                title: 'PPO Flight Control',
                desc: 'Actor-Critic agent learns 3D continuous flight policies to maximize navigation reward.',
                tag: 'Proximal Policy Opt.'
              }
            ].map((p) => (
              <div
                key={p.step}
                style={{
                  background: 'var(--bg-panel-raised)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-4)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="font-mono" style={{ fontSize: '12px', fontWeight: 800, color: 'var(--accent-primary)' }}>
                    {p.step}
                  </span>
                  <span style={{ fontSize: '10px', background: 'rgba(91, 140, 255, 0.1)', color: 'var(--accent-primary)', padding: '2px 6px', borderRadius: '4px' }}>
                    {p.tag}
                  </span>
                </div>
                <h4 style={{ fontSize: '13px', fontWeight: 600 }}>{p.title}</h4>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Section 4: What We Discovered */}
        <section id="part3" className="card" style={{ padding: 'var(--space-6)' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            color: 'var(--accent-success)',
            fontSize: '12px',
            fontWeight: 700,
            letterSpacing: '0.6px',
            textTransform: 'uppercase',
            marginBottom: 'var(--space-2)'
          }}>
            <Award size={18} /> Part 3: What the Results Proved
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: 700, marginBottom: 'var(--space-3)' }}>
            Biological Inductive Biases Accelerate Intelligence
          </h2>

          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: 'var(--space-4)' }}>
            Through rigorous ablation benchmarking against unconstrained MLPs, randomized topology controls, and pruned synaptic variants, the empirical data revealed three fundamental findings:
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-4)', marginBottom: 'var(--space-4)' }}>
            <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-primary)' }}>+17.2%</div>
              <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Faster Learning Convergence</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>1,200 episodes vs 1,450 for baseline</div>
            </div>

            <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-success)' }}>78.4%</div>
              <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Path Trajectory Efficiency</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>vs 65.1% for unconstrained MLP</div>
            </div>

            <div style={{ background: 'var(--bg-panel-raised)', border: '1px solid var(--border-subtle)', padding: 'var(--space-4)', borderRadius: 'var(--radius-md)', textAlign: 'center' }}>
              <div className="font-mono" style={{ fontSize: '32px', fontWeight: 800, color: 'var(--accent-warning)' }}>92.8%</div>
              <div style={{ fontSize: '12px', fontWeight: 600, marginTop: '4px' }}>Synaptic Sparsity</div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>Pruning 50% synapses loses only 3.5% reward</div>
            </div>
          </div>

          <div style={{
            padding: 'var(--space-4)',
            background: 'rgba(61, 220, 151, 0.05)',
            border: '1px solid rgba(61, 220, 151, 0.25)',
            borderRadius: 'var(--radius-md)',
            fontSize: '13px',
            color: 'var(--text-primary)',
            lineHeight: 1.7
          }}>
            <strong>Core Scientific Conclusion:</strong> Biological neural structure is not random wiring; it is an optimized coordinate system. Ring attractor dynamics in the Ellipsoid Body maintain an internal heading compass, while the Protocerebral Bridge integrates angular velocity, giving the agent a pre-configured spatial prior that traditional deep networks must waste millions of steps trying to infer.
          </div>
        </section>

        {/* Section 5: Future Horizons & Neuromorphic Edge */}
        <section id="future" style={{
          background: 'linear-gradient(135deg, rgba(91, 140, 255, 0.12) 0%, rgba(61, 220, 151, 0.08) 100%)',
          border: '1px solid rgba(91, 140, 255, 0.25)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-4)'
        }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              background: 'rgba(91, 140, 255, 0.2)',
              color: 'var(--accent-primary)',
              fontSize: '11px',
              fontWeight: 600,
              marginBottom: '8px'
            }}>
              <Cpu size={13} /> FUTURE HORIZONS
            </div>
            <h3 style={{ fontSize: '20px', fontWeight: 700, marginBottom: '8px' }}>
              The Road Ahead: Neuromorphic Robotics &amp; Micro-Drones
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
              This platform lays the groundwork for compiling biological connectomes directly onto next-generation neuromorphic hardware (such as Intel Loihi 2 and BrainChip Akida). By mapping event-based spiking neural networks directly from Drosophila Central Complex graphs, we can power autonomous micro-drones (MAVs) to execute agile obstacle evasion and search-and-rescue flights in GPS-denied tunnels on less than 50 milliwatts of total battery power.
            </p>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingTop: 'var(--space-4)',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            flexWrap: 'wrap',
            gap: '12px'
          }}>
            <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              Open-source neuro-AI research &bull; HHMI Janelia male-cns:v1.0 &bull; PyTorch &amp; Three.js
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={onNavigateToDemo}
                className="btn btn-primary"
                style={{ fontSize: '12px', padding: '7px 16px' }}
              >
                <Compass size={14} /> Back to Simulation
              </button>
              <a
                href="https://github.com/manas-dange/connectome-agent"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
                style={{ fontSize: '12px', padding: '7px 16px', display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                <Github size={14} /> Star on GitHub <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default AboutView;
