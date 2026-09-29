import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity } from 'lucide-react';
import { ActivationSparkline } from './ActivationSparkline';

export const AgentController = ({
  agentType,
  onAgentTypeChange,
  currentStep,
  totalSteps,
  cumulativeReward,
  pathEfficiency,
  isPlaying,
  onPlayToggle,
  onReset,
  onSeek
}) => {
  return (
    <div className="card" style={{ marginBottom: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-3)' }}>
        <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} color="var(--accent-primary)" /> Agent Controller
        </h3>
        <span className="font-mono" style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Step <strong style={{ color: 'var(--text-primary)' }}>{currentStep}</strong> / {totalSteps}
        </span>
      </div>

      {/* Architecture Selector */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
          Neural Architecture:
        </label>
        <select
          className="select-input"
          value={agentType}
          onChange={(e) => onAgentTypeChange(e.target.value)}
        >
          <option value="connectome">Connectome-Constrained (Fly Brain)</option>
          <option value="baseline">Baseline (Unconstrained MLP)</option>
        </select>
      </div>

      {/* Playback Controls & Scrubber */}
      <div style={{ marginBottom: 'var(--space-3)' }}>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-3)' }}>
          <button
            onClick={onPlayToggle}
            className="btn btn-primary"
            style={{ flex: 1, height: '40px' }}
            aria-label={isPlaying ? "Pause Playback" : "Play Navigation"}
          >
            {isPlaying ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Play</>}
          </button>

          <button
            onClick={onReset}
            className="btn btn-ghost"
            style={{ height: '40px' }}
            aria-label="Reset Episode"
          >
            <RotateCcw size={16} /> Reset
          </button>
        </div>

        {/* Scrubber Range */}
        <input
          type="range"
          className="scrubber"
          min={0}
          max={Math.max(0, totalSteps - 1)}
          value={currentStep}
          onChange={(e) => onSeek(parseInt(e.target.value, 10))}
          aria-label="Timeline Scrubber"
        />
      </div>

      {/* Monospace Metrics Readout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2)',
        background: 'var(--bg-panel-raised)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Cumulative Reward</div>
          <div className="font-mono" style={{
            fontSize: '15px',
            fontWeight: 600,
            color: cumulativeReward >= 0 ? 'var(--accent-success)' : 'var(--text-primary)',
            marginTop: '2px'
          }}>
            {cumulativeReward > 0 ? `+${cumulativeReward.toFixed(1)}` : cumulativeReward.toFixed(1)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Path Efficiency</div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 600, color: 'var(--accent-primary)', marginTop: '2px' }}>
            {(pathEfficiency * 100).toFixed(0)}% <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 400 }}>optimal</span>
          </div>
        </div>
      </div>

      {/* Real-Time Neural Activation Sparkline */}
      <ActivationSparkline currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
};
