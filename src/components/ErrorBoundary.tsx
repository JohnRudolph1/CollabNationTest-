import { Component, ErrorInfo, ReactNode } from 'react';

interface State { hasError: boolean }

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State { return { hasError: true }; }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    if (import.meta.env.DEV) {
      console.error('UI error boundary caught error', error, info);
    }
  }

  render() {
    if (this.state.hasError) {
      return <div className="card"><h2>Something went wrong.</h2><p>Please refresh and try again.</p></div>;
    }
    return this.props.children;
  }
}
