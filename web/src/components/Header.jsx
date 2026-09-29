import React, { useState } from 'react';
import { Info, Github, Layers, GitCompare, BookOpen, Sparkles, Compass, Brain, Keyboard, X } from 'lucide-react';

export const Header = ({ currentTab, onTabChange, viewMode, onViewModeChange, onOpenInfo }) => {
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <>
      <header style={{
        height: '58px',
        background: 'rgba(12, 15, 23, 0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 var(--space-4)',
        zIndex: 30,
        flexShrink: 0
      }}>
        {/* Brand & Live Dataset Chip */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
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
              width: '32px',
              height: '32px',
              borderRadius: 'var(--radius-md)',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.22) 0%, rgba(16, 185, 129, 0.18) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.45)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-primary)',
              boxShadow: '0 0 14px rgba(56, 189, 248, 0.25)'
            }}>
              <Brain size={18} />
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 700, fontSize: '14.5px', color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                Connectome Navigator
              </span>
              <span style={{ fontSize: '10.5px', color: 'var(--text-tertiary)', letterSpacing: '0.2px' }}>
                Fruit Fly RL Architecture
              </span>
            </div>
          </div>

          {/* Biological Dataset Tag */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-full)',
            padding: '4px 12px',
            fontSize: '11px',
            color: 'var(--text-secondary)'
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--accent-success)', boxShadow: '0 0 8px var(--accent-success)' }} />
            <span>male-cns:v1.0 &bull; <strong style={{ color: 'var(--text-primary)', fontWeight: 600 }}>1,243 CX Neurons</strong></span>
          </div>
        </div>

        {/* Main Navigation Tabs */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '4px',
          background: 'rgba(255, 255, 255, 0.03)',
          padding: '4px',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)'
        }}>
          <button
            onClick={() => onTabChange('demo')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 14px',
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: currentTab === 'demo' ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
              cursor: 'pointer',
              background: currentTab === 'demo' ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
              color: currentTab === 'demo' ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: currentTab === 'demo' ? '0 2px 10px rgba(56, 189, 248, 0.25)' : 'none',
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
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: currentTab === 'docs' ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
              cursor: 'pointer',
              background: currentTab === 'docs' ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
              color: currentTab === 'docs' ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: currentTab === 'docs' ? '0 2px 10px rgba(56, 189, 248, 0.25)' : 'none',
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
              fontSize: '12px',
              fontWeight: 500,
              borderRadius: 'var(--radius-sm)',
              border: '1px solid',
              borderColor: currentTab === 'about' ? 'rgba(56, 189, 248, 0.45)' : 'transparent',
              cursor: 'pointer',
              background: currentTab === 'about' ? 'rgba(56, 189, 248, 0.16)' : 'transparent',
              color: currentTab === 'about' ? '#FFFFFF' : 'var(--text-secondary)',
              boxShadow: currentTab === 'about' ? '0 2px 10px rgba(56, 189, 248, 0.25)' : 'none',
              transition: 'all 0.15s ease'
            }}
          >
            <Sparkles size={14} color={currentTab === 'about' ? 'var(--accent-primary)' : 'var(--text-secondary)'} /> Vision & Insights
          </button>
        </nav>

        {/* Action Controls & External Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
          {/* View Mode Toggle (Shown when on Demo tab) */}
          {currentTab === 'demo' && (
            <div style={{
              display: 'flex',
              background: 'rgba(255, 255, 255, 0.04)',
              padding: '2px',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)'
            }}>
              <button
                onClick={() => onViewModeChange('single')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '5px 11px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'single' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'single' ? '#090A0F' : 'var(--text-secondary)',
                  fontWeight: viewMode === 'single' ? 600 : 500,
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
                  padding: '5px 11px',
                  fontSize: '11px',
                  borderRadius: 'var(--radius-xs)',
                  border: 'none',
                  cursor: 'pointer',
                  background: viewMode === 'compare' ? 'var(--accent-primary)' : 'transparent',
                  color: viewMode === 'compare' ? '#090A0F' : 'var(--text-secondary)',
                  fontWeight: viewMode === 'compare' ? 600 : 500,
                  transition: 'all 0.15s ease'
                }}
              >
                <GitCompare size={13} /> Compare
              </button>
            </div>
          )}

          {/* Keyboard Shortcuts Dialog Button */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="btn-icon"
            title="Keyboard Shortcuts (?)"
            aria-label="Keyboard Shortcuts"
          >
            <Keyboard size={16} />
          </button>

          {/* Info Modal Button */}
          <button
            onClick={onOpenInfo}
            className="btn-icon"
            title="Methodology & Dataset Info"
            aria-label="Methodology Info"
          >
            <Info size={16} />
          </button>

          {/* GitHub Link */}
          <a
            href="https://github.com/manas-dange/connectome-agent"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-icon"
            title="View on GitHub"
            aria-label="GitHub Repository"
          >
            <Github size={16} />
          </a>
        </div>
      </header>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(9, 10, 15, 0.75)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100
        }} onClick={() => setShowShortcuts(false)}>
          <div
            className="card"
            style={{ width: '420px', maxWidth: '90vw', padding: 'var(--space-5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--space-4)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Keyboard size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: 'var(--text-primary)' }}>Keyboard Shortcuts</h3>
              </div>
              <button
                onClick={() => setShowShortcuts(false)}
                className="btn-icon"
                style={{ width: '28px', height: '28px' }}
              >
                <X size={15} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Play / Pause Navigation</span>
                <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>Space</kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Step Forward / Backward</span>
                <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>← / →</kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Reset Episode</span>
                <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>R</kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '8px', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Switch Playback Speed (0.5x, 1x, 2x, 4x)</span>
                <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>1, 2, 3, 4</kbd>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Toggle Camera (Orbit / Chase)</span>
                <kbd style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--text-primary)' }}>C</kbd>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
