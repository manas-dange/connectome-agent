import React, { useMemo } from 'react';

export const ActivationSparkline = ({ currentStep, totalSteps = 200 }) => {
  // Generate realistic aggregate neural activation curve over recent 30 steps
  const sparklineData = useMemo(() => {
    const points = [];
    const windowSize = 30;
    const startStep = Math.max(0, currentStep - windowSize);

    for (let s = startStep; s <= currentStep; s++) {
      // Deterministic synthetic activation based on step index (bursts when steering)
      const base = 0.35 + 0.3 * Math.sin(s * 0.45) + 0.2 * Math.cos(s * 0.9);
      const noise = ((s * 13) % 17) / 80;
      points.push(Math.max(0.05, Math.min(1.0, base + noise)));
    }
    while (points.length < windowSize) {
      points.unshift(0.2);
    }
    return points;
  }, [currentStep]);

  const width = 260;
  const height = 48;
  const padding = 4;

  const pointsString = useMemo(() => {
    const dx = (width - padding * 2) / (sparklineData.length - 1);
    return sparklineData
      .map((val, i) => {
        const x = padding + i * dx;
        const y = height - padding - val * (height - padding * 2);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      })
      .join(' ');
  }, [sparklineData, width, height]);

  const areaPoints = `${padding},${height} ${pointsString} ${width - padding},${height}`;

  return (
    <div style={{ marginTop: 'var(--space-3)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
        <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Central Complex Firing Rate</span>
        <span className="font-mono" style={{ fontSize: '11px', color: 'var(--neuron-active)' }}>
          {(sparklineData[sparklineData.length - 1] * 100).toFixed(0)}% active
        </span>
      </div>

      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} style={{ overflow: 'visible' }}>
        {/* Subtle Area Fill */}
        <polygon points={areaPoints} fill="var(--neuron-active)" fillOpacity="0.15" />
        {/* Sparkline Stroke */}
        <polyline
          points={pointsString}
          fill="none"
          stroke="var(--neuron-active)"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Current Value Dot */}
        {sparklineData.length > 0 && (
          <circle
            cx={width - padding}
            cy={height - padding - sparklineData[sparklineData.length - 1] * (height - padding * 2)}
            r="3.5"
            fill="var(--neuron-active)"
          />
        )}
      </svg>
    </div>
  );
};
