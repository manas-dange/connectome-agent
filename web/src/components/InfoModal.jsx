import React, { useEffect, useRef } from 'react';
import { X, ExternalLink, Brain, Network, Award } from 'lucide-react';

export const InfoModal = ({ isOpen, onClose }) => {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (isOpen) {
      dialog.showModal();
    } else {
      dialog.close();
    }
  }, [isOpen]);

  const handleBackdropClick = (e) => {
    if (e.target === dialogRef.current) {
      onClose();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onClose={onClose}
      style={{
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-panel)',
        color: 'var(--text-primary)',
        padding: 'var(--space-5)',
        maxWidth: '560px',
        width: '90vw',
        margin: 'auto',
        boxShadow: '0 20px 48px rgba(0, 0, 0, 0.7)'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Brain size={20} color="var(--accent-primary)" />
          <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Project Methodology & Connectome</h2>
        </div>
        <button
          onClick={onClose}
          className="btn-icon"
          style={{ width: '30px', height: '30px' }}
          aria-label="Close Modal"
        >
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div style={{ fontSize: '13px', lineHeight: 1.6, color: 'var(--text-secondary)' }}>
        <p style={{ marginBottom: 'var(--space-3)' }}>
          This project investigates whether biological neural architecture provides useful inductive biases for artificial reinforcement learning agents.
        </p>

        {/* Highlight Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-3)', margin: 'var(--space-4) 0' }}>
          <div style={{ background: 'var(--bg-panel-raised)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-primary)', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Network size={14} /> Dataset
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 500 }}>
              male-cns:v1.0
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>HHMI Janelia & Google Research</div>
          </div>

          <div style={{ background: 'var(--bg-panel-raised)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ color: 'var(--accent-success)', fontWeight: 600, fontSize: '12px', display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Award size={14} /> Subcircuit
            </div>
            <div style={{ fontSize: '13px', color: 'var(--text-primary)', marginTop: '4px', fontWeight: 500 }}>
              Central Complex (CX)
            </div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>850 real neurons · 44,608 real synapses</div>
          </div>
        </div>

        <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)', marginTop: 'var(--space-4)', marginBottom: 'var(--space-2)' }}>
          Key Experimental Findings
        </h4>
        <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <li><strong>~17% Faster Learning:</strong> Connectome agents reach optimal performance in 1,200 episodes vs 1,450 for unconstrained baselines.</li>
          <li><strong>Synapse Counts Matter:</strong> Scrambling connection strengths while keeping topology causes a 7.4% performance drop.</li>
          <li><strong>Robustness to Pruning:</strong> Pruning 50% of the weakest synapses causes only a 3.5% loss in performance.</li>
        </ul>
      </div>

      {/* Footer Links */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 'var(--space-3)',
        marginTop: 'var(--space-5)',
        paddingTop: 'var(--space-4)',
        borderTop: '1px solid var(--border-subtle)'
      }}>
        <a
          href="https://neuprint.janelia.org"
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-ghost"
          style={{ fontSize: '12px', textDecoration: 'none' }}
        >
          neuPrint Database <ExternalLink size={13} />
        </a>

        <button onClick={onClose} className="btn btn-primary" style={{ fontSize: '12px' }}>
          Close
        </button>
      </div>
    </dialog>
  );
};
