import React from 'react';
import { AlertTriangle, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100%',
          width: '100%',
          padding: 'var(--space-6)',
          background: 'var(--bg-primary)',
          color: 'var(--text-primary)',
          textAlign: 'center',
          gap: 'var(--space-4)'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'rgba(255, 92, 92, 0.15)',
            color: 'var(--accent-danger)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertTriangle size={24} />
          </div>

          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '6px' }}>
              Something encountered an issue
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', lineHeight: 1.6 }}>
              {this.state.error?.message || 'An unexpected rendering error occurred in this view.'}
            </p>
          </div>

          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              if (this.props.onReset) this.props.onReset();
            }}
            className="btn btn-primary"
            style={{ padding: '8px 18px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <RotateCcw size={15} /> Return to 3D Simulation
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
