import { Component } from 'react'

/**
 * Catches unhandled render errors so a bug in one component doesn't
 * white-screen the whole form. The in-progress draft lives in
 * localStorage and survives a reload, so recovery is a refresh.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Unhandled render error:', error, info)
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <div
        style={{
          maxWidth: '28rem',
          margin: '6rem auto',
          padding: '2rem',
          textAlign: 'center',
          fontFamily: 'inherit',
        }}
      >
        <h1 style={{ fontSize: '1.25rem', marginBottom: '0.75rem' }}>
          Something went wrong
        </h1>
        <p style={{ marginBottom: '1.5rem', lineHeight: 1.5 }}>
          Sorry about that. Your answers so far are saved on this device
          &mdash; reload the page to pick up where you left off.
        </p>
        <button
          onClick={() => window.location.reload()}
          style={{
            padding: '0.75rem 1.5rem',
            fontSize: '1rem',
            cursor: 'pointer',
            borderRadius: '0.5rem',
            border: '1px solid currentColor',
            background: 'transparent',
            color: 'inherit',
          }}
        >
          Reload the form
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
