import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Activity, ArrowUp, RotateCcw as TurnLeft, RotateCw as TurnRight, PauseCircle, Gauge, Target } from 'lucide-react';
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
  onSeek,
  currentAction = 0,
  distanceToGoal = 15.0,
  playbackSpeed = 1,
  onSpeedChange
}) => {
  // Action labels
  const ACTIONS = [
    { id: 0, label: 'FORWARD', icon: ArrowUp, color: 'var(--accent-primary)' },
    { id: 1, label: 'TURN L', icon: TurnLeft, color: 'var(--accent-warning)' },
    { id: 2, label: 'TURN R', icon: TurnRight, color: 'var(--accent-warning)' },
    { id: 3, label: 'HOVER', icon: PauseCircle, color: 'var(--text-tertiary)' },
  ];

  // Global Keyboard listener for playback shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger if user is typing in an input
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        onPlayToggle();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        onSeek(Math.min(totalSteps - 1, currentStep + 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        onSeek(Math.max(0, currentStep - 1));
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        onReset();
      } else if (e.key === '1' && onSpeedChange) {
        onSpeedChange(0.5);
      } else if (e.key === '2' && onSpeedChange) {
        onSpeedChange(1);
      } else if (e.key === '3' && onSpeedChange) {
        onSpeedChange(2);
      } else if (e.key === '4' && onSpeedChange) {
        onSpeedChange(4);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlaying, currentStep, totalSteps, onPlayToggle, onSeek, onReset, onSpeedChange]);

  const speedOptions = [0.5, 1, 2, 4];
  const progressPct = Math.min(100, Math.round((currentStep / Math.max(1, totalSteps - 1)) * 100));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
      {/* Header with Title and Step Counter */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h3 style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Activity size={16} color="var(--accent-primary)" /> Flight Controller
        </h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span className="font-mono" style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
            Step <strong style={{ color: 'var(--text-primary)' }}>{currentStep}</strong> / {totalSteps}
          </span>
          <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>({progressPct}%)</span>
        </div>
      </div>

      {/* Architecture Selector */}
      <div>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px', fontWeight: 500 }}>
          Neural Architecture:
        </label>
        <select
          className="select-input"
          value={agentType}
          onChange={(e) => onAgentTypeChange(e.target.value)}
        >
          <option value="connectome">🧠 Connectome-Constrained (Fly Brain)</option>
          <option value="baseline">🤖 Baseline (Unconstrained MLP)</option>
        </select>
      </div>

      {/* Playback Controls & Speed Selector */}
      <div>
        <div style={{ display: 'flex', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
          <button
            onClick={onPlayToggle}
            className="btn btn-primary"
            style={{ flex: 1, height: '38px' }}
            aria-label={isPlaying ? "Pause Playback" : "Play Navigation"}
          >
            {isPlaying ? <><Pause size={15} /> Pause</> : <><Play size={15} /> Play Flight</>}
          </button>

          <button
            onClick={onReset}
            className="btn btn-ghost"
            style={{ height: '38px', padding: '0 12px' }}
            title="Reset Episode (R)"
            aria-label="Reset Episode"
          >
            <RotateCcw size={15} />
          </button>
        </div>

        {/* Speed Selector Pills */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '3px',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          marginBottom: 'var(--space-3)'
        }}>
          <span style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', paddingLeft: '6px' }}>Speed:</span>
          <div style={{ display: 'flex', gap: '2px' }}>
            {speedOptions.map((spd) => (
              <button
                key={spd}
                onClick={() => onSpeedChange && onSpeedChange(spd)}
                style={{
                  padding: '3px 8px',
                  fontSize: '10.5px',
                  fontWeight: 600,
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  background: playbackSpeed === spd ? 'var(--accent-primary)' : 'transparent',
                  color: playbackSpeed === spd ? '#090A0F' : 'var(--text-secondary)',
                  transition: 'all 0.15s ease'
                }}
              >
                {spd}x
              </button>
            ))}
          </div>
        </div>

        {/* Scrubber Range Slider */}
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

      {/* Live Actuator HUD (Active Motor Action) */}
      <div>
        <div style={{ fontSize: '10.5px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Motor Steering Actuator:</span>
          <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>
            {ACTIONS[currentAction]?.label || 'FORWARD'}
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
          {ACTIONS.map((act) => {
            const Icon = act.icon;
            const isActive = currentAction === act.id;
            return (
              <div
                key={act.id}
                className={`actuator-indicator ${isActive ? 'active' : ''}`}
                style={{
                  padding: '6px 4px',
                  flexDirection: 'column',
                  gap: '3px',
                  borderWidth: isActive ? '1.5px' : '1px'
                }}
              >
                <Icon size={13} />
                <span style={{ fontSize: '9.5px', letterSpacing: '0.2px' }}>{act.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Monospace Metrics Readout Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 'var(--space-2)',
        background: 'var(--bg-secondary)',
        padding: '10px 12px',
        borderRadius: 'var(--radius-sm)',
        border: '1px solid var(--border-subtle)'
      }}>
        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Cumulative Reward
          </div>
          <div className="font-mono" style={{
            fontSize: '15px',
            fontWeight: 700,
            color: cumulativeReward >= 0 ? 'var(--accent-success)' : 'var(--accent-danger)',
            marginTop: '2px'
          }}>
            {cumulativeReward > 0 ? `+${cumulativeReward.toFixed(1)}` : cumulativeReward.toFixed(1)}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '10px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Path Efficiency
          </div>
          <div className="font-mono" style={{ fontSize: '15px', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '2px' }}>
            {(pathEfficiency * 100).toFixed(0)}% <span style={{ fontSize: '10px', color: 'var(--text-secondary)', fontWeight: 400 }}>optimal</span>
          </div>
        </div>
      </div>

      {/* Target Distance & Proximity Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '6px 10px',
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xs)',
        fontSize: '11px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)' }}>
          <Target size={13} color="var(--accent-primary)" />
          <span>Distance to Target:</span>
        </div>
        <span className="font-mono" style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
          {distanceToGoal.toFixed(1)}m
        </span>
      </div>

      {/* Real-Time Neural Activation Sparkline */}
      <ActivationSparkline currentStep={currentStep} totalSteps={totalSteps} />
    </div>
  );
};

export default AgentController;
