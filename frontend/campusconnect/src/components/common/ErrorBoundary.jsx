import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center',
          justifyContent: 'center', minHeight: '100vh', padding: 40,
          background: '#0B1120', color: '#F1F5F9', fontFamily: "'Inter', sans-serif",
          textAlign: 'center'
        }}>
          <div style={{
            width: 80, height: 80, borderRadius: 24,
            background: 'linear-gradient(135deg, #EF4444, #DC2626)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, marginBottom: 24, boxShadow: '0 20px 40px rgba(239, 68, 68, 0.3)'
          }}>
            ⚠️
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 12px 0', letterSpacing: '-0.5px' }}>
            Something went wrong
          </h2>
          <p style={{ color: '#94A3B8', fontSize: 16, maxWidth: 400, lineHeight: 1.6, margin: '0 0 32px 0' }}>
            An unexpected error occurred. Please try refreshing the page.
          </p>
          <button
            onClick={() => window.location.reload()}
            style={{
              padding: '14px 32px', borderRadius: 14,
              background: 'linear-gradient(135deg, #6366F1, #818CF8)',
              color: '#fff', border: 'none', fontSize: 15,
              fontWeight: 700, cursor: 'pointer',
              boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.target.style.transform = 'scale(1)'}
          >
            Refresh Page
          </button>
          {this.state.error && (
            <details style={{ marginTop: 32, maxWidth: 500, textAlign: 'left' }}>
              <summary style={{ cursor: 'pointer', color: '#64748B', fontSize: 13 }}>Error Details</summary>
              <pre style={{
                marginTop: 8, padding: 16, borderRadius: 12,
                background: '#1E293B', fontSize: 12, overflow: 'auto',
                color: '#EF4444', border: '1px solid #334155'
              }}>
                {this.state.error.toString()}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
