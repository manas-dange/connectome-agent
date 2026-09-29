import React from 'react';
import { Info, Github, Layers, GitCompare, BookOpen, Sparkles, Compass, Brain } from 'lucide-react';

export const Header = ({ currentTab, onTabChange, viewMode, onViewModeChange, onOpenInfo }) => {
  return (
    <header style={{
      height: '56px',
      background: 'rgba(27, 31, 42, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-subtle)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 var(--space-4)',
      zIndex: 20,
      flexShrink: 0
    }}>
      {/* Brand & Live Dataset Chip */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <div
          onClick={() => onTabChange('demo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            cursor: 'pointer',
            userSelect: 'none'
          }}
        >
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, rgba(91, 140, 255, 0.25) 0%, rgba(61, 220, 151, 0.2) 100%)',
            border: '1px solid rgba(91, 140, 255, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-primary)',
            boxShadow: '0 0 10px rgba(91, 140, 255, 0.25)'
          }}>
            <Brain size={16} />
          </div>
          
          <div>
            <span style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>
              Connectome Navigator
            </span>
          </div>
        </div>

        {/* Live Biological Badge */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'rgba(255, 255, 255, 0.04)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          padding: '3px 10px',
          fontSize: '11px',
          color: 'var(--text-secondary)'
        }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--accent-success)' }} />
          <span>male-cns:v1.0 &bull; 850 CX Neurons</span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <nav style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        background: 'rgba(255, 255, 255, 0.03)',
        padding: '3px',
        borderRadius: 'var(--radius-md)',
        border: '1px solid rgba(255, 255, 255, 0.06)'
      }}>
        <button
          onClick={() => onTabChange('demo')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            borderColor: currentTab === 'demo' ? 'rgba(91, 140, 255, 0.5)' : 'transparent',
            cursor: 'pointer',
            background: currentTab === 'demo' ? 'rgba(91, 140, 255, 0.18)' : 'transparent',
            color: currentTab === 'demo' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: currentTab === 'demo' ? '0 2px 8px rgba(91, 140, 255, 0.2)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Compass size={14} color={currentTab === 'demo' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> 3D Simulation
        </button>

        <button
          onClick={() => onTabChange('docs')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            borderColor: currentTab === 'docs' ? 'rgba(91, 140, 255, 0.5)' : 'transparent',
            cursor: 'pointer',
            background: currentTab === 'docs' ? 'rgba(91, 140, 255, 0.18)' : 'transparent',
            color: currentTab === 'docs' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: currentTab === 'docs' ? '0 2px 8px rgba(91, 140, 255, 0.2)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <BookOpen size={14} color={currentTab === 'docs' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> Documentation
        </button>

        <button
          onClick={() => onTabChange('about')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 14px',
            fontSize: '12.5px',
            fontWeight: 500,
            borderRadius: 'var(--radius-sm)',
            border: '1px solid',
            borderColor: currentTab === 'about' ? 'rgba(91, 140, 255, 0.5)' : 'transparent',
            cursor: 'pointer',
            background: currentTab === 'about' ? 'rgba(91, 140, 255, 0.18)' : 'transparent',
            color: currentTab === 'about' ? '#FFFFFF' : 'var(--text-secondary)',
            boxShadow: currentTab === 'about' ? '0 2px 8px rgba(91, 140, 255, 0.2)' : 'none',
            transition: 'all 0.15s ease'
          }}
        >
          <Sparkles size={14} color={currentTab === 'about' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> About & Vision
        </button>
      </nav>

      {/* Nav Controls & Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {/* View Mode Toggle (Shown when on Demo tab) */}
        {currentTab === 'demo' && (
          <div style={{
            display: 'flex',
            background: 'var(--bg-panel-raised)',
            padding: '2px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)'
          }}>
            <button
              onClick={() => onViewModeChange('single')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'single' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'single' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <Layers size={13} /> Single View
            </button>
            
            <button
              onClick={() => onViewModeChange('compare')}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '5px 10px',
                fontSize: '11px',
                fontWeight: 500,
                borderRadius: 'var(--radius-sm)',
                border: 'none',
                cursor: 'pointer',
                background: viewMode === 'compare' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'compare' ? '#FFFFFF' : 'var(--text-secondary)',
                transition: 'all 0.15s ease'
              }}
            >
              <GitCompare size={13} /> Compare
            </button>
          </div>
        )}

        {/* Info & GitHub */}
        <button
          onClick={onOpenInfo}
          className="btn-icon"
          title="Methodology & Dataset Info"
          aria-label="Methodology Info"
        >
          <Info size={17} />
        </button>

        <a
          href="https://github.com/manas-dange/connectome-agent"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-icon"
          title="View on GitHub"
          aria-label="GitHub Repository"
          style={{ textDecoration: 'none' }}
        >
          <Github size={17} />
        </a>
      </div>
    </header>
  );
};

export default Header;
