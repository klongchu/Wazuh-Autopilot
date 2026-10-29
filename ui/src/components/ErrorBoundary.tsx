import { Component, type ErrorInfo, type ReactNode } from "react";
import { TriangleAlert } from "lucide-react";

interface Props {
  children: ReactNode;
  /** Resets the boundary when this changes — e.g. the current route. */
  resetKey?: string;
  /** Rendered instead of the default panel. */
  fallback?: (error: Error, reset: () => void) => ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Last line of defence against a render error blanking the console. Without it
 * any thrown error in a page unmounts the whole tree and leaves a white screen
 * with no way back.
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("Unhandled render error", error, info.componentStack);
  }

  componentDidUpdate(prev: Props) {
    if (this.state.error && prev.resetKey !== this.props.resetKey) this.setState({ error: null });
  }

  reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    if (this.props.fallback) return this.props.fallback(error, this.reset);
    return (
      <div className="flex h-full min-h-[60vh] flex-col items-center justify-center px-6 py-12 text-center">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full border border-danger/30 bg-danger/10 text-danger">
          <TriangleAlert className="h-5 w-5" />
        </div>
        <h1 className="text-base font-medium">Something broke on this screen</h1>
        <p className="mt-1 max-w-md text-sm text-muted">
          The rest of the console is still running. Try again, or go back to the command center.
        </p>
        <pre className="scrollbar-thin mt-4 max-h-32 max-w-lg overflow-auto rounded-lg border border-line bg-deep px-3 py-2 text-left font-mono text-micro text-muted">
          {error.message}
        </pre>
        <div className="mt-4 flex gap-2">
          <button type="button" className="btn-secondary btn-sm" onClick={this.reset}>
            Try again
          </button>
          <button type="button" className="btn-primary btn-sm" onClick={() => (window.location.href = "/")}>
            Back to command center
          </button>
        </div>
      </div>
    );
  }
}
