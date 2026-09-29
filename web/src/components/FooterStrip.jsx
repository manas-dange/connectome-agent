import React from 'react';
import { Info } from 'lucide-react';

export const FooterStrip = ({ onOpenInfo, numNodes = 1243, numEdges = 3899 }) => {
  return (
    <footer style={{
      height: '32px',
      background: 'var(--bg-panel)',
      borderTop: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-4)',
      fontSize: '11px',
      color: 'var(--text-secondary)',
      zIndex: 10
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <button
          onClick={onOpenInfo}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--accent-primary)',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            padding: 0
          }}
        >
          <Info size={13} />
          <span>Central Complex Subgraph</span>
        </button>
        <span>·</span>
        <span className="font-mono">{numNodes.toLocaleString()} neurons</span>
        <span>·</span>
        <span className="font-mono">{numEdges.toLocaleString()} synapses</span>
        <span>·</span>
        <span style={{ color: 'var(--text-tertiary)' }}>dataset: male-cns:v1.0</span>
      </div>

      <div style={{ color: 'var(--text-tertiary)' }}>
        Google Research & HHMI Janelia FlyEM Project
      </div>
    </footer>
  );
};
